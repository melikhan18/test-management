package com.test.backend.controller;

import com.test.backend.dto.*;
import com.test.backend.service.TestFeatureService;
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
 * REST controller for test feature management operations.
 * Simple endpoints without complex hierarchy in URLs.
 */
@RestController
@RequestMapping("/api/v1/test-features")
@RequiredArgsConstructor
@Tag(name = "Test Feature Management", description = "APIs for managing test features")
@SecurityRequirement(name = "bearerAuth")
public class TestFeatureController {

    private final TestFeatureService testFeatureService;

    @Operation(summary = "Create a new test feature", description = "Create a new test feature with hierarchy context")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Test feature created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Parent resource not found"),
            @ApiResponse(responseCode = "409", description = "Test feature name already exists")
    })
    @PostMapping
    public ResponseEntity<TestFeatureDto> createTestFeature(
            @Valid @RequestBody CreateTestFeatureWithContextRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestFeatureRequestDto context = request.getContext();
        TestFeatureDto testFeature = testFeatureService.createTestFeature(
                context.getCompanyId(), 
                context.getProjectId(), 
                context.getPlatformId(), 
                context.getVersionId(),
                context.getTestSuiteId(),
                request.getTestFeature(), 
                userEmail
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(testFeature);
    }

    @Operation(summary = "Get test features by suite", description = "Retrieve all test features for a specific test suite")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test features retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test suite not found")
    })
    @GetMapping
    public ResponseEntity<List<TestFeatureDto>> getTestFeaturesByTestSuite(
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        List<TestFeatureDto> testFeatures = testFeatureService.getTestFeaturesByTestSuite(
                companyId, projectId, platformId, versionId, testSuiteId, userEmail);
        return ResponseEntity.ok(testFeatures);
    }

    @Operation(summary = "Get test feature by ID", description = "Retrieve a specific test feature by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test feature retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test feature not found")
    })
    @GetMapping("/{testFeatureId}")
    public ResponseEntity<TestFeatureDto> getTestFeature(
            @Parameter(description = "Test Feature ID", required = true) @PathVariable Long testFeatureId,
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestFeatureDto testFeature = testFeatureService.getTestFeature(
                companyId, projectId, platformId, versionId, testSuiteId, testFeatureId, userEmail);
        return ResponseEntity.ok(testFeature);
    }

    @Operation(summary = "Update test feature", description = "Update an existing test feature's details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test feature updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test feature not found"),
            @ApiResponse(responseCode = "409", description = "Test feature name already exists")
    })
    @PutMapping("/{testFeatureId}")
    public ResponseEntity<TestFeatureDto> updateTestFeature(
            @Parameter(description = "Test Feature ID", required = true) @PathVariable Long testFeatureId,
            @Valid @RequestBody CreateTestFeatureWithContextRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestFeatureRequestDto context = request.getContext();
        TestFeatureDto testFeature = testFeatureService.updateTestFeature(
                context.getCompanyId(), 
                context.getProjectId(), 
                context.getPlatformId(), 
                context.getVersionId(),
                context.getTestSuiteId(),
                testFeatureId,
                request.getTestFeature(), 
                userEmail
        );
        return ResponseEntity.ok(testFeature);
    }

    @Operation(summary = "Delete test feature", description = "Soft delete a test feature")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Test feature deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test feature not found")
    })
    @DeleteMapping("/{testFeatureId}")
    public ResponseEntity<Void> deleteTestFeature(
            @Parameter(description = "Test Feature ID", required = true) @PathVariable Long testFeatureId,
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        testFeatureService.deleteTestFeature(
                companyId, projectId, platformId, versionId, testSuiteId, testFeatureId, userEmail);
        return ResponseEntity.noContent().build();
    }
}
