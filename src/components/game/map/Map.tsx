import { drag } from "d3-drag";
import { geoOrthographic, geoPath, GeoProjection } from "d3-geo";
import { pointers, select } from "d3-selection";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import versor from "versor";

import useStages from "../../../hooks/useStages";
import { Coordinates, SensorHook } from "../../../types/over-yonder";
import Countries from "./Countries";
import Destination from "./Destination";
import Globe from "./Globe";
import Guess from "./Guess";

interface MapProps {
  stages: ReturnType<typeof useStages>;
  coordinates: SensorHook<Coordinates>;
}

export default function Map({ stages, coordinates }: MapProps) {
  const mapRef = useRef<SVGSVGElement>(null);

  const target = stages.current();
  if (!("score" in target)) {
    throw new Error("stage is unscored.");
  } else if (!coordinates.value) {
    throw new Error("User coordinates unavailable");
  }

  // D3 GeoProjection and GeoGenerator objects are mutable.
  // Put them in useRef so they don't get re-created and forget their values on re-render.
  // Since React can't monitor changes to internal values, rely on rotation state.
  const [rotation, setRotation] = useState<[number, number, number]>([
    -coordinates.value.longitude,
    -coordinates.value.latitude,
    0,
  ]);
  const projectionRef = useRef(geoOrthographic().rotate(rotation));
  const geoGeneratorRef = useRef(geoPath(projectionRef.current));

  useLayoutEffect(() => {
    if (!mapRef.current) throw Error("mapRef is not assigned");

    projectionRef.current.fitSize(
      [mapRef.current.clientWidth, mapRef.current.clientHeight],
      { type: "Sphere" }
    );
  }, []);

  useEffect(() => {
    if (!mapRef.current) throw Error("mapRef is not assigned");

    select(mapRef.current).call(
      handleDrag.call(mapRef.current, setRotation, projectionRef.current)
    );
  }, []);

  return (
    <div className="w-full aspect-square">
      <svg ref={mapRef} id="map" className="w-full h-full">
        <Globe {...{ geoGeneratorRef }}></Globe>
        <Countries {...{ geoGeneratorRef }}></Countries>
        <Guess
          {...{ geoGeneratorRef, location: coordinates.value, target }}
        ></Guess>
        <Destination
          {...{ geoGeneratorRef, location: coordinates.value, target }}
        ></Destination>
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
  setRotation: React.Dispatch<React.SetStateAction<[number, number, number]>>,
  projection: GeoProjection
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

    r0 = projection.rotate();
    q0 = versor(r0);
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

    let r1 = versor.rotation(q1);
    setRotation(r1);
    projection.rotate(r1);

    // In vicinity of the antipode (unstable) of q0, restart.
    if (delta[0] < 0.7) {
      dragStarted(event);
    }
  };

  return drag<SVGSVGElement, unknown>()
    .on("start", dragStarted)
    .on("drag", dragged);
}
