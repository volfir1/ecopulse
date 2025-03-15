import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Shield, Trash, AlertCircle } from 'lucide-react';
import DeactivateAccountModal from './deactivateModal';

export const DeleteAccountForm = ({ handleDeactivateAccount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const confirmDeactivation = () => {
    handleDeactivateAccount();
    closeModal();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Account</h2>
        <p className="text-gray-600">Permanently deactivate your account and remove your data</p>
      </div>

      {/* Warning Banner */}
      <div className="p-5 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-4">
          <div className="mt-0.5">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-red-800">Account Deletion Warning</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Deleting your account is a permanent action and cannot be undone. Please read the following information carefully before proceeding:</p>
              
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Your account will be deactivated immediately</li>
                <li>You will have a 5-hour window to recover your account via email</li>
                <li>After 5 hours, you'll need to wait 24 hours before requesting another recovery link</li>
                <li>After 30 days without recovery, your data may be permanently deleted</li>
                <li>All your active sessions will be terminated</li>
                <li>You will need to create a new account to access EcoPulse services again</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Data Protection Info */}
      <div className="p-5 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-4">
          <div className="mt-0.5">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-800">Data Protection Information</h3>
            <p className="mt-2 text-sm text-blue-700">
              In compliance with data protection regulations, we will:
            </p>
            <ul className="list-disc pl-5 mt-3 text-sm text-blue-700 space-y-1">
              <li>Maintain a secure backup of your data during the recovery period</li>
              <li>Permanently delete personal information after 30 days</li>
              <li>Retain anonymized statistical data as permitted by our Privacy Policy</li>
              <li>Provide you with a confirmation email once account deletion is complete</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delete Account Button */}
      <div className="pt-4">
        <button 
          onClick={openModal}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center space-x-2"
        >
          <Trash className="w-4 h-4" />
          <span>Delete My Account</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <DeactivateAccountModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDeactivation}
      />
    </div>
  );
};

DeleteAccountForm.propTypes = {
  handleDeactivateAccount: PropTypes.func.isRequired
};

export default DeleteAccountForm;