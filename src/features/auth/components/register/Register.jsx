// Register.jsx
import React from 'react';
import { User, Lock, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Loader, useSnackbar, useLoader } from '@shared/index';
import { useRegister } from './registerHook';
import { RegisterSchema, initialValues } from './validation';
import { p, t } from '@shared/index';

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
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4">
            {/* User Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ border: `2px solid ${t.main}` }}>
                <User className="w-6 h-6" style={{ color: p.main }} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center" 
                style={{ color: t.main }}>
              Create Account
            </h2>

            {/* Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="space-y-3">
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full h-10 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  {/* Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 text-xs text-gray-500 bg-white">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign Up Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                    className="w-full h-10 flex items-center justify-center gap-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <img src="/google-icon.svg" alt="Google" className="w-4 h-4" />
                    <span className="text-sm">Sign up with Google</span>
                  </button>

                  {/* Login Link */}
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

        {/* Brand Side */}
        <div 
          className="hidden md:flex w-1/2 items-center justify-center p-6"
          style={{ 
            background: `linear-gradient(135deg, ${p.main}, ${p.dark})`
          }}
        >
          <div className="text-center">
            <img src="/logo.png" alt="Logo" className="w-32 h-32 mx-auto mb-4" />
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