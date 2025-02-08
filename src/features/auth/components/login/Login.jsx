import React, { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CustomButton from '@components/buttons/buttons';
import crosswalk from '../../../../assets/images/vectors/crosswalk.jpg';
import { Palette } from '@shared/components/ui/colors';
import Loader from '@shared/components/loaders/Loader';
import { useLoader } from '@components/loaders/useLoader';
import ToastNotification from '@shared/components/toast-notif/ToastNotification';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { startLoading, stopLoading } = useLoader();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    try {
      setToastMessage('Successfully Logged In!');
      setToastType('success');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error('Login failed:', error);
      setToastMessage('Login failed. Please try again.');
      setToastType('error');
    } finally {
      stopLoading();
    }
  };

  const handleGoogleSignIn = async () => {
    startLoading();
    try {
      // Implement Google Sign-in logic here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setToastMessage('Google Sign-in Successful!');
      setToastType('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      setToastMessage('Google Sign-in failed. Please try again.');
      setToastType('error');
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <Loader />
      {toastMessage && <ToastNotification message={toastMessage} type={toastType} />}
      
      <div className="flex min-h-screen">
        {/* Left Side - Primary Color Background */}
        <div className="flex flex-col items-start justify-center flex-1 p-12" 
             style={{ background: `linear-gradient(135deg, ${Palette.primary.main}, ${Palette.primary.dark})` }}>
          <div className="max-w-xl">
            <img src="/logo.png" alt="EcoPulse Logo" className="w-32 h-32 mb-6" />
            <h1 className="mb-8 text-5xl font-bold text-white">EcoPulse</h1>
            <p className="max-w-md text-lg leading-relaxed text-white/80">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          </div>
        </div>

        {/* Right Side - Background Image */}
        <div 
          className="relative flex items-center justify-center w-1/2 bg-center bg-cover"
          style={{
            backgroundImage: `url(${crosswalk})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}></div>
          <div className="relative z-10 w-full max-w-md p-8 mx-12 bg-white shadow-xl rounded-3xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full" 
                   style={{ border: `2px solid ${Palette.primary.main}` }}>
                <User className="w-full h-full p-4" style={{ color: Palette.primary.main }} />
              </div>
            </div>

            <h2 className="mb-8 text-3xl font-bold text-center" style={{ color: Palette.text.primary }}>Login</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5" style={{ color: Palette.text.disabled }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full py-3 pl-10 pr-3 transition-all border rounded-lg"
                  style={{ 
                    borderColor: Palette.text.disabled,
                    '&:focus': {
                      borderColor: Palette.primary.main,
                      boxShadow: `0 0 0 2px ${Palette.primary.light}30`
                    }
                  }}
                  placeholder="Email"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5" style={{ color: Palette.text.disabled }} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-3 pl-10 pr-3 transition-all border rounded-lg"
                  style={{ 
                    borderColor: Palette.text.disabled,
                    '&:focus': {
                      borderColor: Palette.primary.main,
                      boxShadow: `0 0 0 2px ${Palette.primary.light}30`
                    }
                  }}
                  placeholder="Password"
                />
              </div>

              <CustomButton
                variant="primary"
                size="large"
                fullWidth
                type="submit"
              >
                Login
              </CustomButton>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: Palette.text.disabled }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-white">Or continue with</span>
                </div>
              </div>

              <CustomButton
                variant="secondary"
                size="large"
                fullWidth
                onClick={handleGoogleSignIn}
                startIcon={
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                }
              >
                Sign in with Google
              </CustomButton>

              <div className="text-center" style={{ color: Palette.text.secondary }}>
                Not a member?{' '}
                <Link 
                  to="/register" 
                  className="font-medium hover:underline"
                  style={{ color: Palette.primary.main }}
                >
                  Sign up now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;