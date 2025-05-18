"use client";
import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardContent } from "@/components/molecules/basic/card";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import { CommentsSheet } from "@/components/organisms/CommentsSheet";
import { StateEditorSheet } from "@/components/organisms/StateEditorSheet";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/organisms/basic/table";
import { toast } from "sonner";

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

const fakeUsers = [
  {
    id: "1",
    name: "David García",
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
    name: "Ana Torres",
    email: "ana.torres@email.com",
    phone: "+57 301 987 6543",
    tipoId: "Cédula de ciudadanía",
    numeroId: "2345678901",
    apellido: "Torres",
    direccion: "Carrera 10 #20-30, Ciudad 2, País 9",
    avatar: "/Shattered.webp",
  },
  {
    id: "3",
    name: "Carlos Pérez",
    email: "carlos.perez@email.com",
    phone: "+57 302 555 1234",
    tipoId: "Pasaporte",
    numeroId: "A1234567",
    apellido: "Pérez",
    direccion: "Avenida 5 #15-25, Ciudad 3, País 9",
    avatar: "/Shattered.webp",
  },
];

const estadoColor = {
  "En viaje": "bg-blue-100 text-blue-700",
  Entregado: "bg-green-100 text-green-700",
  Cancelado: "bg-red-100 text-red-700",
} as const;

export default function BusquedaPedidosAdminPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof fakePedidos>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ estado: string }>({ estado: "" });
  const [comentSheet, setComentSheet] = useState<string | null>(null);
  const [estadoSheet, setEstadoSheet] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setTimeout(() => {
      const filtered = fakePedidos.filter(
        (p) =>
          p.id_envio.toLowerCase().includes(query.toLowerCase()) ||
          p.numero_guia.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
      if (filtered.length === 0) setError("No se encontraron pedidos.");
    }, 800);
  };

  const handleEdit = (pedido: (typeof fakePedidos)[0]) => {
    setEditing(pedido.id_envio);
    setEditForm({ estado: pedido.estado });
    setEstadoSheet(pedido.id_envio);
  };

  const handleEditChange = (value: string) => {
    setEditForm({ estado: value });
  };

  const handleEditSave = () => {
    setResults((prev) =>
      prev.map((p) =>
        p.id_envio === editing ? { ...p, estado: editForm.estado } : p
      )
    );
    setEditing(null);
    setEstadoSheet(null);
    toast.success("Pedido actualizado", {
      description: `Estado: ${editForm.estado}`,
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
        <Card className="w-full h-full ">
          <CardContent className="p-6">
            <h1 className="mb-4 text-2xl font-bold text-center">
              Buscar pedidos
            </h1>
            <div className="flex flex-col items-center gap-4 mb-6 md:h-10 md:gap-2 md:flex-row">
              <Input
                placeholder="ID de pedido o número de guía"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-full"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading || !query}>
                Buscar
              </Button>
            </div>
            {loading && (
              <div className="flex flex-col gap-2 mt-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-10 rounded" />
                ))}
              </div>
            )}
            {error && (
              <div className="mt-4 font-medium text-center text-destructive">
                {error}
              </div>
            )}
            {results.length > 0 && (
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
                      <TableHead>Recibo</TableHead>
                      <TableHead>Comentarios</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((pedido) => (
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
                        <TableCell>
                          {fakeUsers.find((u) => u.id === pedido.userId)
                            ?.name || "-"}
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
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(pedido)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              router.push(
                                `/admin/busqueda/personas/${pedido.userId}`
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
            {/* Sheet para comentarios */}
            <CommentsSheet
              open={!!comentSheet}
              onOpenChange={() => setComentSheet(null)}
              comentarios={
                results.find((p) => p.id_envio === comentSheet)?.comentarios ||
                []
              }
              onAddComentario={(texto) => {
                const now = new Date();
                const fecha = now.toISOString().slice(0, 10);
                const hora = now.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                setResults((prev) =>
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
              open={!!estadoSheet}
              value={editForm.estado}
              onChange={handleEditChange}
              onSave={handleEditSave}
              onCancel={() => {
                setEstadoSheet(null);
                setEditing(null);
              }}
              onOpenChange={(open) => {
                if (!open) {
                  setEstadoSheet(null);
                  setEditing(null);
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
