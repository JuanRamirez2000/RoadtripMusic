"use client";
import { Transition } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggleSwitch() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute left-4 top-2 z-50">
      <input
        type="checkbox"
        id="toggle-light"
        className="toggle-light sr-only"
        checked={theme === "light"}
        onChange={() => {
          if (theme === "dark") {
            return setTheme("light");
          }
          return setTheme("dark");
        }}
      />
      <label className="relative z-50 cursor-pointer" htmlFor="toggle-light">
        <Transition
          show={theme === "light"}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 rotate-[-120deg] scale-50"
          enterTo="opacity-100 rotate-0 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <SunIcon className={`h-10 w-10 dark:hidden`} />
        </Transition>
        <Transition
          show={theme === "dark"}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 rotate-[-120deg] scale-50"
          enterTo="opacity-100 rotate-0 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 rotate-0 scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <MoonIcon className="hidden h-10 w-10 dark:block" />
        </Transition>
      </label>
    </div>
  );
}
