import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/organisms/basic/sheet";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { useQuery } from "@apollo/client";
import { LISTA_ESTADOS } from "@/lib/graphql/mutations";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/molecules/basic/select";

interface StateEditorSheetProps {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function StateEditorSheet({
  open,
  value,
  onChange,
  onSave,
  onCancel,
  onOpenChange,
}: StateEditorSheetProps) {
  // Query para obtener los estados disponibles
  const { data: estadosData, loading: loadingEstados } = useQuery(
    LISTA_ESTADOS,
    {
      fetchPolicy: "cache-first",
    }
  );

  // Extraer estados únicos de la respuesta de obtenerEnvios
  const estadosUnicos = React.useMemo(() => {
    if (!estadosData?.obtenerEnvios) return [];

    const estadosMap = new Map();
    estadosData.obtenerEnvios.forEach((envio: any) => {
      const estado = envio.id_estado;
      if (estado && !estadosMap.has(estado.id_estado)) {
        estadosMap.set(estado.id_estado, estado);
      }
    });

    return Array.from(estadosMap.values());
  }, [estadosData]);

  const estados = estadosUnicos;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange ? onOpenChange : (v) => !v && onCancel()}
    >
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Editar estado del envío</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          <label className="font-medium">Estado actual</label>

          {loadingEstados ? (
            <Skeleton className="h-10 w-full rounded" />
          ) : (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="px-3 py-2 border rounded">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado: any) => (
                  <SelectItem
                    key={estado.id_estado}
                    value={estado.id_estado.toString()}
                  >
                    {estado.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              onClick={onSave}
              disabled={loadingEstados || !value}
            >
              Guardar cambios
            </Button>
            <Button size="sm" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
