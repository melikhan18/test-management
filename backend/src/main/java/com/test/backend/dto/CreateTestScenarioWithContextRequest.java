package com.test.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Combined request DTO for creating test scenarios with hierarchy context.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestScenarioWithContextRequest {
    
    @NotNull(message = "Context is required")
    @Valid
    private TestScenarioRequestDto context;
    
    @NotNull(message = "Test scenario data is required")
    @Valid
    private CreateTestScenarioRequest testScenario;
}
