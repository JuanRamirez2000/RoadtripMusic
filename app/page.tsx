import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import type { Route } from "next";
import Image from "next/image";
import {
  MapIcon,
  MusicalNoteIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Roadtrip Music",
  description: "An ai based music generator for roadtrips!",
};

const Home = async () => {
  const session = await getServerSession(authOptions);
  return (
    <main>
      {/* Hero Section */}
      <div className="hero min-h-screen ">
        <div className="hero-content flex-col lg:flex-row-reverse ">
          <div className="relative h-64 w-64 rounded-lg md:h-96 md:w-96">
            <Image
              src={"/assets/svgs/carOnRoadTrip.svg"}
              alt="Hero Image"
              fill
            />
          </div>
          <div className="flex flex-col items-center gap-4 text-center md:gap-8">
            <h1 className="text-4xl  font-semibold tracking-tighter md:text-7xl md:font-bold">
              Roadtrip music
            </h1>
            <p className="w-64 text-xl tracking-tight md:w-96">
              An AI powered playlist generator for roadtrips!
            </p>
            <div className="breadcrumbs text-sm md:text-lg lg:text-xl">
              <ul>
                <li>
                  <UserIcon className="mr-2 h-4 w-4 text-secondary-focus" />
                  Sign In
                </li>
                <li>
                  <MapIcon className="mr-2 h-4 w-4 text-secondary-focus" />
                  Plan Route
                </li>
                <li>
                  <MusicalNoteIcon className="mr-2 h-4 w-4 text-secondary-focus" />
                  Generate Music
                </li>
              </ul>
            </div>
            {!!session ? (
              <Link
                className="btn-primary btn w-32 md:w-64"
                href={"/locationSearch"}
              >
                Get Started
              </Link>
            ) : (
              <Link
                className="btn-primary btn w-32 md:w-64"
                href={"/api/auth/signin" as Route}
              >
                Sign in to spotify
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
