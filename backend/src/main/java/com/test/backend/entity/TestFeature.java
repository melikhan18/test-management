package com.test.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * TestFeature entity representing test features in the test management system.
 * A test feature is a grouping/folder structure for test scenarios within a test suite.
 * Extends BaseEntity to inherit id, createdAt, updatedAt, and deletedAt fields.
 */
@Entity
@Table(name = "test_features", indexes = {
    @Index(name = "idx_test_feature_name", columnList = "name"),
    @Index(name = "idx_test_feature_suite", columnList = "test_suite_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestFeature extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_suite_id", nullable = false, foreignKey = @ForeignKey(name = "fk_test_feature_suite"))
    private TestSuite testSuite;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_test_feature_created_by"))
    private User createdBy;
    
    @OneToMany(mappedBy = "testFeature", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<TestScenario> testScenarios = new ArrayList<>();
    
    // Helper methods
    public void addTestScenario(TestScenario testScenario) {
        testScenarios.add(testScenario);
        testScenario.setTestFeature(this);
    }
    
    public void removeTestScenario(TestScenario testScenario) {
        testScenarios.remove(testScenario);
        testScenario.setTestFeature(null);
    }
}
