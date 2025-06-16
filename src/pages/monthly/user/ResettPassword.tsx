import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { environment } from '@/config';
import toast from 'react-hot-toast';

const ResettPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [touched, setTouched] = useState(false);
const clearData=()=>{
    setNewPassword("")
    setConfirmPassword("");
}
  
  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setEmail(parsed.email || '');
      } catch (err) {
        console.error('Invalid userData in sessionStorage');
      }
    }
  }, []);

  const passwordsMatch = newPassword === confirmPassword;
  const isValid = !!email && !!newPassword && !!confirmPassword && passwordsMatch;

  const handleReset = async () => {
    try {
      const res = await axiosInstance.post(`${environment.apiUrl}api/Login/change-password`, {
        emailId: email,
        newPassword: newPassword,
      });
      toast.success('Password reset successful:', res.data);
    clearData()
    } catch (err: any) {
      console.error('Reset error:', err.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Reset Password</h1>

      {/* Row 1: Email + New Password */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex flex-col w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col w-full">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setTouched(true);
            }}
            className="focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Row 2: Confirm Password + Button */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex flex-col w-full">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setTouched(true);
            }}
            className={`focus:ring-2 transition-all ${
              touched && !passwordsMatch
                ? 'border-red-500 ring-red-200'
                : 'focus:ring-blue-500'
            }`}
          />
          {touched && !passwordsMatch && (
            <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        <Button
          className="h-10 w-full md:w-32 transition-all"
          disabled={!isValid}
          variant={isValid ? 'default' : 'secondary'}
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ResettPassword;
