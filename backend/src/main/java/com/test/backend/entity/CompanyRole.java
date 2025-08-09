package com.test.backend.entity;

/**
 * Enum for company member roles.
 * Defines the different roles a user can have within a company.
 */
public enum CompanyRole {
    OWNER("Owner"),
    ADMIN("Administrator"), 
    MEMBER("Member");
    
    private final String displayName;
    
    CompanyRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
