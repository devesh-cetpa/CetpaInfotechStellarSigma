import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { environment } from '@/config';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const clearData = () => {
    setNewPassword('');
    setConfirmPassword('');
  };

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
      await axiosInstance.post(`${environment.apiUrl}api/Login/change-password`, {
        emailId: email,
        newPassword: newPassword,
      });
      toast.success('Password reset successful');
      clearData();
    } catch (err: any) {
      toast.error('Failed to reset password');
      console.error('Reset error:', err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 py-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 p-5">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-blue-800 mb-1">Reset Password</h1>
          <p className="text-gray-500 text-sm">
            Set a new password for your account.
          </p>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (isValid) handleReset();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="email" className="mb-0.5 block text-gray-700 text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              autoComplete="username"
              disabled
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="mb-0.5 block text-gray-700 text-sm">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="New password"
              value={newPassword}
              autoComplete="new-password"
              onChange={e => {
                setNewPassword(e.target.value);
                setTouched(true);
              }}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mb-0.5 block text-gray-700 text-sm">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={e => {
                setConfirmPassword(e.target.value);
                setTouched(true);
              }}
              className={`text-sm ${
                touched && !passwordsMatch ? 'border-red-500' : ''
              }`}
            />
            {touched && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-0.5">Passwords do not match</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-10 text-base font-semibold bg-blue-700 hover:bg-blue-800 rounded-lg"
            disabled={!isValid}
            variant={isValid ? 'default' : 'secondary'}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
