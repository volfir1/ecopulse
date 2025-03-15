import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Lock, AlertTriangle, X } from 'lucide-react';

const DeactivateAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [countdown, setCountdown] = useState(5);
  const [confirmText, setConfirmText] = useState('');
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const modalRef = useRef(null);

  // Handle countdown
  useEffect(() => {
    if (!isOpen) return;
    
    // Reset countdown and confirmation state when modal opens
    setCountdown(5);
    setConfirmText('');
    setIsConfirmEnabled(false);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen]);

  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Check confirmation text
  const handleConfirmTextChange = (e) => {
    const text = e.target.value;
    setConfirmText(text);
    setIsConfirmEnabled(text.toLowerCase() === 'deactivate');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Deactivate Account</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Warning: This action cannot be easily undone</h3>
              <p className="mt-1 text-sm text-red-700">
                Deactivating your account will remove your access to the platform. You will have a 5-hour window to recover your account, after which you'll need to wait 24 hours before attempting recovery again.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">What happens when you deactivate your account:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Your profile will be hidden from other users</li>
              <li>You will be logged out immediately</li>
              <li>All your active sessions will be terminated</li>
              <li>A recovery link will be sent to your email</li>
              <li>Your data will be kept for 30 days before permanent deletion</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              To confirm, type "deactivate" below:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={handleConfirmTextChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Type 'deactivate' to confirm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-b-lg">
          <span className="text-sm text-gray-500">
            {countdown > 0 ? `Please wait ${countdown} seconds...` : 'You can now confirm'}
          </span>
          
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onConfirm}
              disabled={!isConfirmEnabled || countdown > 0}
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeactivateAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default DeactivateAccountModal;