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
    if (coordinates.value === null) {
      throw new Error("Coordinates not available.");
    } else if (svgRef.current) {
      new D3Map(svgRef.current, target, coordinates.value);
    }
    // TODO: Fix this!!!
    // eslint-disable-next-line
  }, [svgRef]);

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
      <text
        id="destLabel"
        dominantBaseline="middle"
      >{target.city}, {target.country}</text>
    </g>
  );
  const guess = (
    <g>
      <path
        id="guessLine"
        fillOpacity={0}
        stroke={colors.emerald[500]}
        strokeLinecap="round"
        strokeWidth="2px"
      ></path>
      <text cursor="default" fill={colors.emerald[800]}>
        <textPath href="#guessLine" startOffset="10">
          Your guess
        </textPath>
      </text>
    </g>
  );

  return (
    <div className="h-full">
      <svg ref={svgRef} id="map" className="mx-auto w-full aspect-square">
        {globe}
        {countries}
        {destination}
        {guess}
      </svg>
    </div>
  );
}
