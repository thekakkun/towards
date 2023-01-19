import { useEffect, useState } from "react";
import { Coordinates } from "../types/cartography";
import { SensorState } from "../types/game";
import { Degrees } from "../types/math";

export default function usePosition() {
  const coordinates = useCoordinates();
  const heading = useHeading();
  const [status, setStatus] = useState<SensorState>("unavailable");

  // useEffect(() => {
  //   console.log(`Position status: ${status}
  // Coordinates:
  //   availability: ${coordinates.availability}
  //   permission: ${coordinates.permission}
  //   value: ${coordinates.value?.latitude}, ${coordinates.value?.longitude}
  // Heading:
  //   availability: ${heading.availability}
  //   permission: ${heading.permission}
  //   value: ${heading.value}`);
  // }, [coordinates, heading, status]);

  useEffect(() => {
    if (coordinates.value && heading.value) {
      setStatus("ready");
    } else if (
      coordinates.permission === "granted" &&
      heading.permission === "granted"
    ) {
      if (!coordinates.value || !heading.value) {
        setStatus("prompt");
      }
    } else if (
      coordinates.permission === "denied" ||
      heading.permission === "denied"
    ) {
      setStatus("denied");
    } else if (coordinates.availability && heading.availability) {
      setStatus("unknown");
    }
  }, [coordinates, heading]);

  return {
    coordinates,
    heading,
  };
}

// Geolocation API stuff. To get user coordinates.
function useCoordinates() {
  // geolocation availability
  const [availability, setAvailability] = useState(false);
  useEffect(() => {
    setAvailability("geolocation" in navigator);
  }, []);

  // geolocation permissions
  const [permission, setPermission] = useState<PermissionState>("prompt");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  useEffect(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((res) =>
        res.addEventListener("change", () => setPermission(res.state))
      );
  }, []);

  let watchId: number = 0;
  function requestPermission() {
    if (availability) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCoordinates(pos.coords);
        },
        (error) => {
          throw new Error(`ERROR(${error.code}): ${error.message}`);
        }
      );
    }
  }

  useEffect(() => {
    function revokePermission() {
      navigator.geolocation.clearWatch(watchId);
    }

    return () => {
      revokePermission();
    };
  }, [watchId]);

  return { availability, permission, requestPermission, value: coordinates };
}

// Device orientation stuff stuff. To get user heading.
interface WebkitDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading: number;
  requestPermission?: () => Promise<PermissionState>;
}

function useHeading() {
  const [availability, setAvailability] = useState(false);
  useEffect(() => {
    // FIX: shows as true on desktop chrome
    const androidAvailability = "ondeviceorientationabsolute" in window;
    const iosAvailability =
      "ondeviceorientation" in window &&
      "webkitCompassHeading" in DeviceOrientationEvent.prototype;
    const devAvailability = process.env.NODE_ENV === "development";

    setAvailability(androidAvailability || iosAvailability || devAvailability);
  }, []);

  const [permission, setPermission] = useState<PermissionState>("denied");
  const [heading, setHeading] = useState<Degrees | null>(null);
  useEffect(() => {
    const requestWebkitPermission = (
      DeviceOrientationEvent as unknown as WebkitDeviceOrientationEvent
    ).requestPermission;

    if (typeof requestWebkitPermission === "function") {
      requestWebkitPermission().then(setPermission);
    } else {
      setPermission("granted");
    }
  }, []);

  function requestPermission() {
    // dummy value for development purposes
    if (process.env.NODE_ENV === "development") {
      setHeading(30);

      // Absolute orientation. Should be the case for Chrome on Android
    } else if ("ondeviceorientationabsolute" in window) {
      window.addEventListener(
        "deviceorientationabsolute" as "deviceorientation",
        onDeviceOrientation
      );

      // Orientation with permissions. Should be the case for Safari on iOS.
    } else if ("ondeviceorientation" in window) {
      const requestWebkitPermission = (
        DeviceOrientationEvent as unknown as WebkitDeviceOrientationEvent
      ).requestPermission;

      if (typeof requestWebkitPermission === "function") {
        try {
          requestWebkitPermission().then((permission) => {
            if (permission !== "granted") {
              throw new Error("Device orientation permission rejected.");
            }
            window.addEventListener("deviceorientation", onDeviceOrientation);
          });
        } catch (err) {
          alert(err);
        }
      }
    }
  }

  function onDeviceOrientation(
    orientation: DeviceOrientationEvent | WebkitDeviceOrientationEvent
  ) {
    if ("webkitCompassHeading" in orientation) {
      setHeading(orientation.webkitCompassHeading);
    } else if (orientation.absolute && orientation.alpha !== null) {
      setHeading(359 - orientation.alpha);
    }
  }

  useEffect(() => {
    function revokePermission() {
      // Absolute orientation. Should be the case for Chrome on Android
      if ("ondeviceorientationabsolute" in window) {
        window.removeEventListener(
          "deviceorientationabsolute" as "deviceorientation",
          onDeviceOrientation
        );

        // Orientation with permissions. Should be the case for Safari on iOS.
      } else if ("ondeviceorientation" in window) {
        window.removeEventListener("deviceorientation", onDeviceOrientation);
      }
    }

    return () => {
      revokePermission();
    };
  }, []);

  return {
    availability,
    permission,
    requestPermission,
    value: heading,
  };
}
