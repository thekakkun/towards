import { GeoPath, GeoPermissibleObjects } from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";

export default function Globe({
  rotation,
  geoGeneratorRef,
}: {
  rotation: [number, number, number];
  geoGeneratorRef: React.MutableRefObject<GeoPath<any, GeoPermissibleObjects>>;
}) {
  const globeRef = useRef(null);

  useEffect(() => {
    if (!globeRef.current) throw Error("globeRef is not assigned");

    select(globeRef.current).attr(
      "d",
      geoGeneratorRef.current({
        type: "Sphere",
      })
    );
  });

  return <path ref={globeRef} fill={colors.blue[100]}></path>;
}
