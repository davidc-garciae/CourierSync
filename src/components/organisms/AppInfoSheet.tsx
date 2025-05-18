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
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4 text-base text-foreground">
          <p>
            <b>¡Atención!</b> Esta aplicación está en{" "}
            <span className="font-semibold text-primary">desarrollo</span> y
            actualmente <b>no está conectada a los endpoints API reales</b>.
          </p>
          <ul className="pl-5 text-sm list-disc text-muted-foreground">
            <li>
              El <b>front end</b> está listo para conectarse a servicios reales.
            </li>
            <li>
              Las funcionalidades de <b>registro</b>, <b>ingreso de usuario</b>{" "}
              y <b>ingreso de administrador</b> simulan solicitudes API.
            </li>
            <li>
              La edición de perfil y la visualización de historial de usuario
              también simulan respuestas y errores.
            </li>
            <li>
              Si ocurre un error en la simulación, se muestran mensajes de error
              realistas.
            </li>
            <li>
              Para ingresar como <b>usuario</b> usa:{" "}
              <span className="font-mono">User / User</span>
            </li>
            <li>
              Para ingresar como <b>administrador</b> usa:{" "}
              <span className="font-mono">Admin / Admin</span>
            </li>
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            Si tienes dudas o necesitas conectar el backend, contacta al equipo
            de desarrollo.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
