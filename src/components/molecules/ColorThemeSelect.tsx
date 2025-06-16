"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/molecules/basic/select";

interface ThemeOption {
  name: string;
  className: string;
  label: string;
  color: string;
}

// Mover THEMES fuera del componente para evitar recreaciones
const THEME_OPTIONS: ThemeOption[] = [
  {
    name: "default",
    className: "",
    label: "Base",
    color: "hsl(240 5.9% 10%)",
  },
  {
    name: "red",
    className: "theme-red",
    label: "Rojo",
    color: "hsl(0, 72.2%, 50.6%)",
  },
  {
    name: "rose",
    className: "theme-rose",
    label: "Rosa",
    color: "hsl(346.8, 77.2%, 49.8%)",
  },
  {
    name: "orange",
    className: "theme-orange",
    label: "Naranja",
    color: "hsl(24.6, 95%, 53.1%)",
  },
  {
    name: "green",
    className: "theme-green",
    label: "Verde",
    color: "hsl(142.1, 76.2%, 36.3%)",
  },
  {
    name: "blue",
    className: "theme-blue",
    label: "Azul",
    color: "hsl(221.2, 83.2%, 53.3%)",
  },
  {
    name: "yellow",
    className: "theme-yellow",
    label: "Amarillo",
    color: "hsl(47.9, 95.8%, 53.1%)",
  },
  {
    name: "violet",
    className: "theme-violet",
    label: "Violeta",
    color: "hsl(262.1, 83.3%, 57.8%)",
  },
];

function ColorThemeSelectComponent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string>("default");

  // Función estable para aplicar clases de color
  const applyColorClass = useCallback((color: string) => {
    if (typeof document === "undefined") return;

    const classList = document.documentElement.classList;
    // Quita todas las clases de color existentes
    THEME_OPTIONS.forEach((theme) => {
      if (theme.className) classList.remove(theme.className);
    });
    // Aplica la clase seleccionada
    const themeObj = THEME_OPTIONS.find((theme) => theme.name === color);
    themeObj?.className && classList.add(themeObj.className);
  }, []);

  // Inicializar solo una vez cuando se monta el componente
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
      const color = localStorage.getItem("theme-color") ?? "default";
      setSelected(color);
      applyColorClass(color);
    }
  }, [applyColorClass]);

  // Re-aplicar color cuando cambia el tema oscuro/claro
  useEffect(() => {
    if (!mounted) return;
    applyColorClass(selected);
  }, [resolvedTheme, mounted, selected, applyColorClass]);

  // Maneja el cambio de color
  const handleChange = useCallback(
    (value: string) => {
      setSelected(value);
      if (typeof window !== "undefined") {
        localStorage.setItem("theme-color", value);
      }
      applyColorClass(value);
    },
    [applyColorClass]
  );

  // Memorizar los items del select para evitar recreaciones
  const selectItems = useMemo(
    () =>
      THEME_OPTIONS.map((themeOption) => (
        <SelectItem key={`theme-${themeOption.name}`} value={themeOption.name}>
          <div className="inline-flex items-center gap-2">
            <span
              className="flex-shrink-0 w-4 h-4 border rounded-full border-border"
              style={{ backgroundColor: themeOption.color }}
            />
            <span>{themeOption.label}</span>
          </div>
        </SelectItem>
      )),
    []
  );

  if (!mounted) {
    return (
      <div className="w-fit min-w-[8rem] h-9 rounded-md border bg-muted animate-pulse" />
    );
  }

  return (
    <Select value={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-fit min-w-[8rem] border-primary">
        <SelectValue placeholder="Tema de color" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{selectItems}</SelectGroup>
      </SelectContent>
    </Select>
  );
}

// Memoizar el componente completo
export const ColorThemeSelect = React.memo(ColorThemeSelectComponent);
