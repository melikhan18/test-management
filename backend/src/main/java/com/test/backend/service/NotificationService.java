package com.test.backend.service;

import com.test.backend.dto.NotificationDto;
import com.test.backend.entity.Notification;
import com.test.backend.entity.User;
import com.test.backend.enums.NotificationType;
import com.test.backend.repository.NotificationRepository;
import com.test.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for notification management.
 */
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new notification.
     */
    @Transactional
    public NotificationDto createNotification(String userEmail, NotificationType type, String title, 
                                            String message, String actionUrl, Long relatedEntityId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setActionUrl(actionUrl);
        notification.setRelatedEntityId(relatedEntityId);

        notification = notificationRepository.save(notification);
        return convertToDto(notification);
    }

    /**
     * Get all notifications for a user.
     */
    public List<NotificationDto> getUserNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        List<NotificationDto> dtos = notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
                
        return dtos;
    }

    /**
     * Get unread notifications for a user.
     */
    public List<NotificationDto> getUnreadNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        return notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Mark notification as read.
     */
    @Transactional
    public NotificationDto markAsRead(Long notificationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Check if notification belongs to user
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this notification");
        }

        notification.markAsRead();
        notification = notificationRepository.save(notification);
        return convertToDto(notification);
    }

    /**
     * Mark all notifications as read for a user.
     */
    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        notificationRepository.markAllAsReadForUser(user);
    }

    /**
     * Get notification count for a user.
     */
    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    /**
     * Delete notification.
     */
    @Transactional
    public void deleteNotification(Long notificationId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Check if notification belongs to user
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied to this notification");
        }

        notificationRepository.delete(notification);
    }

    /**
     * Delete invitation-related notification for a user.
     */
    @Transactional
    public void deleteInvitationNotification(String userEmail, String invitationToken) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find notification with the invitation token in actionUrl
        List<Notification> notifications = notificationRepository.findByUserAndTypeOrderByCreatedAtDesc(user, NotificationType.COMPANY_INVITATION);
        
        for (Notification notification : notifications) {
            if (notification.getActionUrl() != null && notification.getActionUrl().contains(invitationToken)) {
                notificationRepository.delete(notification);
                break; // Only delete the first matching notification
            }
        }
    }

    /**
     * Convert Notification entity to DTO.
     */
    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getIsRead(),
                notification.getActionUrl(),
                notification.getRelatedEntityId(),
                notification.getCreatedAt(),
                notification.getReadAt()
        );
        
        return dto;
    }
}
