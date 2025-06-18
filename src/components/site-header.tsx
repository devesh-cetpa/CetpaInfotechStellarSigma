import React from 'react';
import { Link } from 'react-router';
import { logo } from '@/assets/image/images';

import { removeSessionItem } from '@/lib/helperFunction';

import { environment } from '@/config';

import { Button } from './ui/button';
import { AlignJustify, Power } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

const SiteHeader: React.FC<{ showtoggle?: boolean }> = ({ showtoggle = false }) => {
  // const user = useSelector((state: RootState) => state.user);
  // console.log(user,"user");
  const user = JSON.parse(sessionStorage.getItem('userData'));
  console.log(user.unique_name, '-------');
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50 border-b-4 border-red-600 h-[80px] px-4">
      <div className="flex items-center justify-between h-full p-2">
        <div className="flex items-center space-x-4 ">
          <div className="md:hidden">
            <AlignJustify className="w-8 h-8 cursor-pointer rounded-md transition-all " onClick={toggleSidebar} />
          </div>
          <img src={logo} alt="Company Logo" className="object-contain h-12 w-auto" />
          <Link to="#" className="hidden sm:flex flex-col text-primary">
            <span className="text-md md:text-lg font-semibold">Stellar Sigma Villas</span>
            <span className="text-sm md:text-md text-gray-600">Stellar Appartments and Villas</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {showtoggle && (
            <div className="hidden md:block text-gray-800 text-md md:text-lg font-semibold">{user?.unique_name}</div>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              sessionStorage.clear();
              removeSessionItem('userData');
              window.location.href = environment.powerOffUrl;
            }}
          >
            <Power className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
