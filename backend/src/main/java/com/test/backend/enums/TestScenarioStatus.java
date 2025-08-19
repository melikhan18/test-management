package com.test.backend.enums;

/**
 * Enum representing test scenario status.
 */
public enum TestScenarioStatus {
    DRAFT("Draft", "Test scenario is in draft state"),
    READY("Ready", "Test scenario is ready for execution"),
    IN_PROGRESS("In Progress", "Test scenario execution is in progress"),
    PASSED("Passed", "Test scenario execution passed"),
    FAILED("Failed", "Test scenario execution failed"),
    BLOCKED("Blocked", "Test scenario execution is blocked"),
    SKIPPED("Skipped", "Test scenario execution was skipped"),
    ON_HOLD("On Hold", "Test scenario execution is on hold");

    private final String displayName;
    private final String description;

    TestScenarioStatus(String displayName, String description) {
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
