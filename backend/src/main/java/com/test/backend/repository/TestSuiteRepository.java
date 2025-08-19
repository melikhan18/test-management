package com.test.backend.repository;

import com.test.backend.entity.TestSuite;
import com.test.backend.entity.Version;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for TestSuite entity.
 */
@Repository
public interface TestSuiteRepository extends JpaRepository<TestSuite, Long> {

    /**
     * Find all test suites by version (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestSuite ts WHERE ts.version = :version AND ts.deletedAt IS NULL")
    List<TestSuite> findByVersion(@Param("version") Version version);

    /**
     * Find test suite by id (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestSuite ts WHERE ts.id = :id AND ts.deletedAt IS NULL")
    Optional<TestSuite> findActiveById(@Param("id") Long id);

    /**
     * Find test suite by name and version (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestSuite ts WHERE ts.name = :name AND ts.version = :version AND ts.deletedAt IS NULL")
    Optional<TestSuite> findByNameAndVersion(@Param("name") String name, @Param("version") Version version);

    /**
     * Check if test suite name exists in version (excluding soft deleted).
     */
    @Query("SELECT COUNT(ts) > 0 FROM TestSuite ts WHERE ts.name = :name AND ts.version = :version AND ts.deletedAt IS NULL")
    boolean existsByNameAndVersion(@Param("name") String name, @Param("version") Version version);

    /**
     * Find all test suites by version id (excluding soft deleted).
     */
    @Query("SELECT ts FROM TestSuite ts WHERE ts.version.id = :versionId AND ts.deletedAt IS NULL")
    List<TestSuite> findByVersionId(@Param("versionId") Long versionId);
}
