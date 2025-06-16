import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { BadgeCheck, ChevronRight, HelpCircle, UserPlus, LockKeyhole, Mail, Shield, Home, Send } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [apartmentFound, setApartmentFound] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  // const [flatNumbers] = useState(mockFlats);

  const [passwordEmail, setPasswordEmail] = useState('');
  const [password, setPassword] = useState('');
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
      console.log('API response:', response.data);
      // Check if response has data array with at least one email
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const foundEmail = response.data.data[0];
        setEmail(foundEmail);
        console.log('Email found for apartment:', foundEmail);
        setApartmentFound(true);
        toast.success('Apartment found! OTP can be sent to registered email');
      } else {
        throw new Error('No email found for this apartment');
      }
    } catch (error: any) {
      console.error('Error checking apartment:', error);
      toast.error(error.message || 'Failed to find apartment. Please try again.');
      setApartmentFound(false);
      setEmail('');
    }
  };

  const handleSendOTP = async (): Promise<void> => {
    if (!email) {
      toast.error('No email address found');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Invalid email address format');
      return;
    }

    setLoading((prev) => ({ ...prev, otp: true }));

    try {
      const response = await axiosInstance.post(`${environment.apiUrl}api/Login/request-password-reset`, {
        FlatNumber: apartmentNumber,
      });
      console.log(response.data, 'response in send otp');

      if (response.data) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtp(''); // Clear any existing OTP
        toast.success(`OTP sent to ${email}`);
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);

      if (error.response?.status === 400) {
        const validationError = error.response.data;
        if (validationError.errors) {
          const firstError = Object.values(validationError.errors)[0]?.[0];
          toast.error(firstError || 'Validation error occurred');
        } else {
          toast.error('Invalid request format');
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const handleVerifyOTP = async (): Promise<void> => {
    // Validate OTP format using standardized function
    if (!validateOTP(otp)) {
      toast.error(`Please enter a valid ${OTP_LENGTH}-digit OTP (numbers only)`);
      return;
    }

    // Validate email format using standardized function
    if (!email || !validateEmail(email)) {
      toast.error('Invalid or missing email address');
      return;
    }

    // Start loading
    setLoading((prev) => ({ ...prev, verify: true }));

    try {
      // Send OTP verification request
      const response = await axiosInstance.post(`${environment.apiUrl}api/Login/verify-otp`, {
        emailId: email,
        otp,
      });

      // Fixed: Check if response has data and token
      if (response.data && response.data.data && response.data.data.token) {
        const token = response.data.data.token;
        const userData = jwtDecode(token);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('token', token);
        toast.success('Login Successfully');

        // Navigate based on role
        if (String(userData.role).toLowerCase() === 'admin') {
          navigate('/monthly-report');
        } else if (String(userData.role).toLowerCase() === 'user') {
          navigate('/report-monthly');
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

      // Handle validation error from backend
      if (error.response?.status === 400) {
        const validationError = error.response.data;
        if (validationError?.errors) {
          const firstError = Object.values(validationError.errors)[0]?.[0];
          toast.error(firstError || 'Validation error occurred');
        } else {
          toast.error('Invalid OTP...');
        }
      }
      // General server error message
      else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      // Fallback
      else {
        toast.error('OTP verification failed. Please try again.');
      }
    } finally {
      // Stop loading
      setLoading((prev) => ({ ...prev, verify: false }));
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const formattedValue = formatOTP(e.target.value);
    setOtp(formattedValue);
  };

  const handleOTPKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    // Allow only digits, backspace, delete, and arrow keys
    if (!/[\d]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }

    // Handle Enter key for verification
    if (e.key === 'Enter' && !otpVerified && validateOTP(otp)) {
      handleVerifyOTP();
    }
  };


  // const resetForm = (): void => {
  //   setApartmentNumber("");
  //   setEmail("");
  //   setOtp("");
  //   setApartmentFound(false);
  //   setOtpSent(false);
  //   setOtpVerified(false);
  //   setLoading({
  //     apartment: false,
  //     otp: false,
  //     verify: false,
  //     fetchingFlats: false,
  //   });
  //   toast("Form reset", { icon: "🔄" });
  // };
  const handlePasswordLogin = async() => {
    if (!validateEmail(passwordEmail) || !password) {
      alert('Please enter valid email and password.');
      return;
    }
      setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `${environment.apiUrl}api/login`,
        {
          emailId:email,
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

      // Navigate based on role
      if (String(userData.role).toLowerCase() === "admin") {
        navigate("/monthly-report");
      } else if (String(userData.role).toLowerCase() === "user") {
        navigate("/report-monthly");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error, "error in login");
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelp = () => {
    alert('For help:\n1. Select apartment\n2. Send OTP\n3. Enter OTP\n\nDemo OTP: 123456');
  };

  const toggleLoginMode = () => {
    setLoginMode((prev) => (prev === 'otp' ? 'password' : 'otp'));
    resetForm();
  };

  const resetForm = () => {
    setApartmentNumber('');
    setEmail('');
    setOtp('');
    setApartmentFound(false);
    setOtpSent(false);
    setOtpVerified(false);
    setPassword('');
    setPasswordEmail('');
    setLoading({ apartment: false, otp: false, verify: false });
  };

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

              {/* Conditional Rendering */}
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
                          value={email}
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
                      value={passwordEmail}
                      onChange={(e) => setPasswordEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    />
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
                  <Button onClick={handlePasswordLogin} className="w-full h-12 text-white font-semibold shadow-md">
                    <span className="flex items-center justify-center gap-2">
                      <span>Login to System</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </Button>
                )}

                {/* Footer buttons */}
                <div className="flex gap-3 w-full">
                  <Button onClick={toggleLoginMode} variant="outline" className="flex-1 h-10 border-gray-300">
                    {loginMode === 'otp' ? (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" /> Password Login
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" /> OTP Login
                      </>
                    )}
                  </Button>
                  <Button onClick={handleHelp} variant="outline" className="flex-1 h-10 border-gray-300">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help
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
