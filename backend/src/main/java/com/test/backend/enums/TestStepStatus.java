package com.test.backend.enums;

/**
 * Enum representing test step execution status.
 */
public enum TestStepStatus {
    NOT_EXECUTED("Not Executed", "Test step has not been executed yet"),
    PASSED("Passed", "Test step execution passed"),
    FAILED("Failed", "Test step execution failed"),
    BLOCKED("Blocked", "Test step execution is blocked"),
    SKIPPED("Skipped", "Test step execution was skipped");

    private final String displayName;
    private final String description;

    TestStepStatus(String displayName, String description) {
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
