import Needle from "../../assets/images/needle.svg";
import Rose from "../../assets/images/rose.svg";
import { Degrees, SensorHook } from "../../types/over-yonder";

export default function Compass({ heading }: { heading: SensorHook<Degrees> }) {
  console.log(Needle);

  return (
    <div className="overflow-clip relative w-full mx-auto aspect-square">
      <img
        src={Rose}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(45deg) rotate(-${heading.value}deg)`,
        }}
      />
      <img
        src={Needle}
        className="rounded-full w-full absolute h-[45%] top-[27.5%]"
      ></img>
    </div>
  );
}
