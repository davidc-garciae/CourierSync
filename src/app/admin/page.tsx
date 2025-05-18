import React from "react";
import { Card, CardContent } from "@/components/molecules/basic/card";
import { DashboardHeader } from "@/components/molecules/DashboardHeader";

export default function AdminPage() {
  // Breadcrumbs para admin
  const breadcrumbs = [
    { label: "Panel de administración", isCurrentPage: true },
  ];
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-primary/50 to-background">
        <Card className="w-full max-w-2xl shadow-xl rounded-xl backdrop-blur bg-card/60">
          <CardContent className="flex flex-col items-center p-8">
            <h1 className="mb-4 text-3xl font-bold">
              ¡Bienvenido/a al panel de administración!
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Aquí puedes gestionar usuarios, pedidos y acceder a todas las
              herramientas administrativas del sistema. <br></br> <br></br>Usa
              el menú lateral para navegar entre las diferentes secciones de
              administración.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
