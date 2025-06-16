import React from 'react';
import { Navigate, Outlet } from 'react-router';
import AppLayout from '@/components/layout/app-layout';
import { getSessionItem } from '@/lib/helperFunction';

const PublicRoute: React.FC = () => {
  const token = getSessionItem('token');
  const userDataRaw = sessionStorage.getItem('userData');

  let isAuthenticated = false;
  let isUser = false;

  if (token && userDataRaw) {
    try {
      const userData = JSON.parse(userDataRaw);
      const role = userData?.role?.toLowerCase();
      isUser = role === 'user';
      isAuthenticated = isUser; // Only authenticated if role is user
    } catch (error) {
      console.error('Invalid userData in sessionStorage:', error);
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default PublicRoute;
