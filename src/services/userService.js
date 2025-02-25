export const userService = {
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
    }
  };
  
  export default userService;