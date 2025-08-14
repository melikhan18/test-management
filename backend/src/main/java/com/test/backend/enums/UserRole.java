package com.test.backend.enums;

/**
 * System-wide user roles for the test management application.
 * These roles are different from company-specific roles and define global permissions.
 */
public enum UserRole {
    /**
     * System administrator with full access to all features
     */
    ADMIN("ADMIN"),
    
    /**
     * Moderator with elevated privileges across companies
     */
    MODERATOR("MODERATOR"),
    
    /**
     * Regular user with standard permissions
     */
    USER("USER");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    /**
     * Check if this role has admin privileges
     */
    public boolean isAdmin() {
        return this == ADMIN;
    }
    
    /**
     * Check if this role has moderator or higher privileges
     */
    public boolean isModerator() {
        return this == ADMIN || this == MODERATOR;
    }
    
    /**
     * Check if this role has higher or equal privilege than the given role
     */
    public boolean hasPrivilegeLevel(UserRole role) {
        return this.ordinal() <= role.ordinal();
    }
}
