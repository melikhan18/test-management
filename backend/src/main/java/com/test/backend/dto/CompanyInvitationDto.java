package com.test.backend.dto;

import com.test.backend.entity.CompanyRole;
import com.test.backend.enums.InvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for company invitation information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyInvitationDto {
    
    private Long id;
    private Long companyId;
    private String companyName;
    private String invitedByName;
    private String invitedByEmail;
    private String invitedEmail;
    private CompanyRole role;
    private InvitationStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean isExpired;
}
