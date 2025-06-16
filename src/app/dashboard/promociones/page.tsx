"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/basic/card";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/atoms/button";
import {
  Calendar,
  Clock,
  Gift,
  RefreshCw,
  AlertCircle,
  Tag,
  Zap,
  Star,
} from "lucide-react";
import {
  usePromocionesPorCliente,
  clasificarPromociones,
  calcularDiasRestantes,
  formatearFecha,
  type PromocionData,
} from "@/hooks/usePromociones";
import { useUserProfile } from "@/hooks/useUserProfile";

// Componente para una tarjeta de promoción individual
function PromocionCard({
  promocion,
  tipo,
}: {
  promocion: PromocionData;
  tipo: "activa" | "proxima" | "expirada";
}) {
  const diasRestantes =
    tipo === "activa" ? calcularDiasRestantes(promocion.fechaFin) : null;

  const getVarianteBadge = () => {
    switch (tipo) {
      case "activa":
        return "default";
      case "proxima":
        return "secondary";
      case "expirada":
        return "outline";
      default:
        return "outline";
    }
  };

  const getIconoTipo = () => {
    switch (tipo) {
      case "activa":
        return <Zap className="w-4 h-4" />;
      case "proxima":
        return <Clock className="w-4 h-4" />;
      case "expirada":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getEstiloCard = () => {
    switch (tipo) {
      case "activa":
        return "border-green-200 bg-green-50/50";
      case "proxima":
        return "border-blue-200 bg-blue-50/50";
      case "expirada":
        return "border-gray-200 bg-gray-50/50 opacity-75";
      default:
        return "";
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${getEstiloCard()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getIconoTipo()}
            <CardTitle className="text-lg">{promocion.titulo}</CardTitle>
          </div>
          <Badge variant={getVarianteBadge()} className="ml-2">
            {tipo === "activa" && "Activa"}
            {tipo === "proxima" && "Próxima"}
            {tipo === "expirada" && "Expirada"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">        <p className="text-sm leading-relaxed text-foreground/80">
          {promocion.descripcion}
        </p>        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-foreground/70" />
            <span className="text-foreground/70">Inicio:</span>
            <span className="font-medium">
              {formatearFecha(promocion.fechaInicio)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-foreground/70" />
            <span className="text-foreground/70">Fin:</span>
            <span className="font-medium">
              {formatearFecha(promocion.fechaFin)}
            </span>
          </div>

          {tipo === "activa" && diasRestantes !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-foreground/70">Tiempo restante:</span>
              <span className="font-medium text-orange-600">
                {diasRestantes > 0 ? `${diasRestantes} días` : "Último día"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PromocionesPage() {
  const { userProfile, loading: loadingProfile } = useUserProfile();
  const clienteId = userProfile?.id ? parseInt(userProfile.id) : 0;

  const { promociones, loading, error, refetch } =
    usePromocionesPorCliente(clienteId);

  // Breadcrumbs para promociones
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Promociones", href: "/dashboard/promociones" },
    { label: "Mis promociones", isCurrentPage: true },
  ];

  // Clasificar promociones
  const { activas, proximas, expiradas } = clasificarPromociones(promociones);
  // Loading state
  if (loadingProfile || loading) {
    return (
      <>
        <DashboardHeader breadcrumbs={breadcrumbs} />
        <div className="flex justify-start flex-1 p-4 items-top bg-gradient-to-br from-primary/70 to-primary/10">
          <Card className="w-full border shadow-2xl backdrop-blur border-border bg-card/95">
            <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
              <CardTitle className="mb-2 text-2xl font-bold text-center">
                Mis Promociones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <div className="w-8 h-8 mx-auto mb-4 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
                <p>Cargando tus promociones...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <DashboardHeader breadcrumbs={breadcrumbs} />
        <div className="flex justify-start flex-1 p-4 items-top bg-gradient-to-br from-primary/70 to-primary/10">
          <Card className="w-full border shadow-2xl backdrop-blur border-border bg-card/95">
            <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
              <CardTitle className="mb-2 text-2xl font-bold text-center">
                Mis Promociones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <span
                  className="text-lg font-semibold text-destructive"
                  role="alert"
                  aria-live="assertive"
                >
                  ❌ Error al cargar promociones
                </span>                <p className="text-sm text-foreground/70">
                  No se pudieron cargar tus promociones. Verifica la conexión
                  con el servidor.
                </p>
                <Button
                  onClick={refetch}
                  variant="outline"
                  className="flex items-center shadow-lg group"
                >
                  Reintentar
                  <RefreshCw className="ml-2 transition-transform duration-300 group-hover:-animate-spin" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // No authenticated state
  if (!userProfile) {
    return (
      <>
        <DashboardHeader breadcrumbs={breadcrumbs} />
        <div className="flex justify-start flex-1 p-4 items-top bg-gradient-to-br from-primary/70 to-primary/10">
          <Card className="w-full border shadow-2xl backdrop-blur border-border bg-card/95">
            <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
              <CardTitle className="mb-2 text-2xl font-bold text-center">
                Mis Promociones
              </CardTitle>
            </CardHeader>
            <CardContent>              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <AlertCircle className="w-12 h-12 mb-4 text-orange-500" />
                <h3 className="text-xl font-semibold text-foreground/80">
                  Sesión requerida
                </h3>
                <p className="max-w-md text-sm text-foreground/70">
                  Debes iniciar sesión para ver tus promociones personalizadas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex justify-start flex-1 p-4 items-top bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full border shadow-2xl backdrop-blur border-border bg-card/95">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Mis Promociones
            </CardTitle>
            <p className="text-sm text-center text-muted-foreground">
              Descubre las ofertas especiales diseñadas para ti
            </p>
            {!loading && promociones.length > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </Button>
                <Badge variant="outline" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  {promociones.length} promociones
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resumen de promociones */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Promociones Activas
                  </CardTitle>
                  <Zap className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {activas.length}
                  </div>                  <p className="text-xs text-foreground/70">
                    Disponibles ahora
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Próximas
                  </CardTitle>
                  <Clock className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {proximas.length}
                  </div>                  <p className="text-xs text-foreground/70">
                    Próximamente disponibles
                  </p>
                </CardContent>
              </Card>

              <Card>                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Historial
                  </CardTitle>
                  <Star className="w-4 h-4 text-foreground/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground/80">
                    {expiradas.length}
                  </div>
                  <p className="text-xs text-foreground/70">
                    Promociones utilizadas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Promociones Activas */}
            {activas.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold">Promociones Activas</h2>
                  <Badge variant="default" className="ml-2">
                    {activas.length}
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activas.map((promocion) => (
                    <PromocionCard
                      key={promocion.id_promocion}
                      promocion={promocion}
                      tipo="activa"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Promociones Próximas */}
            {proximas.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">
                    Próximas Promociones
                  </h2>
                  <Badge variant="secondary" className="ml-2">
                    {proximas.length}
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {proximas.map((promocion) => (
                    <PromocionCard
                      key={promocion.id_promocion}
                      promocion={promocion}
                      tipo="proxima"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Promociones Expiradas */}
            {expiradas.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">
                    Historial de Promociones
                  </h2>
                  <Badge variant="outline" className="ml-2">
                    {expiradas.length}
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {expiradas.slice(0, 6).map((promocion) => (
                    <PromocionCard
                      key={promocion.id_promocion}
                      promocion={promocion}
                      tipo="expirada"
                    />
                  ))}
                </div>
                {expiradas.length > 6 && (                  <div className="text-center">
                    <p className="text-sm text-foreground/70">
                      Y {expiradas.length - 6} promociones más en el
                      historial...
                    </p>
                  </div>
                )}
              </div>
            )}            {/* Estado vacío */}
            {promociones.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <Gift className="w-16 h-16 mb-4 text-foreground/50" />
                <h3 className="text-xl font-semibold text-foreground/80">
                  No hay promociones disponibles
                </h3>
                <p className="max-w-md text-sm text-foreground/70">
                  Parece que no tienes promociones activas en este momento.
                  ¡Mantente atento a futuras ofertas especiales!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
