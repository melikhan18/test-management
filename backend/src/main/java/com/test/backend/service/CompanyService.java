package com.test.backend.service;

import com.test.backend.dto.CompanyDto;
import com.test.backend.dto.CompanyMemberDto;
import com.test.backend.dto.CreateCompanyRequest;
import com.test.backend.dto.UserCompanyDto;
import com.test.backend.entity.Company;
import com.test.backend.entity.CompanyMember;
import com.test.backend.entity.CompanyRole;
import com.test.backend.entity.Project;
import com.test.backend.entity.User;
import com.test.backend.repository.CompanyMemberRepository;
import com.test.backend.repository.CompanyRepository;
import com.test.backend.repository.ProjectRepository;
import com.test.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for company management operations.
 */
@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Create a new company with the user as owner.
     */
    @Transactional
    public CompanyDto createCompany(CreateCompanyRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if company name already exists for this user
        if (companyRepository.existsByNameAndOwner(request.getName(), user)) {
            throw new RuntimeException("Company with this name already exists for this user");
        }

        // Create company
        Company company = new Company();
        company.setName(request.getName());
        company.setOwner(user);
        company = companyRepository.save(company);

        // Create company member entry with OWNER role
        CompanyMember companyMember = new CompanyMember();
        companyMember.setUser(user);
        companyMember.setCompany(company);
        companyMember.setRole(CompanyRole.OWNER);
        companyMember.setJoinedAt(LocalDateTime.now());
        companyMemberRepository.save(companyMember);

        return convertToDto(company);
    }

    /**
     * Get all companies where user is a member.
     */
    public List<CompanyDto> getUserCompanies(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CompanyMember> companyMembers = companyMemberRepository.findByUser(user);
        
        return companyMembers.stream()
                .map(cm -> convertToDto(cm.getCompany()))
                .collect(Collectors.toList());
    }

    /**
     * Get all companies where user is a member with user's role information.
     */
    public List<UserCompanyDto> getUserCompaniesWithRole(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CompanyMember> companyMembers = companyMemberRepository.findByUser(user);
        
        return companyMembers.stream()
                .map(cm -> convertToUserCompanyDto(cm.getCompany(), cm.getRole()))
                .collect(Collectors.toList());
    }

    /**
     * Get companies owned by user.
     */
    public List<CompanyDto> getOwnedCompanies(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Company> companies = companyRepository.findActiveCompaniesByOwner(user);
        
        return companies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get company by ID if user has access.
     */
    public CompanyDto getCompany(Long companyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.existsByUserAndCompany(user, company)) {
            throw new RuntimeException("Access denied to this company");
        }

        return convertToDto(company);
    }

    /**
     * Get all members of a company.
     */
    public List<CompanyMemberDto> getCompanyMembers(Long companyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.existsByUserAndCompany(user, company)) {
            throw new RuntimeException("Access denied to this company");
        }

        List<CompanyMember> members = companyMemberRepository.findMembersByCompanyOrderByRole(company);
        
        return members.stream()
                .map(this::convertToMemberDto)
                .collect(Collectors.toList());
    }

    /**
     * Get user's role in a specific company.
     */
    public CompanyRole getUserRoleInCompany(Long companyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        CompanyMember companyMember = companyMemberRepository.findByUserAndCompany(user, company)
                .orElseThrow(() -> new RuntimeException("User is not a member of this company"));

        return companyMember.getRole();
    }

    /**
     * Update company name (only owner can do this).
     */
    @Transactional
    public CompanyDto updateCompany(Long companyId, CreateCompanyRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user is owner of this company
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER)) {
            throw new RuntimeException("Only company owner can update company information");
        }

        // Check if new name already exists for this user
        if (!company.getName().equals(request.getName()) && 
            companyRepository.existsByNameAndOwner(request.getName(), user)) {
            throw new RuntimeException("Company with this name already exists for this user");
        }

        company.setName(request.getName());
        company = companyRepository.save(company);

        return convertToDto(company);
    }

    /**
     * Soft delete company (only owner can do this).
     * Also soft deletes all projects in the company.
     */
    @Transactional
    public void deleteCompany(Long companyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user is owner of this company
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER)) {
            throw new RuntimeException("Only company owner can delete company");
        }

        // First, soft delete all projects in this company
        List<Project> companyProjects = projectRepository.findByCompany(company);
        for (Project project : companyProjects) {
            project.markAsDeleted();
        }
        projectRepository.saveAll(companyProjects);

        // Then, soft delete the company
        company.markAsDeleted();
        companyRepository.save(company);
    }

    /**
     * Convert Company entity to DTO.
     */
    private CompanyDto convertToDto(Company company) {
        long memberCount = companyMemberRepository.countByCompany(company);
        
        return new CompanyDto(
                company.getId(),
                company.getName(),
                company.getOwner().getId(),
                company.getOwner().getUsername() + " " + company.getOwner().getSurname(),
                company.getOwner().getEmail(),
                company.getCreatedAt(),
                company.getUpdatedAt(),
                memberCount
        );
    }

    /**
     * Convert Company entity to UserCompanyDto with user's role.
     */
    private UserCompanyDto convertToUserCompanyDto(Company company, CompanyRole userRole) {
        long memberCount = companyMemberRepository.countByCompany(company);
        
        return new UserCompanyDto(
                company.getId(),
                company.getName(),
                company.getOwner().getId(),
                company.getOwner().getUsername() + " " + company.getOwner().getSurname(),
                company.getOwner().getEmail(),
                company.getCreatedAt(),
                company.getUpdatedAt(),
                memberCount,
                userRole
        );
    }

    /**
     * Convert CompanyMember entity to DTO.
     */
    private CompanyMemberDto convertToMemberDto(CompanyMember companyMember) {
        User user = companyMember.getUser();
        Company company = companyMember.getCompany();
        
        return new CompanyMemberDto(
                user.getId(),
                user.getUsername(),
                user.getSurname(),
                user.getEmail(),
                company.getId(),
                company.getName(),
                companyMember.getRole(),
                companyMember.getJoinedAt()
        );
    }
}
