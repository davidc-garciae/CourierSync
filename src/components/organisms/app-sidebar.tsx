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
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMemo } from "react";

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
  // Obtener datos reales del usuario autenticado
  const { userProfile, loading } = useUserProfile();

  // Transformar userProfile al formato esperado por SidebarUserMenu
  const user = useMemo(() => {
    if (!userProfile) return null;

    return {
      name: userProfile.apellido
        ? `${userProfile.name} ${userProfile.apellido}`
        : userProfile.name,
      email: userProfile.email,
      // No pasar avatar para que siempre use las iniciales
      userType: userProfile.userType,
    };
  }, [userProfile]);

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
      {loading ? (
        <div className="px-2 pb-2 mt-auto">
          <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600"></div>
            Cargando usuario...
          </div>
        </div>
      ) : (
        user && <SidebarUserMenu user={user} />
      )}
      <SidebarRail />
    </Sidebar>
  );
}
