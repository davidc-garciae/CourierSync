"use client";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/molecules/basic/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";
import { Skeleton } from "@/components/atoms/skeleton";
import { useEffect, useState } from "react";

function getBreadcrumbsFromNavigation() {
  return [
    { label: "Historial", href: "/dashboard" },
    { label: "Mis compras", isCurrentPage: true },
  ];
}
import { Button } from "@/components/atoms/button";
import { RefreshCCWDotIcon } from "@/components/ui/refresh-ccw-dot";

export default function MisComprasPage() {
  const breadcrumbs = getBreadcrumbsFromNavigation();
  const [compras, setCompras] = useState<typeof comprasData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lógica de carga extraída a función reutilizable
  function fetchCompras() {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Simulación de error con 20% de probabilidad
      if (Math.random() < 0.2) {
        setError(
          "No se pudieron cargar las compras. Por favor, inténtalo de nuevo más tarde."
        );
        setLoading(false);
        return;
      }
      setCompras(comprasData);
      setLoading(false);
    }, 1200);
  }

  useEffect(() => {
    fetchCompras();
  }, []);

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex justify-start flex-1 p-4 items-top bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full border shadow-2xl backdrop-blur border-border bg-card/95">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Mis compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="p-2 border-t-0 border-y -2 bg-muted/"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col flex-1 gap-2 pt-1 md:flex-row md:items-center">
                        <Skeleton className="w-20 h-6 mb-1" />
                        <Skeleton className="w-24 h-6 mb-1" />
                        <Skeleton className="w-24 h-6 mb-1" />
                      </div>
                      <Skeleton className="w-20 h-5 rounded-full" />
                    </div>
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
                  onClick={fetchCompras}
                  variant="outline"
                  className="flex items-center shadow-lg group"
                >
                  Reintentar
                  <RefreshCCWDotIcon className="ml-2 transition-transform duration-300 group-hover:-animate-spin" />
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {compras.map((compra) => (
                  <AccordionItem key={compra.id_envio} value={compra.id_envio}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex flex-col flex-1 gap-2 md:flex-row md:items-center">
                          <span className="font-medium">
                            ID: {compra.id_envio}
                          </span>
                          <span className="text-muted-foreground">
                            Guía: {compra.numero_guia}
                          </span>
                          <span className="text-muted-foreground">
                            Fecha: {compra.fecha_compra}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            estadoColor[compra.estado]
                          }`}
                        >
                          {compra.estado}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-4 p-4 rounded-lg bg-muted/50 md:grid-cols-2">
                        <div>
                          <span className="block text-sm text-muted-foreground">
                            Dirección
                          </span>
                          <span>{compra.direccion}</span>
                        </div>
                        <div>
                          <span className="block text-sm text-muted-foreground">
                            Nombre del cliente
                          </span>
                          <span>{compra.nombre_cliente}</span>
                        </div>
                        <div>
                          <span className="block text-sm text-muted-foreground">
                            Precio
                          </span>
                          <span>{compra.precio}</span>
                        </div>
                        <div>
                          <span className="block text-sm text-muted-foreground">
                            Recibo
                          </span>
                          <span>{compra.recibo}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Datos simulados fuera del componente para evitar recreación en cada render
const comprasData = [
  {
    id_envio: "001",
    numero_guia: "A123456",
    fecha_compra: "2024-05-01",
    estado: "En viaje" as const,
    direccion: "Calle 123 #45-67, Ciudad",
    nombre_cliente: "David García",
    precio: "$50.000",
    recibo: "#REC-001",
  },
  {
    id_envio: "002",
    numero_guia: "B654321",
    fecha_compra: "2024-04-20",
    estado: "Entregado" as const,
    direccion: "Carrera 45 #67-89, Ciudad",
    nombre_cliente: "David García",
    precio: "$75.000",
    recibo: "#REC-002",
  },
  {
    id_envio: "003",
    numero_guia: "C789012",
    fecha_compra: "2024-03-15",
    estado: "Cancelado" as const,
    direccion: "Avenida 10 #20-30, Ciudad",
    nombre_cliente: "David García",
    precio: "$60.000",
    recibo: "#REC-003",
  },
];

const estadoColor = {
  "En viaje": "bg-blue-100 text-blue-700",
  Entregado: "bg-green-100 text-green-700",
  Cancelado: "bg-red-100 text-red-700",
} as const;
