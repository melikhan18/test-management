package com.test.backend.repository;

import com.test.backend.entity.Company;
import com.test.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Company entity.
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    /**
     * Find companies by owner.
     */
    List<Company> findByOwner(User owner);
    
    /**
     * Find companies by owner ID.
     */
    List<Company> findByOwnerId(Long ownerId);
    
    /**
     * Check if company name exists for a specific owner.
     */
    boolean existsByNameAndOwner(String name, User owner);
    
    /**
     * Find company by name and owner.
     */
    Optional<Company> findByNameAndOwner(String name, User owner);
    
    /**
     * Find all non-deleted companies by owner.
     */
    @Query("SELECT c FROM Company c WHERE c.owner = :owner AND c.deletedAt IS NULL")
    List<Company> findActiveCompaniesByOwner(@Param("owner") User owner);
    
    /**
     * Search companies by name containing the search term.
     */
    @Query("SELECT c FROM Company c WHERE c.name ILIKE %:searchTerm% AND c.deletedAt IS NULL")
    List<Company> searchByName(@Param("searchTerm") String searchTerm);
}
