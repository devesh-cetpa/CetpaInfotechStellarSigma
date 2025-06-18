import React from 'react';
import { Navigate, Outlet } from 'react-router';
import AppLayout from '@/components/layout/app-layout';
import { getSessionItem } from '@/lib/helperFunction';

const PublicRoute: React.FC = () => {
  const token = getSessionItem('token');
  const userDataRaw = sessionStorage.getItem('userData');

  // Default states
  let isAuthenticated = false;
  let isUser = false;
  let isAdmin = false;

  // Check if user is authenticated and determine role
  if (token && userDataRaw) {
    try {
      const userData = JSON.parse(userDataRaw);
      const role = userData?.role?.toLowerCase();
      isUser = role === 'user';
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
  
  // If authenticated but not a regular user (e.g., admin trying to access user routes)
  // Admins should be redirected to their dashboard
  if (isAuthenticated && !isUser) {
    // If admin, redirect to admin dashboard
    if (isAdmin) {
      return <Navigate to="/monthly-report" />;
    }
    // If neither user nor admin, redirect to unauthorized
    return <Navigate to="/unauthorized" />;
  }

  // If user, allow access to public routes
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default PublicRoute;
