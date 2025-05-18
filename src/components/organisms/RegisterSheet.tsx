"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/organisms/basic/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/molecules/basic/select";

export function RegisterSheet({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    tipoId: "Cédula de ciudadanía",
    numeroId: "",
    nombre: "",
    apellido: "",
    direccion: "",
    celular: "",
    correo: "",
    confirmarCorreo: "",
    password: "",
    confirmarPassword: "",
  });

  const [errors, setErrors] = React.useState<{ [k: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.tipoId) newErrors.tipoId = "Requerido";
    if (!form.numeroId) newErrors.numeroId = "Requerido";
    if (!form.nombre) newErrors.nombre = "Requerido";
    if (!form.apellido) newErrors.apellido = "Requerido";
    if (!form.direccion) newErrors.direccion = "Requerido";
    if (!form.celular) newErrors.celular = "Requerido";
    if (!form.correo) newErrors.correo = "Requerido";
    if (!form.confirmarCorreo) newErrors.confirmarCorreo = "Requerido";
    if (
      form.correo &&
      form.confirmarCorreo &&
      form.correo !== form.confirmarCorreo
    )
      newErrors.confirmarCorreo = "Los correos no coinciden";
    if (!form.password) newErrors.password = "Requerido";
    if (!form.confirmarPassword) newErrors.confirmarPassword = "Requerido";
    if (
      form.password &&
      form.confirmarPassword &&
      form.password !== form.confirmarPassword
    )
      newErrors.confirmarPassword = "Las contraseñas no coinciden";
    return newErrors;
  };

  // Simulación de API para verificar si el correo ya está registrado
  type RegisterFormType = {
    tipoId: string;
    numeroId: string;
    nombre: string;
    apellido: string;
    direccion: string;
    celular: string;
    correo: string;
    confirmarCorreo: string;
    password: string;
    confirmarPassword: string;
  };
  async function fakeRegisterApi(form: RegisterFormType) {
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        // Simula que el correo "ya-registrado@email.com" ya existe
        if (form.correo === "ya-registrado@email.com") {
          resolve({
            success: false,
            message: "Ya existe un usuario registrado con ese correo.",
          });
        } else {
          resolve({ success: true });
        }
      }, 1000);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setSaving(true);
    const result = await fakeRegisterApi(form);
    setSaving(false);
    if (!result.success) {
      toast.error("Error de registro", {
        description: result.message,
      });
      return;
    }
    toast.success("¡Registro exitoso!", {
      description: format(new Date(), "PPPP 'a las' p"),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full max-w-lg p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            <div className="mb-1 text-2xl font-bold">Hola.</div>
            <div className="mb-1 text-base font-medium">
              Es un gusto tenerte a bordo en nuestro centro de envíos
            </div>
            <div className="mb-4 text-sm text-muted-foreground">
              Registrarse es muy fácil y rápido.
            </div>
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4 px-6 pb-6"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Tipo de Identificación
              </span>
              <Select
                name="tipoId"
                value={form.tipoId}
                onValueChange={(value) => setForm({ ...form, tipoId: value })}
              >
                <SelectTrigger className="px-2 py-1 border rounded">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cédula de ciudadanía">
                    Cédula de ciudadanía
                  </SelectItem>
                  <SelectItem value="Cédula de extranjería">
                    Cédula de extranjería
                  </SelectItem>
                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoId && (
                <span className="text-xs text-destructive">
                  {errors.tipoId}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Número de identificación
              </span>
              <Input
                name="numeroId"
                value={form.numeroId}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.numeroId && (
                <span className="text-xs text-destructive">
                  {errors.numeroId}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Nombre
              </span>
              <Input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.nombre && (
                <span className="text-xs text-destructive">
                  {errors.nombre}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Apellido
              </span>
              <Input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.apellido && (
                <span className="text-xs text-destructive">
                  {errors.apellido}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="block text-xs font-medium text-muted-foreground">
                Dirección
              </span>
              <Input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.direccion && (
                <span className="text-xs text-destructive">
                  {errors.direccion}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Número de celular
              </span>
              <Input
                name="celular"
                value={form.celular}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.celular && (
                <span className="text-xs text-destructive">
                  {errors.celular}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Correo electrónico
              </span>
              <Input
                name="correo"
                type="email"
                value={form.correo}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.correo && (
                <span className="text-xs text-destructive">
                  {errors.correo}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Confirmar correo electrónico
              </span>
              <Input
                name="confirmarCorreo"
                type="email"
                value={form.confirmarCorreo}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.confirmarCorreo && (
                <span className="text-xs text-destructive">
                  {errors.confirmarCorreo}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Contraseña
              </span>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.password && (
                <span className="text-xs text-destructive">
                  {errors.password}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="block text-xs font-medium text-muted-foreground">
                Confirmar contraseña
              </span>
              <Input
                name="confirmarPassword"
                type="password"
                value={form.confirmarPassword}
                onChange={handleChange}
                required
                className="mt-1 text-base font-semibold"
              />
              {errors.confirmarPassword && (
                <span className="text-xs text-destructive">
                  {errors.confirmarPassword}
                </span>
              )}
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Registrando..." : "Registrarse"}
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
      </DialogContent>
    </Dialog>
  );
}
