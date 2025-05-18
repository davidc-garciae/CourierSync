"use client";
import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardContent } from "@/components/molecules/basic/card";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import { navigation_admin } from "@/lib/navigation_admin";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/organisms/basic/table";

// Simulación de usuarios (en un caso real, esto vendría de la API)
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
  const [results, setResults] = useState<typeof fakeUsers>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setTimeout(() => {
      const filtered = fakeUsers.filter(
        (u) =>
          u.email.toLowerCase().includes(query.toLowerCase()) ||
          u.phone.replace(/\D/g, "").includes(query.replace(/\D/g, ""))
      );
      setResults(filtered);
      setLoading(false);
      if (filtered.length === 0) setError("No se encontraron usuarios.");
    }, 800);
  };

  return (
    <>
      <DashboardHeader
        breadcrumbs={getBreadcrumbsFromNavigation("/admin/busqueda/personas")}
      />
      <div className="flex flex-col w-full h-full p-4 bg-gradient-to-br from-primary/50 to-background">
        <Card className="w-full h-full ">
          <CardContent className="p-6">
            <h1 className="mb-4 text-2xl font-bold text-center">
              Buscar personas
            </h1>
            <div className="flex flex-col items-center gap-4 mb-6 md:h-10 md:gap-2 md:flex-row">
              <Input
                placeholder="Correo electrónico o teléfono"
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
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/admin/busqueda/personas/${user.id}`)
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
