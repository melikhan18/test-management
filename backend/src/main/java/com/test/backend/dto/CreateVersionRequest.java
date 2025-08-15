package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for creating a version.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateVersionRequest {
    
    @NotBlank(message = "Version name is required")
    @Size(min = 1, max = 50, message = "Version name must be between 1 and 50 characters")
    private String versionName;
}
