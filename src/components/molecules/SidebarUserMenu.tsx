"use client";
import React from "react";
import { UserDropdownMenu } from "@/components/molecules/UserDropdownMenu";

interface SidebarUserMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export const SidebarUserMenu: React.FC<SidebarUserMenuProps> = ({ user }) => {
  // Cerrar sesión: limpia storage y redirige a home
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // Elimina solo las claves de sesión/autenticación, NO el theme ni color
      localStorage.removeItem("auth-token"); // ejemplo, ajusta según tu clave real
      localStorage.removeItem("user-session"); // ejemplo, ajusta según tu clave real
      sessionStorage.clear();
      window.location.href = "http://localhost:3000";
    }
  };

  return (
    <div className="px-2 pb-2 mt-auto">
      <UserDropdownMenu user={user} onLogout={handleLogout} />
    </div>
  );
};
