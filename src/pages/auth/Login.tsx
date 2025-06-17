import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { BadgeCheck, ChevronRight, HelpCircle, UserPlus, LockKeyhole, Mail, Shield, Home, Send, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAllApartments } from '@/features/appartment/appartmentSlice';
import toast from 'react-hot-toast';
import { environment } from '@/config';
import axiosInstance from '@/services/axiosInstance';
import { useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Login = () => {
  const [loginMode, setLoginMode] = useState('otp');

  // OTP mode states
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [otpModeEmail, setOtpModeEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [apartmentFound, setApartmentFound] = useState(false);

  // Password mode states
  const [passwordModeEmail, setPasswordModeEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const flatNumbers = useAppSelector((state) => state.appartment.apartments) || [];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState({
    apartment: false,
    otp: false,
    verify: false,
  });

  const OTP_LENGTH = 6;
  const OTP_PATTERN = /^\d{6}$/;

  // Helper functions
  const formatOTP = (value) => value.replace(/\D/g, '').slice(0, OTP_LENGTH);
  const validateOTP = (value) => OTP_PATTERN.test(value);
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  useEffect(() => {
    dispatch(fetchAllApartments());
  }, [dispatch]);

  const handleApartmentCheck = async (): Promise<void> => {
    if (!apartmentNumber) {
      toast.error('Please select an apartment number');
      return;
    }

    setLoading((prev) => ({ ...prev, apartment: true }));

    try {
      const response = await axiosInstance.post(
        `${environment.apiUrl}api/Login/GetEmailByFlatNo?flatNo=${apartmentNumber}`
      );
      
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const foundEmail = response.data.data[0];
        setOtpModeEmail(foundEmail);
        setApartmentFound(true);
        toast.success('Apartment found! OTP can be sent to registered email');
      } else {
        throw new Error('No email found for this apartment');
      }
    } catch (error: any) {
      console.error('Error checking apartment:', error);
      toast.error(error.message || 'Failed to find apartment. Please try again.');
      setApartmentFound(false);
      setOtpModeEmail('');
    } finally {
      setLoading((prev) => ({ ...prev, apartment: false }));
    }
  };

  const handleSendOTP = async (): Promise<void> => {
    if (!otpModeEmail) {
      toast.error('No email address found');
      return;
    }

    if (!validateEmail(otpModeEmail)) {
      toast.error('Invalid email address format');
      return;
    }

    setLoading((prev) => ({ ...prev, otp: true }));

    try {
      const response = await axiosInstance.post(`${environment.apiUrl}api/Login/request-password-reset`, {
        FlatNumber: apartmentNumber,
      });

      if (response.data) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtp('');
        // toast.success(`OTP sent Successfully to ${otpModeEmail}`);
        toast.success(`OTP sent Successfully to ${maskEmail(otpModeEmail)}`);
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const handleVerifyOTP = async (): Promise<void> => {
    if (!validateOTP(otp)) {
      toast.error(`Please enter a valid ${OTP_LENGTH}-digit OTP (numbers only)`);
      return;
    }

    if (!otpModeEmail || !validateEmail(otpModeEmail)) {
      toast.error('Invalid or missing email address');
      return;
    }

    setLoading((prev) => ({ ...prev, verify: true }));

    try {
      const response = await axiosInstance.post(`${environment.apiUrl}api/Login/verify-otp`, {
        emailId: otpModeEmail,
        otp,
      });

      if (response.data && response.data.data && response.data.data.token) {
        const token = response.data.data.token;
        const userData = jwtDecode(token);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('token', token);
        toast.success('Login Successfully');

        if (String(userData.role).toLowerCase() === 'admin') {
          navigate('/monthly-report');
        } else if (String(userData.role).toLowerCase() === 'user') {
          navigate('/monthly');
        } else {
          navigate('/login');
        }
      } else {
        setOtpVerified(false);
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setOtpVerified(false);
      toast.error(error.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, verify: false }));
    }
  };

  const handlePasswordLogin = async () => {
    if (!validateEmail(passwordModeEmail) || !password) {
      toast.error('Please enter valid email and password.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `${environment.apiUrl}api/login`,
        {
          emailId: passwordModeEmail, // Using the correct email state
          password,
        }
      );

      if (response.data.statusCode !== 200 || response.data.error) {
        throw new Error(response.data.message || "Login failed");
      }
      
      const token = response.data.data.token;
      const userData = jwtDecode(token);
      sessionStorage.setItem("userData", JSON.stringify(userData));
      sessionStorage.setItem("token", token);
      toast.success("Login Successfully");

      if (String(userData.role).toLowerCase() === "admin") {
        navigate("/monthly-report");
      } else if (String(userData.role).toLowerCase() === "user") {
        navigate("/report-monthly");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      console.log(error, "error in login");
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const formattedValue = formatOTP(e.target.value);
    setOtp(formattedValue);
  };

  const handleOTPKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!/[\d]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'Enter' && !otpVerified && validateOTP(otp)) {
      handleVerifyOTP();
    }
  };

  const handleHelp = () => {
  navigate('/')
  };

  const toggleLoginMode = () => {
    setLoginMode((prev) => (prev === 'otp' ? 'password' : 'otp'));
    resetForm();
  };

  const resetForm = () => {
    setApartmentNumber('');
    setOtpModeEmail('');
    setPasswordModeEmail('');
    setOtp('');
    setPassword('');
    setApartmentFound(false);
    setOtpSent(false);
    setOtpVerified(false);
    setLoading({ apartment: false, otp: false, verify: false });
  };
function maskEmail(email) {
  const [local, domain] = email.split('@');
  if (!domain) return email; // Not a valid email
  if (local.length <= 4) return `${local}@${domain}`;
  const visible = local.slice(0, 4);
  const masked = '*'.repeat(local.length - 4);
  return `${visible}${masked}@${domain}`;
}
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage:
              "url('https://dyimg2.realestateindia.com/proj_images/project9467/proj_header_image-9467-770x400.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4,
          }}
        />
      </div>

      {/* Main */}
      <div className="relative z-20 flex items-center justify-center w-full min-h-screen">
        <div className="px-4 py-12 w-full max-w-md">
          <Card className="bg-white rounded-lg border border-gray-100 shadow-lg relative">
            <CardHeader className="pb-0 pt-6">
              <div className="flex justify-center mb-4">
                <img src="/src/assets/image/logo.png" alt="Logo" className="h-20 w-auto" />
              </div>
            </CardHeader>

            <CardContent className="pt-0 pb-4">
              <div className="h-px my-4 bg-gray-200 w-full" />
              <div className="text-center text-gray-600 text-sm mb-4 flex items-center justify-center">
                <LockKeyhole className="w-3 h-3 mr-1.5 text-gray-500" />
                {loginMode === 'otp' ? 'Secure Access Portal - OTP Login' : 'Secure Access Portal - Password Login'}
              </div>

              {loginMode === 'otp' ? (
                <>
                  {/* Apartment selection */}
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Home size={14} />
                      <span>Select Apartment</span>
                    </div>
                    <div className="flex gap-2">
                      <Select value={apartmentNumber} onValueChange={setApartmentNumber} disabled={apartmentFound}>
                        <SelectTrigger className="flex-1 text-sm">
                          <SelectValue placeholder="Choose apartment" />
                        </SelectTrigger>
                        <SelectContent>
                          {flatNumbers?.map((flat) => (
                            <SelectItem key={flat.id} value={flat.flatNumber}>
                              {flat.flatNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleApartmentCheck}
                        disabled={loading.apartment || !apartmentNumber || apartmentFound}
                        size="sm"
                      >
                        {loading.apartment ? 'Checking...' : apartmentFound ? 'Found ✓' : 'Check'}
                      </Button>
                    </div>
                  </div>

                  {/* Email + OTP */}
                  {apartmentFound && (
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Mail size={14} />
                        <span>Send OTP</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                         value={maskEmail(otpModeEmail)}
                          readOnly
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                        />
                        <Button
                          onClick={handleSendOTP}
                          disabled={loading.otp || otpVerified}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {loading.otp ? (
                            'Sending...'
                          ) : (
                            <>
                              <Send size={12} className="mr-1" /> {otpSent ? 'Resend' : 'Send'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {otpSent && (
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Shield size={14} />
                        <span>Enter OTP</span>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={handleOTPChange}
                          onKeyDown={handleOTPKeyPress}
                          maxLength={OTP_LENGTH}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md text-center"
                          disabled={otpVerified}
                        />
                        <Button
                          onClick={handleVerifyOTP}
                          disabled={loading.verify || !validateOTP(otp) || otpVerified}
                          size="sm"
                        >
                          {loading.verify ? 'Verifying...' : otpVerified ? 'Verified ✓' : 'Verify'}
                        </Button>
                      </div>
                      {otp.length > 0 && !validateOTP(otp) && (
                        <p className="text-xs text-red-500">Please enter exactly 6 digits</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Password login form */}
                  <div className="space-y-4 mb-4">
                    <Label className="text-sm font-medium text-gray-700">
                      <Mail size={14} className="inline-block mr-1" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      value={passwordModeEmail}
                      onChange={(e) => setPasswordModeEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    />
                    {passwordModeEmail && !validateEmail(passwordModeEmail) && (
                      <p className="text-xs text-red-500">Please enter a valid email address</p>
                    )}
                    
                    <Label className="text-sm font-medium text-gray-700">
                      <LockKeyhole size={14} className="inline-block mr-1" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col pt-0 pb-8">
              <div className="w-full space-y-4">
                {loginMode === 'otp' ? (
                  otpVerified && (
                    <Button
                      onClick={() => (window.location.href = 'https://uat.dfccil.com/Account/DfccilLogin')}
                      className="w-full h-12 text-white font-semibold shadow-md"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>Login to System</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </Button>
                  )
                ) : (
                  <Button 
                    onClick={handlePasswordLogin} 
                    className="w-full h-12 text-white font-semibold shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login to System'}
                  </Button>
                )}

                {/* Footer buttons */}
                <div className="flex gap-3 w-full">
                  <Button onClick={toggleLoginMode} variant="outline" className="flex-1 h-10 border-gray-300">
                    {loginMode === 'otp' ? (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" /> Login with Password
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" /> Login with OTP
                      </>
                    )}
                  </Button>
                  <Button onClick={handleHelp} variant="outline" className="flex-1 h-10 border-gray-300">
                   
                   <ArrowLeft className="w-4 h-4 mr-2" /> Back To Home
                  </Button>
                </div>

                {(apartmentFound || otpSent || loginMode === 'password') && (
                  <Button onClick={resetForm} variant="ghost" className="w-full text-gray-500" size="sm">
                    Reset Form
                  </Button>
                )}

                <div className="flex justify-center mt-4 mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BadgeCheck className="w-3 h-3 text-green-600" />
                    <span>Secure Connection</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;