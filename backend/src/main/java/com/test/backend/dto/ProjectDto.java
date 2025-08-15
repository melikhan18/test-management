package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for project information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    
    private Long id;
    private String name;
    private String description;
    private Long companyId;
    private String companyName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
