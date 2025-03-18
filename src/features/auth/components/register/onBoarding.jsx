// src/features/auth/onboarding/Onboarding.jsx
import React, { useState, useEffect } from 'react';
import { User, ArrowRight, CheckCircle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar, useLoader, p, t } from '@shared/index';
import { useAuth } from '@context/AuthContext';

// Default avatar options
const defaultAvatars = [
    { id: 'avatar-1', src: '/avatars/1.svg', alt: 'Avatar 1' },
    { id: 'avatar-2', src: '/avatars/2.svg', alt: 'Avatar 2' },
    { id: 'avatar-3', src: '/avatars/3.svg', alt: 'Avatar 3' },
    { id: 'avatar-4', src: '/avatars/4.svg', alt: 'Avatar 4' },
    { id: 'avatar-5', src: '/avatars/5.svg', alt: 'Avatar 5' },
    { id: 'avatar-6', src: '/avatars/6.svg', alt: 'Avatar 6' },
    { id: 'default-avatar', src: ' /avatars/7.svg', alt: 'Default Avatar' },
];

// Gender options from your User model
const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "transgender", label: "Transgender" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const Onboarding = () => {
    const navigate = useNavigate();
    const toast = useSnackbar();
    const { startLoading, stopLoading, isLoading } = useLoader();
    const { user, setUser } = useAuth();

    // State for selected options
    const [selectedGender, setSelectedGender] = useState('prefer-not-to-say');
    const [selectedAvatar, setSelectedAvatar] = useState('default-avatar');
    const [isCustomAvatar, setIsCustomAvatar] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [customAvatarUrl, setCustomAvatarUrl] = useState('');
    const fileInputRef = React.useRef(null);

    // Load any existing user data

    useEffect(() => {
        // Check if we have valid authentication
        const authToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (!authToken || !userData) {
            console.error('Missing authentication in onboarding');
            toast.error('Authentication error. Please try logging in again.');
            navigate('/login');
            return;
        }

        // Log the current auth state to help with debugging
        console.log('Onboarding auth check:', {
            hasToken: !!authToken,
            hasUser: !!userData,
            userId: user?.id || JSON.parse(userData)?.id
        });
    }, []);

    useEffect(() => {
        if (user) {
            if (user.gender) setSelectedGender(user.gender);
            if (user.avatar) {
                // Check if this is a Cloudinary URL
                if (user.avatar.includes('cloudinary.com')) {
                    setIsCustomAvatar(true);
                    setCustomAvatarUrl(user.avatar);
                } else {
                    setSelectedAvatar(user.avatar);
                }
            }
        }
    }, [user]);

    // Handle clicking the upload button
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const fetchSvgAsBase64 = async (svgUrl) => {
        try {
            const response = await fetch(svgUrl);
            const svgText = await response.text();
            return `data:image/svg+xml;base64,${btoa(svgText)}`;
        } catch (error) {
            console.error('Error converting SVG to base64:', error);
            throw error;
        }
    };

    const uploadDefaultAvatarToCloudinary = async (avatarId) => {
        try {
            // Find the selected avatar from your default avatars array
            const selectedAvatarObj = defaultAvatars.find(avatar => avatar.id === avatarId);

            if (!selectedAvatarObj) {
                throw new Error('Selected avatar not found');
            }

            // Get the avatar path - ensure it's a full URL
            let avatarSrc = selectedAvatarObj.src;

            // If it's a relative path, make it absolute using the current window location
            if (avatarSrc.startsWith('/')) {
                // Get the base URL (protocol + hostname + port)
                const baseUrl = window.location.origin;
                avatarSrc = `${baseUrl}${avatarSrc}`;
            }

            console.log('Fetching SVG from:', avatarSrc);

            // Fetch the SVG content
            const response = await fetch(avatarSrc);
            if (!response.ok) {
                throw new Error(`Failed to fetch SVG: ${response.status}`);
            }

            // Get SVG content as text
            const svgContent = await response.text();

            // Convert to base64
            const base64Data = `data:image/svg+xml;base64,${btoa(svgContent)}`;

            // Create a unique identifier using the user ID and timestamp
            const userId = user?.id || JSON.parse(localStorage.getItem('user'))?.id;
            const uniqueId = `${userId}_${Date.now()}`;

            // Create a request to your backend to upload this default avatar to Cloudinary
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const uploadResponse = await fetch(`${API_URL}/uploads/avatar/base64`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    base64Image: base64Data,
                    avatarId: avatarId,
                    uniqueId: uniqueId
                })
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.message || `Server error: ${uploadResponse.status}`);
            }

            const data = await uploadResponse.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to upload default avatar');
            }

            return data.avatar; // Return the Cloudinary URL
        } catch (error) {
            console.error('Error uploading default avatar:', error);
            throw error;
        }
    };
    // Handle file selection
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
            // Create form data for the upload
            const formData = new FormData();
            formData.append('avatar', file);

            // Increase progress to show activity
            setUploadProgress(30);

            // Upload to our backend which will handle Cloudinary
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await fetch(`${API_URL}/uploads/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            setUploadProgress(70);

            // Check if response is OK
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to upload image');
            }

            console.log('Avatar upload response:', data);

            // Make sure we have an avatar URL
            if (!data.avatar) {
                throw new Error('No avatar URL returned from server');
            }

            // Update state with the new avatar URL
            setCustomAvatarUrl(data.avatar);
            setIsCustomAvatar(true);
            setUploadProgress(100);

            toast.success('Avatar uploaded successfully!');

            // Also update user in context if available
            if (setUser && user) {
                setUser({
                    ...user,
                    avatar: data.avatar
                });
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error(error.message || 'Failed to upload avatar');
        } finally {
            setIsUploading(false);
            // Reset the file input for future uploads
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };


    const handleComplete = async () => {
        startLoading();

        try {
            let avatarValue;

            if (isCustomAvatar && customAvatarUrl) {
                // Custom uploaded avatar - already a Cloudinary URL
                avatarValue = customAvatarUrl;
            } else {
                // Default avatar - upload it to Cloudinary first
                try {
                    toast.info('Processing avatar...', { autoClose: 2000 });
                    avatarValue = await uploadDefaultAvatarToCloudinary(selectedAvatar);
                } catch (avatarError) {
                    console.error('Failed to upload default avatar:', avatarError);
                    // Fallback to the original selected avatar ID
                    avatarValue = selectedAvatar;
                    toast.warning('Using default avatar due to upload issue', { autoClose: 2000 });
                }
            }

            console.log('Final avatar being saved:', avatarValue);

            // Call your API to update user profile with onboarding data
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await fetch(`${API_URL}/users/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    gender: selectedGender,
                    avatar: avatarValue,
                    hasCompletedOnboarding: true
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            const data = await response.json();

            // Update the user in context and localStorage
            if (setUser && user) {
                const updatedUser = {
                    ...user,
                    gender: selectedGender,
                    avatar: avatarValue,
                    hasCompletedOnboarding: true
                };

                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            toast.success('Profile updated successfully!');

            // Redirect to dashboard after a brief delay
            setTimeout(() => {
                navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
            }, 800);
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.message || 'Failed to update profile. Please try again.');
        } finally {
            stopLoading();
        }
    };

    // Handle skip
    const handleSkip = () => {
        toast.info('You can update your profile later in the settings.');
        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center"
                            style={{ border: `2px solid ${p.main}` }}>
                            <User className="w-10 h-10" style={{ color: p.main }} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-2" style={{ color: t.main }}>
                        Complete Your Profile
                    </h1>
                    <p className="text-gray-600 text-lg max-w-lg mx-auto">
                        Personalize your EcoPulse experience by setting up your profile. This helps us provide a more tailored experience.
                    </p>
                </div>

                {/* Gender Selection */}
                <div className="mb-8">
                    <h2 className="font-semibold text-xl mb-4" style={{ color: t.main }}>
                        Choose Your Gender
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {genderOptions.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                className={`py-4 px-3 rounded-xl border-2 transition-all ${selectedGender === option.value
                                        ? 'border-green-600 bg-green-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedGender(option.value)}
                            >
                                <div className="flex items-center">
                                    {selectedGender === option.value && (
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                    )}
                                    <span className={`${selectedGender === option.value ? 'font-medium' : ''}`}>
                                        {option.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Avatar Selection */}
                <div className="mb-10">
                    <h2 className="font-semibold text-xl mb-4" style={{ color: t.main }}>
                        Choose Your Avatar
                    </h2>

                    {/* Default Avatar Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        {defaultAvatars.map(avatar => (
                            <button
                                key={avatar.id}
                                type="button"
                                className={`p-3 rounded-xl border-2 transition-all ${!isCustomAvatar && selectedAvatar === avatar.id
                                        ? 'border-green-600 bg-green-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => {
                                    setSelectedAvatar(avatar.id);
                                    setIsCustomAvatar(false);
                                }}
                            >
                                <img
                                    src={avatar.src}
                                    alt={avatar.alt}
                                    className="w-full h-auto rounded-lg"
                                />
                            </button>
                        ))}

                        {/* Custom Avatar Upload Button */}
                        <button
                            type="button"
                            className={`p-3 rounded-xl border-2 transition-all ${isCustomAvatar
                                    ? 'border-green-600 bg-green-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            onClick={handleUploadClick}
                        >
                            {isCustomAvatar && customAvatarUrl ? (
                                <img
                                    src={customAvatarUrl}
                                    alt="Custom Avatar"
                                    className="w-full h-auto aspect-square object-cover rounded-lg"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full aspect-square bg-gray-100 rounded-lg">
                                    <Camera className="w-8 h-8 mb-2 text-gray-400" />
                                    <span className="text-xs text-gray-500">Upload</span>
                                </div>
                            )}
                        </button>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/jpeg, image/png, image/gif"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 text-center mt-2">
                                Uploading... {uploadProgress}%
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mt-4 text-center">
                        You can change your avatar anytime from your profile settings.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={isLoading || isUploading}
                        className="w-full py-3 flex items-center justify-center bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: p.main, borderColor: p.main }}
                    >
                        {isLoading ? (
                            'Saving...'
                        ) : (
                            <>
                                <span className="text-lg">Complete & Continue</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleSkip}
                        disabled={isLoading || isUploading}
                        className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;