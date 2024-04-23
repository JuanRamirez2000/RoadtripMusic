import type { Metadata } from "next";
import Link from "next/link";
import HeroImage from "./HeroImage";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Roadtrip Music",
  description: "An ai based music generator for roadtrips!",
};

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <section className="flex max-w-7xl flex-col items-center justify-center gap-1 p-1 lg:flex-row-reverse">
        <HeroImage />
        <div className="flex flex-col items-center gap-4 text-center md:gap-8">
          <h1 className="text-4xl font-semibold tracking-tighter md:text-7xl md:font-bold">
            Roadify
          </h1>
          <p className="w-64 text-xl tracking-tight md:w-96">
            An AI powered playlist generator for roadtrips!
          </p>
          <div>
            <SignedOut>
              <SignInButton>
                <button className="tranisition-all inline-flex w-32 items-center justify-center rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-900 duration-150 ease-in hover:scale-110 dark:bg-cyan-400 md:w-64">
                  Sign In To Spotify
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                className="tranisition-all inline-flex w-32 items-center justify-center rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-900 duration-150 ease-in hover:scale-110 dark:bg-cyan-400 md:w-64"
                href={"/locationSearch"}
              >
                Get Started
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>
    </main>
  );
}
