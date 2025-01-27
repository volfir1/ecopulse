import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from 'shared/components/logo';
import crosswalk from '../../../../assets/images/vectors/crosswalk.jpg'
import Loader from 'shared/components/loaders/Loader';
import { useLoader } from 'shared/components/loaders/useLoader';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {startLoading, stopLoading} = useLoader()
  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    startLoading()

    try{
      // API call here
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // Logic here
      navigate('/dashboard')
    }catch(error){
      console.error('Login failed:', error)
    }finally{
      stopLoading()
    }
  }

  return (
    <>
    <Loader />
    <div className="min-h-screen flex">
      {/* Left Side - Green Background */}
      <div className="flex-1 bg-gradient-to-br from-green-400 to-green-500 p-12 flex flex-col justify-center items-start">
        {/* Logo and Content Container */}
        <div className="max-w-xl">
          {/* Logo */}
          <img src={logo} alt="EcoPulse Logo" className="w-32 h-32 mb-6" />
          
          {/* Brand Text */}
          <h1 className="text-5xl font-bold text-white mb-8">EcoPulse</h1>
          
          {/* Description */}
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div 
        className="w-1/2 flex items-center justify-center relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${crosswalk})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay to ensure form visibility */}
        <div className="absolute inset-0 bg-white/90"></div>
        
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 mx-12 relative z-10">
          {/* User Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-olive-600">
              <User className="w-full h-full p-4 text-olive-600" />
            </div>
          </div>

          {/* Login Text */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Email"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Login
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-gray-600">
              Not a member?{' '}
              <Link to="/register" className="text-green-500 hover:text-green-600 font-medium">
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