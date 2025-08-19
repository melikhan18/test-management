package com.test.backend.controller;

import com.test.backend.dto.*;
import com.test.backend.service.TestStepService;
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
 * REST controller for test step management operations.
 * Simple endpoints without complex hierarchy in URLs.
 */
@RestController
@RequestMapping("/api/v1/test-steps")
@RequiredArgsConstructor
@Tag(name = "Test Step Management", description = "APIs for managing test steps")
@SecurityRequirement(name = "bearerAuth")
public class TestStepController {

    private final TestStepService testStepService;

    @Operation(summary = "Create a new test step", description = "Create a new test step with hierarchy context")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Test step created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Parent resource not found")
    })
    @PostMapping
    public ResponseEntity<TestStepDto> createTestStep(
            @Valid @RequestBody CreateTestStepWithContextRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestStepRequestDto context = request.getContext();
        TestStepDto testStep = testStepService.createTestStep(
                context.getCompanyId(), 
                context.getProjectId(), 
                context.getPlatformId(), 
                context.getVersionId(),
                context.getTestSuiteId(),
                context.getTestFeatureId(),
                context.getTestScenarioId(),
                request.getTestStep(), 
                userEmail
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(testStep);
    }

    @Operation(summary = "Get test steps by scenario", description = "Retrieve all test steps for a specific test scenario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test steps retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test scenario not found")
    })
    @GetMapping
    public ResponseEntity<List<TestStepDto>> getTestStepsByTestScenario(
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            @Parameter(description = "Test Feature ID", required = true) @RequestParam Long testFeatureId,
            @Parameter(description = "Test Scenario ID", required = true) @RequestParam Long testScenarioId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        List<TestStepDto> testSteps = testStepService.getTestStepsByTestScenario(
                companyId, projectId, platformId, versionId, testSuiteId, testFeatureId, testScenarioId, userEmail);
        return ResponseEntity.ok(testSteps);
    }

    @Operation(summary = "Get test step by ID", description = "Retrieve a specific test step by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test step retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test step not found")
    })
    @GetMapping("/{testStepId}")
    public ResponseEntity<TestStepDto> getTestStep(
            @Parameter(description = "Test Step ID", required = true) @PathVariable Long testStepId,
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            @Parameter(description = "Test Feature ID", required = true) @RequestParam Long testFeatureId,
            @Parameter(description = "Test Scenario ID", required = true) @RequestParam Long testScenarioId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestStepDto testStep = testStepService.getTestStep(
                companyId, projectId, platformId, versionId, testSuiteId, testFeatureId, testScenarioId, testStepId, userEmail);
        return ResponseEntity.ok(testStep);
    }

    @Operation(summary = "Update test step", description = "Update an existing test step's details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test step updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test step not found")
    })
    @PutMapping("/{testStepId}")
    public ResponseEntity<TestStepDto> updateTestStep(
            @Parameter(description = "Test Step ID", required = true) @PathVariable Long testStepId,
            @Valid @RequestBody CreateTestStepWithContextRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestStepRequestDto context = request.getContext();
        TestStepDto testStep = testStepService.updateTestStep(
                context.getCompanyId(), 
                context.getProjectId(), 
                context.getPlatformId(), 
                context.getVersionId(),
                context.getTestSuiteId(),
                context.getTestFeatureId(),
                context.getTestScenarioId(),
                testStepId,
                request.getTestStep(), 
                userEmail
        );
        return ResponseEntity.ok(testStep);
    }

    @Operation(summary = "Delete test step", description = "Soft delete a test step")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Test step deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test step not found")
    })
    @DeleteMapping("/{testStepId}")
    public ResponseEntity<Void> deleteTestStep(
            @Parameter(description = "Test Step ID", required = true) @PathVariable Long testStepId,
            @Parameter(description = "Company ID", required = true) @RequestParam Long companyId,
            @Parameter(description = "Project ID", required = true) @RequestParam Long projectId,
            @Parameter(description = "Platform ID", required = true) @RequestParam Long platformId,
            @Parameter(description = "Version ID", required = true) @RequestParam Long versionId,
            @Parameter(description = "Test Suite ID", required = true) @RequestParam Long testSuiteId,
            @Parameter(description = "Test Feature ID", required = true) @RequestParam Long testFeatureId,
            @Parameter(description = "Test Scenario ID", required = true) @RequestParam Long testScenarioId,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        testStepService.deleteTestStep(
                companyId, projectId, platformId, versionId, testSuiteId, testFeatureId, testScenarioId, testStepId, userEmail);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Reorder test steps", description = "Update the order of test steps within a test scenario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test steps reordered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid step order data"),
            @ApiResponse(responseCode = "403", description = "Access denied - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Test scenario not found")
    })
    @PutMapping("/reorder")
    public ResponseEntity<List<TestStepDto>> reorderTestSteps(
            @Valid @RequestBody ReorderTestStepsRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        List<TestStepDto> testSteps = testStepService.reorderTestSteps(
                request.getCompanyId(),
                request.getProjectId(),
                request.getPlatformId(),
                request.getVersionId(),
                request.getTestSuiteId(),
                request.getTestFeatureId(),
                request.getTestScenarioId(),
                request.getStepOrders(),
                userEmail
        );
        return ResponseEntity.ok(testSteps);
    }

    @Operation(summary = "Update test step execution", description = "Update the execution result of a test step")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test step execution updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid execution data"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Test step not found")
    })
    @PutMapping("/{testStepId}/execution")
    public ResponseEntity<TestStepDto> updateTestStepExecution(
            @Parameter(description = "Test Step ID", required = true) @PathVariable Long testStepId,
            @Valid @RequestBody UpdateTestStepExecutionRequest request,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        TestStepDto testStep = testStepService.updateTestStepExecution(
                request.getCompanyId(),
                request.getProjectId(),
                request.getPlatformId(),
                request.getVersionId(),
                request.getTestSuiteId(),
                request.getTestFeatureId(),
                request.getTestScenarioId(),
                testStepId,
                request.getActualResult(),
                request.getExecutionNotes(),
                userEmail
        );
        return ResponseEntity.ok(testStep);
    }
}
