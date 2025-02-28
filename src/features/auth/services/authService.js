// src/features/auth/services/authService.js
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  getIdToken 
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

let currentAuthRequest = null;

const authService = {
  // Registration - using your existing API
  register: async (firstName, lastName, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return {
        success: true,
        user: data.user || { firstName, lastName, email },
      };
    } catch (error) {
      console.error("Registration Error:", error.message);
      throw new Error(error.message || "Something went wrong during registration");
    }
  },

  // Login - using your existing API
  login: async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Save token to localStorage as backup
      if (data.user && data.user.accessToken) {
        localStorage.setItem('authToken', data.user.accessToken);
      }
  
      return { success: true, user: data.user };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Logout - using your existing API
  logout: async () => {
    try {
      // First logout from Firebase (if the user was signed in with Google)
      try {
        await auth.signOut();
      } catch (firebaseError) {
        console.warn("Firebase logout error:", firebaseError);
        // Continue with the API logout even if Firebase logout failed
      }
      
      localStorage.removeItem('authToken'); // Clear localStorage token
      
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      return { success: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Check auth status - using your existing API
  checkAuthStatus: async (signal) => {
    try {
      // Cancel any existing auth check request
      if (currentAuthRequest) {
        currentAuthRequest.abort();
      }
      
      // Create a new AbortController if not provided
      const controller = signal ? { signal } : new AbortController();
      if (!signal) {
        currentAuthRequest = controller;
        signal = controller.signal;
      }
      
      // Get token from localStorage as backup
      const localToken = localStorage.getItem('authToken');
      
      const headers = {
        "Content-Type": "application/json"
      };
      
      // Add token to headers if available
      if (localToken) {
        headers["Authorization"] = `Bearer ${localToken}`;
      }
      
      // Add the signal to the fetch request
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "GET",
        headers,
        credentials: "include",
        signal
      });
      
      // Clear the current request reference
      if (currentAuthRequest && currentAuthRequest.signal === signal) {
        currentAuthRequest = null;
      }
      
      if (response.status === 401) {
        return { 
          success: false, 
          error: 'Session expired or invalid' 
        };
      }
  
      if (!response.ok) {
        const data = await response.json();
        return { 
          success: false, 
          error: data.msg || 'Verification failed' 
        };
      }
      
      const data = await response.json();
      return { 
        success: true, 
        user: data.user 
      };
    } catch (error) {
      // Don't treat aborted requests as errors
      if (error.name === 'AbortError') {
        console.log('Auth check was cancelled by a new request');
        return { aborted: true };
      }
      
      console.error('Auth verification error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Google Sign-In with Firebase
  googleSignIn: async () => {
    try {
      // 1. Sign in with Google via Firebase
      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      // Optional: Customize the sign-in experience
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Open the Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      
      // Get the user data from Firebase
      const user = result.user;
      
      // Get the ID token to send to our backend
      const idToken = await getIdToken(user);
      
      // Send the user data and token to our backend
      const response = await fetch("http://localhost:5000/api/auth/google-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid
        }),
        credentials: "include"
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Google sign-in failed");
      }
      
      // Save token to localStorage as backup
      if (data.user && data.user.accessToken) {
        localStorage.setItem('authToken', data.user.accessToken);
      }
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      
      // Handle Firebase authentication errors
      if (error.code) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            throw new Error("Sign-in was cancelled");
          case 'auth/cancelled-popup-request':
          case 'auth/popup-blocked':
            throw new Error("Sign-in popup was blocked. Please try again");
          default:
            throw new Error(error.message || "Failed to sign in with Google");
        }
      }
      
      throw new Error(error.message || "Failed to sign in with Google");
    }
  }
};

export default authService;