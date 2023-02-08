import { ReactComponent as Needle } from "../../assets/images/needle.svg";
import { ReactComponent as Rose } from "../../assets/images/rose.svg";
import { Degrees, SensorHook } from "../../types/over-yonder";

export default function Compass({ heading }: { heading: SensorHook<Degrees> }) {
  return (
    <div className="overflow-clip relative w-full mx-auto aspect-square">
      <Rose
        title="Compass rose"
        className="rounded-full w-full absolute"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(45deg) rotate(-${heading.value}deg)`,
        }}
      ></Rose>
      <Needle
        title="Compass needle"
        className="rounded-full w-full absolute h-[45%] top-[27.5%]"
      ></Needle>
    </div>
  );
}
