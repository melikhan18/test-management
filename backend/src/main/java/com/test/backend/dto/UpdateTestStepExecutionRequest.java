package com.test.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for updating test step execution
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTestStepExecutionRequest {
    
    @NotNull(message = "Company ID is required")
    private Long companyId;
    
    @NotNull(message = "Project ID is required")
    private Long projectId;
    
    @NotNull(message = "Platform ID is required")
    private Long platformId;
    
    @NotNull(message = "Version ID is required")
    private Long versionId;
    
    @NotNull(message = "Test Suite ID is required")
    private Long testSuiteId;
    
    @NotNull(message = "Test Feature ID is required")
    private Long testFeatureId;
    
    @NotNull(message = "Test Scenario ID is required")
    private Long testScenarioId;
    
    @Size(max = 1000, message = "Actual result must not exceed 1000 characters")
    private String actualResult;
    
    @Size(max = 1000, message = "Execution notes must not exceed 1000 characters")
    private String executionNotes;
}
