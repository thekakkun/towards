import { GeoPath, GeoPermissibleObjects } from "d3-geo";
import { select } from "d3-selection";
import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";
import { Coordinates } from "../../../types/cartography";
import { CompletedLocation } from "../../../types/game";

interface DestinationProps {
  rotation: [number, number, number];
  geoGenerator: GeoPath<any, GeoPermissibleObjects>;
  location: Coordinates;
  target: CompletedLocation;
}

export default function Destination({
  rotation,
  geoGenerator,
  location,
  target,
}: DestinationProps) {
  const destinationRef = useRef(null);

  useEffect(() => {
    if (!destinationRef.current) throw Error("destinationRef is not assigned");

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

    const projection = geoGenerator.projection();
    const destPoint =
      typeof projection === "function"
        ? projection([target.longitude, target.latitude])
        : null;
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
  }, [destinationRef, rotation, geoGenerator, location, target]);

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
