import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

/**
 * Authentication service for handling login, register, and token management
 */
export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
    return response.data;
  },

  /**
   * Get current user information
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Logout user (client-side only, no API call needed)
   */
  logout: (): void => {
    // The actual logout logic will be handled in the context
    // This is just a placeholder for any future server-side logout logic
  },
};
