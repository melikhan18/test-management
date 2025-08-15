package com.test.backend.service;

import com.test.backend.dto.CreateVersionRequest;
import com.test.backend.dto.VersionDto;
import com.test.backend.entity.*;
import com.test.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for version management operations.
 * Handles CRUD operations for versions within platforms.
 */
@Service
@RequiredArgsConstructor
public class VersionService {

    private final VersionRepository versionRepository;
    private final PlatformRepository platformRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final UserRepository userRepository;

    /**
     * Create a new version in a platform.
     */
    @Transactional
    public VersionDto createVersion(Long companyId, Long projectId, Long platformId, CreateVersionRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can create versions.");
        }

        // Get and validate platform
        Platform platform = platformRepository.findActiveById(platformId)
                .orElseThrow(() -> new RuntimeException("Platform not found with id: " + platformId));

        // Validate platform belongs to the specified project and company
        if (!platform.getProject().getId().equals(projectId) || 
            !platform.getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Platform does not belong to the specified project/company");
        }

        // Check if version name already exists in this platform
        if (versionRepository.existsByVersionNameAndPlatform(request.getVersionName(), platform)) {
            throw new RuntimeException("A version with this name already exists in this platform");
        }

        // Create version
        Version version = new Version();
        version.setVersionName(request.getVersionName());
        version.setPlatform(platform);

        version = versionRepository.save(version);
        return convertToDto(version);
    }

    /**
     * Get all versions for a platform.
     */
    public List<VersionDto> getPlatformVersions(Long companyId, Long projectId, Long platformId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        // Get and validate platform
        Platform platform = platformRepository.findActiveById(platformId)
                .orElseThrow(() -> new RuntimeException("Platform not found with id: " + platformId));

        // Validate platform belongs to the specified project and company
        if (!platform.getProject().getId().equals(projectId) || 
            !platform.getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Platform does not belong to the specified project/company");
        }

        List<Version> versions = versionRepository.findActiveVersionsByPlatform(platform);
        return versions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get version by ID if user has access.
     */
    public VersionDto getVersion(Long companyId, Long projectId, Long platformId, Long versionId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        // Get and validate platform
        Platform platform = platformRepository.findActiveById(platformId)
                .orElseThrow(() -> new RuntimeException("Platform not found with id: " + platformId));

        // Validate platform belongs to the specified project and company
        if (!platform.getProject().getId().equals(projectId) || 
            !platform.getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Platform does not belong to the specified project/company");
        }

        Version version = versionRepository.findByIdAndPlatform(versionId, platform)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        return convertToDto(version);
    }

    /**
     * Update version.
     */
    @Transactional
    public VersionDto updateVersion(Long companyId, Long projectId, Long platformId, Long versionId, 
                                  CreateVersionRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can update versions.");
        }

        // Get and validate platform
        Platform platform = platformRepository.findActiveById(platformId)
                .orElseThrow(() -> new RuntimeException("Platform not found with id: " + platformId));

        // Validate platform belongs to the specified project and company
        if (!platform.getProject().getId().equals(projectId) || 
            !platform.getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Platform does not belong to the specified project/company");
        }

        Version version = versionRepository.findByIdAndPlatform(versionId, platform)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        // Check if new name conflicts with existing versions
        if (!version.getVersionName().equals(request.getVersionName()) && 
            versionRepository.existsByVersionNameAndPlatform(request.getVersionName(), platform)) {
            throw new RuntimeException("A version with this name already exists in this platform");
        }

        version.setVersionName(request.getVersionName());

        version = versionRepository.save(version);
        return convertToDto(version);
    }

    /**
     * Delete version (soft delete).
     */
    @Transactional
    public void deleteVersion(Long companyId, Long projectId, Long platformId, Long versionId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can delete versions.");
        }

        // Get and validate platform
        Platform platform = platformRepository.findActiveById(platformId)
                .orElseThrow(() -> new RuntimeException("Platform not found with id: " + platformId));

        // Validate platform belongs to the specified project and company
        if (!platform.getProject().getId().equals(projectId) || 
            !platform.getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Platform does not belong to the specified project/company");
        }

        Version version = versionRepository.findByIdAndPlatform(versionId, platform)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        version.markAsDeleted();
        versionRepository.save(version);
    }

    /**
     * Convert Version entity to DTO.
     */
    private VersionDto convertToDto(Version version) {
        Platform platform = version.getPlatform();
        Project project = platform.getProject();
        Company company = project.getCompany();
        
        return new VersionDto(
                version.getId(),
                version.getVersionName(),
                platform.getId(),
                platform.getName(),
                project.getId(),
                project.getName(),
                company.getId(),
                company.getName(),
                version.getCreatedAt(),
                version.getUpdatedAt()
        );
    }
}
