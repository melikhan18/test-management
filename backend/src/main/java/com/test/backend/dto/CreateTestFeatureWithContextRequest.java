package com.test.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Combined request DTO for creating test features with hierarchy context.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestFeatureWithContextRequest {
    
    @NotNull(message = "Context is required")
    @Valid
    private TestFeatureRequestDto context;
    
    @NotNull(message = "Test feature data is required")
    @Valid
    private CreateTestFeatureRequest testFeature;
}
