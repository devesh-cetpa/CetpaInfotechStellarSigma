import * as React from 'react';
import {
  LayoutGrid,
  LogOut,
  Hotel,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Users,
  ChartNoAxesGantt,
  MonitorCog,
  Book,
  ParenthesesIcon,
  Church,
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
import { environment } from '@/config';
import { Separator } from '@radix-ui/react-separator';
import { useNavigate } from 'react-router';
import useUserRoles from '@/hooks/useUserRoles';
import { removeSessionItem } from '@/lib/helperFunction';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const { isAdmin} = useUserRoles();
  const hasAccess = isAdmin ;
  const navMainItems = [
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
      title: 'Notice',
      url: '/notice',
      icon: Book,
    },
    {
      title: 'Reset Password',
      url: '/reset',
      icon:ParenthesesIcon,
    },
  
   
  
  ].filter(Boolean);

  const handleLogout = () => {
    removeSessionItem('token');
    window.location.href = environment.logoutUrl;
  };

  return (
    <Sidebar collapsible="icon" {...props} className="">
      <div className="flex justify-end md:pt-[90px] ">
        {state === 'collapsed' ? (
          <ChevronsRight onClick={toggleSidebar} className="w-8 h-8 cursor-pointer" />
        ) : (
          <ChevronsLeft onClick={toggleSidebar} className="w-8 h-8 cursor-pointer" />
        )}
      </div>
      <SidebarSeparator />
      <SidebarContent className="flex justify-between">
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
        
          <Separator />

          <SidebarMenuButton
            onClick={handleLogout}
            asChild
            tooltip={'Exit'}
            className={`transition-all cursor-pointer duration-300  active:bg-primary [&>svg]:size-7 ease-in-out hover:bg-primary hover:text-white h-full w-full`}
          >
            <div className={`flex items-center gap-2`}>
              <LogOut size={24} />
              <span>Exit</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
