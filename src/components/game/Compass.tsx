import compass from "../../assets/images/compass.png";
import { Degrees } from "../../types/math";

interface CompassProps {
  heading: Degrees;
}

export default function Compass({ heading }: CompassProps) {
  return (
    <div className="self-end overflow-clip m-auto">
      <img
        className="rounded-full w-4/5 m-auto"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(45deg) rotate(-${heading}deg)`,
        }}
        src={compass}
        alt={`compass heading: ${heading} degrees`}
      />
    </div>
  );
}
