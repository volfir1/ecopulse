// src/components/auth/Register.jsx
import React from 'react';
import { User, Lock, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomButton from '@components/buttons/buttons';
import { p, s, t, bg } from '@shared/index';
import Loader from '@shared/components/loaders/Loader';
import ToastNotification from '@shared/components/toast-notif/ToastNotification';
import { useRegister } from './hook';

const Register = () => {
  const {
    formValues: { email, phone, password, confirmPassword },
    formHandlers: {
      handleEmailChange,
      handlePhoneChange,
      handlePasswordChange,
      handleConfirmPasswordChange,
      handleSubmit,
      handleGoogleSignUp
    },
    toast: { toastMessage, toastType }
  } = useRegister();

  return (
    <>
      <Loader />
      {toastMessage && <ToastNotification message={toastMessage} type={toastType} />}
      
      <div className="flex h-screen">
        {/* Left Side - Form */}
        <div className="w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full" 
                   style={{ border: `2px solid ${t.main}` }}>
                <User className="w-full h-full p-3" style={{ color: p.main }} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6" 
                style={{ color: t.main }}>
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-4 h-4" style={{ color: t.disabled }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="block w-full py-2 pl-9 pr-3 text-sm transition-all border rounded-lg"
                  style={{ borderColor: t.disabled }}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-4 h-4" style={{ color: t.disabled }} />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="block w-full py-2 pl-9 pr-3 text-sm transition-all border rounded-lg"
                  style={{ borderColor: t.disabled }}
                  placeholder="Phone Number"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-4 h-4" style={{ color: t.disabled }} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full py-2 pl-9 pr-3 text-sm transition-all border rounded-lg"
                  style={{ borderColor: t.disabled }}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-4 h-4" style={{ color: t.disabled }} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="block w-full py-2 pl-9 pr-3 text-sm transition-all border rounded-lg"
                  style={{ borderColor: t.disabled }}
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <CustomButton
                variant="primary"
                size="medium"
                fullWidth
                type="submit"
              >
                Create Account
              </CustomButton>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: t.disabled }}></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 text-gray-500 bg-white">Or continue with</span>
                </div>
              </div>

              <CustomButton
                variant="secondary"
                size="medium"
                fullWidth
                onClick={handleGoogleSignUp}
                startIcon={
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-4 h-4"
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
                Sign up with Google
              </CustomButton>

              <div className="text-center text-sm" style={{ color: t.secondary }}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium hover:underline"
                  style={{ color: p.main }}
                >
                  Login now
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Brand */}
        <div 
          className="w-1/2 flex items-center justify-center p-6"
          style={{ 
            background: `linear-gradient(135deg, ${p.main}, ${p.dark})`
          }}
        >
          <div className="text-center">
            <img src="/logo.png" alt="EcoPulse Logo" className="w-32 h-32 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">EcoPulse</h1>
            <p className="text-sm leading-relaxed text-white/80 max-w-md mx-auto">
              Join our community of eco-conscious individuals and businesses.
              Together, we can make a difference for a sustainable future.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;