import { ReactElement } from "react";

interface DisplayProps {
  info: ReactElement;
  visualization: ReactElement;
}

export default function Display(props: DisplayProps) {
  return (
    <div>
      <div>{props.info}</div>
      <div className="h-full flex flex-col justify-between">
        {props.visualization}
      </div>
    </div>
  );
}
