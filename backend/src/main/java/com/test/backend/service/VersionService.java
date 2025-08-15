package com.test.backend.service;

import com.test.backend.dto.CreateVersionRequest;
import com.test.backend.dto.VersionDto;
import com.test.backend.entity.Company;
import com.test.backend.entity.CompanyRole;
import com.test.backend.entity.Project;
import com.test.backend.entity.User;
import com.test.backend.entity.Version;
import com.test.backend.repository.CompanyMemberRepository;
import com.test.backend.repository.CompanyRepository;
import com.test.backend.repository.ProjectRepository;
import com.test.backend.repository.UserRepository;
import com.test.backend.repository.VersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for version management operations.
 */
@Service
public class VersionService {

    @Autowired
    private VersionRepository versionRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new version in a project.
     */
    @Transactional
    public VersionDto createVersion(Long companyId, Long projectId, CreateVersionRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user has permission to create versions (OWNER or ADMIN)
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER) &&
            !companyMemberRepository.hasRole(user, company, CompanyRole.ADMIN)) {
            throw new RuntimeException("Access denied. Only company owners and admins can create versions.");
        }

        Project project = projectRepository.findByIdAndCompany(projectId, company)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check if version name already exists in this project
        if (versionRepository.existsByVersionNameAndProject(request.getVersionName(), project)) {
            throw new RuntimeException("A version with this name already exists in the project");
        }

        // Create version
        Version version = new Version();
        version.setVersionName(request.getVersionName());
        version.setProject(project);

        version = versionRepository.save(version);
        return convertToDto(version);
    }

    /**
     * Get all versions for a project that user has access to.
     */
    public List<VersionDto> getProjectVersions(Long companyId, Long projectId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user is a member of this company
        if (!companyMemberRepository.existsByUserAndCompany(user, company)) {
            throw new RuntimeException("Access denied to this company");
        }

        Project project = projectRepository.findByIdAndCompany(projectId, company)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<Version> versions = versionRepository.findActiveVersionsByProject(project);
        return versions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get version by ID if user has access.
     */
    public VersionDto getVersion(Long companyId, Long projectId, Long versionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user is a member of this company
        if (!companyMemberRepository.existsByUserAndCompany(user, company)) {
            throw new RuntimeException("Access denied to this company");
        }

        Project project = projectRepository.findByIdAndCompany(projectId, company)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Version version = versionRepository.findByIdAndProject(versionId, project)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        return convertToDto(version);
    }

    /**
     * Update version.
     */
    @Transactional
    public VersionDto updateVersion(Long companyId, Long projectId, Long versionId, CreateVersionRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user has permission to update versions (OWNER or ADMIN)
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER) &&
            !companyMemberRepository.hasRole(user, company, CompanyRole.ADMIN)) {
            throw new RuntimeException("Access denied. Only company owners and admins can update versions.");
        }

        Project project = projectRepository.findByIdAndCompany(projectId, company)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Version version = versionRepository.findByIdAndProject(versionId, project)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        // Check if new name conflicts with existing versions
        if (!version.getVersionName().equals(request.getVersionName()) && 
            versionRepository.existsByVersionNameAndProject(request.getVersionName(), project)) {
            throw new RuntimeException("A version with this name already exists in the project");
        }

        version.setVersionName(request.getVersionName());

        version = versionRepository.save(version);
        return convertToDto(version);
    }

    /**
     * Delete version (soft delete).
     */
    @Transactional
    public void deleteVersion(Long companyId, Long projectId, Long versionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user has permission to delete versions (OWNER or ADMIN)
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER) &&
            !companyMemberRepository.hasRole(user, company, CompanyRole.ADMIN)) {
            throw new RuntimeException("Access denied. Only company owners and admins can delete versions.");
        }

        Project project = projectRepository.findByIdAndCompany(projectId, company)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Version version = versionRepository.findByIdAndProject(versionId, project)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        version.markAsDeleted();
        versionRepository.save(version);
    }

    /**
     * Convert Version entity to DTO.
     */
    private VersionDto convertToDto(Version version) {
        Project project = version.getProject();
        Company company = project.getCompany();
        
        return new VersionDto(
                version.getId(),
                version.getVersionName(),
                project.getId(),
                project.getName(),
                company.getId(),
                company.getName(),
                version.getCreatedAt(),
                version.getUpdatedAt()
        );
    }
}
