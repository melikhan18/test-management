import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { notificationService } from '../services';
import { formatErrorMessage } from '../utils/helpers';
import { useAuth } from './AuthContext';
import type { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  loadNotifications: () => Promise<void>;
  loadUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  removeInvitationNotification: (invitationToken: string) => void;
  addNotification: (notification: Notification) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, user } = useAuth();

  // Load notifications when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
      loadUnreadCount();
      
      // Set up periodic refresh
      const interval = setInterval(() => {
        refreshNotifications();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  const loadNotifications = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      console.log('Loading notifications from backend...');
      const data = await notificationService.getNotifications();
      console.log('Loaded notifications:', data);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const data = await notificationService.getNotificationCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to load notification count:', formatErrorMessage(error));
    }
  };

  const markAsRead = async (notificationId: number): Promise<void> => {
    try {
      console.log('Marking notification as read:', notificationId);
      const updatedNotification = await notificationService.markAsRead(notificationId);
      console.log('Backend response:', updatedNotification);
      
      // Update local state with backend response
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? updatedNotification
            : notif
        )
      );
      
      // Update unread count only if notification was actually unread
      const wasUnread = !notifications.find(n => n.id === notificationId)?.isRead;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      console.log('Updated notification state successfully');
    } catch (error) {
      console.error('Failed to mark notification as read:', formatErrorMessage(error));
      // Reload notifications on error to ensure consistency
      await refreshNotifications();
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      await notificationService.markAllAsRead();
      
      // Reload fresh data from backend to ensure consistency
      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', formatErrorMessage(error));
      // Reload on error to maintain consistency
      await refreshNotifications();
    }
  };

  const deleteNotification = async (notificationId: number): Promise<void> => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      const wasUnread = !notifications.find(n => n.id === notificationId)?.isRead;
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', formatErrorMessage(error));
      await refreshNotifications();
    }
  };

  const removeInvitationNotification = (invitationToken: string): void => {
    setNotifications(prev => {
      const filteredNotifications = prev.filter(notif => {
        if (notif.type === 'COMPANY_INVITATION' && notif.actionUrl) {
          return !notif.actionUrl.includes(invitationToken);
        }
        return true;
      });
      
      // Update unread count if any notification was removed and was unread
      const removedNotification = prev.find(notif => 
        notif.type === 'COMPANY_INVITATION' && 
        notif.actionUrl && 
        notif.actionUrl.includes(invitationToken)
      );
      
      if (removedNotification && !removedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return filteredNotifications;
    });
  };

  const addNotification = (notification: Notification): void => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const refreshNotifications = async (): Promise<void> => {
    await Promise.all([
      loadNotifications(),
      loadUnreadCount()
    ]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    removeInvitationNotification,
    addNotification,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
