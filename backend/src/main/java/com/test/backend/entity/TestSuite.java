package com.test.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * TestSuite entity representing test suites in the test management system.
 * A test suite contains multiple test features and belongs to a specific version.
 * Extends BaseEntity to inherit id, createdAt, updatedAt, and deletedAt fields.
 */
@Entity
@Table(name = "test_suites", indexes = {
    @Index(name = "idx_test_suite_name", columnList = "name"),
    @Index(name = "idx_test_suite_version", columnList = "version_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestSuite extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 200)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "version_id", nullable = false, foreignKey = @ForeignKey(name = "fk_test_suite_version"))
    private Version version;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_test_suite_created_by"))
    private User createdBy;
    
    @OneToMany(mappedBy = "testSuite", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<TestFeature> testFeatures = new ArrayList<>();
    
    // Helper methods
    public void addTestFeature(TestFeature testFeature) {
        testFeatures.add(testFeature);
        testFeature.setTestSuite(this);
    }
    
    public void removeTestFeature(TestFeature testFeature) {
        testFeatures.remove(testFeature);
        testFeature.setTestSuite(null);
    }
}
