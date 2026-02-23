import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      const currentUser = authService.getCurrentUser();

      if (token && currentUser) {
        try {
          const isValid = await authService.validateToken();
          if (isValid) {
            setUser(currentUser);
          } else {
            authService.logout();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          authService.logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Alternative login function for when user is already authenticated
  const setUserAuthenticated = (user) => {
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const signup = async (userData) => {
    try {
      // First request OTP for signup
      await authService.requestSignupOtp(userData.email);

      // Return success to indicate OTP was sent
      // The UI should navigate to OTP verification page
      return {
        success: true,
        message: 'OTP sent to your email',
        requiresOtp: true,
        userData: userData // Store user data for later completion
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const completeSignup = async (userData, otp) => {
    try {
      const signupData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        gender: userData.gender,
        otp: otp
      };

      // Complete signup with the actual OTP
      await authService.completeSignup(signupData);
      return true;
    } catch (error) {
      console.error('Complete signup error:', error);
      // Check for specific database constraint error
      if (error.message && (
        error.message.includes('Duplicate entry') ||
        error.message.includes('UK_6dotkott2kjsp8vw4d0m25fb7') ||
        error.message.includes('already exists') ||
        error.message.includes('constraint')
      )) {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      throw error;
    }
  };

  const value = {
    user,
    currentUser: user, // Alias for backward compatibility
    login,
    logout,
    signup,
    completeSignup,
    setUserAuthenticated,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
