package com.test.backend.dto;

import com.test.backend.enums.PlatformType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * Response DTO for platform information.
 */
@Schema(description = "Platform information response")
public record PlatformDto(
    @Schema(description = "Platform ID", example = "1")
    Long id,
    
    @Schema(description = "Platform name", example = "Android App")
    String name,
    
    @Schema(description = "Platform description", example = "Android mobile application")
    String description,
    
    @Schema(description = "Platform type", example = "ANDROID")
    PlatformType platformType,
    
    @Schema(description = "Project ID", example = "1")
    Long projectId,
    
    @Schema(description = "Project name", example = "E-commerce App")
    String projectName,
    
    @Schema(description = "Number of versions in this platform", example = "5")
    int versionCount,
    
    @Schema(description = "Platform creation date")
    LocalDateTime createdAt,
    
    @Schema(description = "Platform last update date")
    LocalDateTime updatedAt
) {}
