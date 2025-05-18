import * as React from "react";

/**
 * DashboardContent
 * Molecule que representa el contenido principal del dashboard.
 */
export function DashboardContent() {
  return (
    <div className="flex flex-col flex-1 gap-4 p-4">
      {Array.from({ length: 24 }).map((_, index) => (
        <div
          key={index}
          className="w-full h-12 rounded-lg aspect-video bg-muted/50"
        />
      ))}
    </div>
  );
}
