package com.test.backend.repository;

import com.test.backend.entity.TestScenario;
import com.test.backend.entity.TestFeature;
import com.test.backend.enums.TestScenarioStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for TestScenario entity.
 */
@Repository
public interface TestScenarioRepository extends JpaRepository<TestScenario, Long> {

    /**
     * Find all test scenarios by test feature (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestScenario ts WHERE ts.testFeature = :testFeature AND ts.deletedAt IS NULL")
    List<TestScenario> findByTestFeature(@Param("testFeature") TestFeature testFeature);

    /**
     * Find test scenario by id (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestScenario ts WHERE ts.id = :id AND ts.deletedAt IS NULL")
    Optional<TestScenario> findActiveById(@Param("id") Long id);

    /**
     * Find test scenario by name and test feature (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestScenario ts WHERE ts.name = :name AND ts.testFeature = :testFeature AND ts.deletedAt IS NULL")
    Optional<TestScenario> findByNameAndTestFeature(@Param("name") String name, @Param("testFeature") TestFeature testFeature);

    /**
     * Check if test scenario name exists in test feature (excluding soft deleted).
     */
    @Query("SELECT COUNT(ts) > 0 FROM TestScenario ts WHERE ts.name = :name AND ts.testFeature = :testFeature AND ts.deletedAt IS NULL")
    boolean existsByNameAndTestFeature(@Param("name") String name, @Param("testFeature") TestFeature testFeature);

    /**
     * Find all test scenarios by test feature id (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestScenario ts WHERE ts.testFeature.id = :testFeatureId AND ts.deletedAt IS NULL")
    List<TestScenario> findByTestFeatureId(@Param("testFeatureId") Long testFeatureId);

    /**
     * Find test scenarios by status (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestScenario ts WHERE ts.status = :status AND ts.deletedAt IS NULL")
    List<TestScenario> findByStatus(@Param("status") TestScenarioStatus status);

    /**
     * Find test scenarios assigned to user (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestScenario ts WHERE ts.assignedTo.id = :userId AND ts.deletedAt IS NULL")
    List<TestScenario> findByAssignedToId(@Param("userId") Long userId);
}
