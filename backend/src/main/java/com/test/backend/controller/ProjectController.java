package com.test.backend.controller;

import com.test.backend.dto.CreateProjectRequest;
import com.test.backend.dto.ProjectDto;
import com.test.backend.service.ProjectService;
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

import java.util.List;

/**
 * Controller for project management operations.
 */
@RestController
@RequestMapping("/api/v1/companies/{companyId}/projects")
@Tag(name = "Project Management", description = "Project management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Operation(
            summary = "Create Project",
            description = "Create a new project in a company (Owner/Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project created successfully"),
            @ApiResponse(responseCode = "400", description = "Project name already exists or invalid data"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - Owner/Admin only"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@PathVariable Long companyId,
                                                   @RequestBody CreateProjectRequest request) {
        String userEmail = getCurrentUserEmail();
        ProjectDto project = projectService.createProject(companyId, request, userEmail);
        return ResponseEntity.ok(project);
    }

    @Operation(
            summary = "Get Company Projects",
            description = "Get all projects in a company"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this company"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<ProjectDto>> getCompanyProjects(@PathVariable Long companyId) {
        String userEmail = getCurrentUserEmail();
        List<ProjectDto> projects = projectService.getCompanyProjects(companyId, userEmail);
        return ResponseEntity.ok(projects);
    }

    @Operation(
            summary = "Get Project",
            description = "Get project details by ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project details retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this company"),
            @ApiResponse(responseCode = "404", description = "Project or company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDto> getProject(@PathVariable Long companyId,
                                                @PathVariable Long projectId) {
        String userEmail = getCurrentUserEmail();
        ProjectDto project = projectService.getProject(companyId, projectId, userEmail);
        return ResponseEntity.ok(project);
    }

    @Operation(
            summary = "Update Project",
            description = "Update project details (Owner/Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project updated successfully"),
            @ApiResponse(responseCode = "400", description = "Project name already exists or invalid data"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - Owner/Admin only"),
            @ApiResponse(responseCode = "404", description = "Project or company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long companyId,
                                                   @PathVariable Long projectId,
                                                   @RequestBody CreateProjectRequest request) {
        String userEmail = getCurrentUserEmail();
        ProjectDto project = projectService.updateProject(companyId, projectId, request, userEmail);
        return ResponseEntity.ok(project);
    }

    @Operation(
            summary = "Delete Project",
            description = "Delete a project (soft delete) (Owner/Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project deleted successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - Owner/Admin only"),
            @ApiResponse(responseCode = "404", description = "Project or company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long companyId,
                                             @PathVariable Long projectId) {
        String userEmail = getCurrentUserEmail();
        projectService.deleteProject(companyId, projectId, userEmail);
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
