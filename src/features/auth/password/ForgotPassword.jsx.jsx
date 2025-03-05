import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { p, t } from '@shared/index'; // Assumes these exports contain your color values
import crosswalk from '@assets/images/vectors/crosswalk.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      // Use the correct method from the service
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      // For security, the success message is always shown even if email isn't found
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Gradient Background */}
      <div 
        className="flex flex-col items-center justify-center flex-1 p-12 text-center"
        style={{ background: `linear-gradient(135deg, ${p.main}, ${p.dark})` }}
      >
        <img src="/logo.png" alt="EcoPulse Logo" className="w-32 h-32 mb-6" />
        <h1 className="mb-6 text-5xl font-bold text-white">EcoPulse</h1>
        <p className="text-lg leading-relaxed text-white/80 max-w-md">
          Forgot your password? No worries, we'll help you reset it.
        </p>
      </div>

      {/* Right Side - Background Image with Form Card */}
      <div 
        className="relative flex items-center justify-center w-1/2 bg-center bg-cover"
        style={{
          backgroundImage: `url(${crosswalk})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }} />
        <div className="relative z-10 w-full max-w-md p-8 mx-12 bg-white shadow-xl rounded-3xl">
          <h2 className="mb-6 text-2xl font-bold text-center" style={{ color: t.main }}>
            Reset Your Password
          </h2>
          <p className="mb-4 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {message && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>}
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <a href="/login" className="text-green-700 hover:underline">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
