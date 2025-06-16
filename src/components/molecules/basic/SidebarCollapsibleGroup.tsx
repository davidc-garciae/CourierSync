import * as React from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/atoms/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/organisms/basic/sidebar";

interface SidebarCollapsibleGroupProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * SidebarCollapsibleGroup
 * Molecule que representa un grupo colapsable en la barra lateral.
 * Utiliza Collapsible, SidebarGroup y permite anidar contenido (por ejemplo, listas de menú).
 *
 * @param title Título del grupo colapsable.
 * @param defaultOpen Si el grupo debe estar abierto por defecto.
 * @param children Contenido a mostrar dentro del grupo colapsable.
 */
export function SidebarCollapsibleGroup({
  title,
  defaultOpen = true,
  children,
}: Readonly<SidebarCollapsibleGroupProps>) {
  return (
    <Collapsible
      title={title}
      defaultOpen={defaultOpen}
      className="group/collapsible"
    >
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className="text-sm group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <CollapsibleTrigger>
            {title}{" "}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>{children}</SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
