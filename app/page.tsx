import type { Metadata } from "next";
import Link from "next/link";
import HeroImage from "./HeroImage";
import { auth } from "auth";
import { SignIn } from "./components/AuthComponents";

export const metadata: Metadata = {
  title: "Roadtrip Music",
  description: "An ai based music generator for roadtrips!",
};

async function Home() {
  const session = await auth();
  return (
    <main>
      {/* Hero Section */}
      <div className="flex min-h-screen w-screen flex-col items-center justify-center">
        <div className="flex max-w-7xl flex-col items-center justify-center gap-1 p-1 lg:flex-row-reverse">
          <HeroImage />
          <div className="flex flex-col items-center gap-4 text-center md:gap-8">
            <h1 className="text-4xl font-semibold tracking-tighter md:text-7xl md:font-bold">
              Roadtrip music
            </h1>
            <p className="w-64 text-xl tracking-tight md:w-96">
              An AI powered playlist generator for roadtrips!
            </p>
            {!!session ? (
              <Link
                className="tranisition-all inline-flex w-32 items-center justify-center rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-900 duration-150 ease-in hover:scale-110 dark:bg-cyan-400 md:w-64"
                href={"/locationSearch"}
              >
                Get Started
              </Link>
            ) : (
              <SignIn />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
