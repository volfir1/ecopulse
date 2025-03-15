import React, { useState } from 'react';
import { Card, AppIcon, Footer, Loader } from '@shared/index';
import { useProfile } from './profileHook';
import { ProfileForm } from './profileForm';
import { SecurityForm } from './securityForm';
import { DeleteAccountForm } from './deleteAccountForm'; // We'll create this component
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const {
    formData,
    passwordData,
    isLoading,
    handleInputChange,
    handlePasswordChange,
    handleProfileSubmit,
    handlePasswordSubmit,
    handleDeactivateAccount
  } = useProfile();

  const navigation = [
    { id: 'profile', icon: 'profile', label: 'Profile' },
    { id: 'security', icon: 'security', label: 'Security' },
    { id: 'delete-account', icon: 'trash', label: 'Delete Account' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <Loader />}
      
      {/* Header */}
      <div className="py-8 px-6 bg-green-700 shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="mt-2 text-white/90 text-lg">Manage your personal information and account security</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-5xl mx-auto grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 md:col-span-3">
            <Card.Base variant="default" className="p-4">
              <div className="flex flex-col space-y-1">
                {navigation.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'
                    } ${item.id === 'delete-account' ? 'text-red-600 hover:bg-red-50' : ''}`}
                  >
                    <AppIcon name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </Card.Base>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 md:col-span-9">
            <Card.Base variant="default" className="p-6">
              {activeTab === 'profile' && (
                <ProfileForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleProfileSubmit}
                />
              )}
              {activeTab === 'security' && (
                <SecurityForm
                  passwordData={passwordData}
                  handlePasswordChange={handlePasswordChange}
                  handleSubmit={handlePasswordSubmit}
                />
              )}
              {activeTab === 'delete-account' && (
                <DeleteAccountForm 
                  handleDeactivateAccount={handleDeactivateAccount}
                />
              )}
            </Card.Base>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

ProfileForm.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default UserProfile;