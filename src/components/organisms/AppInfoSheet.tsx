import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/organisms/basic/sheet";
import { Button } from "@/components/atoms/button";

export function AppInfoSheet({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Información de la aplicación</SheetTitle>
        </SheetHeader>{" "}
        <div className="flex flex-col gap-4 mt-4 text-base text-foreground">
          <p>
            <b>¡Atención!</b> Esta aplicación está{" "}
            <span className="font-semibold text-primary">
              lista para conectarse al backend
            </span>
            , pero el <b>backend aún no está desplegado adecuadamente</b>{" "}
            (versión anterior).
          </p>
          <ul className="pl-5 text-sm list-disc text-muted-foreground">
            <li>
              El <b>frontend</b> está completamente preparado para integrarse
              con servicios reales.
            </li>
            <li>
              El <b>backend</b> se encuentra en una versión anterior y no está
              disponible actualmente.
            </li>
            <li>
              Por el momento <b>no es posible iniciar sesión</b> ni acceder a
              las funcionalidades.
            </li>
            <li>
              En la <b>próxima actualización</b> se implementará un sistema de
              datos simulados para demostrar todas las funcionalidades sin
              necesidad de backend.
            </li>
            <li>
              Esto permitirá navegar y probar todas las características del
              dashboard administrativo con datos de ejemplo.
            </li>
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            Próximamente: Modo demostración con datos simulados para una
            experiencia completa sin dependencias del backend.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
