let currentAuthRequest = null;

// authService.js - Combine all auth-related functionality in one file
const authService = {
    // Registration
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
  
  
    // Logout
    // Update your logout function to also clear localStorage
logout: async () => {
  try {
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
  
    // Check auth status
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
    
    // Update your checkAuthStatus function
    checkAuthStatus: async () => {
      try {
        // Cancel any existing auth check request
        if (currentAuthRequest) {
          currentAuthRequest.abort();
        }
        
        // Create a new AbortController
        const controller = new AbortController();
        currentAuthRequest = controller;
        
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
          signal: controller.signal
        });
        
        // Clear the current request reference
        currentAuthRequest = null;
        
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
    
  
    // Social login methods
    googleSignIn: async () => {
      // Implementation will depend on your actual Google Sign-In flow
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, user: { email: "google@example.com", name: "Google User" } };
    },
  
    googleSignUp: async () => {
      // Implementation will depend on your actual Google Sign-Up flow
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        user: {
          email: "google@example.com",
          name: "Google User",
          provider: "google",
        },
      };
    },
  };
  
  export default authService;