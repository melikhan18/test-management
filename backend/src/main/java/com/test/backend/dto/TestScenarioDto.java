package com.test.backend.dto;

import com.test.backend.enums.TestScenarioPriority;
import com.test.backend.enums.TestScenarioStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for TestScenario entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestScenarioDto {
    
    private Long id;
    private String name;
    private String description;
    private String preconditions;
    private String expectedResult;
    private TestScenarioPriority priority;
    private TestScenarioStatus status;
    private Integer estimatedDurationMinutes;
    private Long testFeatureId;
    private String testFeatureName;
    private Long createdById;
    private String createdByName;
    private Long assignedToId;
    private String assignedToName;
    private int testStepCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
