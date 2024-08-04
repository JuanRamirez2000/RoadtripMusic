"use client";
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
    <div className="absolute left-4 top-2">
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
      <label className="relative cursor-pointer" htmlFor="toggle-light">
        <SunIcon className="h-10 w-10 dark:hidden" />
        <MoonIcon className="hidden h-10 w-10 dark:block" />
      </label>
    </div>
  );
}
