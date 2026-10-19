import React from 'react';
import axios from 'axios';
import API_CONFIG from '../config/api';

// Helper function for secure storage
const secureStorage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // Handle JWT token differently from other data
      if (key === 'hotel_auth_token') {
        return item; // Return token as string
      }
      return JSON.parse(item); // Parse other data as JSON
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      // Handle JWT token differently from other data
      if (key === 'hotel_auth_token') {
        localStorage.setItem(key, value); // Store token as string
      } else {
        const item = JSON.stringify(value);
        localStorage.setItem(key, item); // Store other data as JSON
      }
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },
};

// Default admin user (for demo purposes only - remove in production)
const DEMO_USERS = {
  admin: {
    id: 1,
    email: 'admin@hotel.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'System',
    role: 'admin',
    permissions: ['manage_users', 'manage_hotels', 'manage_bookings', 'view_reports', 'system_admin']
  },
  manager: {
    id: 2,
    email: 'manager@hotel.com',
    password: 'manager123',
    firstName: 'Manager',
    lastName: 'Hotel',
    role: 'manager',
    permissions: ['manage_hotels', 'manage_bookings', 'view_reports']
  }
};

class AuthService {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    this.isRefreshing = false;
    this.retryQueue = [];
    this.init();
    this.initializeDefaultAdmin(); // Initialiser l'admin par défaut
  }

  /**
   * Initialise le service avec les données du localStorage
   */
  init() {
    this.loadAuthData();
    this.setupAxiosInterceptors();
    
    // Set up token refresh before it expires
    if (this.token) {
      this.scheduleTokenRefresh();
    }
  }

  /**
   * Load authentication data from secure storage
   */
  loadAuthData() {
    try {
      const token = secureStorage.get(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      const refreshToken = secureStorage.get(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      const userData = secureStorage.get(API_CONFIG.STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = userData;
        
        // Set up axios default headers
        this.setAuthHeader(token);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading authentication data:', error);
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Initialise l'admin par défaut si aucun utilisateur n'existe
   */
  initializeDefaultAdmin() {
    const hasUsers = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA) || sessionStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
    
    if (!hasUsers) {
      const defaultAdmin = DEMO_USERS.admin;
      const token = this.generateMockToken(defaultAdmin);
      const userData = {
        id: defaultAdmin.id,
        email: defaultAdmin.email,
        firstName: defaultAdmin.firstName,
        lastName: defaultAdmin.lastName,
        role: defaultAdmin.role,
        permissions: defaultAdmin.permissions
      };
      
      this.setAuthData(token, userData, null, true);
      
      console.log('✅ Admin par défaut créé avec succès !');
      console.log('📧 Email:', defaultAdmin.email);
      console.log('🔑 Mot de passe:', defaultAdmin.password);
      console.log('👤 Rôle:', defaultAdmin.role);
    }
  }

  /**
   * Génère un token JWT simulé pour les admins fixes
   */
  generateMockToken(user) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    };
    
    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    const signature = 'mock-signature';
    
    return `${headerBase64}.${payloadBase64}.${signature}`;
  }

  /**
   * Set authentication data
   */
  setAuthData(token, user, refreshToken = null, rememberMe = false) {
    this.token = token;
    this.user = user;
    this.refreshToken = refreshToken;
    
    // Set axios default headers
    this.setAuthHeader(token);
    
    // Store in secure storage
    const storage = rememberMe ? localStorage : sessionStorage;
    
    try {
      // Store auth data
      secureStorage.set(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      secureStorage.set(API_CONFIG.STORAGE_KEYS.USER_DATA, user);
      
      if (refreshToken) {
        secureStorage.set(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      
      // Store remember me preference
      secureStorage.set(API_CONFIG.STORAGE_KEYS.REMEMBER_ME, rememberMe);
      
      // Schedule token refresh before it expires
      this.scheduleTokenRefresh();
      
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(email, password, rememberMe = false) {
    try {
      // Real API call
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        { email, password, rememberMe },
        { 
          timeout: API_CONFIG.TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.data && response.data.token) {
        const { token, user, refreshToken } = response.data;
        this.setAuthData(token, user, refreshToken, rememberMe);
        return { success: true, user };
      }
      
      return { 
        success: false, 
        message: 'Invalid email or password' 
      };
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'An error occurred during login';
      
      if (error.response) {
        // Handle different status codes
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid email or password';
            break;
          case 401:
            errorMessage = 'Invalid credentials';
            break;
          case 403:
            errorMessage = 'Account not verified. Please check your email.';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. Please check your internet connection.';
      } else if (!window.navigator.onLine) {
        errorMessage = 'No internet connection';
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData) {
    try {
      // Basic validation
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        return { 
          success: false, 
          message: 'Please fill in all required fields' 
        };
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }
      
      // Password strength check (at least 8 characters, 1 number, 1 letter)
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(userData.password)) {
        return {
          success: false,
          message: 'Password must be at least 8 characters long and contain at least one letter and one number'
        };
      }
      
      // For demo purposes - check if email exists in demo users
      if (process.env.NODE_ENV !== 'production') {
        const emailExists = Object.values(DEMO_USERS).some(user => user.email === userData.email);
        if (emailExists) {
          return { 
            success: false, 
            message: 'This email is already registered' 
          };
        }
        
        // Simulate successful registration
        const newUser = {
          id: Date.now(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'user',
          permissions: [],
          isVerified: false
        };
        
        // In a real app, you would send a verification email here
        
        return { 
          success: true, 
          message: 'Registration successful! Please check your email to verify your account.',
          user: newUser
        };
      }
      
      // Real API call in production
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
        userData,
        { 
          timeout: API_CONFIG.TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.data && response.data.success) {
        return { 
          success: true, 
          message: response.data.message || 'Registration successful! Please check your email to verify your account.',
          user: response.data.user
        };
      }
      
      return { 
        success: false, 
        message: response.data?.message || 'Registration failed' 
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'An error occurred during registration';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid registration data';
        } else if (error.response.status === 409) {
          errorMessage = 'This email is already registered';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  async logout() {
    try {
      if (this.token && !this.token.includes('mock_signature_for_fixed_admin')) {
        await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
          {},
          { 
            timeout: API_CONFIG.TIMEOUT,
            headers: { 
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      this.clearAuthData();
      return { success: true, message: 'Déconnexion réussie' };
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    if (!this.token || !this.user) {
      return false;
    }
    
    // Check token expiration
    try {
      const tokenData = this.parseJwt(this.token);
      if (!tokenData || !tokenData.exp) return false;
      
      // Check if token is expired
      const now = Date.now() / 1000; // Convert to seconds
      return tokenData.exp > now;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }

  /**
   * Récupère l'utilisateur courant
   */
  getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }
    return { ...this.user };
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role) {
    if (!this.user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(this.user.role);
    }
    
    return this.user.role === role;
  }

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  hasPermission(permission) {
    if (!this.user) return false;
    
    // Admin has all permissions
    if (this.user.role === 'admin') {
      return true;
    }
    
    // Check specific permissions
    return Array.isArray(this.user.permissions) && 
           this.user.permissions.includes(permission);
  }

  /**
   * Définit les données d'authentification
   */
  setAuthData(token, user, refreshToken = null, rememberMe = false) {
    this.token = token;
    this.user = user;
    this.refreshToken = refreshToken;
    
    // Set axios default headers
    this.setAuthHeader(token);
    
    // Store in secure storage
    const storage = rememberMe ? localStorage : sessionStorage;
    
    try {
      // Store auth data
      secureStorage.set(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
      secureStorage.set(API_CONFIG.STORAGE_KEYS.USER_DATA, user);
      
      if (refreshToken) {
        secureStorage.set(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      
      // Store remember me preference
      secureStorage.set(API_CONFIG.STORAGE_KEYS.REMEMBER_ME, rememberMe);
      
      // Schedule token refresh before it expires
      this.scheduleTokenRefresh();
      
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Nettoie toutes les données d'authentification
   */
  clearAuthData() {
    // Clear tokens and user data
    this.token = null;
    this.user = null;
    this.refreshToken = null;
    
    // Clear storage
    secureStorage.remove(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    secureStorage.remove(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    secureStorage.remove(API_CONFIG.STORAGE_KEYS.USER_DATA);
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear any pending refresh timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    // Clear any pending requests
    this.retryQueue = [];
  }

  /**
   * Récupère le token d'authentification
   */
  getToken() {
    return this.token;
  }

  /**
   * Set authentication header for axios
   */
  setAuthHeader(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Setup axios interceptors
   */
  setupAxiosInterceptors() {
    // Request interceptor
    this.axiosInterceptor = axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        config.headers['Content-Type'] = API_CONFIG.CONTENT_TYPE;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If token refresh in progress, add to queue
            return new Promise((resolve, reject) => {
              this.retryQueue.push({ resolve, reject });
            })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;
          
          try {
            await this.refreshAuthToken();
            
            // Process queued requests
            this.processQueue(null, this.token);
            
            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${this.token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.clearAuthData();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }
        
        // Handle other errors
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          
          // Handle specific error statuses
          switch (status) {
            case 400:
              return Promise.reject(data.message || 'Bad request');
            case 403:
              return Promise.reject('You are not authorized to perform this action');
            case 404:
              return Promise.reject('Resource not found');
            case 500:
              return Promise.reject('Server error. Please try again later.');
            default:
              return Promise.reject(data?.message || 'An error occurred');
          }
        } else if (error.request) {
          // Request was made but no response received
          return Promise.reject('Network error. Please check your connection.');
        } else {
          // Something happened in setting up the request
          return Promise.reject(error.message || 'An error occurred');
        }
      }
    );
  }

  /**
   * Process queued requests
   */
  processQueue(error, token = null) {
    this.retryQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.retryQueue = [];
  }

  /**
   * Refresh authentication token
   */
  async refreshAuthToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`,
        { refreshToken: this.refreshToken },
        { 
          timeout: API_CONFIG.TIMEOUT,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.data && response.data.token) {
        const { token, user, refreshToken } = response.data;
        this.setAuthData(token, user, refreshToken);
        return true;
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Schedule token refresh before it expires
   */
  scheduleTokenRefresh() {
    if (!this.token) return;
    
    // Decode the token to get expiration time
    const tokenData = this.parseJwt(this.token);
    if (!tokenData || !tokenData.exp) return;
    
    // Refresh token 5 minutes before it expires
    const expiresIn = (tokenData.exp * 1000) - Date.now() - (5 * 60 * 1000);
    
    if (expiresIn > 0) {
      this.refreshTimeout = setTimeout(() => {
        this.refreshAuthToken().catch(error => {
          console.error('Failed to refresh token:', error);
          this.clearAuthData();
        });
      }, expiresIn);
    }
  }

  /**
   * Parse JWT token
   */
  parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}

// Export d'une instance unique
const authService = new AuthService();
export default authService;

// Export des fonctions principales
export const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  refreshToken,
  isAuthenticated,
  getCurrentUser,
  getToken,
  setAuthData,
  setUserData,
  setToken,
  clearAuthData,
  hasPermission,
  hasRole,
  getDemoAccounts,
} = authService;

// Hook d'authentification pour React
export const useAuth = () => {
  return {
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getCurrentUser(),
    token: authService.getToken(),
    login: authService.login,
    logout: authService.logout,
    register: authService.register,
    hasPermission: authService.hasPermission,
    hasRole: authService.hasRole,
  };
};

// Middleware pour les requêtes API
export const authMiddleware = {
  requestInterceptor: (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    return config;
  },

  responseInterceptor: async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const result = await authService.refreshToken();
        if (result.success) {
          originalRequest.headers['Authorization'] = `Bearer ${result.token}`;
          return fetch(originalRequest);
        }
      } catch (refreshError) {
        console.error('Erreur de rafraîchissement:', refreshError);
        authService.clearAuthData();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  },
};