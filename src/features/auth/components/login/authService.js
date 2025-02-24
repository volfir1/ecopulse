export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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

  googleSignIn: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, user: { email: "google@example.com", name: "Google User" } };
  },
};

