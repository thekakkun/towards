import { ReactElement } from "react";

interface DisplayProps {
  info: ReactElement;
  visualization: ReactElement;
}

export default function Display(props: DisplayProps) {
  return (
    <div className="">
      <div>{props.info}</div>
      <div className="">{props.visualization}</div>
    </div>
  );
}
