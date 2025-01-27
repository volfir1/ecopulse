import React, { useState } from 'react';
import { User, Lock, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from 'shared/components/logo';

const Register = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="min-h-screen flex">
      {/* Left Side - White with Form */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md p-8 mx-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-12">Register</h1>

          {/* Registration Form */}
          <form className="space-y-6">
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

            {/* Phone Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Phone Number"
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

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Confirm Password"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Register
            </button>

            {/* Login Link */}
            <div className="text-center text-gray-600">
              Already a member?{' '}
              <Link to="/login" className="text-green-500 hover:text-green-600 font-medium">
                Login now
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Green with Logo */}
      <div className="flex-1 bg-gradient-to-br from-green-400 to-green-500 p-12 flex flex-col justify-center items-center">
        <div className="max-w-xl">
          {/* Logo */}
          <img src={logo} alt="EcoPulse Logo" className="w-48 h-48 mb-8" />
          
          {/* Brand Text */}
          <h1 className="text-5xl font-bold text-white text-center mb-8">EcoPulse</h1>
        </div>
      </div>
    </div>
  );
};

export default Register;