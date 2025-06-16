"use client";
// src/app/admin/layout.tsx
import { AppSidebar } from "@/components/organisms/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/organisms/basic/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ReactNode } from "react";
import { navigation_admin } from "@/lib/navigation_admin";

export default function AdminLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <AuthGuard requiredUserType="agente" redirectTo="/">
      <SidebarProvider className="">
        <AppSidebar navigationData={navigation_admin} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
