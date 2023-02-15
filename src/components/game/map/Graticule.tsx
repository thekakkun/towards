import { geoGraticule10, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useMemo, useRef } from "react";
import colors from "tailwindcss/colors";

export default function Graticule({
  geoGeneratorRef,
}: {
  geoGeneratorRef: React.MutableRefObject<GeoPath<any, GeoPermissibleObjects>>;
}) {
  const graticuleRef = useRef(null);
  const graticules = useMemo(geoGraticule10, []);

  useEffect(() => {
    if (!graticuleRef.current) throw Error("globeRef is not assigned");

    select(graticuleRef.current).attr("d", geoGeneratorRef.current(graticules));
  });

  return (
    <path ref={graticuleRef} fillOpacity={0} stroke={colors.stone[400]} strokeDasharray="1"></path>
  );
}
