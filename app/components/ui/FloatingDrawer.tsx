"use client";

import { Button } from "@headlessui/react";
import { useState } from "react";

const FloatingDrawer = ({ children }: { children: React.ReactNode }) => {
  const [hidden, setHidden] = useState<boolean>(false);

  return (
    <section className="absolute left-0 top-0 z-20 flex h-screen w-1/4 p-4">
      <Button
        className="absolute left-5 top-5 z-30 size-10 bg-red-200"
        onClick={() => setHidden((prev) => !prev)}
      ></Button>
      <div
        className={`${
          hidden ? "visible" : "invisible"
        }  size-full min-w-80 max-w-sm rounded-lg bg-zinc-100 opacity-95 shadow-2xl`}
      >
        {children}
      </div>
    </section>
  );
};

export { FloatingDrawer };
