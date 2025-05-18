"use client";
// src/app/dashboard/layout.tsx
import { AppSidebar } from "@/components/organisms/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/organisms/basic/sidebar";
import { ReactNode } from "react";
import { navigation_admin } from "@/lib/navigation_admin";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="">
      <AppSidebar navigationData={navigation_admin} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
