import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/organisms/basic/sheet";

export function AppInfoSheet({
  trigger,
}: {
  readonly trigger: React.ReactNode;
}) {
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
              conectada correctamente al backend
            </span>
            {", "}y todas las funcionalidades principales están disponibles.
          </p>
          <ul className="pl-5 text-sm list-disc text-muted-foreground">
            <li>
              El <b>frontend</b> está completamente integrado con servicios
              reales.
            </li>
            <li>
              El <b>backend</b> está desplegado y operativo.
            </li>
            <li>
              Ya es posible <b>iniciar sesión</b> y acceder a las
              funcionalidades principales.
            </li>
            <li>
              Puedes probar el sistema usando las credenciales de usuario y
              administrador listadas abajo.
            </li>
            <li>
              Próximamente se implementará un modo demostración con datos
              simulados para pruebas sin conexión.
            </li>
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            Próximamente: Modo demostración con datos simulados para una
            experiencia completa sin dependencias del backend.
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <b>Credenciales de acceso disponibles:</b>
            <ul className="pl-5 mt-1 list-disc">
              <li>
                <b>Usuario:</b> alejandroorrego@gmail.com
                <br />
                <b>Contraseña:</b> user
              </li>
              <li>
                <b>Administrador:</b> admin1
                <br />
                <b>Contraseña:</b> admin1
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
