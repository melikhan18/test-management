// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
  
  // Companies
  COMPANIES: {
    BASE: '/companies',
    OWNED: '/companies/owned',
    BY_ID: (id: number) => `/companies/${id}`,
    MEMBERS: (id: number) => `/companies/${id}/members`,
    ADD_MEMBER: (id: number) => `/companies/${id}/members`,
    REMOVE_MEMBER: (companyId: number, userId: number) => `/companies/${companyId}/members/${userId}`,
    UPDATE_MEMBER_ROLE: (companyId: number, userId: number) => `/companies/${companyId}/members/${userId}/role`,
  },
  
  // Projects (for future use)
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: number) => `/projects/${id}`,
    BY_COMPANY: (companyId: number) => `/companies/${companyId}/projects`,
  },
  
  // Versions (for future use)
  VERSIONS: {
    BASE: '/versions',
    BY_ID: (id: number) => `/versions/${id}`,
    BY_PROJECT: (projectId: number) => `/projects/${projectId}/versions`,
  },
  
  // Health Check
  HEALTH: '/health',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
