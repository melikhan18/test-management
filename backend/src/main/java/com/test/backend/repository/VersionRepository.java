package com.test.backend.repository;

import com.test.backend.entity.Platform;
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
     * Find all versions for a platform that are not soft deleted.
     */
    @Query("SELECT v FROM Version v WHERE v.platform = :platform AND v.deletedAt IS NULL ORDER BY v.createdAt DESC")
    List<Version> findActiveVersionsByPlatform(@Param("platform") Platform platform);
    
    /**
     * Find all versions for a platform (including soft deleted ones).
     */
    @Query("SELECT v FROM Version v WHERE v.platform = :platform ORDER BY v.createdAt DESC")
    List<Version> findByPlatform(@Param("platform") Platform platform);
    
    /**
     * Find version by ID and platform if not soft deleted.
     */
    @Query("SELECT v FROM Version v WHERE v.id = :versionId AND v.platform = :platform AND v.deletedAt IS NULL")
    Optional<Version> findByIdAndPlatform(@Param("versionId") Long versionId, @Param("platform") Platform platform);
    
    /**
     * Check if version name exists in platform.
     */
    @Query("SELECT COUNT(v) > 0 FROM Version v WHERE v.versionName = :versionName AND v.platform = :platform AND v.deletedAt IS NULL")
    boolean existsByVersionNameAndPlatform(@Param("versionName") String versionName, @Param("platform") Platform platform);
    
    /**
     * Check if version name exists globally (among active versions).
     */
    @Query("SELECT COUNT(v) > 0 FROM Version v WHERE v.versionName = :versionName AND v.deletedAt IS NULL")
    boolean existsByVersionNameAndNotDeleted(@Param("versionName") String versionName);
    
    /**
     * Count active versions for a platform.
     */
    @Query("SELECT COUNT(v) FROM Version v WHERE v.platform = :platform AND v.deletedAt IS NULL")
    long countByPlatform(@Param("platform") Platform platform);
    
    /**
     * Find version by name and platform.
     */
    @Query("SELECT v FROM Version v WHERE v.versionName = :versionName AND v.platform = :platform AND v.deletedAt IS NULL")
    Optional<Version> findByVersionNameAndPlatform(@Param("versionName") String versionName, @Param("platform") Platform platform);
    
    // Legacy methods for backward compatibility during transition
    /**
     * Find all versions for a project that are not soft deleted.
     * @deprecated Use findActiveVersionsByPlatform instead
     */
    @Deprecated
    @Query("SELECT v FROM Version v WHERE v.platform.project = :project AND v.deletedAt IS NULL ORDER BY v.createdAt DESC")
    List<Version> findActiveVersionsByProject(@Param("project") Project project);
    
    /**
     * Find all versions for a project (including soft deleted ones).
     * @deprecated Use findByPlatform instead
     */
    @Deprecated
    @Query("SELECT v FROM Version v WHERE v.platform.project = :project ORDER BY v.createdAt DESC")
    List<Version> findByProject(@Param("project") Project project);
    
    /**
     * Find version by ID and project if not soft deleted.
     * @deprecated Use findByIdAndPlatform instead
     */
    @Deprecated
    @Query("SELECT v FROM Version v WHERE v.id = :versionId AND v.platform.project = :project AND v.deletedAt IS NULL")
    Optional<Version> findByIdAndProject(@Param("versionId") Long versionId, @Param("project") Project project);
    
    /**
     * Check if version name exists in project.
     * @deprecated Use existsByVersionNameAndPlatform instead
     */
    @Deprecated
    @Query("SELECT COUNT(v) > 0 FROM Version v WHERE v.versionName = :versionName AND v.platform.project = :project AND v.deletedAt IS NULL")
    boolean existsByVersionNameAndProject(@Param("versionName") String versionName, @Param("project") Project project);
    
    /**
     * Count active versions for a project.
     * @deprecated Use countByPlatform instead
     */
    @Deprecated
    @Query("SELECT COUNT(v) FROM Version v WHERE v.platform.project = :project AND v.deletedAt IS NULL")
    long countByProject(@Param("project") Project project);
    
    /**
     * Find version by name and project.
     * @deprecated Use findByVersionNameAndPlatform instead
     */
    @Deprecated
    @Query("SELECT v FROM Version v WHERE v.versionName = :versionName AND v.platform.project = :project AND v.deletedAt IS NULL")
    Optional<Version> findByVersionNameAndProject(@Param("versionName") String versionName, @Param("project") Project project);
}
