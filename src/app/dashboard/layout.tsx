"use client";
// src/app/dashboard/layout.tsx
import { AppSidebar } from "@/components/organisms/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/organisms/basic/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requiredUserType="cliente" redirectTo="/">
      <SidebarProvider className="">
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
