"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/molecules/basic/card";
import { Skeleton } from "@/components/atoms/skeleton";
import { Button } from "@/components/atoms/button";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/organisms/basic/table";
import { toast } from "sonner";
import { CommentsSheet } from "@/components/organisms/CommentsSheet";
import { StateEditorSheet } from "@/components/organisms/StateEditorSheet";
import { RefreshCCWDotIcon } from "@/components/atoms/refresh-ccw-dot";
import { useQuery, useMutation } from "@apollo/client";
import {
  ENVIOS_POR_CLIENTE,
  UPDATE_ENVIO,
  BUSCA_CLIENTE,
} from "@/lib/graphql/mutations";
import { useComentarios } from "@/hooks/useComentarios";

type Envio = {
  id_envio: string;
  numeroGuia: string;
  direccionEnvio: string;
  fechaCompra: string;
  precio: number;
  id_estado: {
    id_estado: number;
    nombre: string;
  };
  id_cliente: {
    id_cliente: string;
    nombre: string;
    apellido: string;
  };
};

// Función para formatear precio
const formatPrecio = (precio: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

// Función para formatear fecha
const formatFecha = (fechaISO: string): string => {
  try {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return fechaISO;
  }
};

// Función para obtener colores según estado (responsive al tema)
const getEstadoColor = (estado: string): string => {
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes("entregado") || estadoLower.includes("completado")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  }
  if (
    estadoLower.includes("viaje") ||
    estadoLower.includes("proceso") ||
    estadoLower.includes("enviado")
  ) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  }
  if (estadoLower.includes("cancelado") || estadoLower.includes("rechazado")) {
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  }
  if (estadoLower.includes("pendiente") || estadoLower.includes("esperando")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  }
  return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
};

function getBreadcrumbs(id: string | undefined, clienteNombre?: string) {
  return [
    { label: "Administrador", href: "/admin" },
    { label: "Búsqueda", href: "/admin/busqueda/personas" },
    id
      ? {
          label: clienteNombre ?? `Usuario #${id}`,
          href: `/admin/busqueda/personas/${id}`,
        }
      : { label: "Perfil de usuario", href: "#" },
    { label: "Historial", isCurrentPage: true },
  ];
}

export default function AdminUserHistorialPage() {
  const { id } = useParams();
  const [comentSheet, setComentSheet] = useState<string | null>(null);
  const [stateEditorSheet, setStateEditorSheet] = useState<string | null>(null);
  const [editingEnvio, setEditingEnvio] = useState<Envio | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("");

  // Hook para manejar comentarios
  const {
    comentarios,
    loading: loadingComentarios,
    agregarComentario,
  } = useComentarios(comentSheet);

  // Query para obtener datos del cliente (para el breadcrumb)
  const { data: clienteData } = useQuery(BUSCA_CLIENTE, {
    variables: { id_cliente: id },
    skip: !id,
  });

  // Query para obtener envíos del cliente
  const { data, loading, error, refetch } = useQuery(ENVIOS_POR_CLIENTE, {
    variables: { id_cliente: id ? parseInt(id as string) : 0 },
    fetchPolicy: "cache-and-network",
    skip: !id,
  });

  // Mutation para actualizar envío
  const [updateEnvio, { loading: updatingEnvio }] = useMutation(UPDATE_ENVIO, {
    onCompleted: () => {
      toast.success("Estado actualizado exitosamente");
      setStateEditorSheet(null);
      setEditingEnvio(null);
      setEstadoSeleccionado("");
      refetch(); // Recargar datos
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  const envios: Envio[] = data?.enviosPorCliente ?? [];
  const cliente = clienteData?.buscaCliente;
  const clienteNombre = cliente
    ? `${cliente.nombre} ${cliente.apellido}`
    : undefined;

  const handleEdit = (envio: Envio) => {
    setEditingEnvio(envio);
    setEstadoSeleccionado(envio.id_estado.id_estado.toString());
    setStateEditorSheet(envio.id_envio);
  };

  const handleEditSave = async () => {
    if (!editingEnvio || !estadoSeleccionado) return;

    // Preparar todos los campos requeridos para la mutación
    const enviosInput = {
      id_cliente: parseInt(editingEnvio.id_cliente.id_cliente),
      id_estado: parseInt(estadoSeleccionado),
      numeroGuia: editingEnvio.numeroGuia,
      direccionEnvio: editingEnvio.direccionEnvio,
      fechaCompra: editingEnvio.fechaCompra,
      precio: editingEnvio.precio,
    };

    await updateEnvio({
      variables: {
        id_envio: editingEnvio.id_envio,
        enviosInput,
      },
    });
  };

  return (
    <>
      <DashboardHeader
        breadcrumbs={getBreadcrumbs(
          Array.isArray(id) ? id[0] : id,
          clienteNombre
        )}
      />
      <div className="flex flex-col w-full h-full p-4 bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full mx-auto border shadow-2xl backdrop-blur border-border bg-card/95">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Historial de envíos del usuario
            </CardTitle>
            {clienteNombre && (
              <p className="text-sm text-muted-foreground">
                Cliente: {clienteNombre}
              </p>
            )}
            {!loading && (
              <p className="text-sm text-muted-foreground">
                {envios.length > 0
                  ? `${envios.length} envío(s) registrado(s)`
                  : "Sin envíos registrados"}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {(() => {
              if (loading) {
                return (
                  <div className="flex flex-col gap-4">
                    {["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
                      <Skeleton key={key} className="w-full h-12 rounded" />
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
                      ❌ Error al cargar historial: {error.message}
                    </span>
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      className="flex items-center shadow-lg group"
                    >
                      Reintentar
                      <RefreshCCWDotIcon className="ml-2 transition-transform duration-300 group-hover:rotate-180" />
                    </Button>
                  </div>
                );
              }
              if (envios.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                    <div className="mb-4 text-6xl">📦</div>
                    <h3 className="text-xl font-semibold text-muted-foreground">
                      Sin envíos registrados
                    </h3>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Este usuario aún no tiene envíos registrados en el
                      sistema.
                    </p>
                  </div>
                );
              }
              return (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Envío</TableHead>
                        <TableHead>Guía</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Comentarios</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {envios.map((envio) => (
                        <TableRow key={envio.id_envio}>
                          <TableCell className="font-mono text-sm">
                            {envio.id_envio}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {envio.numeroGuia}
                          </TableCell>
                          <TableCell>
                            {formatFecha(envio.fechaCompra)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getEstadoColor(
                                envio.id_estado.nombre
                              )}`}
                            >
                              {envio.id_estado.nombre}
                            </span>
                          </TableCell>
                          <TableCell
                            className="max-w-xs truncate"
                            title={envio.direccionEnvio}
                          >
                            {envio.direccionEnvio}
                          </TableCell>
                          <TableCell className="font-semibold text-green-600 dark:text-green-400">
                            {formatPrecio(envio.precio)}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setComentSheet(envio.id_envio)}
                            >
                              Ver comentarios
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(envio)}
                              disabled={updatingEnvio}
                            >
                              Editar estado
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })()}

            {/* Sheet para comentarios */}
            <CommentsSheet
              open={!!comentSheet}
              onOpenChange={(open) => {
                if (!open) setComentSheet(null);
              }}
              comentarios={comentarios}
              onAddComentario={agregarComentario}
              loading={loadingComentarios}
            />

            {/* Sheet para editar estado */}
            <StateEditorSheet
              open={!!stateEditorSheet}
              value={estadoSeleccionado}
              onChange={setEstadoSeleccionado}
              onSave={handleEditSave}
              onCancel={() => {
                setStateEditorSheet(null);
                setEditingEnvio(null);
                setEstadoSeleccionado("");
              }}
              onOpenChange={(open) => {
                if (!open) {
                  setStateEditorSheet(null);
                  setEditingEnvio(null);
                  setEstadoSeleccionado("");
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
