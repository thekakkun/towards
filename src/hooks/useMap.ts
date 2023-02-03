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
import { useEffect, useMemo, useRef } from "react";
import versor from "versor";

import geoJson from "../assets/data/ne_110m_admin_0_countries.json";
import { Coordinates, Degrees } from "../types/cartography";
import { CompletedLocation } from "../types/game";
import { getDestination } from "../utilities/cartography";
import useCoordinates from "./useCoordinates";
import useStages from "./useStages";

export default function useMap(
  containerRef: React.RefObject<SVGSVGElement>,
  stages: ReturnType<typeof useStages>,
  coordinates: ReturnType<typeof useCoordinates>
) {
  if (!coordinates.value) {
    throw new Error("coordinates unavailable");
  }

  const initRotation = useRef<[number, number, number]>([
    -coordinates.value.longitude,
    -coordinates.value.latitude,
    0,
  ]);
  const projection = useMemo(() => geoOrthographic(), []);
  const geoGenerator = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    projection.rotate(initRotation.current);
  }, [projection, initRotation]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      projection.fitSize([container.clientWidth, container.clientHeight], {
        type: "Sphere",
      });

      select(container).call(
        handleDrag(projection, container).on("drag.render", () =>
          draw(
            projection,
            geoGenerator,
            container,
            coordinates.value as Coordinates,
            stages.current() as CompletedLocation
          )
        )
      );
      select(container).call(() =>
        draw(
          projection,
          geoGenerator,
          container,
          coordinates.value as Coordinates,
          stages.current() as CompletedLocation
        )
      );
    }
  }, [containerRef, projection, geoGenerator, coordinates.value, stages]);
}

/** Draw the map. */
function draw(
  projection: GeoProjection,
  geoGenerator: GeoPath<any, GeoPermissibleObjects>,
  container: SVGSVGElement,
  location: Coordinates,
  target: CompletedLocation
) {
  // The globe background
  select(container)
    .select<SVGPathElement>("#globe")
    .attr(
      "d",
      geoGenerator({
        type: "Sphere",
      })
    );

  // The countries
  const u = select(container)
    .select<SVGGElement>("#countries")
    .selectAll<SVGPathElement, ExtendedFeatureCollection>("path")
    .data((geoJson as ExtendedFeatureCollection).features);
  u.enter().append("path").merge(u).attr("d", geoGenerator);

  // Line to the destination
  if (location) {
    select(container)
      .select<SVGPathElement>("#destLine")
      .attr(
        "d",
        geoGenerator({
          type: "LineString",
          coordinates: [
            [location.longitude, location.latitude],
            [target.longitude, target.latitude],
          ],
        })
      );
    select(container)
      .select<SVGPathElement>("#destPoint")
      .attr(
        "d",
        geoGenerator({
          type: "Point",
          coordinates: [target.longitude, target.latitude],
        })
      );

    const destPoint = projection([target.longitude, target.latitude]);

    if (destPoint !== null) {
      select(container)
        .select<SVGTextElement>("#destLabel")
        .attr("x", destPoint[0] + 10)
        .attr("y", destPoint[1])
        .attr(
          "display",
          geoGenerator({
            type: "Point",
            coordinates: [target.longitude, target.latitude],
          }) === null
            ? "none"
            : ""
        );
    }

    // Guess by user
    if ("heading" in target) {
      select(container)
        .select<SVGPathElement>("#guessLine")
        .attr(
          "d",
          geoGenerator({
            type: "Polygon",
            coordinates: [createArrow(location, target.heading)],
          })
        );
    }
  }

  return projection;
}

/**
 * Define the drag behavior.
 * @returns the drag behavior object.
 */
function handleDrag(projection: GeoProjection, container: SVGSVGElement) {
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
      projection.invert?.([px, py]) ??
        (() => {
          throw new Error("Projection not invertible");
        })()
    );

    q0 = versor((r0 = projection.rotate()));
  };

  /**
   * Handle the drag event and update the projection rotation.
   * @param event The drag event launched during drag.
   */
  const dragged = (event: DragEvent) => {
    const [px, py, pa] = pointer(event);

    const v1 = versor.cartesian(
      projection.rotate(r0).invert?.([px, py]) ??
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

    projection.rotate(versor.rotation(q1));

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
function createArrow(location: Coordinates, heading: Degrees) {
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
    getDestination(location, heading + angle, dist * scale)
  );

  arrowPolygon.push(arrowPolygon[0]); // close the polygon
  return arrowPolygon.map((coords) => [coords.longitude, coords.latitude]);
}
