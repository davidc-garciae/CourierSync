import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/organisms/basic/sheet";
import { Button } from "@/components/atoms/button";
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
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange ? onOpenChange : (v) => !v && onCancel()}
    >
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Editar estado del pedido</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          <label className="font-medium">Estado</label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="px-3 py-2 border rounded">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En viaje">En viaje</SelectItem>
              <SelectItem value="Entregado">Entregado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={onSave}>
              Guardar
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
