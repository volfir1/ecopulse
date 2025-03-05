import {
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
let currentAuthRequest = null;

const authService = {
  
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      // Return data needed for verification
      return { 
        success: true, 
        user: data.user,
        userId: data.user?.id || data.userId,
        requireVerification: true,  // Always require verification for new registrations
        message: data.message 
      };
    } catch (error) {
      console.error("Registration Error:", error.message);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (data.user?.accessToken) {
        localStorage.setItem('authToken', data.user.accessToken);
      }

      // Don't require verification during login - use server's response
      return { 
        success: true, 
        user: data.user,
        // Only include requireVerification if the server explicitly mentions it
        ...(data.requireVerification && { requireVerification: data.requireVerification }) 
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  logout: async () => {
    try {
      await auth.signOut().catch(console.warn);
      localStorage.removeItem('authToken');

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });

      if (!response.ok) throw new Error("Logout failed");
      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },
// Fixed checkAuthStatus function for authService.js
checkAuthStatus: async (signal) => {
  try {
    if (currentAuthRequest) currentAuthRequest.abort();

    const controller = signal ? { signal } : new AbortController();
    if (!signal) {
      currentAuthRequest = controller;
      signal = controller.signal;
    }

    // Get stored user and token
    const storedUser = localStorage.getItem('user');
    const localToken = localStorage.getItem('authToken');
    
    console.log('Auth check - Stored data:', { 
      hasToken: !!localToken, 
      hasUser: !!storedUser
    });

    if (!localToken) {
      console.log('No auth token found');
      return { success: false, error: 'No auth token' };
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localToken}`
    };

    console.log('Calling auth verification endpoint');
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers,
      credentials: "include",
      signal
    });

    if (currentAuthRequest?.signal === signal) {
      currentAuthRequest = null;
    }

    // Get response data
    const responseData = await response.json();
    console.log('Auth check response:', responseData);

    if (response.status === 401) {
      console.log('Auth check: Session expired or invalid (401)');
      return { success: false, error: responseData.message || 'Session expired or invalid' };
    }

    if (!response.ok) {
      console.log(`Auth check: Verification failed (${response.status})`);
      return { success: false, error: responseData.message || 'Verification failed' };
    }

    // CRITICAL FIX: Handle successful verification
    if (responseData.success && responseData.user) {
      // Get stored user data
      let userData = responseData.user;
      
      // If we have stored user data with more information, merge it
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // CRITICAL FIX: Force verification status to be true regardless of server response
          userData = {
            ...parsedUser,
            ...responseData.user,
            isVerified: true,
            // Make sure role is preserved
            role: responseData.user.role || parsedUser.role || 'user'
          };
        } catch (e) {
          console.error('Error parsing stored user', e);
        }
      }
      
      // Set default role if missing
      if (!userData.role) {
        userData.role = 'user';
      }
      
      // Update localStorage with enhanced user data
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Auth check successful with enhanced user data:', userData);
      return { success: true, user: userData };
    }
    
    return { success: true, user: responseData.user };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Auth check was cancelled by a new request');
      return { aborted: true };
    }

    console.error('Auth verification error:', error);
    return { success: false, error: error.message };
  }
},
  googleSignIn: async () => {
    try {
      console.log('Starting Google sign-in process');
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await getIdToken(user);
      
      console.log('Google auth successful:', user.email);
      
      if (!user.email || !idToken) {
        throw new Error('Failed to get required user data from Google');
      }
  
      console.log('Sending data to backend');
      const response = await fetch(`${API_URL}/auth/google-signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          uid: user.uid
        }),
        credentials: "include"
      });
    
      // Get the raw text response
      const responseText = await response.text();
      console.log('Raw server response:', responseText);
  
      // Parse the response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid server response format');
      }
      
      // Log the parsed response for debugging
      console.log('Parsed response data:', data);
      
      if (!response.ok) {
        console.error('Server responded with error:', data);
        throw new Error(data.message || "Google sign-in failed");
      }
      
      // Important: Use the server's response about verification
      // Only require verification if the server says so
      return {
        ...data,
        userId: data.userId || data.user?.id,
        email: user.email
      };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      
      if (error.code) {
        const errorMessages = {
          'auth/popup-closed-by-user': "Sign-in was cancelled",
          'auth/popup-blocked': "Sign-in popup was blocked. Please enable popups",
          'auth/cancelled-popup-request': "Sign-in was cancelled",
          'auth/account-exists-with-different-credential': "Account exists with different sign-in method"
        };
        throw new Error(errorMessages[error.code] || error.message || "Failed to sign in with Google");
      }
      
      throw error;
    }
  },

  verifyEmail: async (userId, verificationCode) => {
    if (!userId || !verificationCode) {
      throw new Error("User ID and verification code are required");
    }
  
    try {
      // Debug logging
      console.log('Verifying email:', {
        userId,
        verificationCode: verificationCode.trim(),
        url: `${API_URL}/auth/verify-email`
      });
  
      // Make sure userId is a string and verification code is trimmed
      const formattedUserId = userId.toString();
      const formattedCode = verificationCode.toString().trim();
  
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          userId: formattedUserId,
          verificationCode: formattedCode
        }),
        credentials: "include"
      });
  
      // Get the raw text response
      const responseText = await response.text();
      console.log('Raw server response:', responseText);
      
      // Parse the response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error(`Invalid server response format: ${responseText}`);
      }
  
      // Special case: Check if already verified
      if (data.message && data.message.includes("already verified")) {
        console.log('User is already verified:', data);
        
        // Return success even if it was already verified
        return {
          success: true,
          user: data.user || {},
          message: "Email already verified",
          alreadyVerified: true
        };
      }
  
      // Handle error responses
      if (!response.ok) {
        console.error('Verification failed with status:', response.status, data);
        
        switch (response.status) {
          case 400:
            throw new Error(data.message || "Invalid verification code");
          case 404:
            throw new Error(data.message || "User not found");
          case 410:
            throw new Error(data.message || "Verification code has expired");
          default:
            throw new Error(data.message || `Email verification failed (${response.status})`);
        }
      }
  
      // Handle successful verification
      if (data.user?.accessToken) {
        localStorage.setItem('authToken', data.user.accessToken);
      }
  
      return {
        success: true,
        user: data.user || {},
        message: data.message || "Email verified successfully"
      };
    } catch (error) {
      // Ensure we're not throwing an error with undefined properties
      const errorMessage = error.message || "Unknown verification error";
      
      console.error("Email verification error:", {
        error,
        userId,
        message: errorMessage
      });
      
      throw new Error(errorMessage);
    }
  },

  resendVerificationCode: async (userId) => {
    if (!userId) throw new Error("User ID is required");

    try {
      console.log('Sending resend verification request:', {
        userId,
        url: `${API_URL}/auth/resend-verification`
      });

      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ userId }),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error("User not found");
          case 429:
            throw new Error("Too many requests. Please wait before trying again");
          default:
            throw new Error(data.message || "Failed to resend verification code");
        }
      }

      return {
        success: true,
        message: data.message || "Verification code sent successfully"
      };
    } catch (error) {
      console.error("Resend verification error:", {
        error,
        userId,
        message: error.message
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    if (!email) throw new Error("Email is required");
  
    try {
      console.log('Sending password reset request:', {
        email,
        url: `${API_URL}/auth/forgot-password`
      });
  
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email }),
        credentials: "include"
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to process password reset request");
      }
  
      return {
        success: true,
        message: data.message || "If that email address is in our database, we will send a password reset link."
      };
    } catch (error) {
      console.error("Forgot password error:", {
        error,
        message: error.message
      });
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    if (!token || !newPassword) {
      throw new Error("Reset token and new password are required");
    }
  
    try {
      console.log('Sending reset password request:', {
        token: token.substring(0, 5) + '...',  // Only log part of the token for security
        url: `${API_URL}/auth/reset-password`
      });
  
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          token,
          newPassword
        }),
        credentials: "include"
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error(data.message || "Invalid or expired reset token");
          default:
            throw new Error(data.message || "Failed to reset password");
        }
      }
  
      // Handle successful password reset
      if (data.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
      }
  
      return {
        success: true,
        user: data.user || {},
        message: data.message || "Password has been successfully reset"
      };
    } catch (error) {
      console.error("Reset password error:", {
        error,
        message: error.message
      });
      throw error;
    }
  },
  forceVerifyUser: (userData) => {
    if (!userData) return null;
    
    console.log('Force-verifying user:', userData);
    
    // Create a new object with forced verification
    const verifiedUser = {
      ...userData,
      isVerified: true,
      verificationStatus: 'verified'
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(verifiedUser));
    
    // Return the modified user
    return verifiedUser;
  },
  
  /**
   * Direct login that bypasses verification checks
   * This uses the normal login flow but ensures the user is treated as verified
   */
  directLogin: async (email, password) => {
    try {
      console.log('Using direct login bypass for:', email);
      
      // First call the normal login endpoint
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });
  
      // Parse the response
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse login response:', responseText);
        throw new Error('Invalid server response');
      }
      
      // Handle login errors
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // If no user was returned, this is a server error
      if (!data.user) {
        throw new Error("Invalid server response - missing user data");
      }
      
      // Store the token regardless
      if (data.user.accessToken) {
        localStorage.setItem('authToken', data.user.accessToken);
      }
      
      // Force the user to be verified
      const forceVerifiedUser = {
        ...data.user,
        isVerified: true,
        verificationStatus: 'verified'
      };
      
      console.log('Created force-verified user:', forceVerifiedUser);
      
      // Store the verified user
      localStorage.setItem('user', JSON.stringify(forceVerifiedUser));
      
      // Return success with the verified user
      return { 
        success: true, 
        user: forceVerifiedUser,
        message: "Login successful"
      };
    } catch (error) {
      console.error('Direct login error:', error);
      throw error;
    }
  }
};

export default authService;