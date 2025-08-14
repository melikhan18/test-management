import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { User, UserRole } from '../types';

/**
 * User service for handling user management operations
 */
export const userService = {
  /**
   * Get all users (Admin and Moderator only)
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>(API_ENDPOINTS.USERS.BASE);
    return response.data;
  },

  /**
   * Update user role (Admin only)
   */
  updateUserRole: async (userId: number, newRole: UserRole): Promise<User> => {
    const response = await api.put<User>(API_ENDPOINTS.USERS.ROLE(userId), newRole);
    return response.data;
  },

  /**
   * Delete user (Admin only)
   */
  deleteUser: async (userId: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`${API_ENDPOINTS.USERS.BASE}/${userId}`);
    return response.data;
  },
};
