import { GeoProjection, geoPath } from "d3-geo";
import { select } from "d3-selection";
import { useRef, useEffect } from "react";
import colors from "tailwindcss/colors";
import { Coordinates } from "../../../types/cartography";
import { CompletedLocation } from "../../../types/game";

interface DestinationProps {
  projection: GeoProjection;
  location: Coordinates;
  target: CompletedLocation;
}

export default function Destination({
  projection,
  location,
  target,
}: DestinationProps) {
  const destinationRef = useRef(null);

  useEffect(() => {
    const geoGenerator = geoPath(projection);
    if (destinationRef.current) {
      select(destinationRef.current)
        .select<SVGPathElement>("#destLine")
        .attr(
          "d",
          geoGenerator({
            type: "LineString",
            coordinates: [
              [location.longitude, location.latitude],
              [target.longitude, target.latitude],
            ],
          })
        );

      select(destinationRef.current)
        .select<SVGPathElement>("#destPoint")
        .attr(
          "d",
          geoGenerator({
            type: "Point",
            coordinates: [target.longitude, target.latitude],
          })
        );

      const destPoint = projection([target.longitude, target.latitude]);
      if (destPoint) {
        select(destinationRef.current)
          .select<SVGTextElement>("#destLabel")
          .attr("x", destPoint[0] + 10)
          .attr("y", destPoint[1])
          .attr(
            "display",
            geoGenerator({
              type: "Point",
              coordinates: [target.longitude, target.latitude],
            }) === null
              ? "none"
              : ""
          );
      }
    }
  }, [destinationRef, projection]);

  return (
    <g ref={destinationRef}>
      <path
        id="destLine"
        fillOpacity={0}
        stroke={colors.red[500]}
        strokeLinecap="round"
        strokeWidth="2px"
      ></path>
      <path id="destPoint" fill={colors.red[600]}></path>
      <text id="destLabel" dominantBaseline="middle">
        {target.city}, {target.country}
      </text>
    </g>
  );
}
