// services/authService.js
export const authService = {
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Prototype validation
    if (email === 'test@example.com' && password === 'Test1234') {
      return { success: true, user: { email, name: 'Test User' }};
    }
    throw new Error('Invalid credentials');
  },
  
  googleSignIn: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, user: { email: 'google@example.com', name: 'Google User' }};
  }
};