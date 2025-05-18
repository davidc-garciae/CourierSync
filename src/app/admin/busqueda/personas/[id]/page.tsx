"use client";
import { useEffect, useState } from "react";
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

// Simulación de usuarios (en un caso real, esto vendría de la API)
const fakeUsers = [
  {
    id: "1",
    name: "David",
    email: "david.garcia@email.com",
    phone: "+57 300 123 4567",
    tipoId: "Cédula de ciudadanía",
    numeroId: "1234567890",
    apellido: "García",
    direccion: "Calle 123 #45-67, Ciudad 8, País 9",
    avatar: "/Shattered.webp",
  },
  {
    id: "2",
    name: "Ana",
    email: "ana.torres@email.com",
    phone: "+57 301 987 6543",
    tipoId: "Cédula de ciudadanía",
    numeroId: "2345678901",
    apellido: "Torres",
    direccion: "Carrera 10 #20-30, Ciudad 2, País 9",
    avatar: "/2b.webp",
  },
  {
    id: "3",
    name: "Carlos",
    email: "carlos.perez@email.com",
    phone: "+57 302 555 1234",
    tipoId: "Pasaporte",
    numeroId: "A1234567",
    apellido: "Pérez",
    direccion: "Avenida 5 #15-25, Ciudad 3, País 9",
    avatar: "/9s.webp",
  },
];

function getBreadcrumbs(id: string | undefined) {
  return [
    { label: "Administrador", href: "/admin" },
    { label: "Búsqueda", href: "/admin/busqueda/personas" },
    id
      ? { label: `Perfil de usuario #${id}`, isCurrentPage: true }
      : { label: "Perfil de usuario", isCurrentPage: true },
  ];
}

export default function AdminUserProfilePage() {
  const { id } = useParams() as { id: string };
  const [user, setUser] = useState<(typeof fakeUsers)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setUser(null);
    // Simula la carga de datos
    const timeout = setTimeout(() => {
      const found = fakeUsers.find((u) => u.id === id);
      if (found) {
        setUser(found);
      } else {
        setError("Usuario no encontrado.");
      }
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [id]);

  return (
    <>
      <DashboardHeader breadcrumbs={getBreadcrumbs(id)} />
      <div className="flex items-center justify-center flex-1 p-4 bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full max-w-xl border shadow-2xl backdrop-blur border-border bg-card/80">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Datos personales del usuario
            </CardTitle>
            <div className="flex items-center justify-center mb-2 overflow-hidden bg-black border-2 rounded-full shadow w-28 h-28 border-muted">
              {user ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                  style={{
                    objectPosition: "center",
                    transform: "scale(1.5)",
                    imageRendering: "auto",
                  }}
                />
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
            <div className="grid w-full grid-cols-1 gap-4 p-2 mt-1 mb-10 md:grid-cols-2">
              {user && (
                <EditProfileSheet
                  user={user}
                  isAdmin
                  trigger={
                    <Button
                      className="flex items-center w-full shadow-lg group"
                      variant="default"
                    >
                      <span>Editar perfil</span>
                      <CogIcon className="ml-2 transition-transform duration-300 group-hover:-animate-spin" />
                    </Button>
                  }
                />
              )}
              {user && (
                <Button
                  className="flex items-center w-full shadow-lg group"
                  variant="secondary"
                  onClick={() =>
                    router.push(`/admin/busqueda/personas/${user.id}/historial`)
                  }
                >
                  <span>Ver Historial</span>
                  <HistoryIcon className="ml-2 transition-transform duration-300 group-hover:-animate-spin" />
                </Button>
              )}
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
            ) : error === "Usuario no encontrado." ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <span
                  className="text-lg font-semibold text-destructive"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </span>
                <Button
                  onClick={() => router.push("/admin/busqueda/personas")}
                  variant="outline"
                >
                  Volver a búsqueda
                </Button>
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
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex items-center shadow-lg group"
                >
                  Reintentar
                  <RefreshCCWDotIcon className="ml-2 transition-transform duration-300 group-hover:-animate-spin" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Tipo de identificación
                  </span>
                  <span>{user?.tipoId}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Número de identificación
                  </span>
                  <span>{user?.numeroId}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Nombre
                  </span>
                  <span>{user?.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Apellido
                  </span>
                  <span>{user?.apellido}</span>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Dirección
                  </span>
                  <span>{user?.direccion}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Número de celular
                  </span>
                  <span>{user?.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Correo electrónico
                  </span>
                  <span>{user?.email}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
