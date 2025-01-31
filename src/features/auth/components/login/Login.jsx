import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@shared/components/logo';
import crosswalk from '../../../../assets/images/vectors/crosswalk.jpg';
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
      // Show success toast
      setToastMessage('Successfully Logged In!');
      setToastType('success');

      // Simulated API call (Replace with actual API request)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Redirect to dashboard after login
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

  return (
    <>
      <Loader />
      {/* Make sure ToastNotification is called here */}
      {toastMessage && <ToastNotification message={toastMessage} type={toastType} />}
      
      <div className="flex min-h-screen">
        {/* Left Side - Green Background */}
        <div className="flex flex-col items-start justify-center flex-1 p-12 bg-gradient-to-br from-green-400 to-green-500">
          <div className="max-w-xl">
            <img src={logo} alt="EcoPulse Logo" className="w-32 h-32 mb-6" />
            <h1 className="mb-8 text-5xl font-bold text-white">EcoPulse</h1>
            <p className="max-w-md text-lg leading-relaxed text-white/80">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
          <div className="absolute inset-0 bg-white/90"></div>
          <div className="relative z-10 w-full max-w-md p-8 mx-12 bg-white shadow-xl rounded-3xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 border-2 rounded-full border-olive-600">
                <User className="w-full h-full p-4 text-olive-600" />
              </div>
            </div>

            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full py-3 pl-10 pr-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Email"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full py-3 pl-10 pr-3 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
              >
                Login
              </button>

              <div className="text-center text-gray-600">
                Not a member?{' '}
                <Link to="/register" className="font-medium text-green-500 hover:text-green-600">
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
