package com.test.backend.service;

import com.test.backend.dto.CreatePlatformRequest;
import com.test.backend.dto.PlatformDto;
import com.test.backend.dto.UpdatePlatformRequest;
import com.test.backend.entity.Platform;
import com.test.backend.entity.Project;
import com.test.backend.entity.User;
import com.test.backend.entity.Company;
import com.test.backend.entity.CompanyRole;
import com.test.backend.repository.CompanyMemberRepository;
import com.test.backend.repository.PlatformRepository;
import com.test.backend.repository.ProjectRepository;
import com.test.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for platform management operations.
 * Handles CRUD operations for platforms within projects.
 */
@Service
@RequiredArgsConstructor
public class PlatformService {

    private final PlatformRepository platformRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CompanyMemberRepository companyMemberRepository;

    /**
     * Create a new platform in a project.
     */
    @Transactional
    public PlatformDto createPlatform(Long companyId, Long projectId, CreatePlatformRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can create platforms.");
        }

        // Get and validate project
        Project project = projectRepository.findActiveById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        // Check if project belongs to company
        if (!project.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Project does not belong to the specified company");
        }

        // Check if platform name already exists in this project
        if (platformRepository.existsByNameAndProjectId(request.name(), projectId)) {
            throw new RuntimeException("Platform name '" + request.name() + "' already exists in this project");
        }

        // Create platform
        Platform platform = new Platform();
        platform.setName(request.name());
        platform.setDescription(request.description());
        platform.setPlatformType(request.platformType());
        platform.setProject(project);
        platform.setCreatedAt(LocalDateTime.now());
        platform.setUpdatedAt(LocalDateTime.now());

        Platform savedPlatform = platformRepository.save(platform);
        return convertToDto(savedPlatform);
    }

    /**
     * Get all platforms for a project.
     */
    public List<PlatformDto> getPlatformsByProject(Long companyId, Long projectId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        // Get and validate project
        Project project = projectRepository.findActiveById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        // Check if project belongs to company
        if (!project.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Project does not belong to the specified company");
        }

        List<Platform> platforms = platformRepository.findActiveByProjectId(projectId);
        return platforms.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific platform by ID.
     */
    public PlatformDto getPlatformById(Long companyId, Long projectId, Long platformId, String userEmail) {
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

        if (platform.getDeletedAt() != null) {
            throw new RuntimeException("Platform not found with id: " + platformId);
        }

        return convertToDto(platform);
    }

    /**
     * Update a platform.
     */
    @Transactional
    public PlatformDto updatePlatform(Long companyId, Long projectId, Long platformId, 
                                    UpdatePlatformRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can update platforms.");
        }

        // Get and validate platform
        Platform platform = platformRepository.findActiveById(platformId)
                .orElseThrow(() -> new RuntimeException("Platform not found with id: " + platformId));

        // Validate platform belongs to the specified project and company
        if (!platform.getProject().getId().equals(projectId) || 
            !platform.getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Platform does not belong to the specified project/company");
        }

        if (platform.getDeletedAt() != null) {
            throw new RuntimeException("Platform not found with id: " + platformId);
        }

        // Check if new name conflicts with existing platforms in the same project
        if (!platform.getName().equals(request.name()) && 
            platformRepository.existsByNameAndProjectId(request.name(), projectId)) {
            throw new RuntimeException("Platform name '" + request.name() + "' already exists in this project");
        }

        // Update platform
        platform.setName(request.name());
        platform.setDescription(request.description());
        platform.setPlatformType(request.platformType());
        platform.setUpdatedAt(LocalDateTime.now());

        Platform savedPlatform = platformRepository.save(platform);
        return convertToDto(savedPlatform);
    }

    /**
     * Delete a platform (soft delete).
     */
    @Transactional
    public void deletePlatform(Long companyId, Long projectId, Long platformId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can delete platforms.");
        }

        // Get and validate platform
        Platform platform = platformRepository.findActiveById(platformId)
                .orElseThrow(() -> new RuntimeException("Platform not found with id: " + platformId));

        // Validate platform belongs to the specified project and company
        if (!platform.getProject().getId().equals(projectId) || 
            !platform.getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Platform does not belong to the specified project/company");
        }

        if (platform.getDeletedAt() != null) {
            throw new RuntimeException("Platform not found with id: " + platformId);
        }

        // Soft delete the platform
        platform.setDeletedAt(LocalDateTime.now());
        platform.setUpdatedAt(LocalDateTime.now());
        platformRepository.save(platform);
    }

    /**
     * Convert Platform entity to DTO.
     */
    private PlatformDto convertToDto(Platform platform) {
        return new PlatformDto(
                platform.getId(),
                platform.getName(),
                platform.getDescription(),
                platform.getPlatformType(),
                platform.getProject().getId(),
                platform.getProject().getName(),
                0, // versionCount - we'll calculate this later if needed
                platform.getCreatedAt(),
                platform.getUpdatedAt()
        );
    }
}
