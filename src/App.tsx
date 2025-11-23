import { NavLink, Outlet, useLocation } from 'react-router';
import { Home, Settings } from 'lucide-react';
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

function App() {
  const routeLocation = useLocation();
  const activePath = (path: string) => routeLocation.pathname === path;
  const pathname = () => {
    switch(routeLocation.pathname) {
      case '/':
        return '首页';
      case '/settings':
        return '设置';
      default:
        return '';
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activePath('/')} tooltip="首页">
                  <NavLink to="/">
                    <Home />
                    <span>首页</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activePath('/settings')} tooltip="设置">
                <NavLink to="/settings">
                  <Settings />
                  <span>设置</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="w-full h-dvh flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <div>{pathname()}</div>
          </div>
        </header>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default App;
