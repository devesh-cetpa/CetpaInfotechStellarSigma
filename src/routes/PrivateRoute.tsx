import React from 'react';
import { Navigate, Outlet } from 'react-router';
import AppLayout from '@/components/layout/app-layout';
import { getSessionItem } from '@/lib/helperFunction';

const PrivateRoute: React.FC = () => {
  const token = getSessionItem('token');
  const userDataRaw = sessionStorage.getItem('userData');

  // Default states
  let isAuthenticated = false;
  let isAdmin = false;

  // Check if user is authenticated and has admin role
  if (token && userDataRaw) {
    try {
      const userData = JSON.parse(userDataRaw);
      const role = userData?.role?.toLowerCase();
      isAdmin = role === 'admin';
      isAuthenticated = !!token; // User is authenticated if token exists
    } catch (error) {
      console.error('Invalid userData in sessionStorage:', error);
    }
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated but not admin, redirect to unauthorized
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  // If admin, allow access to private routes
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default PrivateRoute;
