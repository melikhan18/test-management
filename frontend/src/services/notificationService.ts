import api from './api';
import type { Notification, NotificationCount } from '../types';

/**
 * Notification service for handling notification-related operations
 */
export const notificationService = {
  /**
   * Get all notifications for the user
   */
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/api/v1/notifications');
    console.log('Raw notification response from backend:', response.data);
    
    // Log each notification's isRead status
    response.data.forEach((notif: any, index: number) => {
      console.log(`Notification ${index + 1}:`, {
        id: notif.id,
        title: notif.title,
        isRead: notif.isRead,
        isReadType: typeof notif.isRead,
        readAt: notif.readAt
      });
    });
    
    return response.data;
  },

  /**
   * Get unread notifications
   */
  getUnreadNotifications: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/api/v1/notifications/unread');
    return response.data;
  },

  /**
   * Get notification count
   */
  getNotificationCount: async (): Promise<NotificationCount> => {
    const response = await api.get<NotificationCount>('/api/v1/notifications/count');
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: number): Promise<Notification> => {
    const response = await api.put<Notification>(`/api/v1/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    await api.put('/api/v1/notifications/read-all');
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId: number): Promise<void> => {
    await api.delete(`/api/v1/notifications/${notificationId}`);
  },
};
