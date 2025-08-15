package com.test.backend.repository;

import com.test.backend.entity.Project;
import com.test.backend.entity.Version;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Version entity.
 */
@Repository
public interface VersionRepository extends JpaRepository<Version, Long> {
    
    /**
     * Find all versions for a project that are not soft deleted.
     */
    @Query("SELECT v FROM Version v WHERE v.project = :project AND v.deletedAt IS NULL ORDER BY v.createdAt DESC")
    List<Version> findActiveVersionsByProject(@Param("project") Project project);
    
    /**
     * Find all versions for a project (including soft deleted ones).
     */
    @Query("SELECT v FROM Version v WHERE v.project = :project ORDER BY v.createdAt DESC")
    List<Version> findByProject(@Param("project") Project project);
    
    /**
     * Find version by ID and project if not soft deleted.
     */
    @Query("SELECT v FROM Version v WHERE v.id = :versionId AND v.project = :project AND v.deletedAt IS NULL")
    Optional<Version> findByIdAndProject(@Param("versionId") Long versionId, @Param("project") Project project);
    
    /**
     * Check if version name exists in project.
     */
    @Query("SELECT COUNT(v) > 0 FROM Version v WHERE v.versionName = :versionName AND v.project = :project AND v.deletedAt IS NULL")
    boolean existsByVersionNameAndProject(@Param("versionName") String versionName, @Param("project") Project project);
    
    /**
     * Check if version name exists globally (among active versions).
     */
    @Query("SELECT COUNT(v) > 0 FROM Version v WHERE v.versionName = :versionName AND v.deletedAt IS NULL")
    boolean existsByVersionNameAndNotDeleted(@Param("versionName") String versionName);
    
    /**
     * Count active versions for a project.
     */
    @Query("SELECT COUNT(v) FROM Version v WHERE v.project = :project AND v.deletedAt IS NULL")
    long countByProject(@Param("project") Project project);
    
    /**
     * Find version by name and project.
     */
    @Query("SELECT v FROM Version v WHERE v.versionName = :versionName AND v.project = :project AND v.deletedAt IS NULL")
    Optional<Version> findByVersionNameAndProject(@Param("versionName") String versionName, @Param("project") Project project);
}
