// components/Login.jsx
import React from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, p, t } from '@shared/index';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Loader from '@shared/components/loaders/Loader';
import { useLogin } from './loginHook';
import crosswalk from '../../../../assets/images/vectors/crosswalk.jpg';

const Login = () => {
  const {
    handleGoogleSignIn,
    handleSubmit,
    initialValues,
    validationSchema
  } = useLogin();

  return (
    <>
      <Loader />
      
      <div className="flex min-h-screen">
        {/* Left Side - Primary Color Background */}
        <div 
          className="flex flex-col items-start justify-center flex-1 p-12" 
          style={{ 
            background: `linear-gradient(135deg, ${p.main}, ${p.dark})` 
          }}
        >
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
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          />
          
          <div className="relative z-10 w-full max-w-md p-8 mx-12 bg-white shadow-xl rounded-3xl">
            <div className="flex justify-center mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center" 
                style={{ border: `2px solid ${p.main}` }}
              >
                <User 
                  className="w-8 h-8" 
                  style={{ color: p.main }} 
                />
              </div>
            </div>

            <h2 
              className="mb-6 text-2xl font-bold text-center"
              style={{ color: t.main }}
            >
              Login
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="space-y-4">
                  <div className="space-y-1">
                    <div className="relative flex items-center">
                      <Mail 
                        className="absolute left-3 w-4 h-4 text-gray-400" 
                      />
                      <Field
                        type="email"
                        name="email"
                        className={`w-full h-10 pl-9 pr-3 border rounded-lg text-sm ${
                          touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Email"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="relative flex items-center">
                      <Lock 
                        className="absolute left-3 w-4 h-4 text-gray-400" 
                      />
                      <Field
                        type="password"
                        name="password"
                        className={`w-full h-10 pl-9 pr-3 border rounded-lg text-sm ${
                          touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Password"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 text-xs text-gray-500 bg-white">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-10 flex items-center justify-center gap-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <img src="/google-icon.svg" alt="Google" className="w-4 h-4" />
                    <span>Sign in with Google</span>
                  </button>

                  <div className="text-center text-xs text-gray-600">
                    Not a member?{' '}
                    <Link 
                      to="/register" 
                      className="font-medium text-green-700 hover:underline"
                    >
                      Sign up now
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

export default Login;