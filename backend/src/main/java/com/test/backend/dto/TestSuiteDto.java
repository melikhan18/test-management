package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for TestSuite entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestSuiteDto {
    
    private Long id;
    private String name;
    private String description;
    private Long versionId;
    private String versionName;
    private Long platformId;
    private String platformName;
    private Long projectId;
    private String projectName;
    private Long companyId;
    private String companyName;
    private Long createdById;
    private String createdByName;
    private int testFeatureCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
