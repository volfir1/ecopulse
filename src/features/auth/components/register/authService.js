export const authService = {
    register: async (email, phone, password) => {
      // Simulate API call - can be replaced with real API later
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prototype validation - can be replaced with real validation
      if (email === 'test@example.com') {
        throw new Error('Email already exists');
      }
      
      return { 
        success: true, 
        user: { 
          email, 
          phone, 
          name: email.split('@')[0] 
        }
      };
    },
    
    googleSignUp: async () => {
      // Simulate Google OAuth - can be replaced with real Google auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        success: true, 
        user: { 
          email: 'google@example.com', 
          name: 'Google User',
          provider: 'google'
        }
      };
    }
  };