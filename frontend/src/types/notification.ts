export interface Notification {
  id: number;
  type: 'COMPANY_INVITATION' | 'SYSTEM_MESSAGE' | 'PROJECT_UPDATE' | 'TASK_ASSIGNMENT';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  relatedEntityId?: number;
  createdAt: string;
  readAt?: string;
}

export interface NotificationCount {
  unreadCount: number;
}
