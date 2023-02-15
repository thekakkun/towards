import { geoGraticule, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { select } from "d3-selection";
import { useRef, useEffect, useCallback, useMemo } from "react";
import colors from "tailwindcss/colors";

export default function Graticule({
  geoGeneratorRef,
}: {
  geoGeneratorRef: React.MutableRefObject<GeoPath<any, GeoPermissibleObjects>>;
}) {
  const graticuleRef = useRef(null);
  const graticuleGenerator = useMemo(geoGraticule, []);
  const graticules = useMemo(graticuleGenerator, []);

  useEffect(() => {
    if (!graticuleRef.current) throw Error("globeRef is not assigned");

    select(graticuleRef.current).attr("d", geoGeneratorRef.current(graticules));
  });

  return (
    <path ref={graticuleRef} fillOpacity={0} stroke={colors.stone[300]}></path>
  );
}
