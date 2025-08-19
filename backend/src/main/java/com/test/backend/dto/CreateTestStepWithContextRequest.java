package com.test.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Combined request DTO for creating test steps with hierarchy context.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestStepWithContextRequest {
    
    @NotNull(message = "Context is required")
    @Valid
    private TestStepRequestDto context;
    
    @NotNull(message = "Test step data is required")
    @Valid
    private CreateTestStepRequest testStep;
}
