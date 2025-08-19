package com.test.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for operations that require hierarchy context.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestSuiteRequestDto {
    
    @NotNull(message = "Company ID is required")
    private Long companyId;
    
    @NotNull(message = "Project ID is required")
    private Long projectId;
    
    @NotNull(message = "Platform ID is required")
    private Long platformId;
    
    @NotNull(message = "Version ID is required")
    private Long versionId;
    
    // TestSuite specific data will be in CreateTestSuiteRequest
}
