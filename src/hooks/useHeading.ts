import { useEffect, useState } from "react";
import { Degrees } from "../types/math";

export default function useHeading() {
  const [permissionState, setPermissionState] = usePermissionState();
  const [heading, setHeading] = useState<Degrees | null>(null);

  // On initialization, check for availability of orientation services
  useEffect(() => {
    if (
      !(
        "ondeviceorientation" in window ||
        "ondeviceorientationabsolute" in window
      )
    ) {
      throw new Error("Device orientation not supported.");
    }
  });

  // On get coordinates if permission already granted.
  useEffect(() => {
    if (permissionState === "granted") {
      watchHeading();
    }
  }, [permissionState]);

  /**
   * Will prompt user for permission if not 'granted'.
   * Once granted, start monitoring the heading.
   */
  async function requestAccess() {
    const requestHeadingPermission = (
      DeviceOrientationEvent as unknown as webkitDeviceOrientationEvent
    ).requestPermission;

    if (typeof requestHeadingPermission === "function") {
      try {
        setPermissionState(await requestHeadingPermission());
      } catch (err) {
        throw err;
      }
    }

    if (permissionState !== "granted") {
      throw new Error("Orientation permissions rejected.");
    } else {
      watchHeading();
    }
  }

  /**
   * Attach event listener for orientation, based on what is available.
   */
  function watchHeading() {
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener(
        "deviceorientationabsolute" as "deviceorientation",
        onDeviceOrientation
      );
    } else if ("deviceorientation" in window) {
      window.addEventListener("deviceorientation", onDeviceOrientation);
    } else {
      throw new Error("Device orientation not supported.");
    }
  }

  /**
   * Attempt to set the heading based on information available from the event.
   * @param orientation Device orientation event
   */
  function onDeviceOrientation(
    orientation: DeviceOrientationEvent | webkitDeviceOrientationEvent
  ) {
    if ("webkitCompassHeading" in orientation) {
      setHeading(orientation.webkitCompassHeading);
    } else if (orientation.absolute && orientation.alpha) {
      setHeading(359 - orientation.alpha);
    } else {
      throw new Error("Could not get compass heading");
    }
  }

  return { state: permissionState, requestAccess, value: heading };
}

/**
 * Stores orientation permission state in a React state variable.
 * Updates automatically on change.
 *
 * Note: Does not take Sensors API into consideration, due to lack of support
 * at time of development.
 *
 * @returns permission state of the Geolocation API
 */
function usePermissionState(): [
  PermissionState,
  React.Dispatch<React.SetStateAction<PermissionState>>
] {
  const [permissionState, setPermissionState] =
    useState<PermissionState>("denied");

  useEffect(() => {
    const requestHeadingPermission = (
      DeviceOrientationEvent as unknown as webkitDeviceOrientationEvent
    ).requestPermission;

    // No method to request permission. Assume permission granted.
    // This is the case for Chrome.
    if (typeof requestHeadingPermission !== "function") {
      setPermissionState("granted");
    }
    // There is a method to request permission. User needs to be prompted.
    else {
      setPermissionState("prompt");
    }
  }, []);

  return [permissionState, setPermissionState];
}

/**
 * Properties and methods available on Webkit (Safari)
 */
interface webkitDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading: number;
  webkitCompassAccuracy: number;
  requestPermission: () => Promise<PermissionState>;
}
