package com.test.backend.repository;

import com.test.backend.entity.Platform;
import com.test.backend.enums.PlatformType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Platform entity operations.
 */
@Repository
public interface PlatformRepository extends JpaRepository<Platform, Long> {

    /**
     * Find all platforms for a specific project (excluding soft-deleted ones).
     */
    @Query("SELECT p FROM Platform p WHERE p.project.id = :projectId AND p.deletedAt IS NULL")
    List<Platform> findActiveByProjectId(@Param("projectId") Long projectId);

    /**
     * Find platform by name and project (excluding soft-deleted ones).
     */
    @Query("SELECT p FROM Platform p WHERE p.name = :name AND p.project.id = :projectId AND p.deletedAt IS NULL")
    Optional<Platform> findByNameAndProjectId(@Param("name") String name, @Param("projectId") Long projectId);

    /**
     * Find platforms by platform type and project.
     */
    @Query("SELECT p FROM Platform p WHERE p.platformType = :platformType AND p.project.id = :projectId AND p.deletedAt IS NULL")
    List<Platform> findByPlatformTypeAndProjectId(@Param("platformType") PlatformType platformType, @Param("projectId") Long projectId);

    /**
     * Check if platform name exists in project (for validation).
     */
    @Query("SELECT COUNT(p) > 0 FROM Platform p WHERE p.name = :name AND p.project.id = :projectId AND p.deletedAt IS NULL")
    boolean existsByNameAndProjectId(@Param("name") String name, @Param("projectId") Long projectId);

    /**
     * Check if platform name exists in project excluding specific platform id (for updates).
     */
    @Query("SELECT COUNT(p) > 0 FROM Platform p WHERE p.name = :name AND p.project.id = :projectId AND p.id != :excludeId AND p.deletedAt IS NULL")
    boolean existsByNameAndProjectIdAndIdNot(@Param("name") String name, @Param("projectId") Long projectId, @Param("excludeId") Long excludeId);

    /**
     * Find platforms by company id (through project relationship).
     */
    @Query("SELECT p FROM Platform p WHERE p.project.company.id = :companyId AND p.deletedAt IS NULL")
    List<Platform> findByCompanyId(@Param("companyId") Long companyId);

    /**
     * Count platforms in a project.
     */
    @Query("SELECT COUNT(p) FROM Platform p WHERE p.project.id = :projectId AND p.deletedAt IS NULL")
    long countByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Find platform by ID (excluding soft-deleted ones).
     */
    @Query("SELECT p FROM Platform p WHERE p.id = :id AND p.deletedAt IS NULL")
    Optional<Platform> findActiveById(@Param("id") Long id);
}
