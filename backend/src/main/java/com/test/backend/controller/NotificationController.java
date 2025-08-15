package com.test.backend.controller;

import com.test.backend.dto.NotificationDto;
import com.test.backend.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for notification management operations.
 */
@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notification Management", description = "Notification management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Operation(
            summary = "Get User Notifications",
            description = "Get all notifications for the authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getUserNotifications() {
        String userEmail = getCurrentUserEmail();
        List<NotificationDto> notifications = notificationService.getUserNotifications(userEmail);
        return ResponseEntity.ok(notifications);
    }

    @Operation(
            summary = "Get Unread Notifications",
            description = "Get unread notifications for the authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Unread notifications retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications() {
        String userEmail = getCurrentUserEmail();
        List<NotificationDto> notifications = notificationService.getUnreadNotifications(userEmail);
        return ResponseEntity.ok(notifications);
    }

    @Operation(
            summary = "Get Notification Count",
            description = "Get unread notification count for the authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification count retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getNotificationCount() {
        String userEmail = getCurrentUserEmail();
        long count = notificationService.getUnreadCount(userEmail);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @Operation(
            summary = "Mark Notification as Read",
            description = "Mark a specific notification as read"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification marked as read successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this notification"),
            @ApiResponse(responseCode = "404", description = "Notification not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long notificationId) {
        String userEmail = getCurrentUserEmail();
        System.out.println("Marking notification as read - ID: " + notificationId + ", User: " + userEmail);
        NotificationDto notification = notificationService.markAsRead(notificationId, userEmail);
        System.out.println("Notification marked as read: " + notification.isRead());
        return ResponseEntity.ok(notification);
    }

    @Operation(
            summary = "Mark All Notifications as Read",
            description = "Mark all notifications as read for the authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All notifications marked as read successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        String userEmail = getCurrentUserEmail();
        notificationService.markAllAsRead(userEmail);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Delete Notification",
            description = "Delete a specific notification"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification deleted successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this notification"),
            @ApiResponse(responseCode = "404", description = "Notification not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        String userEmail = getCurrentUserEmail();
        notificationService.deleteNotification(notificationId, userEmail);
        return ResponseEntity.ok().build();
    }

    /**
     * Get current authenticated user's email.
     */
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
