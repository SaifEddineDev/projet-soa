import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Create context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update user state from auth service
  const updateUserFromAuth = useCallback(() => {
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    }
    return null;
  }, []);

  // Initialize authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        if (authService.isAuthenticated()) {
          // Try to refresh token if needed
          try {
            await authService.refreshTokenIfNeeded();
          } catch (refreshError) {
            console.warn('Token refresh failed:', refreshError);
            authService.clearAuthData();
          }
          
          // Update user state
          updateUserFromAuth();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        authService.clearAuthData();
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      // Any cleanup if needed
    };
  }, [updateUserFromAuth]);

  // Handle login
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login({ email, password }, rememberMe);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        // Auto-login after successful registration if needed
        if (result.user) {
          setUser(result.user);
          return { success: true, user: result.user };
        } else if (userData.email && userData.password) {
          // Fallback to login if user data is not returned
          return await login(userData.email, userData.password, true);
        }
        return { success: true };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
      return { success: true, message: 'Logged out successfully' };
    } catch (err) {
      console.error('Logout error:', err);
      // Force clear auth data on logout error
      authService.clearAuthData();
      setUser(null);
      setError(null);
      return { success: true, message: 'Logged out (with errors)' };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.updateProfile(userData);
      
      if (result.success) {
        const updatedUser = { ...user, ...result.user };
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated() && !!user;
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return authService.hasRole ? authService.hasRole(role) : user.role === role;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    if (!user || !roles || !Array.isArray(roles)) return false;
    return roles.some(role => hasRole(role));
  }, [hasRole]);

  // Get authentication token
  const getToken = useCallback(() => {
    return authService.getToken();
  }, []);

  // Context value
  const value = {
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    getToken,
    login,
    register,
    logout,
    updateProfile,
    clearError: () => setError(null),
    refreshUser: updateUserFromAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading || isInitialized ? children : null}
    </AuthContext.Provider>
  );
};

export default AuthContext;