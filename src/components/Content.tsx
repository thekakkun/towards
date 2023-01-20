import { ReactElement } from "react";

export interface ContentProps {
  children: ReactElement;
}

export default function Content(props: ContentProps) {
  return <div className="w-full mt-4 px-4"> {props.children}</div>;
}
