"use client";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import { ProfileAvatar } from "@/components/molecules/ProfileAvatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";
import { Button } from "@/components/atoms/button";
import { LabelAttributeValue } from "@/components/molecules/basic/LabelAttributeValue";
import { EditProfileSheet } from "@/components/organisms/EditProfileSheet";
import { ChangePasswordSheet } from "@/components/organisms/ChangePasswordSheet";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/atoms/skeleton";
import { KeyCircleIcon } from "@/components/ui/key-circle";
import { CogIcon } from "@/components/ui/cog";
import { RefreshCCWDotIcon } from "@/components/ui/refresh-ccw-dot";
import { useUserProfile } from "@/hooks/useUserProfile";

function getBreadcrumbsFromNavigation() {
  return [
    { label: "Perfil", href: "/dashboard" },
    { label: "Datos personales", isCurrentPage: true },
  ];
}

export default function DatosPersonalesPage() {
  const breadcrumbs = getBreadcrumbsFromNavigation();
  const { userProfile, loading, error, refetch } = useUserProfile();
  const [atributos, setAtributos] = useState<
    Array<{ label: string; value: string; className?: string }>
  >([]);

  // Estados para controlar los dialogs
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Actualizar atributos cuando se cargue el perfil
  useEffect(() => {
    if (userProfile) {
      const newAtributos = [];

      if (userProfile.userType === "cliente") {
        newAtributos.push(
          {
            label: "Tipo de identificación",
            value: userProfile.tipoId || "No especificado",
          },
          {
            label: "Número de identificación",
            value: userProfile.numeroId || "No especificado",
          },
          { label: "Nombre", value: userProfile.name },
          {
            label: "Apellido",
            value: userProfile.apellido || "No especificado",
          }
        );
      } else {
        // Para agentes
        newAtributos.push(
          { label: "Tipo de usuario", value: "Agente/Administrador" },
          { label: "Nombre de usuario", value: userProfile.name }
        );
      }

      newAtributos.push(
        {
          label: "Dirección",
          value: userProfile.direccion,
          className: "md:col-span-2",
        },
        { label: "Número de celular", value: userProfile.phone },
        { label: "Correo electrónico", value: userProfile.email }
      );

      setAtributos(newAtributos);
    }
  }, [userProfile]);

  // La página ya está protegida por AuthGuard en el layout del dashboard

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex items-center justify-center flex-1 p-4 bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full max-w-xl border shadow-2xl backdrop-blur border-border bg-card/80">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Datos personales
            </CardTitle>
            <ProfileAvatar
              name={userProfile?.name}
              lastName={userProfile?.apellido}
              size="xl"
              variant="default"
              loading={loading}
              className="mb-2"
            />
            <div className="grid w-full grid-cols-1 gap-4 p-2 mt-1 mb-10 md:grid-cols-2">
              {/* Botón de Editar Perfil */}
              <Button
                className="flex items-center w-full shadow-lg group"
                variant="default"
                onClick={() => setIsEditProfileOpen(true)}
              >
                <span>Editar perfil</span>
                <CogIcon className="ml-2 transition-transform duration-300 group-hover:-animate-spin" />
              </Button>

              {/* Botón de Cambiar Contraseña */}
              <ChangePasswordSheet
                trigger={
                  <Button
                    className="flex items-center w-full shadow-lg group"
                    variant="secondary"
                  >
                    <span>Cambiar contraseña</span>
                    <KeyCircleIcon className="ml-2 transition-transform duration-300 group-hover:rotate-45" />
                  </Button>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[...Array(7)].map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <Skeleton className="w-20 h-3 mb-1" />
                    <Skeleton className="h-5 w-52" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <span
                  className="text-lg font-semibold text-destructive"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </span>
                <Button
                  onClick={refetch}
                  variant="outline"
                  className="flex items-center shadow-lg group"
                >
                  Reintentar
                  <RefreshCCWDotIcon className="ml-2 transition-transform duration-300 group-hover:-animate-spin" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {atributos.map((attr, idx) => (
                  <LabelAttributeValue
                    key={attr.label + idx}
                    label={attr.label}
                    value={attr.value}
                    className={attr.className}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Editar Perfil */}
      <EditProfileSheet
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        userProfile={userProfile}
        onSuccess={() => {
          refetch(); // Recargar datos después de actualizar
        }}
      />
    </>
  );
}

// Los datos ahora se cargan dinámicamente desde el backend
