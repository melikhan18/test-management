package com.test.backend.enums;

/**
 * Enum representing different platform types.
 */
public enum PlatformType {
    ANDROID("Android", "Android mobile platform"),
    IOS("iOS", "iOS mobile platform"), 
    WEB("Web", "Web browser platform"),
    SERVICE("Service", "Backend service platform");

    private final String displayName;
    private final String description;

    PlatformType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
