import { useState, useEffect } from 'react';

const useUserRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
 const userData=JSON.parse(sessionStorage.getItem('userData'));
 const role=userData.role.toLowerCase();
    const token = sessionStorage.getItem('token');
    if(token){
      setIsLoading(true);
        setRoles(role);
      setIsLoading(false);
    }
 
    setIsLoading(false);
  }, []);

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
