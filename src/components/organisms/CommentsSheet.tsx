import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/organisms/basic/sheet";
import { Button } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { useEffect, useRef, useState } from "react";

export interface Comentario {
  autor: string;
  texto: string;
  fecha: string;
}

interface CommentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comentarios: Comentario[];
  onAddComentario: (texto: string) => void;
  loading?: boolean;
}

export function CommentsSheet({
  open,
  onOpenChange,
  comentarios,
  onAddComentario,
  loading = false,
}: CommentsSheetProps) {
  const [comentForm, setComentForm] = useState("");
  const comentariosEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (comentariosEndRef.current) {
          comentariosEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [comentarios.length, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Comentarios del pedido</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <Skeleton className="w-full h-20 rounded" />
          ) : comentarios.length === 0 ? (
            <span className="text-muted-foreground">Sin comentarios aún.</span>
          ) : (
            <>
              {comentarios.map((c, idx) => (
                <div key={idx} className="p-2 border rounded bg-muted/50">
                  <div className="flex items-center justify-between mb-1 text-xs text-muted-foreground">
                    <span>{c.autor}</span>
                    <span>{c.fecha}</span>
                  </div>
                  <div className="text-sm break-words whitespace-pre-line">
                    {c.texto}
                  </div>
                </div>
              ))}
              <div ref={comentariosEndRef} />
            </>
          )}
        </div>
        <div className="mt-6">
          <textarea
            className="w-full p-2 mb-2 border rounded"
            rows={3}
            placeholder="Agregar un comentario"
            value={comentForm}
            onChange={(e) => setComentForm(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => {
              if (comentForm.trim()) {
                onAddComentario(comentForm);
                setComentForm("");
              }
            }}
            disabled={!comentForm.trim()}
          >
            Agregar comentario
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
