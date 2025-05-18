"use client";
import { useEffect, useState } from "react";
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
import { RefreshCCWDotIcon } from "@/components/ui/refresh-ccw-dot";

// Simulación de pedidos (en un caso real, esto vendría de la API)
const fakePedidos = [
  {
    id_envio: "001",
    numero_guia: "A123456",
    fecha_compra: "2024-05-01",
    estado: "En viaje",
    direccion: "Calle 123 #45-67, Ciudad",
    nombre_cliente: "David García",
    precio: "$50.000",
    recibo: "#REC-001",
    comentarios: [
      { autor: "Admin", texto: "Pedido creado", fecha: "2024-05-01" },
      {
        autor: "Soporte",
        texto: "Cliente pidió cambio de dirección",
        fecha: "2024-05-02",
      },
    ],
    userId: "1",
  },
  {
    id_envio: "002",
    numero_guia: "B654321",
    fecha_compra: "2024-04-20",
    estado: "Entregado",
    direccion: "Carrera 45 #67-89, Ciudad",
    nombre_cliente: "David García",
    precio: "$75.000",
    recibo: "#REC-002",
    comentarios: [
      { autor: "Admin", texto: "Cliente satisfecho.", fecha: "2024-04-21" },
    ],
    userId: "1",
  },
  {
    id_envio: "003",
    numero_guia: "C789012",
    fecha_compra: "2024-03-15",
    estado: "Cancelado",
    direccion: "Avenida 10 #20-30, Ciudad",
    nombre_cliente: "Ana Torres",
    precio: "$60.000",
    recibo: "#REC-003",
    comentarios: [
      {
        autor: "Admin",
        texto: "Pedido cancelado por el cliente.",
        fecha: "2024-03-16",
      },
    ],
    userId: "2",
  },
];

const estadoColor = {
  "En viaje": "bg-blue-100 text-blue-700",
  Entregado: "bg-green-100 text-green-700",
  Cancelado: "bg-red-100 text-red-700",
} as const;

function getBreadcrumbs(id: string | undefined) {
  return [
    { label: "Administrador", href: "/admin" },
    { label: "Búsqueda", href: "/admin/busqueda/personas" },
    id
      ? {
          label: `Perfil de usuario #${id}`,
          href: `/admin/busqueda/personas/${id}`,
        }
      : { label: "Perfil de usuario", href: "#" },
    { label: "Historial", isCurrentPage: true },
  ];
}

export default function AdminUserHistorialPage() {
  const { id } = useParams() as { id: string };
  const [pedidos, setPedidos] = useState<typeof fakePedidos>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null); // id_envio en edición
  const [editForm, setEditForm] = useState<{ estado: string }>({
    estado: "",
  });
  const [comentSheet, setComentSheet] = useState<string | null>(null); // id_envio para sheet
  const [comentForm, setComentForm] = useState("");

  const [stateEditorSheet, setStateEditorSheet] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Simula error API
      if (Math.random() < 0.15) {
        setError("No se pudo cargar el historial. Intenta de nuevo más tarde.");
        setLoading(false);
        return;
      }
      setPedidos(fakePedidos.filter((p) => p.userId === id));
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleEdit = (pedido: (typeof fakePedidos)[0]) => {
    setEditing(pedido.id_envio);
    setEditForm({ estado: pedido.estado });
    setStateEditorSheet(pedido.id_envio);
  };

  const handleEditChange = (value: string) => {
    setEditForm({ estado: value });
  };

  const handleEditSave = () => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id_envio === editing ? { ...p, estado: editForm.estado } : p
      )
    );
    setEditing(null);
    setStateEditorSheet(null);
    toast.success("Pedido actualizado", {
      description: `Estado: ${editForm.estado}`,
    });
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() < 0.15) {
        setError("No se pudo cargar el historial. Intenta de nuevo más tarde.");
        setLoading(false);
        return;
      }
      setPedidos(fakePedidos.filter((p) => p.userId === id));
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <DashboardHeader breadcrumbs={getBreadcrumbs(id)} />
      <div className="flex flex-col w-full h-full p-4 bg-gradient-to-br from-primary/70 to-primary/10">
        <Card className="w-full mx-auto border shadow-2xl backdrop-blur border-border bg-card/95">
          <CardHeader className="flex flex-col items-center gap-2 pb-2 mb-4">
            <CardTitle className="mb-2 text-2xl font-bold text-center">
              Historial de pedidos del usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, idx) => (
                  <Skeleton key={idx} className="w-full h-12 rounded" />
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
                  onClick={handleRetry}
                  variant="outline"
                  className="flex items-center shadow-lg group"
                >
                  Reintentar
                  <RefreshCCWDotIcon className="ml-2 transition-transform duration-300 group-hover:-animate-spin" />
                </Button>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Este usuario no tiene pedidos registrados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Guía</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Recibo</TableHead>
                      <TableHead>Comentario</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos.map((pedido) => (
                      <TableRow key={pedido.id_envio}>
                        <TableCell>{pedido.id_envio}</TableCell>
                        <TableCell>{pedido.numero_guia}</TableCell>
                        <TableCell>{pedido.fecha_compra}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              estadoColor[
                                pedido.estado as keyof typeof estadoColor
                              ]
                            }`}
                          >
                            {pedido.estado}
                          </span>
                        </TableCell>
                        <TableCell>{pedido.direccion}</TableCell>
                        <TableCell>{pedido.precio}</TableCell>
                        <TableCell>{pedido.recibo}</TableCell>
                        <TableCell
                          className="max-w-xs truncate"
                          title={pedido.comentarios
                            .map((c) => c.texto)
                            .join(" | ")}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setComentSheet(pedido.id_envio)}
                          >
                            Ver comentarios ({pedido.comentarios.length})
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(pedido)}
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Sheet para comentarios */}
      <CommentsSheet
        open={!!comentSheet}
        onOpenChange={() => setComentSheet(null)}
        comentarios={
          pedidos.find((p) => p.id_envio === comentSheet)?.comentarios || []
        }
        onAddComentario={(texto) => {
          const now = new Date();
          const fecha = now.toISOString().slice(0, 10);
          const hora = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          setPedidos((prev) =>
            prev.map((p) =>
              p.id_envio === comentSheet
                ? {
                    ...p,
                    comentarios: [
                      ...p.comentarios,
                      {
                        autor: "Admin",
                        texto,
                        fecha: `${fecha} ${hora}`,
                      },
                    ],
                  }
                : p
            )
          );
          toast.success("Comentario agregado");
        }}
        loading={false}
      />
      {/* Sheet para editar estado */}
      <StateEditorSheet
        open={!!stateEditorSheet}
        value={editForm.estado}
        onChange={(value) => setEditForm({ estado: value })}
        onSave={handleEditSave}
        onCancel={() => {
          setStateEditorSheet(null);
          setEditing(null);
        }}
        onOpenChange={(open) => {
          if (!open) {
            setStateEditorSheet(null);
            setEditing(null);
          }
        }}
      />
    </>
  );
}
