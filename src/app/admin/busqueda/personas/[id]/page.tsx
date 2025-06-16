"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/basic/card";
import { Skeleton } from "@/components/atoms/skeleton";
import { Button } from "@/components/atoms/button";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import { EditProfileSheet } from "@/components/organisms/EditProfileSheet";
import { CogIcon } from "@/components/ui/cog";
import { RefreshCCWDotIcon } from "@/components/ui/refresh-ccw-dot";
import { HistoryIcon } from "@/components/ui/history";
import { useQuery } from "@apollo/client";
import { BUSCA_CLIENTE } from "@/lib/graphql/mutations";
import { ProfileAvatar } from "@/components/molecules/ProfileAvatar";

type Cliente = {
  id_cliente: string;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  direccion: string;
  telefono: string;
  numeroDocumento: string;
  idTipoDocumento?: {
    nombre: string;
  };
};

function getBreadcrumbs(
  id: string | string[] | undefined,
  cliente?: Cliente | null
) {
  const clienteId = Array.isArray(id) ? id[0] : id;
  return [
    { label: "Administrador", href: "/admin" },
    { label: "Búsqueda", href: "/admin/busqueda/personas" },
    clienteId && cliente
      ? { label: `${cliente.nombre} ${cliente.apellido}`, isCurrentPage: true }
      : { label: "Perfil de usuario", isCurrentPage: true },
  ];
}

export default function AdminUserProfilePage() {
  const { id } = useParams();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const router = useRouter();

  // Query para obtener los datos del cliente
  const { data, loading, error, refetch } = useQuery(BUSCA_CLIENTE, {
    variables: { id_cliente: id },
    fetchPolicy: "cache-and-network",
    skip: !id,
  });

  const cliente: Cliente | null = data?.buscaCliente ?? null;

  const handleEditSuccess = () => {
    setEditProfileOpen(false);
    refetch(); // Recargar los datos después de editar
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 7 }, (_, idx) => (
            <div key={`skeleton-field-${idx}`} className="flex flex-col gap-1">
              <Skeleton className="w-20 h-3 mb-1" />
              <Skeleton className="h-5 w-52" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <span
            className="text-lg font-semibold text-destructive"
            role="alert"
            aria-live="assertive"
          >
            ❌ Error al cargar usuario: {error.message}
          </span>
          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="flex items-center shadow-lg group"
            >
              Reintentar
              <RefreshCCWDotIcon className="ml-2 transition-transform duration-300 group-hover:rotate-180" />
            </Button>
            <Button
              onClick={() => router.push("/admin/busqueda/personas")}
              variant="secondary"
            >
              Volver a búsqueda
            </Button>
          </div>
        </div>
      );
    }

    if (!cliente) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <span
            className="text-lg font-semibold text-destructive"
            role="alert"
            aria-live="assertive"
          >
            Usuario no encontrado
          </span>
          <Button
            onClick={() => router.push("/admin/busqueda/personas")}
            variant="outline"
          >
            Volver a búsqueda
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Tipo de identificación
          </span>
          <span>{cliente.idTipoDocumento?.nombre ?? "Sin especificar"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Número de identificación
          </span>
          <span>{cliente.numeroDocumento}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Nombres
          </span>
          <span>{cliente.nombre}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Apellidos
          </span>
          <span>{cliente.apellido}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Correo electrónico
          </span>
          <span className="break-words">{cliente.correoElectronico}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Teléfono
          </span>
          <span>{cliente.telefono}</span>
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Dirección
          </span>
          <span className="break-words">{cliente.direccion}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <DashboardHeader breadcrumbs={getBreadcrumbs(id, cliente)} />
      <div className="flex items-center justify-center flex-1 p-4 bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full max-w-xl border shadow-2xl backdrop-blur border-border bg-card/80">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Datos personales del usuario
            </CardTitle>
            <ProfileAvatar
              name={cliente?.nombre}
              lastName={cliente?.apellido}
              size="xl"
              variant="default"
              loading={loading}
              className="mb-2"
            />
            <div className="grid w-full grid-cols-1 gap-4 p-2 mt-1 mb-10 md:grid-cols-2">
              {cliente && (
                <Button
                  className="flex items-center w-full shadow-lg group"
                  variant="default"
                  onClick={() => setEditProfileOpen(true)}
                  disabled={loading}
                >
                  <span>Editar perfil</span>
                  <CogIcon className="ml-2 transition-transform duration-300 group-hover:rotate-90" />
                </Button>
              )}
              {cliente && (
                <Button
                  className="flex items-center w-full shadow-lg group"
                  variant="secondary"
                  onClick={() =>
                    router.push(
                      `/admin/busqueda/personas/${cliente.id_cliente}/historial`
                    )
                  }
                >
                  <span>Ver Historial</span>
                  <HistoryIcon className="ml-2 transition-transform duration-300 group-hover:scale-110" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>

      {/* Sheet de edición de perfil - Mapeando propiedades */}
      {cliente && (
        <EditProfileSheet
          open={editProfileOpen}
          onOpenChange={setEditProfileOpen}
          userProfile={{
            id: cliente.id_cliente,
            name: cliente.nombre,
            apellido: cliente.apellido,
            phone: cliente.telefono,
            email: cliente.correoElectronico,
            direccion: cliente.direccion,
            numeroId: cliente.numeroDocumento,
            tipoId: cliente.idTipoDocumento?.nombre,
            userType: "cliente" as const,
          }}
          targetUserType="cliente"
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
