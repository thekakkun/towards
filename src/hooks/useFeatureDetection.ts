import { useEffect, useState } from "react";

type FeatureState = PermissionState | "unknown" | "unavailable";

export default function useFeatureDetection() {
  const coordinateFeature = useCoordinateFeature();
  const orientationFeature = useOrientationFeature();

  return { coordinateFeature, orientationFeature };
}

/**
 * Checks to see if Geolocation is available, and what its state is.
 * @returns Availability state of coordinates.
 */
function useCoordinateFeature() {
  const [coordinateFeature, setCoordinateFeature] =
    useState<FeatureState>("unknown");

  useEffect(() => {
    if ("geolocation" in navigator) {
      watchState();
    } else {
      setCoordinateFeature("unavailable");
    }

    async function watchState() {
      let res = await navigator.permissions.query({ name: "geolocation" });
      res.addEventListener("change", () => setCoordinateFeature(res.state));
    }
  }, []);

  return coordinateFeature;
}

/**
 * DeviceOrientationEvent interface for WebKit
 */
interface WebKitDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading: number;
  requestPermission?: () => Promise<PermissionState>;
}

/**
 * Checks to see if Orientation (AKA compass heading) is available.
 * @returns Availability state of orientation.
 */
function useOrientationFeature() {
  const [orientationFeature, setOrientationFeature] =
    useState<FeatureState>("unknown");

  useEffect(() => {
    if (DeviceOrientationEvent) {
      watchState();
    } else {
      setOrientationFeature("unavailable");
    }
  });

  async function watchState() {
    try {
      let res = await navigator.permissions.query({
        name: "magnetometer" as PermissionName,
      });
      res.addEventListener("change", () => setOrientationFeature(res.state));
    } catch (err) {
      console.log(err);
      setOrientationFeature("unknown");
    }
  }

  return orientationFeature;
}
