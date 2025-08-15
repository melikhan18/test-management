package com.test.backend.controller;

import com.test.backend.dto.CompanyInvitationDto;
import com.test.backend.dto.CreateInvitationRequest;
import com.test.backend.service.CompanyInvitationService;
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
 * Controller for company invitation management operations.
 */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Company Invitations", description = "Company invitation management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class CompanyInvitationController {

    @Autowired
    private CompanyInvitationService invitationService;

    @Operation(
            summary = "Send Company Invitation",
            description = "Send an invitation to join a company (Owner/Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Invitation sent successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request or user already member/invited"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - Owner/Admin only"),
            @ApiResponse(responseCode = "404", description = "Company or user not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/companies/{companyId}/invitations")
    public ResponseEntity<CompanyInvitationDto> sendInvitation(@PathVariable Long companyId,
                                                              @RequestBody CreateInvitationRequest request) {
        String userEmail = getCurrentUserEmail();
        CompanyInvitationDto invitation = invitationService.sendInvitation(companyId, request, userEmail);
        return ResponseEntity.ok(invitation);
    }

    @Operation(
            summary = "Get Company Invitations",
            description = "Get all invitations sent for a company (Owner/Admin only)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company invitations retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Access denied - Owner/Admin only"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/companies/{companyId}/invitations")
    public ResponseEntity<List<CompanyInvitationDto>> getCompanyInvitations(@PathVariable Long companyId) {
        String userEmail = getCurrentUserEmail();
        List<CompanyInvitationDto> invitations = invitationService.getCompanyInvitations(companyId, userEmail);
        return ResponseEntity.ok(invitations);
    }

    @Operation(
            summary = "Get User Invitations",
            description = "Get all invitations received by the authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User invitations retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/invitations")
    public ResponseEntity<List<CompanyInvitationDto>> getUserInvitations() {
        String userEmail = getCurrentUserEmail();
        List<CompanyInvitationDto> invitations = invitationService.getUserInvitations(userEmail);
        return ResponseEntity.ok(invitations);
    }

    @Operation(
            summary = "Get Pending Invitations",
            description = "Get pending invitations for the authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pending invitations retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/invitations/pending")
    public ResponseEntity<List<CompanyInvitationDto>> getPendingInvitations() {
        String userEmail = getCurrentUserEmail();
        List<CompanyInvitationDto> invitations = invitationService.getPendingInvitations(userEmail);
        return ResponseEntity.ok(invitations);
    }

    @Operation(
            summary = "Accept Invitation",
            description = "Accept a company invitation"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Invitation accepted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid token or invitation already responded/expired"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Invitation not for this user"),
            @ApiResponse(responseCode = "404", description = "Invitation not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/invitations/{token}/accept")
    public ResponseEntity<CompanyInvitationDto> acceptInvitation(@PathVariable String token) {
        String userEmail = getCurrentUserEmail();
        CompanyInvitationDto invitation = invitationService.acceptInvitation(token, userEmail);
        return ResponseEntity.ok(invitation);
    }

    @Operation(
            summary = "Reject Invitation",
            description = "Reject a company invitation"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Invitation rejected successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid token or invitation already responded"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "403", description = "Invitation not for this user"),
            @ApiResponse(responseCode = "404", description = "Invitation not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/invitations/{token}/reject")
    public ResponseEntity<CompanyInvitationDto> rejectInvitation(@PathVariable String token) {
        String userEmail = getCurrentUserEmail();
        CompanyInvitationDto invitation = invitationService.rejectInvitation(token, userEmail);
        return ResponseEntity.ok(invitation);
    }

    /**
     * Get current authenticated user's email.
     */
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
