"use client";

import Image from "next/image";
import { useNightModeStore } from "contexts/themeStore";
export default function HeroImage() {
  const nightMode = useNightModeStore((state) => state.nightMode);

  return (
    <div className="relative h-64 w-64 rounded-lg md:h-96 md:w-96">
      {!nightMode ? (
        <Image src={"/assets/svgs/carOnRoadTrip.svg"} alt="Hero Image" fill />
      ) : (
        <Image
          src={"/assets/svgs/carOnRoadTripDark.svg"}
          alt="Hero Image"
          fill
        />
      )}
    </div>
  );
}
