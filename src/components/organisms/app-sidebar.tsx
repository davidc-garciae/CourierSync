import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/organisms/basic/sidebar";
import { SidebarCollapsibleGroup } from "@/components/molecules/basic/SidebarCollapsibleGroup";
import { SidebarMenuList } from "@/components/molecules/basic/SidebarMenuList";
import { SidebarUserMenu } from "@/components/molecules/SidebarUserMenu";
import { navigation } from "@/lib/navigation";
import { useEffect, useState } from "react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navigationData?: {
    navMain: Array<{
      title: string;
      url: string;
      items: Array<{ title: string; url: string }>;
    }>;
  };
}

export function AppSidebar({ navigationData, ...props }: AppSidebarProps) {
  // Simula obtener datos de usuario desde una API
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    // Simulación de llamada a API
    setTimeout(() => {
      setUser({
        name: "David García",
        email: "david.garcia@email.com",
        avatar: "/Shattered.webp",
      });
    }, 100); // 600ms de delay simulado
  }, []);

  const data = navigationData || navigation;

  return (
    <Sidebar
      {...props}
      className="transition-colors duration-300 bg-background"
    >
      <SidebarHeader className="sticky " />
      <SidebarContent className="gap-0">
        {/* Collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarCollapsibleGroup
            key={item.title}
            title={item.title}
            defaultOpen
          >
            <SidebarMenuList items={item.items} />
          </SidebarCollapsibleGroup>
        ))}
      </SidebarContent>
      {/* Footer: Menú de usuario */}
      {user && <SidebarUserMenu user={user} />}
      <SidebarRail />
    </Sidebar>
  );
}
