import { drag } from "d3-drag";
import {
  ExtendedFeatureCollection,
  geoOrthographic,
  GeoPath,
  geoPath,
  GeoProjection
} from "d3-geo";
import { pointers, select, Selection } from "d3-selection";
import versor from "versor";

import geoJson from "../../assets/data/ne_110m_admin_0_countries.json";
import { Coordinates } from "../../types/cartography";
import { CompletedLocation } from "../../types/game";
import { getDestination } from "../../utilities/cartography";

/**
 * Draw a map, using D3 in the specified element.
 */
export default class D3Map {
  svg: Selection<SVGSVGElement, unknown, null, undefined>;
  target: CompletedLocation;
  destination: Coordinates;
  location: Coordinates;
  projection: GeoProjection;
  geoGenerator: GeoPath;

  /**
   * Create a D3Map object.
   * @param containerEl The element to draw the map on.
   * @param target Target location for stage.
   * @param location User's current location.
   */
  constructor(
    containerEl: SVGSVGElement,
    target: CompletedLocation,
    location: Coordinates
  ) {
    this.svg = select(containerEl);
    this.target = target;
    this.location = location;
    this.destination = getDestination(this.location, this.target.heading, 5000);

    this.projection = geoOrthographic()
      .rotate([
        -this.location.longitude,
        -this.location.latitude,
        this.target.heading,
      ])
      .fitSize(
        [containerEl.clientWidth, containerEl.clientHeight],
        geoJson as ExtendedFeatureCollection
      );
    this.geoGenerator = geoPath(this.projection);

    this.drag = this.drag.bind(this);
    this.svg
      .call(this.drag().on("drag.render", () => this.draw()))
      .call(() => this.draw());
  }

  /** Draw the map. */
  draw() {
    // The globe background
    this.svg.select<SVGPathElement>("#globe").attr(
      "d",
      this.geoGenerator({
        type: "Sphere",
      })
    );

    // The countries
    const u = this.svg
      .select<SVGGElement>("#countries")
      .selectAll<SVGPathElement, ExtendedFeatureCollection>("path")
      .data((geoJson as ExtendedFeatureCollection).features);
    u.enter().append("path").merge(u).attr("d", this.geoGenerator);

    // Line to the destination
    this.svg.select<SVGPathElement>("#destLine").attr(
      "d",
      this.geoGenerator({
        type: "LineString",
        coordinates: [
          [this.location.longitude, this.location.latitude],
          [this.target.longitude, this.target.latitude],
        ],
      })
    );
    this.svg.select<SVGPathElement>("#destPoint").attr(
      "d",
      this.geoGenerator({
        type: "Point",
        coordinates: [this.target.longitude, this.target.latitude],
      })
    );

    const destPoint = this.projection([
      this.target.longitude,
      this.target.latitude,
    ]);

    if (destPoint !== null) {
      this.svg
        .select<SVGTextElement>("#destLabel")
        .attr("x", destPoint[0] + 10)
        .attr("y", destPoint[1])
        .attr(
          "display",
          this.geoGenerator({
            type: "Point",
            coordinates: [this.target.longitude, this.target.latitude],
          }) === null
            ? "none"
            : ""
        );
    }

    // Guess by user
    this.svg.select<SVGPathElement>("#guessLine").attr(
      "d",
      this.geoGenerator({
        type: "LineString",
        coordinates: [
          [this.location.longitude, this.location.latitude],
          [this.destination.longitude, this.destination.latitude],
        ],
      })
    );
  }

  /**
   * Define the drag behavior.
   * @returns the drag behavior object.
   */
  drag() {
    let v0: [number, number, number],
      q0: [number, number, number, number],
      r0: [number, number, number],
      a0: number,
      l: number;

    const pointer = (
      event: DragEvent
    ): [number, number] | [number, number, number] => {
      const t = pointers(event, this.svg.node());

      if (t.length !== l) {
        l = t.length;
        if (l > 1) {
          a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
        }
        dragStarted(event);
      }

      // For multitouch, average positions and compute rotation.
      if (l > 1) {
        const x = t.reduce((acc, curr) => acc + curr[0], 0);
        const y = t.reduce((acc, curr) => acc + curr[1], 0);

        const a = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
        return [x, y, a];
      }

      return t[0];
    };

    /**
     * Set the drag axis on touch start.
     * @param event The drag event lauched on drag start.
     */
    const dragStarted = (event: DragEvent) => {
      const [px, py] = pointer(event);
      v0 = versor.cartesian(
        this.projection.invert?.([px, py]) ??
          (() => {
            throw new Error("Projection not invertible");
          })()
      );

      q0 = versor((r0 = this.projection.rotate()));
    };

    /**
     * Handle the drag event and update the projection rotation.
     * @param event The drag event launched during drag.
     */
    const dragged = (event: DragEvent) => {
      const [px, py, pa] = pointer(event);

      const v1 = versor.cartesian(
        this.projection.rotate(r0).invert?.([px, py]) ??
          (() => {
            throw new Error("Projection not invertible");
          })()
      );
      const delta = versor.delta(v0, v1);
      let q1 = versor.multiply(q0, delta);

      // For multitouch, compose with a rotation around the axis.
      if (pa) {
        const d = (pa - a0) / 2;
        const s = -Math.sin(d);
        const c = Math.sign(Math.cos(d));
        q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
      }

      this.projection.rotate(versor.rotation(q1));

      // In vicinity of the antipode (unstable) of q0, restart.
      if (delta[0] < 0.7) {
        dragStarted(event);
      }
    };

    return drag<SVGSVGElement, unknown>()
      .on("start", dragStarted)
      .on("drag", dragged);
  }
}
