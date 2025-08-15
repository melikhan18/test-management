package com.test.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.test.backend.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for notification information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    
    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    
    @JsonProperty("isRead")
    private boolean isRead;
    
    private String actionUrl;
    private Long relatedEntityId;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
