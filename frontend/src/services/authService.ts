import httpClient from './httpClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from '../types/api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Store tokens and user data
      this.storeAuthData(response);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      // Store tokens and user data
      this.storeAuthData(response);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    try {
      return await httpClient.get<User>(API_ENDPOINTS.AUTH.ME);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      // Update stored tokens
      this.storeAuthData(response);
      
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear all stored data
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Redirect to login page
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    return !!(token && userData);
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Store authentication data
   */
  private storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authResponse.user));
  }

  /**
   * Update stored user data
   */
  updateStoredUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  /**
   * Check if access token is expired (basic check)
   */
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      // Basic JWT expiration check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
