package com.test.backend.repository;

import com.test.backend.entity.Company;
import com.test.backend.entity.CompanyMember;
import com.test.backend.entity.CompanyRole;
import com.test.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for CompanyMember entity.
 */
@Repository
public interface CompanyMemberRepository extends JpaRepository<CompanyMember, CompanyMember.CompanyMemberId> {
    
    /**
     * Find all company members by user.
     */
    List<CompanyMember> findByUser(User user);
    
    /**
     * Find all company members by company.
     */
    List<CompanyMember> findByCompany(Company company);
    
    /**
     * Find company member by user and company.
     */
    Optional<CompanyMember> findByUserAndCompany(User user, Company company);
    
    /**
     * Check if user is member of company.
     */
    boolean existsByUserAndCompany(User user, Company company);
    
    /**
     * Find companies where user has specific role.
     */
    @Query("SELECT cm FROM CompanyMember cm WHERE cm.user = :user AND cm.role = :role")
    List<CompanyMember> findByUserAndRole(@Param("user") User user, @Param("role") CompanyRole role);
    
    /**
     * Find all companies where user is owner.
     */
    @Query("SELECT cm FROM CompanyMember cm WHERE cm.user = :user AND cm.role = 'OWNER'")
    List<CompanyMember> findCompaniesByOwner(@Param("user") User user);
    
    /**
     * Find all members of a company with their roles.
     */
    @Query("SELECT cm FROM CompanyMember cm WHERE cm.company = :company ORDER BY cm.role, cm.joinedAt")
    List<CompanyMember> findMembersByCompanyOrderByRole(@Param("company") Company company);
    
    /**
     * Count members in a company.
     */
    long countByCompany(Company company);
    
    /**
     * Check if user has specific role in company.
     */
    @Query("SELECT CASE WHEN COUNT(cm) > 0 THEN true ELSE false END FROM CompanyMember cm WHERE cm.user = :user AND cm.company = :company AND cm.role = :role")
    boolean hasRole(@Param("user") User user, @Param("company") Company company, @Param("role") CompanyRole role);
}
