import { useEffect, useRef } from "react";
import colors from "tailwindcss/colors";
import useCoordinates from "../../hooks/useCoordinates";

import useStages from "../../hooks/useStages";

import D3Map from "./D3Map";

interface MapProps {
  stages: ReturnType<typeof useStages>;
  coordinates: ReturnType<typeof useCoordinates>;
}

export default function Map({ stages, coordinates }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const target = stages.current();
  if (!("score" in target)) {
    throw new Error("stage is unscored.");
  }

  useEffect(() => {
    const d3Map = (targetElement: SVGSVGElement) => {
      if (coordinates.value === null) {
        throw new Error("Coordinates not available.");
      }

      return new D3Map(targetElement, target, coordinates.value);
    };

    if (svgRef.current) {
      d3Map(svgRef.current);
    }
  }, [svgRef, coordinates.value, target]);

  const globe = <path id="globe" fill={colors.blue[100]}></path>;
  const countries = (
    <g id="countries" fill={colors.stone[100]} stroke={colors.stone[400]}></g>
  );
  const destination = (
    <g>
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
  const guess = (
    <g>
      <path id="guessLine" fill={colors.emerald[600]}></path>
    </g>
  );

  return (
    <div className="w-full aspect-square">
      <svg ref={svgRef} id="map" className="w-full h-full">
        {globe}
        {countries}
        {destination}
        {guess}
      </svg>
    </div>
  );
}
