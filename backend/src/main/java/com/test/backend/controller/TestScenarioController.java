package com.test.backend.controller;

import com.test.backend.dto.*;
import com.test.backend.service.TestScenarioService;
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
 * REST controller for test scenario management operations.
 * Simple endpoints without complex hierarchy in URLs.
 */
@RestController
@RequestMapping("/api/v1/test-scenarios")
@RequiredArgsConstructor
@Tag(name = "Test Scenario Management", description = "APIs for managing test scenarios")
@SecurityRequirement(name = "bearerAuth")
public class TestScenarioController {

    private final TestScenarioService testScenarioService;

    @Operation(summary = "Create a new test scenario", description = "Create a new test scenario with hierarchy context")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Test scenario created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Parent resource not found"),
            @ApiResponse(responseCode = "409", description = "Test scenario name already exists")
    })
    @PostMapping
    public ResponseEntity<TestScenarioDto> createTestScenario(
            @Valid @RequestBody CreateTestScenarioWithContextRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestScenarioRequestDto context = request.getContext();
        TestScenarioDto testScenario = testScenarioService.createTestScenario(
                context.getCompanyId(), 
                context.getProjectId(), 
                context.getPlatformId(), 
                context.getVersionId(),
                context.getTestSuiteId(),
                context.getTestFeatureId(),
                request.getTestScenario(), 
                userEmail
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(testScenario);
    }

    @Operation(summary = "Get test scenarios by feature", description = "Retrieve all test scenarios for a specific test feature")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test scenarios retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test feature not found")
    })
    @GetMapping
    public ResponseEntity<List<TestScenarioDto>> getTestScenariosByTestFeature(
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            @Parameter(description = "Test Feature ID", required = true) @RequestParam Long testFeatureId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        List<TestScenarioDto> testScenarios = testScenarioService.getTestScenariosByTestFeature(
                companyId, projectId, platformId, versionId, testSuiteId, testFeatureId, userEmail);
        return ResponseEntity.ok(testScenarios);
    }

    @Operation(summary = "Get test scenario by ID", description = "Retrieve a specific test scenario by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test scenario retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test scenario not found")
    })
    @GetMapping("/{testScenarioId}")
    public ResponseEntity<TestScenarioDto> getTestScenario(
            @Parameter(description = "Test Scenario ID", required = true) @PathVariable Long testScenarioId,
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            @Parameter(description = "Test Feature ID", required = true) @RequestParam Long testFeatureId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestScenarioDto testScenario = testScenarioService.getTestScenario(
                companyId, projectId, platformId, versionId, testSuiteId, testFeatureId, testScenarioId, userEmail);
        return ResponseEntity.ok(testScenario);
    }

    @Operation(summary = "Update test scenario", description = "Update an existing test scenario's details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test scenario updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test scenario not found"),
            @ApiResponse(responseCode = "409", description = "Test scenario name already exists")
    })
    @PutMapping("/{testScenarioId}")
    public ResponseEntity<TestScenarioDto> updateTestScenario(
            @Parameter(description = "Test Scenario ID", required = true) @PathVariable Long testScenarioId,
            @Valid @RequestBody CreateTestScenarioWithContextRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestScenarioRequestDto context = request.getContext();
        TestScenarioDto testScenario = testScenarioService.updateTestScenario(
                context.getCompanyId(), 
                context.getProjectId(), 
                context.getPlatformId(), 
                context.getVersionId(),
                context.getTestSuiteId(),
                context.getTestFeatureId(),
                testScenarioId,
                request.getTestScenario(), 
                userEmail
        );
        return ResponseEntity.ok(testScenario);
    }

    @Operation(summary = "Delete test scenario", description = "Soft delete a test scenario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Test scenario deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test scenario not found")
    })
    @DeleteMapping("/{testScenarioId}")
    public ResponseEntity<Void> deleteTestScenario(
            @Parameter(description = "Test Scenario ID", required = true) @PathVariable Long testScenarioId,
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            @Parameter(description = "Test Feature ID", required = true) @RequestParam Long testFeatureId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        testScenarioService.deleteTestScenario(
                companyId, projectId, platformId, versionId, testSuiteId, testFeatureId, testScenarioId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Assign user to test scenario", description = "Assign a user to a test scenario for execution")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User assigned successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test scenario or user not found")
    })
    @PutMapping("/{testScenarioId}/assign")
    public ResponseEntity<TestScenarioDto> assignUserToTestScenario(
            @Parameter(description = "Test Scenario ID", required = true) @PathVariable Long testScenarioId,
            @Valid @RequestBody AssignUserToTestScenarioRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestScenarioDto testScenario = testScenarioService.assignUserToTestScenario(
                request.getCompanyId(),
                request.getProjectId(),
                request.getPlatformId(),
                request.getVersionId(),
                request.getTestSuiteId(),
                request.getTestFeatureId(),
                testScenarioId,
                request.getAssignedUserEmail(),
                userEmail
        );
        return ResponseEntity.ok(testScenario);
    }

    @Operation(summary = "Update test scenario status", description = "Update the execution status of a test scenario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test scenario not found")
    })
    @PutMapping("/{testScenarioId}/status")
    public ResponseEntity<TestScenarioDto> updateTestScenarioStatus(
            @Parameter(description = "Test Scenario ID", required = true) @PathVariable Long testScenarioId,
            @Valid @RequestBody UpdateTestScenarioStatusRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestScenarioDto testScenario = testScenarioService.updateTestScenarioStatus(
                request.getCompanyId(),
                request.getProjectId(),
                request.getPlatformId(),
                request.getVersionId(),
                request.getTestSuiteId(),
                request.getTestFeatureId(),
                testScenarioId,
                request.getStatus(),
                userEmail
        );
        return ResponseEntity.ok(testScenario);
    }
}
