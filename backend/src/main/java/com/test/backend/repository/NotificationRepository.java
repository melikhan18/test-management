package com.test.backend.repository;

import com.test.backend.entity.Notification;
import com.test.backend.entity.User;
import com.test.backend.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Notification entity.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /**
     * Find all notifications for a user ordered by creation date (newest first).
     */
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    /**
     * Find unread notifications for a user.
     */
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    /**
     * Find notifications by type for a user.
     */
    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, NotificationType type);
    
    /**
     * Count unread notifications for a user.
     */
    long countByUserAndIsReadFalse(User user);
    
    /**
     * Find notifications by related entity ID.
     */
    List<Notification> findByUserAndRelatedEntityId(User user, Long relatedEntityId);
    
    /**
     * Mark all notifications as read for a user.
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.user = :user AND n.isRead = false")
    void markAllAsReadForUser(@Param("user") User user);
}
