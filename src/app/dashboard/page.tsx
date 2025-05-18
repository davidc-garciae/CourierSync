"use client";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";
import { Card, CardContent } from "@/components/molecules/basic/card";

/**
 * DashboardPage
 * Template que compone el layout del dashboard usando organisms y molecules.
 */

function getBreadcrumbsFromNavigation(pathname: string) {
  return [{ label: "Dashboard", isCurrentPage: true }];
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const breadcrumbs = getBreadcrumbsFromNavigation("/dashboard");
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-primary/50 to-background">
        <Card className="w-full max-w-2xl shadow-xl rounded-xl backdrop-blur bg-card/60">
          <CardContent className="flex flex-col items-center p-8">
            <h1 className="mb-4 text-3xl font-bold">
              ¡Bienvenido/a a tu panel de usuario!
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Desde aquí puedes gestionar tu perfil, consultar tus compras y
              acceder a todas las funcionalidades de tu cuenta.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
