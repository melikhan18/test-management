package com.test.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Request DTO for reordering test steps
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReorderTestStepsRequest {
    
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
    
    @NotNull(message = "Step orders are required")
    private List<StepOrderDto> stepOrders;
    
    /**
     * DTO for step order information
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StepOrderDto {
        @NotNull(message = "Step ID is required")
        private Long stepId;
        
        @NotNull(message = "Step order is required")
        private Integer stepOrder;
    }
}
