"use client";
import React from "react";
import { UserDropdownMenu } from "@/components/molecules/UserDropdownMenu";
import { useAuthSession } from "@/hooks/useAuthSession";

interface SidebarUserMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    userType?: "cliente" | "agente";
  };
}

export const SidebarUserMenu: React.FC<SidebarUserMenuProps> = ({ user }) => {
  const { logout } = useAuthSession();

  // Cerrar sesión usando nuestro sistema de autenticación
  const handleLogout = () => {
    logout(); // Esto limpiará localStorage, cookies y redirigirá
  };

  return (
    <div className="px-2 pb-2 mt-auto">
      <UserDropdownMenu user={user} onLogout={handleLogout} />
    </div>
  );
};
