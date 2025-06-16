"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: "cliente" | "agente" | "any";
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requiredUserType = "any",
  redirectTo = "/",
}: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();

    if (!session) {
      setIsAuthenticated(false);
      setIsAuthorized(false);
      router.replace(redirectTo);
      return;
    }

    setIsAuthenticated(true);

    // Verificar tipo de usuario si es requerido
    if (requiredUserType === "any") {
      setIsAuthorized(true);
    } else if (session.userType === requiredUserType) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      // Redirigir según el tipo de usuario
      const targetRoute =
        session.userType === "cliente" ? "/dashboard" : "/admin";
      router.replace(targetRoute);
    }
  }, [requiredUserType, redirectTo, router]);

  // Mostrar loading mientras verificamos
  if (isAuthenticated === null || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no está autenticado o autorizado, no mostrar contenido
  if (!isAuthenticated || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
