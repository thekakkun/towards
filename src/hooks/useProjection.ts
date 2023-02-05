import { geoOrthographic, geoPath, GeoProjection } from "d3-geo";
import { useState } from "react";

export default function useProjection() {
  const [projection, setProjection] = useState<GeoProjection>(
    geoOrthographic()
  );
  const geoGenerator = geoPath(projection);

  function handleDrag() {
    
  }

  return projection;
}
