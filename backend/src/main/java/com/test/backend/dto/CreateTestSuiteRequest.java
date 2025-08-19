package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating a new test suite.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTestSuiteRequest {
    
    @NotBlank(message = "Test suite name is required")
    @Size(max = 200, message = "Test suite name must not exceed 200 characters")
    private String name;
    
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;
}
