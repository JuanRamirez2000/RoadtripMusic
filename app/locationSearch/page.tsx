export default function LocationsSearchPage() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="maps-drawer" type="checkbox" className="drawer-toggle" />
      {/* Page content here */}
      <div className="drawer-content h-screen">
        <label
          htmlFor="maps-drawer"
          className="absolute left-2 top-2 z-10 rounded-lg bg-emerald-400 px-4 py-3 text-emerald-900 lg:hidden"
        >
          Search Locations
        </label>
      </div>
      {/* Sidebar content here */}
      <div className="drawer-side z-20">
        <label htmlFor="maps-drawer" className="drawer-overlay"></label>
        <div className="h-screen bg-base-100 py-10"></div>
      </div>
    </div>
  );
}
