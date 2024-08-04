"use client";

import { MapboxWrapper } from "app/components/MapboxSearchbox/MapWrapper";
import { FloatingDrawer } from "../components/ui/FloatingDrawer";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function LocationsSearchPage() {
  return (
    <main className="fle{x h-screen w-full flex-row">
      <FloatingDrawer> </FloatingDrawer>
      <MapboxWrapper accessToken={MAPBOX_ACCESS_TOKEN as string} />
    </main>
  );
}
