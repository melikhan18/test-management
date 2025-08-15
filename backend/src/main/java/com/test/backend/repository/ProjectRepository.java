package com.test.backend.repository;

import com.test.backend.entity.Company;
import com.test.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Project entity.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    /**
     * Find all projects for a company that are not soft deleted.
     */
    @Query("SELECT p FROM Project p WHERE p.company = :company AND p.deletedAt IS NULL ORDER BY p.updatedAt DESC")
    List<Project> findActiveProjectsByCompany(@Param("company") Company company);
    
    /**
     * Find all projects for a company (including soft deleted ones).
     */
    @Query("SELECT p FROM Project p WHERE p.company = :company")
    List<Project> findByCompany(@Param("company") Company company);
    
    /**
     * Find project by ID and company if not soft deleted.
     */
    @Query("SELECT p FROM Project p WHERE p.id = :projectId AND p.company = :company AND p.deletedAt IS NULL")
    Optional<Project> findByIdAndCompany(@Param("projectId") Long projectId, @Param("company") Company company);
    
    /**
     * Check if project name exists in company.
     */
    @Query("SELECT COUNT(p) > 0 FROM Project p WHERE p.name = :name AND p.company = :company AND p.deletedAt IS NULL")
    boolean existsByNameAndCompany(@Param("name") String name, @Param("company") Company company);
    
    /**
     * Count active projects for a company.
     */
    @Query("SELECT COUNT(p) FROM Project p WHERE p.company = :company AND p.deletedAt IS NULL")
    long countByCompany(@Param("company") Company company);
}
