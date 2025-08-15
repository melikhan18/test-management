package com.test.backend.controller;

import com.test.backend.dto.CreatePlatformRequest;
import com.test.backend.dto.PlatformDto;
import com.test.backend.dto.UpdatePlatformRequest;
import com.test.backend.service.PlatformService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * REST controller for platform management operations.
 * Handles CRUD operations for platforms within projects.
 */
@RestController
@RequestMapping("/api/v1/companies/{companyId}/projects/{projectId}/platforms")
@RequiredArgsConstructor
@Tag(name = "Platform Management", description = "APIs for managing platforms within projects")
public class PlatformController {

    private final PlatformService platformService;

    @Operation(summary = "Create a new platform", description = "Create a new platform in a project with the specified platform type")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Platform created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Company or project not found"),
            @ApiResponse(responseCode = "409", description = "Platform name already exists in this project")
    })
    @PostMapping
    public ResponseEntity<PlatformDto> createPlatform(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Valid @RequestBody CreatePlatformRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        PlatformDto platform = platformService.createPlatform(companyId, projectId, request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(platform);
    }

    @Operation(summary = "Get all platforms", description = "Retrieve all platforms for a specific project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Platforms retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Company or project not found")
    })
    @GetMapping
    public ResponseEntity<List<PlatformDto>> getPlatformsByProject(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        List<PlatformDto> platforms = platformService.getPlatformsByProject(companyId, projectId, userEmail);
        return ResponseEntity.ok(platforms);
    }

    @Operation(summary = "Get platform by ID", description = "Retrieve a specific platform by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Platform retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Platform, project, or company not found")
    })
    @GetMapping("/{platformId}")
    public ResponseEntity<PlatformDto> getPlatformById(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Platform ID", required = true) @PathVariable Long platformId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        PlatformDto platform = platformService.getPlatformById(companyId, projectId, platformId, userEmail);
        return ResponseEntity.ok(platform);
    }

    @Operation(summary = "Update platform", description = "Update an existing platform's details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Platform updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Platform, project, or company not found"),
            @ApiResponse(responseCode = "409", description = "Platform name already exists in this project")
    })
    @PutMapping("/{platformId}")
    public ResponseEntity<PlatformDto> updatePlatform(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Platform ID", required = true) @PathVariable Long platformId,
            @Valid @RequestBody UpdatePlatformRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        PlatformDto platform = platformService.updatePlatform(companyId, projectId, platformId, request, userEmail);
        return ResponseEntity.ok(platform);
    }

    @Operation(summary = "Delete platform", description = "Soft delete a platform (marks as deleted but preserves data)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Platform deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Platform, project, or company not found")
    })
    @DeleteMapping("/{platformId}")
    public ResponseEntity<Void> deletePlatform(
            @Parameter(description = "Company ID", required = true) @PathVariable Long companyId,
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Platform ID", required = true) @PathVariable Long platformId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        platformService.deletePlatform(companyId, projectId, platformId, userEmail);
        return ResponseEntity.noContent().build();
    }
}
