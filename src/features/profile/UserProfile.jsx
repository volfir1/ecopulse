import React, { useState, useRef, useEffect } from 'react';
import { Card, AppIcon, Loader, useSnackbar } from '@shared/index';
import { useProfile } from './profileHook';
import {
  Box,
  Grid,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  alpha,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Camera, Upload, Check } from 'lucide-react';
import userService from '@services/userService';

// Default avatar options
const defaultAvatars = [
  { id: 'avatar-1', src: '/avatars/1.svg', alt: 'Avatar 1' },
  { id: 'avatar-2', src: '/avatars/2.svg', alt: 'Avatar 2' },
  { id: 'avatar-3', src: '/avatars/3.svg', alt: 'Avatar 3' },
  { id: 'avatar-4', src: '/avatars/4.svg', alt: 'Avatar 4' },
  { id: 'avatar-5', src: '/avatars/5.svg', alt: 'Avatar 5' },
  { id: 'avatar-6', src: '/avatars/6.svg', alt: 'Avatar 6' },
  { id: 'default-avatar', src: '/avatars/7.svg', alt: 'Default Avatar' },
];

// Gender options
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "transgender", label: "Transgender" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const UserProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const toast = useSnackbar();

  const {
    user,
    formData,
    passwordData,
    isLoading,
    handleInputChange,
    handlePasswordChange,
    handlePasswordSubmit,
    originalHandleProfileSubmit,
    isGoogleAccount,
    uploadDefaultAvatar,
    uploadAvatar,
    userAvatar
  } = useProfile();

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(userAvatar || '/avatars/default-avatar.svg');

  useEffect(() => {
    if (user && user.avatar) {
      // Add cache buster to prevent showing cached old images
      const cacheBuster = `?t=${Date.now()}`;

      // Check if it's one of our default avatars by ID
      const defaultAvatar = defaultAvatars.find(a => a.id === user.avatar);

      if (defaultAvatar) {
        // For default avatars, just use the src
        setCurrentAvatar(defaultAvatar.src);
        setSelectedAvatar(defaultAvatar.id);
      } else {
        // For custom/Cloudinary URLs, add cache buster
        setCurrentAvatar(`${user.avatar}${cacheBuster}`);
        setIsCustomAvatar(true);
      }
    }
  }, [user]);

  const navigation = [
    { id: 'profile', icon: 'profile', label: 'Profile' },
    { id: 'security', icon: 'security', label: 'Security' },
  ];

  // Handle avatar selection
  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
    setIsCustomAvatar(false);

    // Find the selected avatar's source
    const selected = defaultAvatars.find(avatar => avatar.id === avatarId);
    if (selected) {
      setCurrentAvatar(selected.src);

      // Update formData with selected avatar - store the ID for default avatars
      handleInputChange({
        target: {
          name: 'avatar',
          value: avatarId
        }
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (selectedAvatar && !isCustomAvatar) {
      // This is a default avatar selection, upload it first
      try {
        // Find the selected avatar
        const selected = defaultAvatars.find(avatar => avatar.id === selectedAvatar);

        if (selected) {
          // Upload the default avatar
          const avatarUrl = await uploadDefaultAvatar(selectedAvatar, selected.src);

          // Update formData with Cloudinary URL
          handleInputChange({
            target: {
              name: 'avatar',
              value: avatarUrl
            }
          });

          // Update displayed avatar (with cache busting)
          const cacheBuster = `?t=${Date.now()}`;
          setCurrentAvatar(`${avatarUrl}${cacheBuster}`);
        }
      } catch (error) {
        toast.error("Error uploading avatar: " + (error.message || "Unknown error"));
        return; // Stop submission on error
      }
    }

    // Now proceed with normal profile update
    await originalHandleProfileSubmit(e);
  };

  // Handle custom avatar upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const avatarUrl = await uploadAvatar(file, (progress) => {
        setUploadProgress(progress);
      });

      setIsCustomAvatar(true);
      setSelectedAvatar(null); // Deselect any default avatar

      // Force cache-busting by adding a timestamp
      const cacheBuster = `?t=${Date.now()}`;
      const urlWithCacheBuster = `${avatarUrl}${cacheBuster}`;

      setCurrentAvatar(urlWithCacheBuster);

      // Update formData with the new avatar URL (without cache buster)
      handleInputChange({
        target: {
          name: 'avatar',
          value: avatarUrl
        }
      });

      // Immediately save the profile to ensure the avatar is persisted
      try {
        const updateResponse = await userService.updateProfile(user.id, {
          ...formData,
          avatar: avatarUrl
        });

        if (updateResponse.success) {
          console.log("Profile updated with new avatar");
        }
      } catch (updateError) {
        console.error("Error saving avatar to profile:", updateError);
      }

      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <Loader />}

      {/* Header */}
      <Box
        sx={{
          py: { xs: 4, md: 5 },
          px: 3,
          background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'white',
              mb: 1
            }}
          >
            My Profile
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 400
            }}
          >
            Manage your personal information and account security
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 3, md: 5 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Grid container spacing={3}>
          {/* Sidebar Navigation */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 16,
                overflow: 'hidden'
              }}
            >
              {/* Profile Card */}
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'white'
                }}
              >
                <Avatar
                  src={currentAvatar}
                  alt={formData.firstName}
                  key={`sidebar-avatar-${currentAvatar}`}
                  sx={{
                    width: 90,
                    height: 90,
                    mb: 2,
                    border: '3px solid white',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    textAlign: 'center'
                  }}
                >
                  {formData.firstName} {formData.lastName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: 'center'
                  }}
                >
                  {formData.email}
                </Typography>

                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 6,
                    bgcolor: 'primary.50',
                    color: 'primary.700',
                    textTransform: 'capitalize',
                    fontSize: 13,
                    fontWeight: 500
                  }}
                >
                  {formData.role || 'User'}
                </Box>
              </Box>

              <Divider />

              {/* Navigation */}
              <Box
                sx={{
                  p: 2,
                  display: isMobile ? 'flex' : 'block',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                {navigation.map(item => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "contained" : "text"}
                    color={activeTab === item.id ? "primary" : "inherit"}
                    onClick={() => setActiveTab(item.id)}
                    fullWidth={!isMobile}
                    startIcon={<AppIcon name={item.icon} />}
                    sx={{
                      py: 1.5,
                      justifyContent: 'flex-start',
                      mb: isMobile ? 0 : 1,
                      borderRadius: 1.5,
                      textAlign: 'left'
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={9}>
            {activeTab === 'profile' && (
              <Box>
                {/* Avatar Selection */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    mb: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    Profile Picture
                  </Typography>

                  <Grid container spacing={3}>
                    {/* Current Avatar */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: { xs: 3, sm: 0 }
                      }}>
                        <Avatar
                          src={currentAvatar}
                          alt={formData.firstName}
                          key={`profile-avatar-${currentAvatar}`}
                          sx={{
                            width: 120,
                            height: 120,
                            border: '3px solid white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            mb: 3
                          }}
                        />

                        <Button
                          variant="outlined"
                          startIcon={<Upload size={16} />}
                          onClick={handleUploadClick}
                          color="primary"
                          sx={{ borderRadius: 2 }}
                        >
                          Upload New Photo
                        </Button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          accept="image/jpeg, image/png, image/gif"
                          onChange={handleFileChange}
                        />

                        {/* Upload Progress */}
                        {isUploading && (
                          <Box sx={{ mt: 2, width: '100%', maxWidth: 200 }}>
                            <Box sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              overflow: 'hidden'
                            }}>
                              <Box
                                sx={{
                                  height: '100%',
                                  borderRadius: 3,
                                  width: `${uploadProgress}%`,
                                  bgcolor: 'primary.main',
                                  transition: 'width 0.3s ease-in-out'
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                              Uploading... {uploadProgress}%
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Default Avatar Selection */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Select Default Avatar
                      </Typography>

                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                        gap: 1.5
                      }}>
                        {defaultAvatars.map(avatar => (
                          <Box
                            key={avatar.id}
                            onClick={() => handleAvatarSelect(avatar.id)}
                            sx={{
                              p: 1,
                              border: '2px solid',
                              borderColor: selectedAvatar === avatar.id ? 'primary.main' : alpha('#000', 0.06),
                              borderRadius: 2,
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: alpha(theme.palette.primary.main, 0.5),
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                              }
                            }}
                          >
                            <Avatar
                              src={avatar.src}
                              alt={avatar.alt}
                              sx={{
                                width: '100%',
                                height: 'auto',
                                aspectRatio: '1/1'
                              }}
                            />
                            {selectedAvatar === avatar.id && (
                              <Box sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                bgcolor: 'primary.main',
                                borderRadius: '50%',
                                width: 22,
                                height: 22,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Check size={14} color="white" />
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Profile Information */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    Personal Information
                  </Typography>

                  <form onSubmit={handleProfileSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1.5 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1.5 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                          disabled // Add this line
                          InputProps={{
                            sx: {
                              borderRadius: 1.5,
                              bgcolor: 'action.disabledBackground', // Add this for better visual feedback
                              '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: 'text.secondary', // Improves readability of disabled text
                              }
                            }
                          }}
                          helperText="Email cannot be changed" // Optional: Add this for user feedback
                        />
                      </Grid>
                    
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="gender-label">Gender</InputLabel>
                          <Select
                            labelId="gender-label"
                            id="gender"
                            name="gender"
                            value={formData.gender || 'prefer-not-to-say'}
                            label="Gender"
                            onChange={handleInputChange}
                            sx={{ borderRadius: 1.5 }}
                          >
                            {genderOptions.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 2
                        }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                              borderRadius: 2,
                              px: 4
                            }}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Box>
            )}

            {activeTab === 'security' && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  Security Settings
                </Typography>

                {isGoogleAccount ? (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      mb: 3,
                      bgcolor: 'info.50',
                      borderLeft: '4px solid',
                      borderColor: 'info.main'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Box sx={{
                        mr: 2,
                        color: 'info.main',
                        display: 'flex'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </Box>
                      <Typography sx={{ color: 'info.dark' }}>
                        You signed in with Google. To change your password, please visit your Google account settings.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <form onSubmit={handlePasswordSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1.5 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          helperText="Must be at least 8 characters long"
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1.5 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                          helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? "Passwords don't match" : ""}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1.5 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 2
                        }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                              borderRadius: 2,
                              px: 4
                            }}
                          >
                            Update Password
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default UserProfile;