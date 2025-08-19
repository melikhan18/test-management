package com.test.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for TestFeature entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestFeatureDto {
    
    private Long id;
    private String name;
    private String description;
    private Long testSuiteId;
    private String testSuiteName;
    private Long createdById;
    private String createdByName;
    private int testScenarioCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
