import { useEffect, useRef, useState } from 'react';
import { Bell, Check, X, ExternalLink, CheckCircle, XCircle, Settings, Archive } from 'lucide-react';
import { invitationService } from '../../services';
import { formatErrorMessage } from '../../utils/helpers';
import { useNotification } from '../../contexts';
import type { Notification } from '../../types';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use notification context instead of local state
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: contextMarkAsRead,
    markAllAsRead: contextMarkAllAsRead,
    deleteNotification: contextDeleteNotification,
    removeInvitationNotification,
    refreshNotifications,
  } = useNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Close any open action menus
        document.querySelectorAll('.notification-action-menu').forEach(menu => {
          menu.classList.add('hidden');
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load notifications and count
  useEffect(() => {
    // NotificationContext already handles loading and periodic refresh
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    await contextMarkAsRead(notificationId);
    // Close the action menu after marking as read
    const actionMenus = document.querySelectorAll('.notification-action-menu');
    actionMenus.forEach(menu => {
      menu.classList.add('hidden');
    });
  };

  const handleMarkAllAsRead = async () => {
    await contextMarkAllAsRead();
  };

  const handleDeleteNotification = async (notificationId: number) => {
    await contextDeleteNotification(notificationId);
    // Close the action menu after deleting
    const actionMenus = document.querySelectorAll('.notification-action-menu');
    actionMenus.forEach(menu => {
      menu.classList.add('hidden');
    });
  };

  const handleAcceptInvitation = async (actionUrl: string) => {
    try {
      // Extract token from actionUrl (e.g., "/invitations/ae37319c-82f1-4f7c-a8ad-444d1b0a0bfb" -> "ae37319c-82f1-4f7c-a8ad-444d1b0a0bfb")
      const token = actionUrl.split('/').pop();
      if (!token) {
        throw new Error('Invalid action URL format');
      }
      await invitationService.acceptInvitation(token);
      
      // Remove the notification from local state immediately for better UX
      removeInvitationNotification(token);
      
      // Refresh notifications to get updated state from backend
      await refreshNotifications();
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      console.error('Error details:', formatErrorMessage(error));
      alert('Failed to accept invitation: ' + formatErrorMessage(error));
    }
  };

  const handleRejectInvitation = async (actionUrl: string) => {
    try {
      // Extract token from actionUrl (e.g., "/invitations/ae37319c-82f1-4f7c-a8ad-444d1b0a0bfb" -> "ae37319c-82f1-4f7c-a8ad-444d1b0a0bfb")
      const token = actionUrl.split('/').pop();
      if (!token) {
        throw new Error('Invalid action URL format');
      }
      await invitationService.rejectInvitation(token);
      
      // Remove the notification from local state immediately for better UX
      removeInvitationNotification(token);
      
      // Refresh notifications to get updated state from backend
      await refreshNotifications();
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      console.error('Error details:', formatErrorMessage(error));
      alert('Failed to reject invitation: ' + formatErrorMessage(error));
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'COMPANY_INVITATION':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">👥</span>
            </div>
          </div>
        );
      case 'SYSTEM_MESSAGE':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">📢</span>
            </div>
          </div>
        );
      case 'PROJECT_UPDATE':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">📊</span>
            </div>
          </div>
        );
      case 'TASK_ASSIGNMENT':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✅</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">📋</span>
            </div>
          </div>
        );
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Professional Notification Bell Button */}
      <button
        onClick={() => {
          if (!isOpen) {
            // Refresh notifications when opening dropdown
            refreshNotifications();
          }
          setIsOpen(!isOpen);
        }}
        className={`relative p-2.5 rounded-xl transition-all duration-200 ${
          unreadCount > 0 
            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 ring-2 ring-blue-200/50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        } focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-blue-50`}
      >
        <Bell className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'scale-110' : ''}`} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 font-medium shadow-sm border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Enterprise Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/80 z-50 overflow-hidden backdrop-blur-sm">
          {/* Professional Header */}
          <div className="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/80 to-gray-100/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Professional Notifications List */}
          <div className="max-h-[28rem] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="relative">
                  <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-blue-300 rounded-full animate-ping mx-auto opacity-20"></div>
                </div>
                <p className="text-sm text-gray-600 mt-4 font-medium">Loading notifications...</p>
                <p className="text-xs text-gray-400 mt-1">Please wait while we fetch your updates</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">All caught up!</h4>
                <p className="text-xs text-gray-500">No new notifications at the moment</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-4 border-b border-gray-100/60 hover:bg-gray-50/80 transition-all duration-200 group ${
                    !notification.isRead ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  )}
                  
                  <div className="flex items-start space-x-4 ml-2">
                    {/* Professional Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Enhanced Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          
                          {/* Premium Invitation Actions */}
                          {notification.type === 'COMPANY_INVITATION' && notification.actionUrl && (
                            <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-100">
                              <button
                                onClick={() => handleAcceptInvitation(notification.actionUrl!)}
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-xs font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectInvitation(notification.actionUrl!)}
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                Decline
                              </button>
                            </div>
                          )}
                          
                          {/* Professional Footer */}
                          <div className="flex items-center justify-between mt-3 pt-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-gray-500 font-medium">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {notification.actionUrl && notification.type !== 'COMPANY_INVITATION' && (
                                <a
                                  href={notification.actionUrl}
                                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Details
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Enterprise Action Menu */}
                        <div className="flex items-start">
                          <div className="relative">
                            <button
                              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                const menu = e.currentTarget.nextElementSibling as HTMLElement;
                                menu.classList.toggle('hidden');
                              }}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="notification-action-menu hidden absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span>Mark as read</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <X className="w-4 h-4 text-red-600" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Premium Footer */}
          {notifications.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/40 to-white">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                >
                  <Archive className="w-4 h-4" />
                  <span>View all notifications</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notification settings
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Notification settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
