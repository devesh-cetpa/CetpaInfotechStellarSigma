import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

const Unauthorized: React.FC = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    // Check if user is logged in and redirect based on role
    const userDataRaw = sessionStorage.getItem('userData');
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        const role = userData?.role?.toLowerCase();
        
        if (role === 'admin') {
          navigate('/monthly-report');
        } else if (role === 'user') {
          navigate('/monthly');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/');
      }
    } else {
      // If not logged in, go to home page
      navigate('/');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        {/* Logo */}
        <div className="mb-6">
          <img src="/logo.png" alt="Company Logo" className="w-16 h-16" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800">Unauthorized</h1>

        {/* Description */}
        <p className="mt-4 text-center text-gray-600">
          You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>

        {/* Go Back Button */}
        <Button className="mt-6 w-full" onClick={handleGoBack} variant="default">
          Go Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default Unauthorized
