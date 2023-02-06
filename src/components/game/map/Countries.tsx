import {
  ExtendedFeatureCollection,
  GeoPath,
  GeoPermissibleObjects,
} from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";
import geoJson from "../../../assets/data/ne_110m_admin_0_countries.json";

export default function Countries({
  geoGenerator,
}: {
  geoGenerator: GeoPath<any, GeoPermissibleObjects>;
}) {
  const countriesRef = useRef(null);

  useEffect(() => {
    if (countriesRef.current) {
      const u = select(countriesRef.current)
        .selectAll<SVGPathElement, ExtendedFeatureCollection>("path")
        .data((geoJson as ExtendedFeatureCollection).features);
      u.enter().append("path").merge(u).attr("d", geoGenerator);
    }
  }, [countriesRef, geoGenerator]);

  return (
    <g
      ref={countriesRef}
      fill={colors.stone[100]}
      stroke={colors.stone[400]}
    ></g>
  );
}
