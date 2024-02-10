import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="relative h-64 w-64 rounded-lg md:h-96 md:w-96">
      <Image
        className="dark:hidden"
        src={"/assets/svgs/carOnRoadTrip.svg"}
        alt="Hero Image"
        fill
      />
      <Image
        className="hidden dark:block"
        src={"/assets/svgs/carOnRoadTripDark.svg"}
        alt="Hero Image"
        fill
      />
    </div>
  );
}
