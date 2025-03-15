import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MailCheck, Clock, ArrowRight, RefreshCw, Lock } from 'lucide-react';
import { Card, p, t, useSnackbar } from '@shared/index';
import authService from '@services/authService';

const AccountDeactivated = () => {
  const location = useLocation();
  const { email, lockoutHours, isLocked } = location.state || {};
  const [isRequestingRecovery, setIsRequestingRecovery] = useState(false);
  const toast = useSnackbar();
  
  const handleRequestRecovery = async () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }
    
    // Don't allow recovery requests during lockout
    if (isLocked) {
      toast.error(`Account recovery is locked for ${lockoutHours} more hours`);
      return;
    }
    
    setIsRequestingRecovery(true);
    
    try {
      const result = await authService.requestAccountRecovery(email);
      
      if (result.success) {
        toast.success(result.message || "Recovery email sent successfully");
      } else {
        toast.error(result.message || "Failed to send recovery email");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsRequestingRecovery(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Card.Base className="max-w-md w-full p-8">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="EcoPulse Logo" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2" style={{ color: t.main }}>Account Deactivated</h1>
          <p className="text-gray-600">
            Your account has been deactivated.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Email notification */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start space-x-3">
            <MailCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Recovery Email Sent</h3>
              <p className="mt-1 text-sm text-blue-700">
                A recovery link has been sent to your email address {email ? `(${email})` : ''}.
                {!isLocked && ' You have 5 hours to use this link.'}
              </p>
            </div>
          </div>
          
          {/* Lockout notification if applicable */}
          {isLocked && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start space-x-3">
              <Lock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Recovery Locked</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Your account recovery is currently locked for {lockoutHours} more hours. 
                  This happens when you don't recover your account within the 5-hour window.
                </p>
              </div>
            </div>
          )}
          
          {/* Recovery window info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start space-x-3">
            <Clock className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-800">Recovery Window</h3>
              <p className="mt-1 text-sm text-gray-700">
                {isLocked
                  ? `You'll need to wait ${lockoutHours} hours before requesting another recovery link.`
                  : 'If you don\'t recover your account within 5 hours, you\'ll need to wait 24 hours before requesting another recovery link.'}
              </p>
            </div>
          </div>
          
          {/* Recovery resend button - disabled during lockout */}
          <div className="pt-2">
            <button
              onClick={handleRequestRecovery}
              disabled={isRequestingRecovery || isLocked}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                isLocked 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700 transition-colors'
              }`}
            >
              {isRequestingRecovery ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <MailCheck className="w-5 h-5" />
                  <span>{isLocked ? 'Recovery Locked' : 'Resend Recovery Email'}</span>
                </>
              )}
            </button>
          </div>
          
          {/* Back to login */}
          <div className="pt-4">
            <Link 
              to="/login" 
              className="flex items-center justify-center space-x-1 text-green-700 hover:text-green-800 font-medium text-sm"
            >
              <span>Return to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Card.Base>
      
      <div className="mt-8 text-center text-sm text-gray-500 max-w-md">
        <p>
          If you didn't request this deactivation or need assistance, 
          please <Link to="/support" className="text-green-700 hover:underline">contact our support team</Link>.
        </p>
      </div>
    </div>
  );
};

export default AccountDeactivated;