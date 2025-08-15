package com.test.backend.entity;

import com.test.backend.enums.InvitationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity for company invitations.
 */
@Entity
@Table(name = "company_invitations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyInvitation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by_user_id", nullable = false)
    private User invitedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_user_id", nullable = false)
    private User invitedUser;
    
    @Column(name = "invited_email", nullable = false)
    private String invitedEmail;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private CompanyRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InvitationStatus status = InvitationStatus.PENDING;
    
    @Column(name = "invitation_token", unique = true, nullable = false)
    private String invitationToken;
    
    @Column(name = "message")
    private String message;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "responded_at")
    private LocalDateTime respondedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // Set expiration to 7 days from now
        expiresAt = LocalDateTime.now().plusDays(7);
    }
    
    /**
     * Check if invitation is expired.
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
    
    /**
     * Accept the invitation.
     */
    public void accept() {
        this.status = InvitationStatus.ACCEPTED;
        this.respondedAt = LocalDateTime.now();
    }
    
    /**
     * Reject the invitation.
     */
    public void reject() {
        this.status = InvitationStatus.REJECTED;
        this.respondedAt = LocalDateTime.now();
    }
    
    /**
     * Mark as expired.
     */
    public void markAsExpired() {
        this.status = InvitationStatus.EXPIRED;
    }
}
