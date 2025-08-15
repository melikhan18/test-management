package com.test.backend.enums;

/**
 * Enum for notification types.
 */
public enum NotificationType {
    COMPANY_INVITATION("COMPANY_INVITATION"),
    SYSTEM_MESSAGE("SYSTEM_MESSAGE"),
    PROJECT_UPDATE("PROJECT_UPDATE"),
    TASK_ASSIGNMENT("TASK_ASSIGNMENT");
    
    private final String displayName;
    
    NotificationType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
