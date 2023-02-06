import { drag } from "d3-drag";
import {
  geoOrthographic,
  GeoPath,
  geoPath,
  GeoPermissibleObjects,
  GeoProjection,
} from "d3-geo";
import { select, pointers } from "d3-selection";
import { useState, useRef, useEffect } from "react";
import versor from "versor";
import useCoordinates from "../../../hooks/useCoordinates";
import useStages from "../../../hooks/useStages";

import Countries from "./Countries";
import Destination from "./Destination";
import Globe from "./Globe";
import Guess from "./Guess";

interface MapProps {
  stages: ReturnType<typeof useStages>;
  coordinates: ReturnType<typeof useCoordinates>;
}

export default function Map({ stages, coordinates }: MapProps) {
  const target = stages.current();
  if (!("score" in target)) {
    throw new Error("stage is unscored.");
  } else if (!coordinates.value) {
    throw new Error("User coordinates unavailable");
  }

  const mapRef = useRef<SVGSVGElement>(null);
  const projectionRef = useRef(
    geoOrthographic().rotate([
      -coordinates.value.longitude,
      -coordinates.value.latitude,
      0,
    ])
  );

  const [geoGenerator, setGeoGenerator] = useState(() =>
    geoPath(projectionRef.current)
  );

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      projectionRef.current.fitSize([map.clientWidth, map.clientHeight], {
        type: "Sphere",
      });

      select(map).call(
        handleDrag
          .call(map, projectionRef.current, setGeoGenerator)
          .on("drag.render", () => {})
      );
    }
  }, [mapRef, projectionRef]);

  return (
    <div className="w-full aspect-square">
      <svg ref={mapRef} id="map" className="w-full h-full">
        <Globe geoGenerator={geoGenerator}></Globe>
        <Countries geoGenerator={geoGenerator}></Countries>
        <Destination
          projection={projectionRef.current}
          geoGenerator={geoGenerator}
          location={coordinates.value}
          target={target}
        ></Destination>
        <Guess
          geoGenerator={geoGenerator}
          location={coordinates.value}
          target={target}
        ></Guess>
      </svg>
    </div>
  );
}

/**
 * Define the drag behavior.
 * @returns the drag behavior object.
 */
function handleDrag(
  this: SVGSVGElement,
  projection: GeoProjection,
  setGeoGenerator: React.Dispatch<
    React.SetStateAction<GeoPath<any, GeoPermissibleObjects>>
  >
) {
  let v0: [number, number, number],
    q0: [number, number, number, number],
    r0: [number, number, number],
    a0: number,
    l: number;

  const pointer = (
    event: DragEvent
  ): [number, number] | [number, number, number] => {
    const t = pointers(event, this);

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
    setGeoGenerator(() => geoPath(projection));
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
    setGeoGenerator(() => geoPath(projection));

    // In vicinity of the antipode (unstable) of q0, restart.
    if (delta[0] < 0.7) {
      dragStarted(event);
    }
  };

  return drag<SVGSVGElement, unknown>()
    .on("start", dragStarted)
    .on("drag", dragged);
}
