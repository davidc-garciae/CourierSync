"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/basic/card";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Calendar,
  Award,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  useSatisfacciones,
  procesarDatosPorDia,
  procesarDistribucionCalificaciones,
  calcularEstadisticas,
  type SatisfaccionData,
} from "@/hooks/useSatisfaccion";

export default function DashboardPage() {
  // Hook para obtener datos de satisfacción desde GraphQL
  const { satisfacciones, loading, error, refetch } = useSatisfacciones();

  // Breadcrumbs para el dashboard
  const breadcrumbs = [
    { label: "Panel de administración", href: "/admin" },
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Satisfacción de Clientes", isCurrentPage: true },
  ];

  // Procesar datos usando las funciones del hook
  const datosPorDia = procesarDatosPorDia(satisfacciones);
  const distribucionCalificaciones =
    procesarDistribucionCalificaciones(satisfacciones);
  const estadisticas = calcularEstadisticas(satisfacciones);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <>
        <DashboardHeader breadcrumbs={breadcrumbs} />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
            <p>Cargando datos de satisfacción...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader breadcrumbs={breadcrumbs} />
        <div className="flex items-center justify-center h-full p-6">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
              <h2 className="mb-2 text-lg font-semibold">
                Error al cargar datos
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                No se pudieron cargar los datos de satisfacción. Verifica la
                conexión con el servidor.
              </p>
              <Button
                onClick={() => refetch()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard de Satisfacción
            </h1>
            <p className="text-muted-foreground">
              Visualiza las métricas de satisfacción de clientes y tendencias de
              calificaciones
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar datos
            </Button>
            <Badge variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tiempo real
            </Badge>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Promedio General
              </CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas.promedio}/5
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-4 h-4 mr-1" />+{estadisticas.tendencia}
                % del mes anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Encuestas
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.total}</div>
              <p className="text-xs text-muted-foreground">
                Respuestas recibidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Comentarios</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas.comentarios}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (estadisticas.comentarios / estadisticas.total) * 100
                )}
                % con comentarios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Satisfacción Alta
              </CardTitle>
              <Award className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas.satisfaccionAlta}
              </div>
              <p className="text-xs text-muted-foreground">
                Calificaciones 4-5 estrellas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfica de tendencia por día */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Satisfacción por Día</CardTitle>
              <p className="text-sm text-muted-foreground">
                Promedio de calificaciones diarias
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    labelFormatter={(value) => `Fecha: ${value}`}
                    formatter={(value: any) => [value, "Promedio"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="promedio"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: "#8884d8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribución de calificaciones */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Distribución de Calificaciones</CardTitle>
              <p className="text-sm text-muted-foreground">
                Cantidad de cada calificación recibida
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribucionCalificaciones}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {" "}
                    {distribucionCalificaciones.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}-${entry.value}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfica de barras - Cantidad por día */}
        <Card>
          <CardHeader>
            <CardTitle>Cantidad de Encuestas por Día</CardTitle>
            <p className="text-sm text-muted-foreground">
              Número de encuestas completadas diariamente
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => `Fecha: ${value}`}
                  formatter={(value: any) => [value, "Cantidad"]}
                />
                <Bar dataKey="cantidad" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Comentarios recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Comentarios Recientes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Últimos comentarios de clientes
            </p>
          </CardHeader>
          <CardContent>
            {" "}
            <div className="space-y-4">
              {satisfacciones
                .filter(
                  (item: SatisfaccionData) =>
                    item.comentario_satisfaccion?.trim().length > 0
                )
                .slice(0, 5)
                .map((item: SatisfaccionData) => (
                  <div
                    key={item.id_satisfaccion}
                    className="flex items-start p-4 space-x-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.calificacion
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {item.id_cliente.nombre} {item.id_cliente.apellido}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.fechaEncuesta}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.comentario_satisfaccion}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Envío #{item.id_envio.id_envio} -{" "}
                        {item.id_envio.numeroGuia}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
