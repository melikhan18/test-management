package com.test.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for assigning a user to a test scenario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignUserToTestScenarioRequest {
    
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
    
    @NotBlank(message = "Assigned user email is required")
    private String assignedUserEmail;
}
