import { useEffect, useState } from "react";
import { SensorState } from "../types/game";

interface SensorInfoProps<T> {
  name: string;
  sensor: {
    state: SensorState;
    requestAccess: () => void;
    value: T;
  };
}

export default function SensorInfo<T>({ name, sensor }: SensorInfoProps<T>) {
  // Automatically get access to data if permission granted
  // useEffect(() => {
  //   if (sensor.state === "granted") {
  //     sensor.requestAccess();
  //   }
  // }, []);

  // const [state, setState] = useState<"warning" | "error" | "ready">("warning");
  // useEffect(() => {
  //   if (sensor.value !== null) {
  //     setState("ready");
  //   } else if (!sensor.isAvailable()) {
  //     setState("error");
  //   } else if (sensor)
  // }, [sensor]);

  return (
    <div>
      <h2>{name}</h2>
      {sensor.state === "unavailable" ? (
        <p>
          Geolocation services are unavailable on this device. Please double
          check the supported browsers below.
        </p>
      ) : sensor.state === "prompt" && sensor.value === null ? (
        <div>
          <p>Please press the button below to provide permissions.</p>{" "}
          <button onClick={sensor.requestAccess}>Provide permission</button>
        </div>
      ) : null}
    </div>
  );
}
