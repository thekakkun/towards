import { geoPath, GeoProjection } from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";

export default function Globe({ projection }: { projection: GeoProjection }) {
  const globeRef = useRef(null);

  useEffect(() => {
    const geoGenerator = geoPath(projection);
    if (globeRef.current) {
      select(globeRef.current).attr(
        "d",
        geoGenerator({
          type: "Sphere",
        })
      );
    }
  }, [globeRef, projection]);

  return <path ref={globeRef} fill={colors.blue[100]}></path>;
}
