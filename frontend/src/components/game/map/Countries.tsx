import {
  ExtendedFeatureCollection,
  GeoPath,
  GeoPermissibleObjects,
} from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";
import * as topojson from "topojson-client";
import { Topology } from "topojson-specification";

import _world from "../../../assets/data/countries-110m.json";

export default function Countries({
  geoGeneratorRef,
}: {
  geoGeneratorRef: React.MutableRefObject<GeoPath<any, GeoPermissibleObjects>>;
}) {
  const world = _world as unknown as Topology;
  const countries = topojson.feature(world, world.objects.countries);

  const countriesRef = useRef(null);

  useEffect(() => {
    if (!countriesRef.current) throw Error("countriesRef is not assigned");
    else if (!("features" in countries))
      throw Error("countries should be a FeatureCollection");

    const u = select(countriesRef.current)
      .selectAll<SVGPathElement, ExtendedFeatureCollection>("path")
      .data(countries.features);
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
