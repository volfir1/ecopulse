// Define the API URL once at the top of the file
const API_URL = "http://localhost:5000/api";

export const userService = {
  // Get all users (admin function)
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get the current logged in user's profile
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      console.log('Raw API Response:', response);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Parsed API Response:', data);
      console.log('User object in response:', data.user);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user profile");
      }

      // Return the data in the expected format
      return {
        success: true,
        user: {
          id: data.user._id, // MongoDB typically uses _id
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          phone: data.user.phone || '',
          role: data.user.role
        }
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Get a specific user by ID
  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      return data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Reset password with token (forgot password flow)
  updatePassword: async (token, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      return {
        success: true,
        message: data.message || "Password updated successfully",
        accessToken: data.accessToken
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || "Password update failed",
        error
      };
    }
  },

  // Change password (when user is logged in)
  changePassword: async (currentPassword, newPassword) => {
    try {
      // Get the user ID from localStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;
      
      console.log("Changing password for user ID:", userId);
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
  
      // Verify userId is in the correct format (MongoDB ObjectId)
      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        throw new Error("Invalid user ID format");
      }
  
      const response = await fetch(`${API_URL}/users/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }
  
      return {
        success: true,
        message: data.message || "Password changed successfully"
      };
    } catch (error) {
      console.error("Password change error:", error);
      throw {
        success: false,
        message: error.message || "Password change failed",
        error
      };
    }
  },
  
  // Update user role (admin function)
  updateUserRole: async (userId, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ role })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update user role");
      }

      return {
        success: true,
        message: data.message || 'Role updated successfully',
        user: data.user
      };
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  },

  // Soft delete a user (deactivate)
  softDeleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE", // Using DELETE method for soft delete
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to deactivate user");
      }

      return {
        success: true,
        message: data.message || "User has been successfully deactivated"
      };
    } catch (error) {
      console.error("Error deactivating user:", error);
      throw error;
    }
  },

  // Restore a soft-deleted user
  restoreUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/restore`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to restore user");
      }

      return {
        success: true,
        message: data.message || "User has been successfully restored",
        user: data.user
      };
    } catch (error) {
      console.error("Error restoring user:", error);
      throw error;
    }
  },

  // Get all users including deleted ones (admin only)
  getAllUsersWithDeleted: async () => {
    try {
      const response = await fetch(`${API_URL}/users/users/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch all users");
      }

      return data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }
};

export default userService;