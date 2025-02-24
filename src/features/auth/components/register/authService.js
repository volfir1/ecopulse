export const authService = {
  register: async (email, phone, password) => {
    try {
      // Generate a default name based on email
      const name = email ? email.split("@")[0] : "User";

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return {
        success: true,
        user: data.user || { name, email, phone }, // Fallback in case user object is missing
      };
    } catch (error) {
      console.error("Registration Error:", error.message);
      throw new Error(error.message || "Something went wrong during registration");
    }
  },

  googleSignUp: async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        user: {
          email: "google@example.com",
          name: "Google User",
          provider: "google",
        },
      };
    } catch (error) {
      console.error("Google Signup Error:", error.message);
      throw new Error("Google signup failed");
    }
  },
};
