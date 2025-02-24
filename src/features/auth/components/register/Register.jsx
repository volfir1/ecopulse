// Register.jsx
import React from 'react';
import { User, Lock, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Loader, useSnackbar, useLoader } from '@shared/index';
import { useRegister } from './registerHook';
import { RegisterSchema, initialValues } from './validation';
import { p, t } from '@shared/index';
import crosswalk from '../../../../assets/images/vectors/crosswalk.jpg';

const Register = () => {
  const {
    formHandlers: {
      handleSubmit,
      handleGoogleSignUp
    }
  } = useRegister();
  
  const { isLoading } = useLoader();

  return (
    <>
      <Loader />
      
      <div className="flex min-h-screen">
        {/* Left Side - Primary Color Background */}
        <div 
          className="flex flex-col items-center justify-center flex-1 p-12 text-center" 
          style={{ 
            background: `linear-gradient(135deg, ${p.main}, ${p.dark})` 
          }}
        >
          <img src="/logo.png" alt="EcoPulse Logo" className="w-32 h-32 mb-6" />
          <h1 className="mb-6 text-5xl font-bold text-white">EcoPulse</h1>
          <p className="text-lg leading-relaxed text-white/80 max-w-md">
            Join our community of eco-conscious individuals and businesses.
            Together, we can make a difference for a sustainable future.
          </p>
        </div>

        {/* Right Side - Form with Background Image */}
        <div 
          className="relative flex items-center justify-center w-1/2 bg-center bg-cover"
          style={{
            backgroundImage: `url(${crosswalk})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          />
          
          <div className="relative z-10 w-full max-w-md p-8 mx-12 bg-white shadow-xl rounded-3xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                   style={{ border: `2px solid ${t.main}` }}>
                <User className="w-8 h-8" style={{ color: p.main }} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6" 
                style={{ color: t.main }}>
              Create Account
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={`w-full h-10 pl-9 pr-3 border rounded-lg text-sm ${
                          touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    <ErrorMessage 
                      name="email"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3 w-4 h-4 text-gray-400" />
                      <Field
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className={`w-full h-10 pl-9 pr-3 border rounded-lg text-sm ${
                          touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    <ErrorMessage 
                      name="phone"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={`w-full h-10 pl-9 pr-3 border rounded-lg text-sm ${
                          touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    <ErrorMessage 
                      name="password"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className={`w-full h-10 pl-9 pr-3 border rounded-lg text-sm ${
                          touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    <ErrorMessage 
                      name="confirmPassword"
                      component="div"
                      className="text-xs text-red-500 mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full h-10 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 text-xs text-gray-500 bg-white">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                    className="w-full h-10 flex items-center justify-center gap-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <img src="/public/google.svg" alt="Google" className="w-4 h-4" />
                    <span>Sign up with Google</span>
                  </button>

                  <div className="text-center text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="font-medium text-green-700 hover:underline"
                    >
                      Login now
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;