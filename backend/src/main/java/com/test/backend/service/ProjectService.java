package com.test.backend.service;

import com.test.backend.dto.CreateProjectRequest;
import com.test.backend.dto.ProjectDto;
import com.test.backend.entity.Company;
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

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for project management operations.
 */
@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new project in a company.
     */
    @Transactional
    public ProjectDto createProject(Long companyId, CreateProjectRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user has permission to create projects (OWNER or ADMIN)
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER) &&
            !companyMemberRepository.hasRole(user, company, CompanyRole.ADMIN)) {
            throw new RuntimeException("Access denied. Only company owners and admins can create projects.");
        }

        // Check if project name already exists in this company
        if (projectRepository.existsByNameAndCompany(request.getName(), company)) {
            throw new RuntimeException("A project with this name already exists in the company");
        }

        // Create project
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setCompany(company);

        project = projectRepository.save(project);
        return convertToDto(project);
    }

    /**
     * Get all projects for a company that user has access to.
     */
    public List<ProjectDto> getCompanyProjects(Long companyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user is a member of this company
        if (!companyMemberRepository.existsByUserAndCompany(user, company)) {
            throw new RuntimeException("Access denied to this company");
        }

        List<Project> projects = projectRepository.findActiveProjectsByCompany(company);
        return projects.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get project by ID if user has access.
     */
    public ProjectDto getProject(Long companyId, Long projectId, String userEmail) {
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

        return convertToDto(project);
    }

    /**
     * Update project.
     */
    @Transactional
    public ProjectDto updateProject(Long companyId, Long projectId, CreateProjectRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user has permission to update projects (OWNER or ADMIN)
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER) &&
            !companyMemberRepository.hasRole(user, company, CompanyRole.ADMIN)) {
            throw new RuntimeException("Access denied. Only company owners and admins can update projects.");
        }

        Project project = projectRepository.findByIdAndCompany(projectId, company)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check if new name conflicts with existing projects
        if (!project.getName().equals(request.getName()) && 
            projectRepository.existsByNameAndCompany(request.getName(), company)) {
            throw new RuntimeException("A project with this name already exists in the company");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        project = projectRepository.save(project);
        return convertToDto(project);
    }

    /**
     * Delete project (soft delete).
     */
    @Transactional
    public void deleteProject(Long companyId, Long projectId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Check if user has permission to delete projects (OWNER or ADMIN)
        if (!companyMemberRepository.hasRole(user, company, CompanyRole.OWNER) &&
            !companyMemberRepository.hasRole(user, company, CompanyRole.ADMIN)) {
            throw new RuntimeException("Access denied. Only company owners and admins can delete projects.");
        }

        Project project = projectRepository.findByIdAndCompany(projectId, company)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.markAsDeleted();
        projectRepository.save(project);
    }

    /**
     * Convert Project entity to DTO.
     */
    private ProjectDto convertToDto(Project project) {
        return new ProjectDto(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getCompany().getId(),
                project.getCompany().getName(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
