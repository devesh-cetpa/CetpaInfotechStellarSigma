import * as React from 'react';
import {
  BellRing,
  CalendarCheck,
  Users,
  ChevronDown,
  ChevronLeft,
  LayoutGrid,
  User,
  LogOut,
  BadgeAlert,
  UserRoundCog,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { logo } from '@/assets/image/images';
import { Separator } from '@radix-ui/react-separator';
import { useNavigate } from 'react-router';
import { removeSessionItem } from '@/lib/helperFunction';
import { resetUser } from '@/features/user/userSlice';
import { environment } from '@/config';
import { setSelectedWorkspace } from '@/features/workspace/workspaceSlice';
import useUserRoles from '@/hooks/useUserRoles';

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

const navigate = useNavigate();
  const data = {
    navMain: [
      {
        title: 'Dashboard',
        url: '/admin-dashboard',
        icon: LayoutGrid,
      },
      // {
      //   title: 'My Grievances',
      //   url: '/admin-grievances',
      //   icon: BadgeAlert,
      // },
      // {
      //   title: 'Manage Services',
      //   url: '/admin-manage-services',
      //   icon: Users,
      // },
      {
        title: 'Grievance Organization',
        url: '/admin-org',
        icon: Users,
      },
     
    ],
  };


  React.useEffect(() => {
    dispatch(setSelectedWorkspace({ unitName: user.Unit, unitId: Number(user.unitId) }));
  }, []);

  const handleLogout = () => {
    removeSessionItem('token');
    dispatch(resetUser());
    window.location.href = environment.logoutUrl;
  };

  return (
    <Sidebar collapsible="icon" {...props} className="">
      <SidebarHeader className="flex flex-row justify-between items-center py-4 px-4">
        <img
          src={logo}
          className={`transition-all  object-contain ${state === 'collapsed' ? 'w-14 h-10' : 'w-full h-12'}`}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarMenu>
        
      </SidebarMenu>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton
            onClick={() => navigate('/dashboard')}
            asChild
            tooltip={' Manage Personal View'}
            className={`transition-all text-black cursor-pointer duration-300  active:bg-primary [&>svg]:size-7 ease-in-out hover:bg-primary hover:text-white h-full w-full active:text-white`}
          >
            <div className={`flex items-center gap-2`}>
              <User size={24} />
              <span> Manage Personal View</span>
            </div>
          </SidebarMenuButton>
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
