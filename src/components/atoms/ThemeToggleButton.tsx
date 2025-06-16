"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon } from "./sun";
import { MoonIcon } from "../auth/moon";

interface ThemeToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function ThemeToggleButton({
  className = "",
  ...props
}: ThemeToggleButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      aria-label="Alternar tema"
      {...props}
      className={`${className} p-2 transition-colors border rounded-full shadow bg-background/80 border-border hover:bg-primary/10`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <SunIcon className="flex items-center justify-center w-5 h-5 " />
      ) : (
        <MoonIcon className="flex items-center justify-center w-5 h-5" />
      )}
    </button>
  );
}
