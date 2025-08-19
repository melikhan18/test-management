package com.test.backend.dto;

import com.test.backend.enums.TestStepStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for TestStep entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestStepDto {
    
    private Long id;
    private Integer stepOrder;
    private String action;
    private String expectedResult;
    private String actualResult;
    private TestStepStatus status;
    private String notes;
    private Long testScenarioId;
    private String testScenarioName;
    private Long executedById;
    private String executedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
