package com.test.backend.repository;

import com.test.backend.entity.Company;
import com.test.backend.entity.CompanyInvitation;
import com.test.backend.entity.User;
import com.test.backend.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for CompanyInvitation entity.
 */
@Repository
public interface CompanyInvitationRepository extends JpaRepository<CompanyInvitation, Long> {
    
    /**
     * Find invitation by token.
     */
    Optional<CompanyInvitation> findByInvitationToken(String token);
    
    /**
     * Find pending invitations for a user.
     */
    List<CompanyInvitation> findByInvitedUserAndStatusOrderByCreatedAtDesc(User invitedUser, InvitationStatus status);
    
    /**
     * Find all invitations for a user.
     */
    List<CompanyInvitation> findByInvitedUserOrderByCreatedAtDesc(User invitedUser);
    
    /**
     * Find invitations sent by a user for a company.
     */
    List<CompanyInvitation> findByCompanyAndInvitedByOrderByCreatedAtDesc(Company company, User invitedBy);
    
    /**
     * Find pending invitation for email and company.
     */
    Optional<CompanyInvitation> findByInvitedEmailAndCompanyAndStatus(String email, Company company, InvitationStatus status);
    
    /**
     * Check if user is already invited to company (pending).
     */
    boolean existsByInvitedEmailAndCompanyAndStatus(String email, Company company, InvitationStatus status);
    
    /**
     * Find expired invitations.
     */
    @Query("SELECT ci FROM CompanyInvitation ci WHERE ci.status = 'PENDING' AND ci.expiresAt < CURRENT_TIMESTAMP")
    List<CompanyInvitation> findExpiredInvitations();
    
    /**
     * Count pending invitations for a company.
     */
    long countByCompanyAndStatus(Company company, InvitationStatus status);
}
