import * as React from 'react';
import {
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Book,
  ParenthesesIcon,
  Church,
  Users,
  MonitorCog,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

import { Separator } from '@radix-ui/react-separator';
import { environment } from '@/config';
import useUserRoles from '@/hooks/useUserRoles';
import { removeSessionItem } from '@/lib/helperFunction';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const { isAdmin, isUser } = useUserRoles();

  // 🔐 Admin-specific routes
  const userRoutes = [
    {
      title: 'Manage Users',
      url: '/admin/users',
      icon: Users,
    },
    {
      title: 'System Settings',
      url: '/admin/settings',
      icon: MonitorCog,
    },
    {
      title: 'Notice',
      url: '/notice',
      icon: Book,
    },
  ];

  // 👤 User-specific routes
  const adminRoutes = [
    {
      title: 'Monthly Report',
      url: '/monthly-report',
      icon: Home,
    },
    {
      title: 'Event Glimpse',
      url: '/event-manage',
      icon: Church,
    },
    {
      title: 'Reset Password',
      url: '/reset',
      icon: ParenthesesIcon,
    },
  ];

  // 🔄 Merge routes based on roles
  const navMainItems = [
    ...(isUser ? userRoutes : []),
    ...(isAdmin ? adminRoutes : []),
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    window.location.href = environment.logoutUrl;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Sidebar Toggle */}
      <div className="flex justify-end md:pt-[90px] px-2">
        {state === 'collapsed' ? (
          <ChevronsRight onClick={toggleSidebar} className="w-6 h-6 cursor-pointer" />
        ) : (
          <ChevronsLeft onClick={toggleSidebar} className="w-6 h-6 cursor-pointer" />
        )}
      </div>

      <SidebarSeparator />

      {/* Navigation Section */}
      <SidebarContent className="flex flex-col justify-between">
        <NavMain items={navMainItems} />
      </SidebarContent>

      {/* Logout Section */}
      <SidebarFooter>
        <SidebarMenu>
          <Separator />
          <SidebarMenuButton
            onClick={handleLogout}
            asChild
            tooltip="Exit"
            className="transition-all duration-300 cursor-pointer active:bg-primary hover:bg-primary hover:text-white w-full h-full [&>svg]:size-6"
          >
            <div className="flex items-center gap-2">
              <LogOut />
              <span>Exit</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
