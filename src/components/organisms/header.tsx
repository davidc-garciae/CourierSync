import React from "react";
import { ThemeToggleButton } from "@/components/atoms/ThemeToggleButton";
import { ColorThemeSelect } from "@/components/molecules/ColorThemeSelect";

interface HeaderProps {
  readonly className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-end w-full gap-4 px-6 py-3 border-b shadow-sm bg-card/80 dark:bg-card/80 backdrop-blur border-border ${className}`.trim()}
    >
      <ColorThemeSelect />
      <ThemeToggleButton />
    </header>
  );
}
