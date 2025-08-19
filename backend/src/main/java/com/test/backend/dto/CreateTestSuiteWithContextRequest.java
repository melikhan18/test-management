package com.test.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Combined request DTO for creating test suites with hierarchy context.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestSuiteWithContextRequest {
    
    @NotNull(message = "Context is required")
    @Valid
    private TestSuiteRequestDto context;
    
    @NotNull(message = "Test suite data is required")
    @Valid
    private CreateTestSuiteRequest testSuite;
}
