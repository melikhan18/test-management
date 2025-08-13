import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { User } from '../types/api';

/**
 * User-related API requests
 */
export interface UpdateProfileRequest {
  username: string;
  surname: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * User Service
 * Handles all user-related API calls
 */
class UserService {
  
  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    try {
      return await httpClient.get<User>(API_ENDPOINTS.USERS.PROFILE);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    try {
      return await httpClient.put<User>(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        profileData
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      await httpClient.post<void>(
        API_ENDPOINTS.USERS.CHANGE_PASSWORD,
        passwordData
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID (if you have admin permissions)
   */
  async getUserById(userId: number): Promise<User> {
    try {
      return await httpClient.get<User>(`${API_ENDPOINTS.USERS.BASE}/${userId}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search users (if you have permissions)
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      return await httpClient.get<User[]>(`${API_ENDPOINTS.USERS.BASE}/search`, {
        params: { q: query }
      });
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
