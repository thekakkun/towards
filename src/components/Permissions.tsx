import usePosition from "../hooks/usePosition";

export default function Permissions() {
  return (
    <div className="">
      <p>
        Being a location-based geograpy game, permission to access the following
        information is needed:
      </p>
      <ul className="list-disc list-inside">
        <li>Geolocation (where you currently are)</li>
        <li>Orientation (which way you're facing)</li>
      </ul>
      <p>
        No user data will be collected by the game or shared with third-parties.
      </p>

      <h3 className="text-base font-bold text-slate-700">
        Supported browsers:
      </h3>

      <ul className="list-disc list-inside">
        <li>Android OS: Chrome</li>
        <li>iOS: Safari</li>
      </ul>
    </div>
  );
}
