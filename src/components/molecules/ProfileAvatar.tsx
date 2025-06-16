import React from "react";
import { Skeleton } from "@/components/atoms/skeleton";
import { cn } from "@/lib/utils";

export interface ProfileAvatarProps {
  /** Nombre del usuario para generar iniciales */
  name?: string;
  /** Apellido del usuario para generar iniciales */
  lastName?: string;
  /** URL de la imagen de avatar (opcional) */
  avatarUrl?: string;
  /** Tamaño del avatar */
  size?: "sm" | "md" | "lg" | "xl";
  /** Si está cargando, muestra skeleton */
  loading?: boolean;
  /** Clases adicionales */
  className?: string;
  /** Variante del estilo */
  variant?: "default" | "simple" | "compact";
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-20 h-20 text-2xl",
  xl: "w-28 h-28 text-3xl",
};

const variantClasses = {
  default:
    "border-2 shadow bg-gradient-to-br from-primary/20 to-secondary/20 border-muted",
  simple: "border border-border bg-background",
  compact: "border border-muted bg-muted/20",
};

export function ProfileAvatar({
  name,
  lastName,
  avatarUrl,
  size = "md",
  loading = false,
  className,
  variant = "default",
}: ProfileAvatarProps) {
  // Generar iniciales
  const getInitials = () => {
    const firstInitial = name?.[0]?.toUpperCase() || "";
    const lastInitial = lastName?.[0]?.toUpperCase() || "";
    return firstInitial + lastInitial || "?";
  };

  if (loading) {
    return (
      <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full font-bold text-foreground",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name} ${lastName}`.trim() || "Avatar"}
          className="object-cover w-full h-full"
          onError={(e) => {
            // Si falla la imagen, mostrar iniciales
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span className="select-none">{getInitials()}</span>
      )}
    </div>
  );
}
