import { drag } from "d3-drag";
import { geoOrthographic, GeoProjection } from "d3-geo";
import { pointers, select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
import versor from "versor";
import useCoordinates from "../../../hooks/useCoordinates";
import useStages from "../../../hooks/useStages";

import Countries from "./Countries";
import Destination from "./Destination";
import Globe from "./Globe";

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

  const [rotation, setRotation] = useState<[number, number, number]>([
    -coordinates.value.longitude,
    -coordinates.value.latitude,
    0,
  ]);
  const mapRef = useRef<SVGSVGElement>(null);
  const projection = geoOrthographic().rotate(rotation);

  useEffect(() => {
    projection.rotate(rotation);
  }, [rotation, projection]);

  useEffect(() => {
    if (mapRef.current) {
      projection.fitSize(
        [mapRef.current.clientWidth, mapRef.current.clientHeight],
        {
          type: "Sphere",
        }
      );

      select(mapRef.current).call(
        handleDrag
          .call(mapRef.current, projection, setRotation)
          .on("drag.render", () => {})
      );
    }
  }, [mapRef, projection]);

  return (
    <div className="w-full aspect-square">
      <svg ref={mapRef} id="map" className="w-full h-full">
        <Globe projection={projection}></Globe>
        <Countries projection={projection}></Countries>
        <Destination
          projection={projection}
          location={coordinates.value}
          target={target}
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
  projection: GeoProjection,
  setRotation: React.Dispatch<React.SetStateAction<[number, number, number]>>
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
  };

  /**
   * Handle the drag event and update the projection rotation.
   * @param event The drag event launched during drag.
   */
  const dragged = (event: DragEvent) => {
    const [px, py, pa] = pointer(event);

    setRotation(r0);
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

    setRotation(versor.rotation(q1));

    // In vicinity of the antipode (unstable) of q0, restart.
    if (delta[0] < 0.7) {
      dragStarted(event);
    }
  };

  return drag<SVGSVGElement, unknown>()
    .on("start", dragStarted)
    .on("drag", dragged);
}
