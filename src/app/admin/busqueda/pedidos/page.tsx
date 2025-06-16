"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardContent } from "@/components/molecules/basic/card";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import { CommentsSheet } from "@/components/organisms/CommentsSheet";
import { StateEditorSheet } from "@/components/organisms/StateEditorSheet";
import { useQuery, useMutation } from "@apollo/client";
import { OBTENER_ENVIOS, UPDATE_ENVIO } from "@/lib/graphql/mutations";
import { useComentarios } from "@/hooks/useComentarios";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/organisms/basic/table";
import { toast } from "sonner";

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
    correoElectronico?: string;
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

export default function BusquedaPedidosAdminPage() {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<Envio[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [comentSheet, setComentSheet] = useState<string | null>(null);
  const [estadoSheet, setEstadoSheet] = useState<string | null>(null);
  const [editingEnvio, setEditingEnvio] = useState<Envio | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("");
  const router = useRouter();

  // Hook para manejar comentarios
  const {
    comentarios,
    loading: loadingComentarios,
    agregarComentario,
  } = useComentarios(comentSheet);

  // Query para obtener todos los envíos
  const {
    data,
    loading: loadingEnvios,
    error,
    refetch,
  } = useQuery(OBTENER_ENVIOS, {
    fetchPolicy: "cache-and-network",
  });

  // Mutation para actualizar envío
  const [updateEnvio, { loading: updatingEnvio }] = useMutation(UPDATE_ENVIO, {
    onCompleted: () => {
      toast.success("Estado actualizado exitosamente");
      setEstadoSheet(null);
      setEditingEnvio(null);
      refetch(); // Recargar datos
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  const envios: Envio[] = data?.obtenerEnvios || [];

  // Función de búsqueda
  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredResults([]);
      setShowResults(false);
      return;
    }

    const queryLower = query.toLowerCase().trim();

    const filtered = envios.filter((envio) => {
      const idEnvio = envio.id_envio?.toString().toLowerCase() || "";
      const numeroGuia = envio.numeroGuia?.toLowerCase() || "";
      const clienteNombre = `${envio.id_cliente?.nombre || ""} ${
        envio.id_cliente?.apellido || ""
      }`.toLowerCase();
      const clienteEmail =
        envio.id_cliente?.correoElectronico?.toLowerCase() || "";
      const estado = envio.id_estado?.nombre?.toLowerCase() || "";

      return (
        idEnvio.includes(queryLower) ||
        numeroGuia.includes(queryLower) ||
        clienteNombre.includes(queryLower) ||
        clienteEmail.includes(queryLower) ||
        estado.includes(queryLower)
      );
    });

    setFilteredResults(filtered);
    setShowResults(true);
  };

  // Búsqueda en tiempo real
  useEffect(() => {
    if (query.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setFilteredResults([]);
      setShowResults(false);
    }
  }, [query, envios]);

  const handleEdit = (envio: Envio) => {
    setEditingEnvio(envio);
    setEstadoSeleccionado(envio.id_estado.id_estado.toString());
    setEstadoSheet(envio.id_envio);
  };

  const handleEditSave = async () => {
    if (!editingEnvio || !estadoSeleccionado) return;

    // Necesitamos preparar todos los campos requeridos para la mutación
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

  // Breadcrumbs dinámicos para búsqueda de pedidos
  function getPedidosBreadcrumbs() {
    return [
      { label: "Búsqueda", href: "/admin" },
      { label: "Pedido", isCurrentPage: true },
    ];
  }

  return (
    <>
      <DashboardHeader breadcrumbs={getPedidosBreadcrumbs()} />
      <div className="flex flex-col w-full h-full p-4 bg-gradient-to-br from-primary/50 to-background">
        <Card className="w-full h-full">
          <CardContent className="p-6">
            <h1 className="mb-4 text-2xl font-bold text-center">
              Buscar pedidos
            </h1>
            <p className="mb-6 text-sm text-center text-muted-foreground">
              {loadingEnvios
                ? "Cargando envíos..."
                : `${envios.length} envíos registrados en el sistema`}
            </p>

            <div className="flex flex-col items-center gap-4 mb-6 md:h-10 md:gap-2 md:flex-row">
              <Input
                placeholder="ID envío, guía, cliente, email o estado..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-full"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={loadingEnvios || !query.trim()}
              >
                Buscar
              </Button>
            </div>

            {loadingEnvios && (
              <div className="flex flex-col gap-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-16 rounded" />
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="font-medium text-red-800 dark:text-red-300">
                  ❌ Error al cargar envíos: {error.message}
                </p>
              </div>
            )}

            {showResults && !loadingEnvios && (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {filteredResults.length > 0
                    ? `${filteredResults.length} resultado(s) encontrado(s)`
                    : "No se encontraron envíos con esos criterios"}
                </div>

                {filteredResults.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Guía</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Comentarios</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.map((envio) => (
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
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {envio.id_cliente.nombre}{" "}
                                  {envio.id_cliente.apellido}
                                </div>
                                {envio.id_cliente.correoElectronico && (
                                  <div className="text-xs text-muted-foreground">
                                    {envio.id_cliente.correoElectronico}
                                  </div>
                                )}
                              </div>
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
                            <TableCell className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(envio)}
                                disabled={updatingEnvio}
                              >
                                Editar estado
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() =>
                                  router.push(
                                    `/admin/busqueda/personas/${envio.id_cliente.id_cliente}`
                                  )
                                }
                              >
                                Ver perfil
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}

            {!showResults && !loadingEnvios && envios.length > 0 && (
              <div className="mt-8 text-center text-muted-foreground">
                <div className="text-4xl mb-2">📦</div>
                <p>Escribe al menos 2 caracteres para buscar envíos</p>
                <p className="text-sm mt-1">
                  Puedes buscar por ID, guía, cliente, email o estado
                </p>
              </div>
            )}

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
              open={!!estadoSheet}
              value={estadoSeleccionado}
              onChange={setEstadoSeleccionado}
              onSave={handleEditSave}
              onCancel={() => {
                setEstadoSheet(null);
                setEditingEnvio(null);
                setEstadoSeleccionado("");
              }}
              onOpenChange={(open) => {
                if (!open) {
                  setEstadoSheet(null);
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
