import { ReactComponent as Rose } from "../../assets/images/rose.svg";
import { ReactComponent as Needle } from "../../assets/images/needle.svg";
import useHeading from "../../hooks/useHeading";

export default function Compass({
  value: heading,
}: ReturnType<typeof useHeading>) {
  return (
    <div className="overflow-clip relative w-full mx-auto aspect-square">
      <Rose
        title="Compass rose"
        className="rounded-full w-full absolute"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(45deg) rotate(-${heading}deg)`,
        }}
      ></Rose>
      <Needle
        title="Compass needle"
        className="rounded-full w-full absolute h-2/5 top-[30%]"
      ></Needle>
    </div>
  );
}
