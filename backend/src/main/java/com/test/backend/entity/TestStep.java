package com.test.backend.entity;

import com.test.backend.enums.TestStepStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * TestStep entity representing individual steps within a test scenario.
 * Each test step contains action, expected result and execution details.
 * Extends BaseEntity to inherit id, createdAt, updatedAt, and deletedAt fields.
 */
@Entity
@Table(name = "test_steps", indexes = {
    @Index(name = "idx_test_step_scenario", columnList = "test_scenario_id"),
    @Index(name = "idx_test_step_order", columnList = "step_order"),
    @Index(name = "idx_test_step_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestStep extends BaseEntity {
    
    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;
    
    @Column(name = "action", nullable = false, columnDefinition = "TEXT")
    private String action;
    
    @Column(name = "expected_result", columnDefinition = "TEXT")
    private String expectedResult;
    
    @Column(name = "actual_result", columnDefinition = "TEXT")
    private String actualResult;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TestStepStatus status = TestStepStatus.NOT_EXECUTED;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_scenario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_test_step_scenario"))
    private TestScenario testScenario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "executed_by", foreignKey = @ForeignKey(name = "fk_test_step_executed_by"))
    private User executedBy;
}
