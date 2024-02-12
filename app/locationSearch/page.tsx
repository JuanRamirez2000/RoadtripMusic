import MapContainer from "./MapContainer";

export default function LocationsSearchPage() {
  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="h-full w-1/2"></div>
      <div className="h-full w-1/2">
        <MapContainer />
      </div>
    </div>
  );
}
