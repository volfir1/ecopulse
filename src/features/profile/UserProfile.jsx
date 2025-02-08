import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  theme, 
  AppIcon,
  Footer,
  InputBox,
  TextArea
} from '@shared/index';


const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(null);
  const { primary, text } = theme.palette;
  
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'EcoPulse',
    location: 'New York, NY',
    bio: 'Passionate about sustainable urban development and green technology.',
    notifications: {
      email: true,
      push: true,
      updates: false
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const navigation = [
    { id: 'profile', icon: 'profile', label: 'Profile' },
    { id: 'security', icon: 'security', label: 'Security' },
    { id: 'notifications', icon: 'notifications', label: 'Notifications' }
  ];

  const renderProfileContent = () => (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h2>
      
      {/* Profile Image */}
      <div className="mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <AppIcon name="profile" size={40} />
                </div>
              )}
            </div>
            <label 
              className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer transition-colors"
              style={{ backgroundColor: primary.main }}
            >
              <AppIcon name="camera" size={16} color="white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-500">
              Upload a new profile photo
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'firstName', label: 'First Name', type: 'text', icon: 'profile' },
            { name: 'lastName', label: 'Last Name', type: 'text', icon: 'profile' },
            { name: 'email', label: 'Email Address', type: 'email', icon: 'email' },
            { name: 'phone', label: 'Phone Number', type: 'tel', icon: 'phone' },
            { name: 'company', label: 'Company', type: 'text', icon: 'modules' },
            { name: 'location', label: 'Location', type: 'text', icon: 'location', iconType: 'tool' }
          ].map(field => (
            <InputBox
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={handleInputChange}
              required
            />
          ))}
        </div>

        <div>
          <TextArea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            icon="document"
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="medium"
            className="inline-flex items-center gap-2"
          >
            <AppIcon name="save" size={20} />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );

  const renderSecurityContent = () => (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Security Settings</h2>
      
      {/* Password Change Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <AppIcon name="password" className="text-primary-600" size={24} style={{ color: primary.main }} />
          <h3 className="text-lg font-medium">Password</h3>
        </div>
        <form className="space-y-4">
          {[
            { label: 'Current Password', icon: 'password' },
            { label: 'New Password', icon: 'password' },
            { label: 'Confirm New Password', icon: 'password' }
          ].map(field => (
            <InputBox
              key={field.label}
              type="password"
              label={field.label}
              icon={field.icon}
              showPasswordToggle
              required
            />
          ))}
          <Button
            variant="primary"
            size="medium"
            className="mt-4"
          >
            Update Password
          </Button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <AppIcon name="phone" className="text-primary-600" size={24} style={{ color: primary.main }} />
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
        <Button
          variant="primary"
          size="medium"
        >
          Enable 2FA
        </Button>
      </div>

      {/* Login Activity */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <AppIcon name="activity" className="text-primary-600" size={24} style={{ color: primary.main }} />
          <h3 className="text-lg font-medium">Login Activity</h3>
        </div>
        <div className="space-y-4">
          {[
            { location: 'New York, USA', date: 'Jan 23, 2024', status: 'Current' },
            { location: 'London, UK', date: 'Jan 20, 2024', status: 'Previous' }
          ].map((activity, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <AppIcon name="location" type="tool" className="text-gray-400" />
                <div>
                  <p className="font-medium">{activity.location}</p>
                  <p className="text-sm text-gray-500">Last accessed {activity.date}</p>
                </div>
              </div>
              {activity.status === 'Current' ? (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  style={{ 
                    backgroundColor: `${primary.main}20`,
                    color: primary.main 
                  }}
                >
                  Current
                </span>
              ) : (
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsContent = () => (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        {[
          {
            title: 'Email Notifications',
            description: 'Receive email updates about your account',
            key: 'email',
            icon: 'email'
          },
          {
            title: 'Push Notifications',
            description: 'Receive push notifications on your device',
            key: 'push',
            icon: 'notifications'
          },
          {
            title: 'Product Updates',
            description: 'Receive updates about product news and features',
            key: 'updates',
            icon: 'modules'
          }
        ].map(setting => (
          <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AppIcon name={setting.icon} className="text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">{setting.title}</h3>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications[setting.key]}
                onChange={() => handleNotificationChange(setting.key)}
                className="sr-only peer"
              />
              <div 
                className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                style={{
                  '--tw-ring-color': `${primary.main}40`,
                  '--tw-ring-opacity': 0.2,
                  backgroundColor: formData.notifications[setting.key] ? primary.main : undefined
                }}
              ></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ backgroundColor: primary.main }} className="py-6 px-4">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="mt-2 text-white/80">Manage your profile and preferences</p>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 md:col-span-3">
            <Card variant="default" className="p-4">
              <div className="flex flex-col space-y-1">
                {navigation.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    style={{
                      backgroundColor: activeTab === item.id ? `${primary.main}10` : undefined,
                      color: activeTab === item.id ? primary.main : text.secondary
                    }}
                  >
                    <AppIcon name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 md:col-span-9">
            <Card variant="default" className="p-6">
              {activeTab === 'profile' && renderProfileContent()}
              {activeTab === 'security' && renderSecurityContent()}
              {activeTab === 'notifications' && renderNotificationsContent()}
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default UserProfileSettings;