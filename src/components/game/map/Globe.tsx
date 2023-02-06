import { GeoPath, GeoPermissibleObjects } from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";

export default function Globe({
  geoGenerator,
}: {
  geoGenerator: GeoPath<any, GeoPermissibleObjects>;
}) {
  const globeRef = useRef(null);

  useEffect(() => {
    if (globeRef.current) {
      select(globeRef.current).attr(
        "d",
        geoGenerator({
          type: "Sphere",
        })
      );
    }
  }, [globeRef, geoGenerator]);

  return <path ref={globeRef} fill={colors.blue[100]}></path>;
}
