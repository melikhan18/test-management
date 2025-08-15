package com.test.backend.enums;

/**
 * Enum for invitation status.
 */
public enum InvitationStatus {
    PENDING("PENDING"),
    ACCEPTED("ACCEPTED"),
    REJECTED("REJECTED"),
    EXPIRED("EXPIRED");
    
    private final String displayName;
    
    InvitationStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
