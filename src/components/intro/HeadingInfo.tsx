import useHeading from "../../hooks/useHeading";

export default function HeadingInfo(
  coordinates: ReturnType<typeof useHeading>
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
      <h2 className="font-bold">Compass</h2>

      {coordinates.state === "unknown" ? (
        <p>Compass state unknown.</p>
      ) : coordinates.state === "unavailable" ? (
        <p>
          Compass services are unavailable on this device. Please double
          check the list of supported browsers below.
        </p>
      ) : coordinates.state === "denied" ? (
        <div>
          <p>Permission to access compass was denied.</p>
          {/* TODO: add instructions for various devices. */}
        </div>
      ) : coordinates.state === "granted" ? (
        <p>Permission granted. Attempting to retrieve compass heading...</p>
      ) : coordinates.state === "prompt" ? (
        <div>
          <p>Press the button below to provide permissions.</p>
          <button
            className="bg-stone-500 hover:bg-stone-700 px-5 py-2 text-sm font-semibold mt-2 rounded-full text-stone-50"
            onClick={coordinates.requestAccess}
          >
            Provide permission
          </button>
        </div>
      ) : coordinates.state === "ready" ? (
        <p>Good to go!</p>
      ) : null}
    </li>
  );
}
