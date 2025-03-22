import React from 'react';

import { SidebarProvider } from "@/components/ui/sidebar";
import SiteHeader from "@/components/site-header";
import { AdminSidebar } from "../sidebar/AdminSidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SidebarProvider className="flex flex-col w-full">
            <SiteHeader />
            <div className="w-full bg-gray-100">
                <div className="flex flex-row">
                    <div className="w-auto">
                        <AdminSidebar className="w-64 bg-gray-800 text-white flex-shrink-0" />
                    </div>
                    <div className="w-full">{children}</div>
                </div>
            </div>
        </SidebarProvider>

    );
};

export default AdminLayout;