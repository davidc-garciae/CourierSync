"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/basic/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/atoms/tabs";
import { Header } from "@/components/organisms/header";
import { RegisterSheet } from "@/components/organisms/RegisterSheet";
import { AppInfoSheet } from "@/components/organisms/AppInfoSheet";
import { useAuth } from "@/hooks/useAuth";
import { ConnectionStatus } from "@/components/debug/ConnectionStatus";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<"usuario" | "admin">("usuario");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Evita el hydration mismatch ocultando el contenido hasta que el tema esté montado
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-primary/50 to-background">
      <Header className="sticky top-0 z-50" />
      {/* Estado de conexión con el backend */}
      <div className="flex justify-center p-2">
        <ConnectionStatus />
      </div>
      <div className="flex items-center justify-center flex-1 w-full">
        <div className="absolute z-50 bottom-4 right-4">
          <AppInfoSheet
            trigger={
              <Button variant="outline" className="shadow-md">
                Información
              </Button>
            }
          />
        </div>
        <Tabs
          className="w-full max-w-md"
          defaultValue="usuario"
          onValueChange={(v) => setRole(v as "usuario" | "admin")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="usuario">Usuario</TabsTrigger>
            <TabsTrigger value="admin">Administrador</TabsTrigger>
          </TabsList>
          <TabsContent value="usuario">
            <Card className="w-full max-w-md border shadow-xl backdrop-blur border-border">
              <LoginForm role="usuario" />
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card className="w-full max-w-md border shadow-xl backdrop-blur border-border">
              <LoginForm role="admin" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LoginForm({ role }: { role: "usuario" | "admin" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const email = (form.elements[0] as HTMLInputElement).value;
    const password = (form.elements[1] as HTMLInputElement).value;

    try {
      const result = await login(email, password, role);

      if (result.success) {
        if (role === "usuario") {
          router.push("/dashboard");
        } else {
          // Redirige a panel admin si lo tienes
          router.push("/admin");
        }
      } else {
        setError(result.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error("Error en login:", err);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {role === "admin" ? "Acceso Administrador" : "Empezar ahora"}
        </CardTitle>
        <p className="mt-2 text-sm text-center text-foreground/60">
          {role === "admin"
            ? "Accede al panel de administración."
            : "¡Bienvenido/a a tu portal de gestión envíos!"}
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <Input
              type="text"
              placeholder="Correo electrónico o usuario"
              required
            />
          </div>
          <div>
            <Input type="password" placeholder="Contraseña" required />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading
              ? "Ingresando..."
              : role === "admin"
              ? "Inicia Sesión como Administrador"
              : "Inicia Sesión"}
          </Button>
        </form>
        <Separator className="my-6" />
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-4 text-sm font-medium text-center text-red-600 animate-fade-in"
          >
            {error}
          </div>
        )}
        <div className="mb-2 text-sm text-center text-foreground/60">
          ¿No tienes cuenta?
        </div>
        <div>
          <RegisterSheet
            trigger={
              <Button variant="secondary" className="w-full" type="button">
                Regístrate
              </Button>
            }
          />
        </div>
      </CardContent>
    </>
  );
}
