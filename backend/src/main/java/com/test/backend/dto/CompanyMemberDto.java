package com.test.backend.dto;

import com.test.backend.entity.CompanyRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for company member information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyMemberDto {
    
    private Long userId;
    private String username;
    private String surname;
    private String email;
    private Long companyId;
    private String companyName;
    private CompanyRole role;
    private LocalDateTime joinedAt;
}
