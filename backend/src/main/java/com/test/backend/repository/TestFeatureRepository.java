package com.test.backend.repository;

import com.test.backend.entity.TestFeature;
import com.test.backend.entity.TestSuite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for TestFeature entity.
 */
@Repository
public interface TestFeatureRepository extends JpaRepository<TestFeature, Long> {

    /**
     * Find all test features by test suite (excluding soft deleted).
     */
    @Query("SELECT tf FROM TestFeature tf WHERE tf.testSuite = :testSuite AND tf.deletedAt IS NULL")
    List<TestFeature> findByTestSuite(@Param("testSuite") TestSuite testSuite);

    /**
     * Find test feature by id (excluding soft deleted).
     */
    @Query("SELECT tf FROM TestFeature tf WHERE tf.id = :id AND tf.deletedAt IS NULL")
    Optional<TestFeature> findActiveById(@Param("id") Long id);

    /**
     * Find test feature by name and test suite (excluding soft deleted).
     */
    @Query("SELECT tf FROM TestFeature tf WHERE tf.name = :name AND tf.testSuite = :testSuite AND tf.deletedAt IS NULL")
    Optional<TestFeature> findByNameAndTestSuite(@Param("name") String name, @Param("testSuite") TestSuite testSuite);

    /**
     * Check if test feature name exists in test suite (excluding soft deleted).
     */
    @Query("SELECT COUNT(tf) > 0 FROM TestFeature tf WHERE tf.name = :name AND tf.testSuite = :testSuite AND tf.deletedAt IS NULL")
    boolean existsByNameAndTestSuite(@Param("name") String name, @Param("testSuite") TestSuite testSuite);

    /**
     * Find all test features by test suite id (excluding soft deleted).
     */
    @Query("SELECT tf FROM TestFeature tf WHERE tf.testSuite.id = :testSuiteId AND tf.deletedAt IS NULL")
    List<TestFeature> findByTestSuiteId(@Param("testSuiteId") Long testSuiteId);
}
