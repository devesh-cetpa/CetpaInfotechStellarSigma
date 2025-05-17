import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, ChevronRight, HelpCircle, UserPlus, LockKeyhole, Calendar, Clock } from 'lucide-react';
import { logo } from '@/assets/image/images';

const LoginPage = () => {
  const primaryColor = 'rgb(30, 64, 110)';
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDay, setCurrentDay] = useState('');

  // Update date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format date: Monday, May 12, 2025
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };

      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
      const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // Format time: 10:30:45 AM (including seconds)
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const formattedTime = now.toLocaleTimeString('en-US', timeOptions);

      setCurrentDay(dayName);
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    // Update immediately and then every second
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    // Preload images
    const bgImage = new Image();
    bgImage.src = 'https://uat.dfccil.com/Account/images/picture1.jpg';

    const logoImg = new Image();
    logoImg.src = logo;

    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = () => {
    window.location.href = 'https://uat.dfccil.com/Account/DfccilLogin';
  };

  const handleHelp = () => {
    alert('Help functionality will be implemented here');
  };

  const handleCreateAccount = () => {
    alert('Create Account functionality will be implemented here');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage: "url('https://uat.dfccil.com/Account/images/picture1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
          }}
        />
      </div>

      {/* Beautiful date and time card at the top */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden shadow-md"
        >
          {/* Card with gradient border */}
          <div className="p-[1px] rounded-xl bg-gradient-to-b from-white to-gray-100">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden">
              {/* Day display with accent background */}
              <div className="text-white text-center py-2 px-4" style={{ backgroundColor: primaryColor }}>
                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2 opacity-80" />
                  <span className="font-medium">{currentDay}</span>
                </div>
              </div>

              {/* Date and time section */}
              <div className="p-3">
                {/* Date display */}
                <div className="text-gray-700 text-center text-sm mb-2">{currentDate}</div>

                {/* Time display with animated separator */}
                <div className="flex items-center justify-center text-gray-800">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <div className="font-mono text-base tracking-wider relative">
                    {currentTime}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-light to-transparent"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex items-center justify-center w-full min-h-screen">
        <div className="px-4 py-12 w-full max-w-md">
          {/* Login card */}
          <Card className="bg-white rounded-lg border border-gray-100 shadow-lg">
            {/* Blue accent strip */}
            <div className="absolute top-0 left-0 h-2 w-full" style={{ backgroundColor: primaryColor }} />

            <CardHeader className="pb-0 pt-6">
              {/* Logo image */}
              <div className="flex justify-center mb-4">
                <img src={logo} alt="DFCCIL Logo" className="h-20 w-auto" />
                {/* Fallback logo */}
                <div
                  id="fallback-logo"
                  className="hidden h-16 w-16 items-center justify-center rounded-full shadow-md mb-4 relative"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="text-white text-xl font-bold">DFCCIL</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 pb-4">
              <div className="h-px my-4 bg-gray-200 w-full" />

              <div className="text-center text-gray-600 text-sm mb-4 flex items-center justify-center">
                <LockKeyhole className="w-3 h-3 mr-1.5 text-gray-500" />
                Secure Access Portal
              </div>
            </CardContent>

            <CardFooter className="flex flex-col pt-0 pb-8">
              <div className="w-full space-y-4">
                {/* Login button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleLogin}
                    className="w-full h-12 text-white font-semibold rounded-lg border-0 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                      className="flex items-center justify-center gap-2 relative z-10"
                    >
                      <span>Login to System</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  </Button>
                </motion.div>

                {/* Secondary buttons */}
                <div className="flex gap-3 w-full">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Button
                      onClick={handleCreateAccount}
                      variant="outline"
                      className="w-full h-10 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                    <Button
                      onClick={handleHelp}
                      variant="outline"
                      className="w-full h-10 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help
                    </Button>
                  </motion.div>
                </div>

                {/* Secure connection indicator */}
                <div className="flex justify-center mt-4 mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BadgeCheck className="w-3 h-3 text-green-600" />
                    <span>Secure Connection</span>
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <div className="text-center text-gray-500 text-xs mt-4">
                Dedicated Freight Corridor Corporation of India Ltd
              </div>
            </CardFooter>
          </Card>

          {/* Card shadow */}
          <div
            className="absolute -bottom-4 left-1/2 w-4/5 h-4 rounded-full bg-black/5 blur-md"
            style={{ transform: 'translateX(-50%)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
