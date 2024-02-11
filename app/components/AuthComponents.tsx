/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut } from "auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("spotify");
      }}
    >
      <button className="tranisition-all inline-flex w-32 items-center justify-center rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-900 duration-150 ease-in hover:scale-110 dark:bg-cyan-400 md:w-64">
        Sign In To Spotify
      </button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <button className="tranisition-all inline-flex w-32 items-center justify-center rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-900 duration-150 ease-in hover:scale-110 dark:bg-cyan-400 md:w-64">
        Sign Out
      </button>
    </form>
  );
}
