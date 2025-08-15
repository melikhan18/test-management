package com.test.backend.dto;

import com.test.backend.entity.CompanyRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for company information with user's role.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCompanyDto {
    
    private Long id;
    private String name;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long memberCount;
    private CompanyRole userRole; // User's role in this company
}
