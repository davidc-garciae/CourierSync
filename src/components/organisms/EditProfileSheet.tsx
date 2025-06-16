"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/basic/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { toast } from "sonner";
import { useUpdateProfile, UpdateProfileForm } from "@/hooks/useUpdateProfile";
import { useState, useEffect } from "react";
import { Label } from "@/components/atoms/label";
import { Loader2, Shield } from "lucide-react";
import { UserProfile } from "@/hooks/useUserProfile";

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: UserProfile | null;
  onSuccess?: () => void;
  targetUserType?: "cliente" | "agente";
}

export function EditProfileSheet({
  open,
  onOpenChange,
  userProfile,
  onSuccess,
  targetUserType = "cliente",
}: Readonly<EditProfileSheetProps>) {
  const [formData, setFormData] = useState<UpdateProfileForm>({
    name: "",
    apellido: "",
    direccion: "",
    phone: "",
    email: "",
    tipoId: "",
    numeroId: "",
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const { updateProfile, loading, error } = useUpdateProfile();

  // Cargar datos del perfil cuando abra el sheet
  useEffect(() => {
    if (open && userProfile) {
      setFormData({
        name: userProfile.name ?? "",
        apellido: userProfile.apellido ?? "",
        direccion: userProfile.direccion ?? "",
        phone: userProfile.phone ?? "",
        email: userProfile.email ?? "",
        tipoId: userProfile.tipoId ?? "",
        numeroId: userProfile.numeroId ?? "",
      });
    }
  }, [open, userProfile]);

  // Validación de email en tiempo real
  const validateEmail = (email: string): string | null => {
    if (!email) return "El email es requerido";

    const trimmedEmail = email.trim();
    if (trimmedEmail !== email) {
      return "El email no puede contener espacios al inicio o final";
    }

    if (email.includes(" ")) {
      return "El email no puede contener espacios";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "El formato del email no es válido";
    }

    return null;
  };

  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
    setEmailError(validateEmail(value));
  };

  const handleInputChange = (field: keyof UpdateProfileForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userProfile?.id) {
      toast.error("No se pudo identificar el usuario");
      return;
    }

    // Validar email antes de enviar
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      toast.error(emailValidationError);
      return;
    }

    // Validar que todos los campos requeridos estén llenos
    if (
      !formData.name.trim() ||
      !formData.apellido.trim() ||
      !formData.email.trim()
    ) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    console.log("🚀 Enviando formulario de actualización:", {
      formData,
      targetUserType,
      userProfileId: userProfile.id,
    });

    // Pasar el targetUserType al hook
    const success = await updateProfile(
      userProfile.id,
      formData,
      targetUserType
    );

    if (success) {
      toast.success("¡Perfil actualizado exitosamente!");
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast.error(error ?? "Error al actualizar el perfil");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Actualiza tu información personal. Los campos marcados con * son
            obligatorios.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="tu@email.com"
              required
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && <p className="text-sm text-red-600">{emailError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Tu número de teléfono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleInputChange("direccion", e.target.value)}
              placeholder="Tu dirección"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoId">Tipo de ID</Label>
              <Input
                id="tipoId"
                value={formData.tipoId}
                onChange={(e) => handleInputChange("tipoId", e.target.value)}
                placeholder="Ej: Cédula"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroId">Número de ID</Label>
              <Input
                id="numeroId"
                value={formData.numeroId}
                onChange={(e) => handleInputChange("numeroId", e.target.value)}
                placeholder="Tu número de identificación"
              />
            </div>
          </div>

          {error && (
            <div className="p-2 text-sm text-red-600 border border-red-200 rounded bg-red-50">
              ❌ {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !!emailError}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
