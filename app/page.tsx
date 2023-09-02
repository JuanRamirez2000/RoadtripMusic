import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Image from "next/image";
import type { Route } from "next";

export const metadata: Metadata = {
  title: "Roadtrip Music",
  description: "An ai based music generator for roadtrips!",
};

const Home = async () => {
  const session = await getServerSession(authOptions);
  return (
    <main>
      {/* Hero Section */}
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-5xl font-semibold tracking-tighter md:text-7xl md:font-bold">
              Roadtrip music
            </h1>
            <p className="w-64 text-2xl tracking-tight md:w-96">
              An AI powered playlist generator for roadtrips!
            </p>
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

      {/* How it works */}
      <div className="flex h-screen min-h-fit w-full flex-col items-center">
        <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
          How it works
        </h2>
        <div className="flex h-1/2 w-full flex-col items-center justify-around md:flex-row">
          <div className="flex h-full w-full flex-col items-center justify-center md:h-full md:w-1/2">
            <div className="max-w-sm">
              <h3 className="text-center text-2xl font-semibold tracking-tight md:text-5xl">
                First log into Spotify
              </h3>
              <p className="text-center text-sm italic md:text-lg">
                Don&apos;t worry, we dont store anything!
              </p>
            </div>
          </div>
          <div className="relative h-full w-full md:w-1/2">
            <Image
              src={"assets/svgs/womanListeningOnPhone.svg"}
              alt="Listening to music on phone"
              fill
            />
          </div>
        </div>
        <div className="flex h-1/2 w-full flex-col items-center justify-around bg-slate-800 text-slate-50 md:flex-row-reverse">
          <div className="flex h-full w-full flex-col items-center justify-center md:h-full md:w-1/2">
            <div className="max-w-sm">
              <h3 className="text-center text-2xl font-semibold tracking-tight md:text-5xl">
                Next; plan your trip!
              </h3>
              <p className="text-center text-sm italic md:text-lg">
                Powered by Google Maps.
              </p>
            </div>
          </div>
          <div className="relative h-full w-full md:w-1/2">
            <Image
              src={"assets/svgs/phoneNavigation.svg"}
              alt="Listening to music on phone"
              fill
            />
          </div>
        </div>
        <div className="flex h-1/2 w-full flex-col items-center justify-around md:flex-row">
          <div className="flex h-full w-full flex-col items-center justify-center md:h-full md:w-1/2">
            <div className="max-w-sm">
              <h3 className="text-center text-2xl font-semibold tracking-tight md:text-5xl">
                We combine all data
              </h3>
            </div>
          </div>
          <div className="relative h-full w-full md:w-1/2">
            <Image
              src={"assets/svgs/womanCombiningPagesOnPhone.svg"}
              alt="Listening to music on phone"
              fill
            />
          </div>
        </div>
        <div className="md:1/3 flex h-1/2 w-full  flex-col items-center justify-around bg-slate-800 text-slate-50 md:flex-row-reverse">
          <div className="flex h-full w-full flex-col items-center justify-center md:h-full md:w-1/2">
            <div className="flex max-w-sm flex-col items-center gap-2">
              <h3 className="text-center text-2xl font-semibold tracking-tight md:text-5xl">
                And youre all set for your trip!
              </h3>
              {!!session ? (
                <Link
                  className="btn-primary btn w-32 md:w-48 lg:w-64"
                  href={"/locationSearch"}
                >
                  Get Started
                </Link>
              ) : (
                <Link
                  className="btn-primary btn w-32 md:w-48 lg:w-64"
                  href={"/api/auth/signin" as Route}
                >
                  Sign in to spotify
                </Link>
              )}
            </div>
          </div>
          <div className="relative h-full w-full md:w-1/2">
            <Image
              src={"assets/svgs/carOnRoadTrip.svg"}
              alt="Listening to music on phone"
              fill
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
