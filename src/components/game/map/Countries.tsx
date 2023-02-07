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
  
  geoGeneratorRef,
}: {
  
  geoGeneratorRef: React.MutableRefObject<GeoPath<any, GeoPermissibleObjects>>;
}) {
  const countriesRef = useRef(null);

  useEffect(() => {
    if (!countriesRef.current) throw Error("countriesRef is not assigned");

    const u = select(countriesRef.current)
      .selectAll<SVGPathElement, ExtendedFeatureCollection>("path")
      .data((geoJson as ExtendedFeatureCollection).features);
    u.enter().append("path").merge(u).attr("d", geoGeneratorRef.current);
  });

  return (
    <g
      ref={countriesRef}
      fill={colors.stone[100]}
      stroke={colors.stone[400]}
    ></g>
  );
}
