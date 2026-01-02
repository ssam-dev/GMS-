// User entity for authentication and profile management
export const User = {
  // Get current logged in user
  me: async () => {
    // Check if user is logged in (no expiration check - permanent login)
    const userData = localStorage.getItem('currentUser');
    const isAuth = localStorage.getItem('isAuthenticated');
    
    if (!userData || isAuth !== 'true') {
      return null;
    }
    
    // Return stored user data
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Login user
  login: async (email, password) => {
    // In production, this would call the actual API
    // For demo: simulate API call
    const mockUser = {
      id: '1',
      email: email,
      full_name: 'Admin User',
      role: 'admin',
      phone: '+1 (555) 123-4567',
      address: '123 Gym Street',
      bio: 'Gym Manager',
      gym_name: 'FitPro Gym',
      gym_address: '456 Fitness Ave',
      gym_phone: '+1 (555) 987-6543',
      profile_picture: null,
      loginMethod: 'email'
    };
    
    // Store user in localStorage (permanent - no expiration)
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());
    
    console.log('User logged in successfully - session is permanent');
    
    return mockUser;
  },

  // Login with Google
  loginWithGoogle: async (credential) => {
    try {
      // Decode JWT token to get user info
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      // Create user object from Google data
      const googleUser = {
        id: payload.sub,
        email: payload.email,
        full_name: payload.name,
        role: 'admin',
        phone: '',
        address: '',
        bio: '',
        gym_name: 'FitPro Gym',
        gym_address: '456 Fitness Ave',
        gym_phone: '+1 (555) 987-6543',
        profile_picture: payload.picture,
        loginMethod: 'google',
        googleId: payload.sub
      };
      
      // Store user in localStorage (permanent - no expiration)
      localStorage.setItem('currentUser', JSON.stringify(googleUser));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTime', new Date().toISOString());
      localStorage.setItem('googleCredential', credential);
      
      console.log('User logged in with Google - session is permanent');
      
      return googleUser;
    } catch (error) {
      console.error('Error decoding Google credential:', error);
      throw error;
    }
  },

  // Update user profile
  updateMyUserData: async (data) => {
    // Update in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    console.log('Updating user data:', data);
    return updatedUser;
  },

  // Logout
  logout: async () => {
    // Clear all user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('googleCredential');
    sessionStorage.clear();
    
    console.log('User logged out successfully');
    
    // Redirect to login page
    window.location.href = '/login';
  },

  // Check if user is authenticated (permanent - no expiration)
  isAuthenticated: () => {
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  }
}
