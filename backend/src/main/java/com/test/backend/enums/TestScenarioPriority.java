package com.test.backend.enums;

/**
 * Enum representing test scenario priority levels.
 */
public enum TestScenarioPriority {
    LOW("Low", "Low priority test scenario"),
    MEDIUM("Medium", "Medium priority test scenario"),
    HIGH("High", "High priority test scenario"),
    CRITICAL("Critical", "Critical priority test scenario");

    private final String displayName;
    private final String description;

    TestScenarioPriority(String displayName, String description) {
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
