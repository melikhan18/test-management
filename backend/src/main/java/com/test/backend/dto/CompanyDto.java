package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for company information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {
    
    private Long id;
    private String name;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long memberCount;
}
