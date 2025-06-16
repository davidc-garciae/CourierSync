"use client";
import React from "react";
import { ProfileAvatar } from "@/components/molecules/ProfileAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/basic/dropdown-menu";
import { LogoutIcon } from "../ui/logout";
import { ChevronUpIcon } from "../ui/chevron-up";

interface UserDropdownMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    userType?: "cliente" | "agente";
  };
  onLogout: () => void;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  user,
  onLogout,
}) => {
  // Extraer nombre y apellido si están en el nombre completo
  const nameParts = user.name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || nameParts[1] || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center w-full gap-2 p-2 transition-colors border rounded-lg shadow bg-background/80 hover:bg-primary/10 border-border"
          aria-label="Menú de usuario"
        >
          <ProfileAvatar
            name={firstName}
            lastName={lastName}
            avatarUrl={user.avatar}
            size="md"
            variant="simple"
          />
          <div className="grid flex-1 text-sm leading-tight text-left">
            <span className="font-medium truncate">{user.name}</span>
            <span className="text-xs truncate text-muted-foreground">
              {user.email}
            </span>
            {user.userType && (
              <span className="text-xs font-medium text-blue-600">
                {user.userType === "cliente"
                  ? "👤 Cliente"
                  : "⚙️ Administrador"}
              </span>
            )}
          </div>
          <ChevronUpIcon className="flex items-center justify-center w-6 h-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <ProfileAvatar
              name={firstName}
              lastName={lastName}
              avatarUrl={user.avatar}
              size="md"
              variant="simple"
            />
            <div className="grid flex-1 text-sm leading-tight text-left">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-xs truncate text-muted-foreground">
                {user.email}
              </span>
              {user.userType && (
                <span className="text-xs font-medium text-blue-600">
                  {user.userType === "cliente"
                    ? "👤 Cliente"
                    : "⚙️ Administrador"}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogoutIcon className="flex items-center justify-center w-6 h-6" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
