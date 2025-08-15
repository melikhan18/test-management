package com.test.backend.controller;

import com.test.backend.dto.CreateVersionRequest;
import com.test.backend.dto.VersionDto;
import com.test.backend.service.VersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST controller for version management operations.
 * Handles CRUD operations for versions within platforms.
 */
@RestController
@RequestMapping("/api/v1/companies/{companyId}/projects/{projectId}/platforms/{platformId}/versions")
@RequiredArgsConstructor
@Tag(name = "Version Management", description = "APIs for managing versions within platforms")
@SecurityRequirement(name = "bearerAuth")
public class VersionController {

    private final VersionService versionService;

    @Operation(summary = "Create a new version", description = "Create a new version in a platform")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Version created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Company, project, or platform not found"),
            @ApiResponse(responseCode = "409", description = "Version name already exists in this platform")
    })
    @PostMapping
    public ResponseEntity<VersionDto> createVersion(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Platform ID", required = true) @PathVariable Long platformId,
            @Valid @RequestBody CreateVersionRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        VersionDto version = versionService.createVersion(companyId, projectId, platformId, request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(version);
    }

    @Operation(summary = "Get all versions", description = "Retrieve all versions for a specific platform")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Company, project, or platform not found")
    })
    @GetMapping
    public ResponseEntity<List<VersionDto>> getPlatformVersions(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Platform ID", required = true) @PathVariable Long platformId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        List<VersionDto> versions = versionService.getPlatformVersions(companyId, projectId, platformId, userEmail);
        return ResponseEntity.ok(versions);
    }

    @Operation(summary = "Get version by ID", description = "Retrieve a specific version by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Version retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Version, platform, project, or company not found")
    })
    @GetMapping("/{versionId}")
    public ResponseEntity<VersionDto> getVersion(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Platform ID", required = true) @PathVariable Long platformId,
            @Parameter(description = "Version ID", required = true) @PathVariable Long versionId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        VersionDto version = versionService.getVersion(companyId, projectId, platformId, versionId, userEmail);
        return ResponseEntity.ok(version);
    }

    @Operation(summary = "Update version", description = "Update an existing version's details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Version updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Version, platform, project, or company not found"),
            @ApiResponse(responseCode = "409", description = "Version name already exists in this platform")
    })
    @PutMapping("/{versionId}")
    public ResponseEntity<VersionDto> updateVersion(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Platform ID", required = true) @PathVariable Long platformId,
            @Parameter(description = "Version ID", required = true) @PathVariable Long versionId,
            @Valid @RequestBody CreateVersionRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        VersionDto version = versionService.updateVersion(companyId, projectId, platformId, versionId, request, userEmail);
        return ResponseEntity.ok(version);
    }

    @Operation(summary = "Delete version", description = "Soft delete a version (marks as deleted but preserves data)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Version deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Version, platform, project, or company not found")
    })
    @DeleteMapping("/{versionId}")
    public ResponseEntity<Void> deleteVersion(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Platform ID", required = true) @PathVariable Long platformId,
            @Parameter(description = "Version ID", required = true) @PathVariable Long versionId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        versionService.deleteVersion(companyId, projectId, platformId, versionId, userEmail);
        return ResponseEntity.noContent().build();
    }
}
