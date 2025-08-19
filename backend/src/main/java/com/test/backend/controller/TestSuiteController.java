package com.test.backend.controller;

import com.test.backend.dto.*;
import com.test.backend.service.TestSuiteService;
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
 * REST controller for test suite management operations.
 * Simple endpoints without complex hierarchy in URLs.
 */
@RestController
@RequestMapping("/api/v1/test-suites")
@RequiredArgsConstructor
@Tag(name = "Test Suite Management", description = "APIs for managing test suites")
@SecurityRequirement(name = "bearerAuth")
public class TestSuiteController {

    private final TestSuiteService testSuiteService;

    @Operation(summary = "Create a new test suite", description = "Create a new test suite with hierarchy context")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Test suite created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Parent resource not found"),
            @ApiResponse(responseCode = "409", description = "Test suite name already exists")
    })
    @PostMapping
    public ResponseEntity<TestSuiteDto> createTestSuite(
            @Valid @RequestBody CreateTestSuiteWithContextRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestSuiteRequestDto context = request.getContext();
        TestSuiteDto testSuite = testSuiteService.createTestSuite(
                context.getCompanyId(), 
                context.getProjectId(), 
                context.getPlatformId(), 
                context.getVersionId(),
                request.getTestSuite(), 
                userEmail
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(testSuite);
    }

    @Operation(summary = "Get test suites by version", description = "Retrieve all test suites for a specific version")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test suites retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Version not found")
    })
    @GetMapping
    public ResponseEntity<List<TestSuiteDto>> getTestSuitesByVersion(
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        List<TestSuiteDto> testSuites = testSuiteService.getTestSuitesByVersion(companyId, projectId, platformId, versionId, userEmail);
        return ResponseEntity.ok(testSuites);
    }

    @Operation(summary = "Get test suite by ID", description = "Retrieve a specific test suite by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test suite retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test suite not found")
    })
    @GetMapping("/{testSuiteId}")
    public ResponseEntity<TestSuiteDto> getTestSuite(
            @Parameter(description = "Test Suite ID", required = true) @PathVariable Long testSuiteId,
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestSuiteDto testSuite = testSuiteService.getTestSuite(companyId, projectId, platformId, versionId, testSuiteId, userEmail);
        return ResponseEntity.ok(testSuite);
    }

    @Operation(summary = "Update test suite", description = "Update an existing test suite's details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test suite updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test suite not found"),
            @ApiResponse(responseCode = "409", description = "Test suite name already exists")
    })
    @PutMapping("/{testSuiteId}")
    public ResponseEntity<TestSuiteDto> updateTestSuite(
            @Parameter(description = "Test Suite ID", required = true) @PathVariable Long testSuiteId,
            @Valid @RequestBody CreateTestSuiteWithContextRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestSuiteRequestDto context = request.getContext();
        TestSuiteDto testSuite = testSuiteService.updateTestSuite(
                context.getCompanyId(), 
                context.getProjectId(), 
                context.getPlatformId(), 
                context.getVersionId(),
                testSuiteId,
                request.getTestSuite(), 
                userEmail
        );
        return ResponseEntity.ok(testSuite);
    }

    @Operation(summary = "Delete test suite", description = "Soft delete a test suite")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Test suite deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test suite not found")
    })
    @DeleteMapping("/{testSuiteId}")
    public ResponseEntity<Void> deleteTestSuite(
            @Parameter(description = "Test Suite ID", required = true) @PathVariable Long testSuiteId,
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        testSuiteService.deleteTestSuite(companyId, projectId, platformId, versionId, testSuiteId, userEmail);
        return ResponseEntity.noContent().build();
    }
}
