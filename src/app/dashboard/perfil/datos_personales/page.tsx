"use client";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import Image from "next/image";
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

function getBreadcrumbsFromNavigation() {
  return [
    { label: "Perfil", href: "/dashboard" },
    { label: "Datos personales", isCurrentPage: true },
  ];
}

export default function DatosPersonalesPage() {
  const breadcrumbs = getBreadcrumbsFromNavigation();
  const [atributos, setAtributos] = useState<typeof atributosData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lógica de carga extraída a función reutilizable
  function fetchAtributos() {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setError(
          "No se pudieron cargar los datos personales. Por favor, inténtalo de nuevo más tarde."
        );
        setLoading(false);
        return;
      }
      setAtributos(atributosData);
      setLoading(false);
    }, 1200);
  }

  useEffect(() => {
    fetchAtributos();
  }, []);

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex items-center justify-center flex-1 p-4 bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full max-w-xl border shadow-2xl backdrop-blur border-border bg-card/80">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Datos personales
            </CardTitle>
            <div className="flex items-center justify-center mb-2 overflow-hidden bg-black border-2 rounded-full shadow w-28 h-28 border-muted">
              <Image
                src="/Shattered.webp"
                alt="Foto de perfil"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                style={{
                  objectPosition: "center",
                  transform: "scale(2.2)",
                  imageRendering: "auto",
                }}
                priority
              />
            </div>
            <div className="grid w-full grid-cols-1 gap-4 p-2 mt-1 mb-10 md:grid-cols-2">
              <EditProfileSheet
                user={{
                  id: "1",
                  name:
                    atributos.find((a) => a.label === "Nombre")?.value || "",
                  apellido:
                    atributos.find((a) => a.label === "Apellido")?.value || "",
                  direccion:
                    atributos.find((a) => a.label === "Dirección")?.value || "",
                  phone:
                    atributos.find((a) => a.label === "Número de celular")
                      ?.value || "",
                  email:
                    atributos.find((a) => a.label === "Correo electrónico")
                      ?.value || "",
                  tipoId:
                    atributos.find((a) => a.label === "Tipo de identificación")
                      ?.value || "",
                  numeroId:
                    atributos.find(
                      (a) => a.label === "Número de identificación"
                    )?.value || "",
                  avatar: "/Shattered.webp",
                }}
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
                  onClick={fetchAtributos}
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
    </>
  );
}

// Datos simulados fuera del componente para evitar recreación en cada render
const atributosData = [
  { label: "Tipo de identificación", value: "Cédula de ciudadanía" },
  { label: "Número de identificación", value: "1234567890" },
  { label: "Nombre", value: "David" },
  { label: "Apellido", value: "García" },
  {
    label: "Dirección",
    value: "Calle 123 #45-67, Ciudad 8, País 9",
    className: "md:col-span-2",
  },
  { label: "Número de celular", value: "+57 300 123 4567" },
  { label: "Correo electrónico", value: "david.garcia@email.com" },
];
