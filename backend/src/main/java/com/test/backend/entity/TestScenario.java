package com.test.backend.entity;

import com.test.backend.enums.TestScenarioPriority;
import com.test.backend.enums.TestScenarioStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * TestScenario entity representing individual test scenarios in the test management system.
 * A test scenario contains multiple test steps and belongs to a test feature.
 * Extends BaseEntity to inherit id, createdAt, updatedAt, and deletedAt fields.
 */
@Entity
@Table(name = "test_cases", indexes = {
    @Index(name = "idx_test_case_name", columnList = "name"),
    @Index(name = "idx_test_case_feature", columnList = "test_feature_id"),
    @Index(name = "idx_test_case_status", columnList = "status"),
    @Index(name = "idx_test_case_priority", columnList = "priority")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestScenario extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "preconditions", columnDefinition = "TEXT")
    private String preconditions;
    
    @Column(name = "expected_result", columnDefinition = "TEXT")
    private String expectedResult;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private TestScenarioPriority priority = TestScenarioPriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TestScenarioStatus status = TestScenarioStatus.DRAFT;
    
    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_feature_id", nullable = false, foreignKey = @ForeignKey(name = "fk_test_case_feature"))
    private TestFeature testFeature;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_test_case_created_by"))
    private User createdBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to", foreignKey = @ForeignKey(name = "fk_test_case_assigned_to"))
    private User assignedTo;
    
    @OneToMany(mappedBy = "testScenario", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<TestStep> testSteps = new ArrayList<>();
    
    // Helper methods
    public void addTestStep(TestStep testStep) {
        testSteps.add(testStep);
        testStep.setTestScenario(this);
    }
    
    public void removeTestStep(TestStep testStep) {
        testSteps.remove(testStep);
        testStep.setTestScenario(null);
    }
}
