package com.test.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for test scenario operations that require hierarchy context.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestScenarioRequestDto {
    
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
    
    // TestScenario specific data will be in CreateTestScenarioRequest
}
