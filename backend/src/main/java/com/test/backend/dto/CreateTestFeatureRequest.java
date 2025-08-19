package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating a new test feature.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestFeatureRequest {
    
    @NotBlank(message = "Test feature name is required")
    @Size(max = 200, message = "Test feature name must not exceed 200 characters")
    private String name;
    
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;
}
