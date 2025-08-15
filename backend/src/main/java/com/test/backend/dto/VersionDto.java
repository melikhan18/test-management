package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Version entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VersionDto {
    private Long id;
    private String versionName;
    private Long projectId;
    private String projectName;
    private Long companyId;
    private String companyName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
