import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { useState, useEffect } from 'react';

const useUserRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    const sessionUserData = sessionStorage.getItem('userData');
    const token = sessionStorage.getItem('token');

    if (token && sessionUserData) {
      try {
        const parsedData = JSON.parse(sessionUserData);
        const role = parsedData?.role?.toLowerCase();

        // Handle both string and array roles
        const roleList = Array.isArray(role) ? role : [role];

        setRoles(roleList);
      } catch (err) {
        console.error('Invalid userData in sessionStorage', err);
        setRoles([]);
      }
    } else if (user?.role) {
      // Fallback to Redux role
      const role = user.role.toLowerCase();
      setRoles([role]);
    }

    setIsLoading(false);
  }, [user?.role]);

  const isAdmin = roles.includes('admin');
  const isUser = roles.includes('user');

  return {
    isAdmin,
    isUser,
    roles,
    isLoading,
  };
};

export default useUserRoles;
