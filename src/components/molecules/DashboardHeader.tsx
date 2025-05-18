import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/organisms/basic/breadcrumb";
import { Separator } from "@/components/atoms/separator";
import { SidebarTrigger } from "@/components/organisms/basic/sidebar";
import { ThemeToggleButton } from "../atoms/ThemeToggleButton";
import { ColorThemeSelect } from "../molecules/ColorThemeSelect";
import Link from "next/link";

export interface DashboardHeaderProps {
  breadcrumbs: Array<{
    label: string;
    href?: string;
    isCurrentPage?: boolean;
  }>;
}

/**
 * DashboardHeader
 * Molecule que representa el header del dashboard con trigger de sidebar, separador y breadcrumbs dinámicos.
 * @param breadcrumbs Array de objetos con label, href y si es la página actual.
 */
export function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
  return (
    <header className="sticky flex items-center h-16 gap-2 px-4 border-b bg-background shrink-0">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4 mr-2" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label + idx}>
              <BreadcrumbItem
                className={idx === 0 ? "hidden md:block" : undefined}
              >
                {crumb.isCurrentPage ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild href={crumb.href || "#"}>
                    <Link href={crumb.href || "#"}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator
                  className={idx === 0 ? "hidden md:block" : undefined}
                />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2 ml-auto">
        <ColorThemeSelect />
        <ThemeToggleButton />
      </div>
    </header>
  );
}
