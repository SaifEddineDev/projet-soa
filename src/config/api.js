// API Configuration
const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // Authentication endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      PROFILE: '/auth/profile',
    },
  },
  
  // Default request timeout (5 seconds)
  TIMEOUT: 5000,
  
  // Content type for requests
  CONTENT_TYPE: 'application/json',
  
  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'hotel_auth_token',
    REFRESH_TOKEN: 'hotel_refresh_token',
    USER_DATA: 'hotel_user_data',
    REMEMBER_ME: 'hotel_remember_me',
  },
};

export default API_CONFIG;
