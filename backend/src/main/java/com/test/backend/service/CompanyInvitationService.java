package com.test.backend.service;

import com.test.backend.dto.CompanyInvitationDto;
import com.test.backend.dto.CreateInvitationRequest;
import com.test.backend.entity.*;
import com.test.backend.enums.InvitationStatus;
import com.test.backend.enums.NotificationType;
import com.test.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for company invitation management.
 */
@Service
public class CompanyInvitationService {

    @Autowired
    private CompanyInvitationRepository invitationRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Send company invitation.
     */
    @Transactional
    public CompanyInvitationDto sendInvitation(Long companyId, CreateInvitationRequest request, String inviterEmail) {
        User inviter = userRepository.findByEmail(inviterEmail)
                .orElseThrow(() -> new RuntimeException("Inviter user not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if inviter has permission (must be OWNER or ADMIN)
        if (!companyMemberRepository.hasRole(inviter, company, CompanyRole.OWNER) &&
            !companyMemberRepository.hasRole(inviter, company, CompanyRole.ADMIN)) {
            throw new RuntimeException("Only company owners and admins can send invitations");
        }

        // Check if user exists
        User invitedUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User with email " + request.getEmail() + " not found"));

        // Check if user is already a member
        if (companyMemberRepository.existsByUserAndCompany(invitedUser, company)) {
            throw new RuntimeException("User is already a member of this company");
        }

        // Check if there's already a pending invitation
        if (invitationRepository.existsByInvitedEmailAndCompanyAndStatus(request.getEmail(), company, InvitationStatus.PENDING)) {
            throw new RuntimeException("There is already a pending invitation for this user");
        }

        // Create invitation
        CompanyInvitation invitation = new CompanyInvitation();
        invitation.setCompany(company);
        invitation.setInvitedBy(inviter);
        invitation.setInvitedUser(invitedUser);
        invitation.setInvitedEmail(request.getEmail());
        invitation.setRole(request.getRole());
        invitation.setMessage(request.getMessage());
        invitation.setInvitationToken(UUID.randomUUID().toString());

        invitation = invitationRepository.save(invitation);

        // Create notification for invited user
        String notificationTitle = "Company Invitation";
        String notificationMessage = String.format("%s %s invited you to join %s as %s",
                inviter.getUsername(), inviter.getSurname(), company.getName(), request.getRole().getDisplayName());
        String actionUrl = "/invitations/" + invitation.getInvitationToken();

        notificationService.createNotification(
                invitedUser.getEmail(),
                NotificationType.COMPANY_INVITATION,
                notificationTitle,
                notificationMessage,
                actionUrl,
                invitation.getId()
        );

        return convertToDto(invitation);
    }

    /**
     * Get invitations for a user.
     */
    public List<CompanyInvitationDto> getUserInvitations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CompanyInvitation> invitations = invitationRepository.findByInvitedUserOrderByCreatedAtDesc(user);
        return invitations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get pending invitations for a user.
     */
    public List<CompanyInvitationDto> getPendingInvitations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CompanyInvitation> invitations = invitationRepository.findByInvitedUserAndStatusOrderByCreatedAtDesc(user, InvitationStatus.PENDING);
        return invitations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Accept invitation.
     */
    @Transactional
    public CompanyInvitationDto acceptInvitation(String token, String userEmail) {
        CompanyInvitation invitation = invitationRepository.findByInvitationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid invitation token"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if invitation belongs to user
        if (!invitation.getInvitedUser().getId().equals(user.getId())) {
            throw new RuntimeException("This invitation is not for you");
        }

        // Check if invitation is still pending
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("This invitation has already been responded to");
        }

        // Check if invitation is expired
        if (invitation.isExpired()) {
            invitation.markAsExpired();
            invitationRepository.save(invitation);
            throw new RuntimeException("This invitation has expired");
        }

        // Check if user is already a member
        if (companyMemberRepository.existsByUserAndCompany(user, invitation.getCompany())) {
            throw new RuntimeException("You are already a member of this company");
        }

        // Accept invitation
        invitation.accept();
        invitation = invitationRepository.save(invitation);

        // Delete the invitation notification from user's notification list
        notificationService.deleteInvitationNotification(userEmail, token);

        // Add user to company
        CompanyMember companyMember = new CompanyMember();
        companyMember.setUser(user);
        companyMember.setCompany(invitation.getCompany());
        companyMember.setRole(invitation.getRole());
        companyMember.setJoinedAt(LocalDateTime.now());
        companyMemberRepository.save(companyMember);

        // Create notification for inviter
        String notificationTitle = "Invitation Accepted";
        String notificationMessage = String.format("%s %s accepted your invitation to join %s",
                user.getUsername(), user.getSurname(), invitation.getCompany().getName());

        notificationService.createNotification(
                invitation.getInvitedBy().getEmail(),
                NotificationType.SYSTEM_MESSAGE,
                notificationTitle,
                notificationMessage,
                "/companies/" + invitation.getCompany().getId(),
                invitation.getCompany().getId()
        );

        return convertToDto(invitation);
    }

    /**
     * Reject invitation.
     */
    @Transactional
    public CompanyInvitationDto rejectInvitation(String token, String userEmail) {
        CompanyInvitation invitation = invitationRepository.findByInvitationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid invitation token"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if invitation belongs to user
        if (!invitation.getInvitedUser().getId().equals(user.getId())) {
            throw new RuntimeException("This invitation is not for you");
        }

        // Check if invitation is still pending
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("This invitation has already been responded to");
        }

        // Reject invitation
        invitation.reject();
        invitation = invitationRepository.save(invitation);

        // Delete the invitation notification from user's notification list
        notificationService.deleteInvitationNotification(userEmail, token);

        // Create notification for inviter
        String notificationTitle = "Invitation Rejected";
        String notificationMessage = String.format("%s %s rejected your invitation to join %s",
                user.getUsername(), user.getSurname(), invitation.getCompany().getName());

        notificationService.createNotification(
                invitation.getInvitedBy().getEmail(),
                NotificationType.SYSTEM_MESSAGE,
                notificationTitle,
                notificationMessage,
                "/companies/" + invitation.getCompany().getId(),
                invitation.getCompany().getId()
        );

        return convertToDto(invitation);
    }

    /**
     * Get company invitations (sent by company).
     */
    public List<CompanyInvitationDto> getCompanyInvitations(Long companyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user has permission
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER) &&
            !companyMemberRepository.hasRole(user, company, CompanyRole.ADMIN)) {
            throw new RuntimeException("Access denied");
        }

        List<CompanyInvitation> invitations = invitationRepository.findByCompanyAndInvitedByOrderByCreatedAtDesc(company, user);
        return invitations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert CompanyInvitation entity to DTO.
     */
    private CompanyInvitationDto convertToDto(CompanyInvitation invitation) {
        return new CompanyInvitationDto(
                invitation.getId(),
                invitation.getCompany().getId(),
                invitation.getCompany().getName(),
                invitation.getInvitedBy().getUsername() + " " + invitation.getInvitedBy().getSurname(),
                invitation.getInvitedBy().getEmail(),
                invitation.getInvitedEmail(),
                invitation.getRole(),
                invitation.getStatus(),
                invitation.getMessage(),
                invitation.getCreatedAt(),
                invitation.getExpiresAt(),
                invitation.isExpired()
        );
    }
}
