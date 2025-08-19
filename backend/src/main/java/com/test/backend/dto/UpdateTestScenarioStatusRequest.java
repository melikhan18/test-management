package com.test.backend.dto;

import com.test.backend.enums.TestScenarioStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for updating test scenario status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTestScenarioStatusRequest {
    
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
    
    @NotNull(message = "Test status is required")
    private TestScenarioStatus status;
}
