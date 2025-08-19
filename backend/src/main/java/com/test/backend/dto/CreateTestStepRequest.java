package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;

/**
 * Request DTO for creating a new test step.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestStepRequest {
    
    @NotNull(message = "Step order is required")
    @Min(value = 1, message = "Step order must be at least 1")
    private Integer stepOrder;
    
    @NotBlank(message = "Action is required")
    @Size(max = 5000, message = "Action must not exceed 5000 characters")
    private String action;
    
    @Size(max = 5000, message = "Expected result must not exceed 5000 characters")
    private String expectedResult;
    
    @Size(max = 5000, message = "Notes must not exceed 5000 characters")
    private String notes;
}
