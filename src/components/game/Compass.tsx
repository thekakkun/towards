import compass from "../../assets/images/compass.png";
import useHeading from "../../hooks/useHeading";

export default function Compass({
  value: heading,
}: ReturnType<typeof useHeading>) {
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
