"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardContent } from "@/components/molecules/basic/card";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import { navigation_admin } from "@/lib/navigation_admin";
import { useQuery } from "@apollo/client";
import { LISTA_CLIENTES } from "@/lib/graphql/mutations";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/organisms/basic/table";

type Cliente = {
  id_cliente: string;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  telefono: string;
  direccion: string;
  numeroDocumento: string;
  idTipoDocumento?: {
    nombre: string;
  };
};

function getBreadcrumbsFromNavigation(pathname: string) {
  for (const section of navigation_admin.navMain) {
    if (section.url === pathname) {
      return [{ label: section.title, isCurrentPage: true }];
    }
    for (const item of section.items) {
      if (item.url === pathname) {
        return [
          { label: section.title, href: section.url },
          { label: item.title, isCurrentPage: true },
        ];
      }
    }
  }
  return [{ label: "Administrador", isCurrentPage: true }];
}

export default function BusquedaPersonasAdminPage() {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<Cliente[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  // Query para obtener todos los clientes
  const {
    data,
    loading: loadingClientes,
    error,
  } = useQuery(LISTA_CLIENTES, {
    fetchPolicy: "cache-and-network",
  });

  const clientes: Cliente[] = data?.listaClientes ?? [];

  // Función de búsqueda
  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredResults([]);
      setShowResults(false);
      return;
    }

    const queryLower = query.toLowerCase().trim();

    const filtered = clientes.filter((cliente) => {
      const email = cliente.correoElectronico?.toLowerCase() || "";
      const phone = cliente.telefono?.replace(/\D/g, "") || "";
      const nombre = cliente.nombre?.toLowerCase() || "";
      const apellido = cliente.apellido?.toLowerCase() || "";
      const numeroDocumento = cliente.numeroDocumento?.replace(/\D/g, "") || "";

      const searchPhone = query.replace(/\D/g, "");

      return (
        email.includes(queryLower) ||
        phone.includes(searchPhone) ||
        nombre.includes(queryLower) ||
        apellido.includes(queryLower) ||
        numeroDocumento.includes(searchPhone) ||
        `${nombre} ${apellido}`.includes(queryLower)
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
  }, [query, clientes]);

  return (
    <>
      <DashboardHeader
        breadcrumbs={getBreadcrumbsFromNavigation("/admin/busqueda/personas")}
      />
      <div className="flex flex-col w-full h-full p-4 bg-gradient-to-br from-primary/50 to-background">
        <Card className="w-full h-full">
          <CardContent className="p-6">
            <h1 className="mb-4 text-2xl font-bold text-center">
              Buscar personas
            </h1>
            <p className="mb-6 text-sm text-center text-muted-foreground">
              {loadingClientes
                ? "Cargando clientes..."
                : `${clientes.length} clientes registrados en el sistema`}
            </p>

            <div className="flex flex-col items-center gap-4 mb-6 md:h-10 md:gap-2 md:flex-row">
              <Input
                placeholder="Email, teléfono, nombre, apellido o documento..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-full"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={loadingClientes || !query.trim()}
              >
                Buscar
              </Button>
            </div>

            {loadingClientes && (
              <div className="flex flex-col gap-2 mt-4">
                {["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
                  <Skeleton key={key} className="w-full h-12 rounded" />
                ))}
              </div>
            )}

            {error && (
              <div className="p-4 mt-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <p className="font-medium text-red-800 dark:text-red-300">
                  ❌ Error al cargar clientes: {error.message}
                </p>
              </div>
            )}

            {showResults && !loadingClientes && (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {filteredResults.length > 0
                    ? `${filteredResults.length} resultado(s) encontrado(s)`
                    : "No se encontraron clientes con esos criterios"}
                </div>

                {filteredResults.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre Completo</TableHead>
                          <TableHead>Correo</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.map((cliente) => (
                          <TableRow key={cliente.id_cliente}>
                            <TableCell className="font-medium">
                              {cliente.nombre} {cliente.apellido}
                            </TableCell>
                            <TableCell>{cliente.correoElectronico}</TableCell>
                            <TableCell>{cliente.telefono}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="text-xs text-muted-foreground">
                                  {cliente.idTipoDocumento?.nombre ??
                                    "Sin tipo"}
                                </div>
                                <div>{cliente.numeroDocumento}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(
                                    `/admin/busqueda/personas/${cliente.id_cliente}`
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

            {!showResults && !loadingClientes && clientes.length > 0 && (
              <div className="mt-8 text-center text-muted-foreground">
                <div className="mb-2 text-4xl">🔍</div>
                <p>Escribe al menos 2 caracteres para buscar clientes</p>
                <p className="mt-1 text-sm">
                  Puedes buscar por email, teléfono, nombre, apellido o
                  documento
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
