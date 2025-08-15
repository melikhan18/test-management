package com.test.backend.controller;

import com.test.backend.dto.CompanyDto;
import com.test.backend.dto.CompanyMemberDto;
import com.test.backend.dto.CreateCompanyRequest;
import com.test.backend.dto.UserCompanyDto;
import com.test.backend.entity.CompanyRole;
import com.test.backend.service.CompanyService;
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
 * Controller for company management operations.
 */
@RestController
@RequestMapping("/api/v1/companies")
@Tag(name = "Company Management", description = "Company management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Operation(
            summary = "Create Company",
            description = "Create a new company with the authenticated user as owner"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company created successfully"),
            @ApiResponse(responseCode = "400", description = "Company name already exists or invalid data"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<CompanyDto> createCompany(@RequestBody CreateCompanyRequest request) {
        String userEmail = getCurrentUserEmail();
        CompanyDto company = companyService.createCompany(request, userEmail);
        return ResponseEntity.ok(company);
    }

    @Operation(
            summary = "Get User Companies",
            description = "Get all companies where the authenticated user is a member"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Companies retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<CompanyDto>> getUserCompanies() {
        String userEmail = getCurrentUserEmail();
        List<CompanyDto> companies = companyService.getUserCompanies(userEmail);
        return ResponseEntity.ok(companies);
    }

    @Operation(
            summary = "Get User Companies with Roles",
            description = "Get all companies where the authenticated user is a member with user's role information"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Companies with roles retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/with-roles")
    public ResponseEntity<List<UserCompanyDto>> getUserCompaniesWithRoles() {
        String userEmail = getCurrentUserEmail();
        List<UserCompanyDto> companies = companyService.getUserCompaniesWithRole(userEmail);
        return ResponseEntity.ok(companies);
    }

    @Operation(
            summary = "Get Owned Companies",
            description = "Get all companies owned by the authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Owned companies retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/owned")
    public ResponseEntity<List<CompanyDto>> getOwnedCompanies() {
        String userEmail = getCurrentUserEmail();
        List<CompanyDto> companies = companyService.getOwnedCompanies(userEmail);
        return ResponseEntity.ok(companies);
    }

    @Operation(
            summary = "Get Company",
            description = "Get company details by ID (user must be a member)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company details retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this company"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{companyId}")
    public ResponseEntity<CompanyDto> getCompany(@PathVariable Long companyId) {
        String userEmail = getCurrentUserEmail();
        CompanyDto company = companyService.getCompany(companyId, userEmail);
        return ResponseEntity.ok(company);
    }

    @Operation(
            summary = "Get Company Members",
            description = "Get all members of a company (user must be a member)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company members retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this company"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{companyId}/members")
    public ResponseEntity<List<CompanyMemberDto>> getCompanyMembers(@PathVariable Long companyId) {
        String userEmail = getCurrentUserEmail();
        List<CompanyMemberDto> members = companyService.getCompanyMembers(companyId, userEmail);
        return ResponseEntity.ok(members);
    }

    @Operation(
            summary = "Get User Role in Company",
            description = "Get the authenticated user's role in a specific company"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User role retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied to this company"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{companyId}/my-role")
    public ResponseEntity<CompanyRole> getUserRoleInCompany(@PathVariable Long companyId) {
        String userEmail = getCurrentUserEmail();
        CompanyRole role = companyService.getUserRoleInCompany(companyId, userEmail);
        return ResponseEntity.ok(role);
    }

    @Operation(
            summary = "Update Company",
            description = "Update company information (only owner can update)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company updated successfully"),
            @ApiResponse(responseCode = "400", description = "Company name already exists or invalid data"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Only company owner can update"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{companyId}")
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable Long companyId, 
                                                   @RequestBody CreateCompanyRequest request) {
        String userEmail = getCurrentUserEmail();
        CompanyDto company = companyService.updateCompany(companyId, request, userEmail);
        return ResponseEntity.ok(company);
    }

    @Operation(
            summary = "Delete Company",
            description = "Soft delete a company (only owner can delete)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company deleted successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Only company owner can delete"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{companyId}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long companyId) {
        String userEmail = getCurrentUserEmail();
        companyService.deleteCompany(companyId, userEmail);
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
