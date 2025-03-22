import React from 'react';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from './ui/sidebar';
import SiteHeader from './site-header';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (

    <SidebarProvider className="flex flex-col w-full">
      <SiteHeader />
      <div className="w-full bg-gray-100">
        <div className="flex flex-row">
          <div className="w-auto">
            <AppSidebar className="w-64 bg-gray-800 text-white flex-shrink-0" />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </SidebarProvider>

  );
};

export default AppLayout;
