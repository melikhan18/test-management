package com.test.backend.dto;

import com.test.backend.entity.CompanyRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating company invitation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInvitationRequest {
    
    private String email;
    private CompanyRole role;
    private String message;
}
