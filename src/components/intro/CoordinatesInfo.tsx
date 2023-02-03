import useCoordinates from "../../hooks/useCoordinates";

export default function CoordinatesInfo(
  coordinates: ReturnType<typeof useCoordinates>
) {
  return (
    <li
      className={`rounded border-2 mt-2 p-2 ${
        coordinates.state === "ready"
          ? "bg-emerald-100 border-emerald-400"
          : coordinates.state === "unavailable"
          ? "bg-red-100 border-red-400"
          : "bg-yellow-100 border-yellow-400"
      }`}
    >
      <h2 className="font-bold mb-1">Location</h2>

      {coordinates.state === "unknown" ? (
        <p>Location Service state unknown.</p>
      ) : coordinates.state === "unavailable" ? (
        <p>
          Geolocation services are unavailable on this device. Please double
          check the list of supported browsers below.
        </p>
      ) : coordinates.state === "denied" ? (
        <div>
          <p className="font-semibold">
            Permission to access location was denied.
          </p>
          <p>
            OS or browser settings may need to be updated. You may need to
            reload the page for changes to take effect.
          </p>
          <ul>
            <li className="mt-1">
              <span className="font-semibold">iOS</span>
              <ul className="list-disc ml-4">
                <li>
                  <a
                    className="text-sky-800 underline"
                    href="https://support.apple.com/en-ca/HT207092"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Turn on location Services for Safari
                  </a>
                </li>
                <li>
                  <a
                    className="text-sky-800 underline"
                    href="https://support.apple.com/en-ca/guide/iphone/iphb3100d149/16.0/ios/16.0#iph00c65c471"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Update privacy controls for the website
                  </a>
                </li>
              </ul>
            </li>
            <li className="mt-1">
              <span className="font-semibold">Android</span>
              <ul className="list-disc ml-4">
                <li>
                  <a
                    className="text-sky-800 underline"
                    href="https://support.google.com/android/answer/6179507"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Update location permissions for Chrome
                  </a>
                </li>
                <li>
                  <a
                    className="text-sky-800 underline"
                    href="https://support.google.com/chrome/answer/114662?hl=en&co=GENIE.Platform%3DAndroid"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Change site permissions
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      ) : coordinates.state === "granted" ? (
        <p>Permission granted. Attempting to retrieve location...</p>
      ) : coordinates.state === "prompt" ? (
        <div>
          <p>Press the button below to provide permissions.</p>
          <button
            className="bg-emerald-600 hover:bg-emerald-800 text-stone-50
            px-5 py-2 text-sm font-semibold mt-2 rounded-md"
            onClick={coordinates.requestAccess}
          >
            Provide permission
          </button>
        </div>
      ) : coordinates.state === "ready" ? (
        <p>Ready!</p>
      ) : null}
    </li>
  );
}
