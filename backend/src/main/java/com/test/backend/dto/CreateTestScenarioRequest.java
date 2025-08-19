package com.test.backend.dto;

import com.test.backend.enums.TestScenarioPriority;
import com.test.backend.enums.TestScenarioStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;

/**
 * Request DTO for creating a new test scenario.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestScenarioRequest {

    @NotBlank(message = "Test scenario name is required")
    @Size(max = 200, message = "Test scenario name must not exceed 200 characters")
    private String name;
    
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;
    
    @Size(max = 5000, message = "Preconditions must not exceed 5000 characters")
    private String preconditions;
    
    @Size(max = 5000, message = "Expected result must not exceed 5000 characters")
    private String expectedResult;
    
    private TestScenarioPriority priority = TestScenarioPriority.MEDIUM;
    
    private TestScenarioStatus status = TestScenarioStatus.DRAFT;
    
    @Min(value = 1, message = "Estimated duration must be at least 1 minute")
    private Integer estimatedDurationMinutes;
    
    private Long assignedToId;
}
