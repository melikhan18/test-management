package com.test.backend.repository;

import com.test.backend.entity.TestStep;
import com.test.backend.entity.TestScenario;
import com.test.backend.enums.TestStepStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for TestStep entity.
 */
@Repository
public interface TestStepRepository extends JpaRepository<TestStep, Long> {

    /**
     * Find all test steps by test scenario ordered by step order (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestStep ts WHERE ts.testScenario = :testScenario AND ts.deletedAt IS NULL ORDER BY ts.stepOrder")
    List<TestStep> findByTestScenarioOrderByStepOrder(@Param("testScenario") TestScenario testScenario);

    /**
     * Find test step by id (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestStep ts WHERE ts.id = :id AND ts.deletedAt IS NULL")
    Optional<TestStep> findActiveById(@Param("id") Long id);

    /**
     * Find all test steps by test scenario id ordered by step order (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestStep ts WHERE ts.testScenario.id = :testScenarioId AND ts.deletedAt IS NULL ORDER BY ts.stepOrder")
    List<TestStep> findByTestScenarioIdOrderByStepOrder(@Param("testScenarioId") Long testScenarioId);

    /**
     * Find test steps by status (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestStep ts WHERE ts.status = :status AND ts.deletedAt IS NULL")
    List<TestStep> findByStatus(@Param("status") TestStepStatus status);

    /**
     * Find test step by test scenario and step order (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestStep ts WHERE ts.testScenario = :testScenario AND ts.stepOrder = :stepOrder AND ts.deletedAt IS NULL")
    Optional<TestStep> findByTestScenarioAndStepOrder(@Param("testScenario") TestScenario testScenario, @Param("stepOrder") Integer stepOrder);

    /**
     * Find maximum step order for a test scenario (excluding soft deleted).
     */
    @Query("SELECT COALESCE(MAX(ts.stepOrder), 0) FROM TestStep ts WHERE ts.testScenario = :testScenario AND ts.deletedAt IS NULL")
    Integer findMaxStepOrderByTestScenario(@Param("testScenario") TestScenario testScenario);

    /**
     * Count test steps by test scenario (excluding soft deleted).
     */
    @Query("SELECT COUNT(ts) FROM TestStep ts WHERE ts.testScenario = :testScenario AND ts.deletedAt IS NULL")
    Long countByTestScenario(@Param("testScenario") TestScenario testScenario);
}
