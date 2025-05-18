"use client";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/organisms/basic/sheet";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { toast } from "sonner";
import { format } from "date-fns";

export function EditProfileSheet({
  user,
  isAdmin = false,
  trigger,
}: {
  user: {
    id: string;
    name: string;
    apellido: string;
    direccion: string;
    phone: string;
    email: string;
    tipoId?: string;
    numeroId?: string;
    avatar?: string;
  };
  isAdmin?: boolean;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [form, setForm] = React.useState({
    name: user.name || "",
    apellido: user.apellido || "",
    direccion: user.direccion || "",
    phone: user.phone || "",
    email: user.email || "",
    tipoId: user.tipoId || "",
    numeroId: user.numeroId || "",
  });

  React.useEffect(() => {
    setForm({
      name: user.name || "",
      apellido: user.apellido || "",
      direccion: user.direccion || "",
      phone: user.phone || "",
      email: user.email || "",
      tipoId: user.tipoId || "",
      numeroId: user.numeroId || "",
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Simula una solicitud POST al guardar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setSaving(false);
        setSuccess(false);
        toast.error("Error al actualizar el perfil", {
          description: "Ocurrió un error inesperado. Intenta nuevamente.",
          className: "text-destructive",
        });
        return;
      }
      setSaving(false);
      setSuccess(true);
      setOpen(false); // Cierra el sheet
      toast.success(
        isAdmin ? "Perfil de usuario actualizado" : "Perfil actualizado",
        {
          description: format(new Date(), "PPPP 'a las' p"),
        }
      );
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || <Button variant="outline">Editar perfil</Button>}
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isAdmin ? "Editar perfil de usuario" : "Editar perfil"}
          </SheetTitle>
        </SheetHeader>
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <label>
            Nombre
            <Input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Apellido
            <Input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
            />
          </label>
          <label>
            Dirección
            <Input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </label>
          <label>
            Número de celular
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Correo electrónico
            <Input name="email" value={form.email} onChange={handleChange} />
          </label>
          {isAdmin && (
            <>
              <label>
                Tipo de ID
                <Input
                  name="tipoId"
                  value={form.tipoId}
                  onChange={handleChange}
                />
              </label>
              <label>
                Número de ID
                <Input
                  name="numeroId"
                  value={form.numeroId}
                  onChange={handleChange}
                />
              </label>
            </>
          )}
          <div className="flex gap-2 mt-4">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
