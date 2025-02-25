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
  
    // Login
    login: async (email, password) => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include" // This line is critical
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
  
        return { success: true, user: data.user };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  
    // Logout
    logout: async () => {
      try {
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
    checkAuthStatus: async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });
        
        if (!response.ok) {
          return { success: false };
        }
        
        const data = await response.json();
        return { success: true, user: data.user };
      } catch (error) {
        return { success: false, error: error.message };
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