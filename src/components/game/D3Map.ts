import { drag } from "d3-drag";
import {
  ExtendedFeatureCollection,
  geoOrthographic,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection,
} from "d3-geo";
import { pointers, select } from "d3-selection";
import versor from "versor";

import geoJson from "../../assets/data/ne_110m_admin_0_countries.json";
import { Coordinates } from "../../types/cartography";
import { CompletedLocation } from "../../types/game";
import { getDestination } from "../../utilities/cartography";

/**
 * Draw a map, using D3 in the specified element.
 */
export default class D3Map {
  // svg: Selection<SVGSVGElement, unknown, null, undefined>;
  target: CompletedLocation;
  destination: Coordinates;
  location: Coordinates;
  projection: GeoProjection;
  geoGenerator: GeoPath;
  arrow: GeoPermissibleObjects;

  /**
   * Create a D3Map object.
  //  * @param containerEl The element to draw the map on.
   * @param target Target location for stage.
   * @param location User's current location.
   */
  constructor(
    // containerEl: SVGSVGElement,
    target: CompletedLocation,
    location: Coordinates
  ) {
    // this.svg = select(containerEl);
    this.target = target;
    this.location = location;
    this.destination = getDestination(this.location, this.target.heading, 5000);

    this.arrow = {
      type: "Polygon",
      coordinates: [this.getArrowCoords()],
    };

    this.projection = geoOrthographic();
    // .rotate([-this.location.longitude, -this.location.latitude, 0])
    // .fitSize([containerEl.clientWidth, containerEl.clientHeight], {
    //   type: "Sphere",
    // });
    this.geoGenerator = geoPath(this.projection);

    // this.drag = this.drag.bind(this);
    // this.svg
    //   .call(this.drag().on("drag.render", () => this.draw()))
    //   .call(() => this.draw());
  }

  init(container: SVGSVGElement) {
    this.projection
      .rotate([-this.location.longitude, -this.location.latitude, 0])
      .fitSize([container.clientWidth, container.clientHeight], {
        type: "Sphere",
      });

    this.drag = this.drag.bind(this);
    select(container)
      .call(this.drag(container).on("drag.render", () => this.draw(container)))
      .call(() => this.draw(container));
  }

  /** Draw the map. */
  draw(container: SVGSVGElement) {
    // The globe background
    select(container)
      .select<SVGPathElement>("#globe")
      .attr(
        "d",
        this.geoGenerator({
          type: "Sphere",
        })
      );

    // The countries
    const u = select(container)
      .select<SVGGElement>("#countries")
      .selectAll<SVGPathElement, ExtendedFeatureCollection>("path")
      .data((geoJson as ExtendedFeatureCollection).features);
    u.enter().append("path").merge(u).attr("d", this.geoGenerator);

    // Line to the destination
    select(container)
      .select<SVGPathElement>("#destLine")
      .attr(
        "d",
        this.geoGenerator({
          type: "LineString",
          coordinates: [
            [this.location.longitude, this.location.latitude],
            [this.target.longitude, this.target.latitude],
          ],
        })
      );
    select(container)
      .select<SVGPathElement>("#destPoint")
      .attr(
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
      select(container)
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
    select(container)
      .select<SVGPathElement>("#guessLine")
      .attr("d", this.geoGenerator(this.arrow));
  }

  /**
   * Define the drag behavior.
   * @returns the drag behavior object.
   */
  drag(container: SVGSVGElement) {
    let v0: [number, number, number],
      q0: [number, number, number, number],
      r0: [number, number, number],
      a0: number,
      l: number;

    const pointer = (
      event: DragEvent
    ): [number, number] | [number, number, number] => {
      const t = pointers(event, select(container).node());

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

  /**
   * Create polygon for arrow, based off needle svg shape and heading
   * @returns coordinates for arrow polygon
   */
  getArrowCoords() {
    // Coordinates of arrow polygon, in radial coordinates from center
    // Measured from needle svg.
    let coords = [
      [34.79, -90], // tip, clockwise from here.
      [27.1, -80.63],
      [35.06, 82.77],
      [26.74, 90], // tail
      [35.06, 97.23],
      [27.1, -99.37],
    ].map(([dist, angle]) => [dist, angle + 90]); // rotate so tip is at 0 degrees

    const arrowLength = 2500;
    const scale = arrowLength / (coords[0][0] + coords[3][0]);
    let arrowPolygon = coords.map(([dist, angle]) =>
      getDestination(this.location, this.target.heading + angle, dist * scale)
    );

    arrowPolygon.push(arrowPolygon[0]); // close the polygon
    return arrowPolygon.map((coords) => [coords.longitude, coords.latitude]);
  }
}
