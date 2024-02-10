"use client";
import { Transition } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

export default function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme();

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
      <label className="relative z-10 cursor-pointer" htmlFor="toggle-light">
        <Transition
          show={theme === "light"}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <SunIcon className={`h-10 w-10 dark:hidden`} />
        </Transition>
        <Transition
          show={theme === "dark"}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <MoonIcon className="hidden h-10 w-10 dark:block" />
        </Transition>
      </label>
    </div>
  );
}
