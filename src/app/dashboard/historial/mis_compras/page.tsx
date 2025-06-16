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
import { Button } from "@/components/atoms/button";
import { RefreshCCWDotIcon } from "@/components/ui/refresh-ccw-dot";
import { useEnviosCliente } from "@/hooks/useEnviosCliente";

function getBreadcrumbsFromNavigation() {
  return [
    { label: "Historial", href: "/dashboard" },
    { label: "Mis compras", isCurrentPage: true },
  ];
}

export default function MisComprasPage() {
  const breadcrumbs = getBreadcrumbsFromNavigation();
  const { envios, loading, error, refetch, hasEnvios } = useEnviosCliente();

  // Función para formatear precio
  const formatPrecio = (precio: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio);
  };

  // Función para obtener colores según estado (adaptable a tema claro/oscuro)
  const getEstadoColor = (estado: string): string => {
    const estadoLower = estado.toLowerCase();
    if (
      estadoLower.includes("entregado") ||
      estadoLower.includes("completado")
    ) {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
    if (
      estadoLower.includes("viaje") ||
      estadoLower.includes("proceso") ||
      estadoLower.includes("enviado")
    ) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
    if (
      estadoLower.includes("cancelado") ||
      estadoLower.includes("rechazado")
    ) {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    }
    if (
      estadoLower.includes("pendiente") ||
      estadoLower.includes("esperando")
    ) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"; // Estado por defecto
  };

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex justify-start flex-1 p-4 items-top bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full border shadow-2xl backdrop-blur border-border bg-card/95">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Mis compras
            </CardTitle>
            {!loading && hasEnvios && (
              <p className="text-sm text-muted-foreground">
                {envios.length} {envios.length === 1 ? "envío" : "envíos"}{" "}
                encontrados
              </p>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-muted/20">
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
                  ❌ {error}
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
            ) : !hasEnvios ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <div className="mb-4 text-6xl">📦</div>
                <h3 className="text-xl font-semibold text-muted-foreground">
                  No tienes compras aún
                </h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  Cuando realices tu primera compra, aquí podrás ver el
                  historial y seguimiento de todos tus envíos.
                </p>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {envios.map((envio) => (
                  <AccordionItem key={envio.id_envio} value={envio.id_envio}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex flex-col flex-1 gap-2 md:flex-row md:items-center">
                          <span className="font-medium">
                            ID: {envio.id_envio}
                          </span>
                          <span className="text-muted-foreground">
                            Guía: {envio.numeroGuia}
                          </span>
                          <span className="text-muted-foreground">
                            Fecha: {envio.fechaCompra}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getEstadoColor(
                            envio.estado
                          )}`}
                        >
                          {envio.estado}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-4 p-4 rounded-lg bg-muted/50 md:grid-cols-2">
                        <div>
                          <span className="block text-sm text-muted-foreground">
                            Dirección de envío
                          </span>
                          <span className="text-foreground">
                            {envio.direccionEnvio}
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm text-muted-foreground">
                            Cliente
                          </span>
                          <span className="text-foreground">
                            {envio.nombreCliente}
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm text-muted-foreground">
                            Precio
                          </span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatPrecio(envio.precio)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-sm text-muted-foreground">
                            Estado actual
                          </span>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${getEstadoColor(
                              envio.estado
                            )}`}
                          >
                            {envio.estado}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="block text-sm text-muted-foreground">
                            Número de guía de seguimiento
                          </span>
                          <span className="px-2 py-1 font-mono text-sm border rounded bg-muted/60 dark:bg-muted/40 text-foreground border-border">
                            {envio.numeroGuia}
                          </span>
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
