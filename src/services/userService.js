export const userService = {
  // Get all users (admin function)
  getAllUsers: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/users", {
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
      const response = await fetch("http://localhost:5000/api/auth/verify", {
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
      
      // Add console.log to debug the response
      console.log('API Response:', data);

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
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
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
  updateUserProfile: async (userData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone
        })
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

  // Change password
  changePassword: async (userId, passwordData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      return data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },
  
  updateUserRole: async (userId, role) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/role`, {
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
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
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
      const response = await fetch(`http://localhost:5000/api/users/${userId}/restore`, {
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
      const response = await fetch("http://localhost:5000/api/users/users/all", {
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