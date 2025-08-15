package com.test.backend.controller;

import com.test.backend.dto.CreateVersionRequest;
import com.test.backend.dto.VersionDto;
import com.test.backend.service.VersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controller for version management operations.
 */
@RestController
@RequestMapping("/api/v1/companies/{companyId}/projects/{projectId}/versions")
@Tag(name = "Version Management", description = "Version management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class VersionController {

    @Autowired
    private VersionService versionService;

    @Operation(
            summary = "Create Version",
            description = "Create a new version in a project (Owner/Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Version created successfully"),
            @ApiResponse(responseCode = "400", description = "Version name already exists or invalid data"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - Owner/Admin only"),
            @ApiResponse(responseCode = "404", description = "Company or project not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<VersionDto> createVersion(@PathVariable Long companyId,
                                                   @PathVariable Long projectId,
                                                   @Valid @RequestBody CreateVersionRequest request) {
        String userEmail = getCurrentUserEmail();
        VersionDto version = versionService.createVersion(companyId, projectId, request, userEmail);
        return ResponseEntity.ok(version);
    }

    @Operation(
            summary = "Get Project Versions",
            description = "Get all versions in a project"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Versions retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this company"),
            @ApiResponse(responseCode = "404", description = "Company or project not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<VersionDto>> getProjectVersions(@PathVariable Long companyId,
                                                              @PathVariable Long projectId) {
        String userEmail = getCurrentUserEmail();
        List<VersionDto> versions = versionService.getProjectVersions(companyId, projectId, userEmail);
        return ResponseEntity.ok(versions);
    }

    @Operation(
            summary = "Get Version",
            description = "Get version details by ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Version details retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this company"),
            @ApiResponse(responseCode = "404", description = "Version, project or company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{versionId}")
    public ResponseEntity<VersionDto> getVersion(@PathVariable Long companyId,
                                                @PathVariable Long projectId,
                                                @PathVariable Long versionId) {
        String userEmail = getCurrentUserEmail();
        VersionDto version = versionService.getVersion(companyId, projectId, versionId, userEmail);
        return ResponseEntity.ok(version);
    }

    @Operation(
            summary = "Update Version",
            description = "Update version details (Owner/Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Version updated successfully"),
            @ApiResponse(responseCode = "400", description = "Version name already exists or invalid data"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - Owner/Admin only"),
            @ApiResponse(responseCode = "404", description = "Version, project or company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{versionId}")
    public ResponseEntity<VersionDto> updateVersion(@PathVariable Long companyId,
                                                   @PathVariable Long projectId,
                                                   @PathVariable Long versionId,
                                                   @Valid @RequestBody CreateVersionRequest request) {
        String userEmail = getCurrentUserEmail();
        VersionDto version = versionService.updateVersion(companyId, projectId, versionId, request, userEmail);
        return ResponseEntity.ok(version);
    }

    @Operation(
            summary = "Delete Version",
            description = "Delete a version (soft delete) (Owner/Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Version deleted successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - Owner/Admin only"),
            @ApiResponse(responseCode = "404", description = "Version, project or company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{versionId}")
    public ResponseEntity<Void> deleteVersion(@PathVariable Long companyId,
                                             @PathVariable Long projectId,
                                             @PathVariable Long versionId) {
        String userEmail = getCurrentUserEmail();
        versionService.deleteVersion(companyId, projectId, versionId, userEmail);
        return ResponseEntity.ok().build();
    }

    /**
     * Get current authenticated user's email.
     */
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
