import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/organisms/basic/sidebar";

interface SidebarMenuListItem {
  title: string;
  url: string;
}

interface SidebarMenuListProps {
  readonly items: readonly SidebarMenuListItem[];
}

/**
 * SidebarMenuList
 * Molecule que representa una lista de ítems de menú para la barra lateral.
 * Renderiza SidebarMenu, SidebarMenuItem y SidebarMenuButton para cada ítem recibido.
 *
 * @param items Array de objetos con título y url de cada ítem de menú.
 */
export function SidebarMenuList({ items }: SidebarMenuListProps) {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      {items.map((subitem) => (
        <SidebarMenuItem key={subitem.title}>
          <SidebarMenuButton asChild isActive={pathname === subitem.url}>
            <Link href={subitem.url}>{subitem.title}</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
