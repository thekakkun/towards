import { ReactElement } from "react";

interface DisplayProps {
  info: ReactElement;
  visualization: ReactElement;
}

export default function Display(props: DisplayProps) {
  return (
    <div>
      <div>{props.info}</div>
      <div>{props.visualization}</div>
    </div>
  );
}
