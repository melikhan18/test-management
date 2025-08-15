package com.test.backend.dto;

import com.test.backend.enums.PlatformType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for updating an existing platform.
 */
@Schema(description = "Request payload for updating an existing platform")
public record UpdatePlatformRequest(
    @Schema(description = "Platform name", example = "Android App v2")
    @NotBlank(message = "Platform name is required")
    @Size(min = 1, max = 100, message = "Platform name must be between 1 and 100 characters")
    String name,
    
    @Schema(description = "Platform description", example = "Updated Android mobile application")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    String description,
    
    @Schema(description = "Platform type", example = "ANDROID")
    @NotNull(message = "Platform type is required")
    PlatformType platformType
) {}
