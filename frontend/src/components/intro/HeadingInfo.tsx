import { Degrees, SensorHook } from "../../types/over-yonder";

export default function HeadingInfo({
  heading,
}: {
  heading: SensorHook<Degrees>;
}) {
  return (
    <li
      className={`rounded border-2 mt-2 p-2 ${
        heading.state === "ready"
          ? "bg-emerald-100 border-emerald-400"
          : heading.state === "unavailable" || heading.state === "denied"
          ? "bg-red-100 border-red-400"
          : "bg-yellow-100 border-yellow-400"
      }`}
    >
      <h2 className="font-bold mb-1">Compass</h2>

      {heading.state === "unknown" ? (
        <p>Compass state unknown.</p>
      ) : heading.state === "unavailable" ? (
        <p>
          Compass services are unavailable on this device. Please double check
          the list of supported browsers below.
        </p>
      ) : heading.state === "denied" ? (
        <div>
          <p>Permission to access compass was denied.</p>
        </div>
      ) : heading.state === "granted" ? (
        <p>Permission granted. Attempting to retrieve compass heading...</p>
      ) : heading.state === "prompt" ? (
        <div>
          <p>Press the button below to provide permissions.</p>
          <button
            className="bg-emerald-600 hover:bg-emerald-800 text-stone-50
            px-5 py-2 text-sm font-semibold mt-2 rounded-md"
            onClick={heading.requestAccess}
          >
            Provide permission
          </button>
        </div>
      ) : heading.state === "ready" ? (
        <p>Ready!</p>
      ) : null}
    </li>
  );
}
