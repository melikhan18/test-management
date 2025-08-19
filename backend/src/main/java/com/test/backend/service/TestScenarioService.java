package com.test.backend.service;

import com.test.backend.dto.CreateTestScenarioRequest;
import com.test.backend.dto.TestScenarioDto;
import com.test.backend.entity.*;
import com.test.backend.entity.CompanyRole;
import com.test.backend.enums.TestScenarioStatus;
import com.test.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for test scenario management operations.
 */
@Service
public class TestScenarioService {

    @Autowired
    private TestScenarioRepository testScenarioRepository;

    @Autowired
    private TestFeatureRepository testFeatureRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    @Autowired
    private TestStepRepository testStepRepository;

    /**
     * Create a new test scenario in a test feature.
     */
    @Transactional
    public TestScenarioDto createTestScenario(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId,
                                     CreateTestScenarioRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN && userRole != CompanyRole.MEMBER) {
            throw new RuntimeException("Access denied. You must be a company member to create test scenarios.");
        }

        // Get and validate test feature
        TestFeature testFeature = testFeatureRepository.findActiveById(testFeatureId)
                .orElseThrow(() -> new RuntimeException("Test feature not found"));

        // Validate hierarchy
        if (!testFeature.getTestSuite().getId().equals(testSuiteId) ||
            !testFeature.getTestSuite().getVersion().getId().equals(versionId) ||
            !testFeature.getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testFeature.getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testFeature.getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test feature does not belong to the specified hierarchy");
        }

        // Check if test scenario name already exists in this test feature
        if (testScenarioRepository.existsByNameAndTestFeature(request.getName(), testFeature)) {
            throw new RuntimeException("A test scenario with this name already exists in this test feature");
        }

        // Validate assigned user if provided
        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            
            // Check if assigned user is a member of this company
            if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, assignedTo.getId()).isPresent()) {
                throw new RuntimeException("Assigned user is not a member of this company");
            }
        }

        // Create test scenario
        TestScenario testScenario = new TestScenario();
        testScenario.setName(request.getName());
        testScenario.setDescription(request.getDescription());
        testScenario.setPreconditions(request.getPreconditions());
        testScenario.setExpectedResult(request.getExpectedResult());
        testScenario.setPriority(request.getPriority());
        testScenario.setStatus(request.getStatus());
        testScenario.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        testScenario.setTestFeature(testFeature);
        testScenario.setCreatedBy(user);
        testScenario.setAssignedTo(assignedTo);

        testScenario = testScenarioRepository.save(testScenario);
        return convertToDto(testScenario);
    }

    /**
     * Get all test scenarios for a test feature that user has access to.
     */
    public List<TestScenarioDto> getTestScenariosByTestFeature(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, String userEmail) {
        // Validate user access
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId()).isPresent()) {
            throw new RuntimeException("Access denied to this company");
        }

        // Get and validate test feature
        TestFeature testFeature = testFeatureRepository.findActiveById(testFeatureId)
                .orElseThrow(() -> new RuntimeException("Test feature not found"));

        // Validate hierarchy
        if (!testFeature.getTestSuite().getId().equals(testSuiteId) ||
            !testFeature.getTestSuite().getVersion().getId().equals(versionId) ||
            !testFeature.getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testFeature.getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testFeature.getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test feature does not belong to the specified hierarchy");
        }

        List<TestScenario> testScenarios = testScenarioRepository.findByTestFeature(testFeature);
        return testScenarios.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get test scenario by ID if user has access.
     */
    public TestScenarioDto getTestScenario(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, Long testScenarioId, String userEmail) {
        // Validate user access
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId()).isPresent()) {
            throw new RuntimeException("Access denied to this company");
        }

        TestScenario testScenario = testScenarioRepository.findActiveById(testScenarioId)
                .orElseThrow(() -> new RuntimeException("Test scenario not found"));

        // Validate hierarchy
        if (!testScenario.getTestFeature().getId().equals(testFeatureId) ||
            !testScenario.getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test scenario does not belong to the specified hierarchy");
        }

        return convertToDto(testScenario);
    }

    /**
     * Update test scenario.
     */
    @Transactional
    public TestScenarioDto updateTestScenario(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, Long testScenarioId,
                                     CreateTestScenarioRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can update test scenarios.");
        }

        TestScenario testScenario = testScenarioRepository.findActiveById(testScenarioId)
                .orElseThrow(() -> new RuntimeException("Test scenario not found"));

        // Validate hierarchy
        if (!testScenario.getTestFeature().getId().equals(testFeatureId) ||
            !testScenario.getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test scenario does not belong to the specified hierarchy");
        }

        // Check if new name conflicts with existing test scenarios (if name is changed)
        if (!testScenario.getName().equals(request.getName()) &&
            testScenarioRepository.existsByNameAndTestFeature(request.getName(), testScenario.getTestFeature())) {
            throw new RuntimeException("A test scenario with this name already exists in this test feature");
        }

        // Validate assigned user if provided
        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            
            // Check if assigned user is a member of this company
            if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, assignedTo.getId()).isPresent()) {
                throw new RuntimeException("Assigned user is not a member of this company");
            }
        }

        testScenario.setName(request.getName());
        testScenario.setDescription(request.getDescription());
        testScenario.setPreconditions(request.getPreconditions());
        testScenario.setExpectedResult(request.getExpectedResult());
        testScenario.setPriority(request.getPriority());
        testScenario.setStatus(request.getStatus());
        testScenario.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        testScenario.setAssignedTo(assignedTo);

        testScenario = testScenarioRepository.save(testScenario);
        return convertToDto(testScenario);
    }

    /**
     * Assign user to test scenario.
     */
    @Transactional
    public TestScenarioDto assignUserToTestScenario(Long companyId, Long projectId, Long platformId, Long versionId, 
                                                     Long testSuiteId, Long testFeatureId, Long testScenarioId, 
                                                     String assignedUserEmail, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permissions for this company
        CompanyMember companyMember = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .orElseThrow(() -> new RuntimeException("Access denied - user is not a member of this company"));

        if (companyMember.getRole() == CompanyRole.MEMBER) {
            throw new RuntimeException("Access denied - insufficient permissions");
        }

        // Get test scenario
        TestScenario testScenario = testScenarioRepository.findActiveById(testScenarioId)
                .orElseThrow(() -> new RuntimeException("Test scenario not found"));

        // Validate hierarchy
        if (!testScenario.getTestFeature().getId().equals(testFeatureId) ||
            !testScenario.getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test scenario does not belong to the specified hierarchy");
        }

        // Find assigned user
        User assignedUser = userRepository.findByEmail(assignedUserEmail)
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        // Check if assigned user is a member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, assignedUser.getId()).isPresent()) {
            throw new RuntimeException("Assigned user is not a member of this company");
        }

        testScenario.setAssignedTo(assignedUser);
        testScenario = testScenarioRepository.save(testScenario);
        return convertToDto(testScenario);
    }

    /**
     * Update test scenario status.
     */
    @Transactional
    public TestScenarioDto updateTestScenarioStatus(Long companyId, Long projectId, Long platformId, Long versionId, 
                                                     Long testSuiteId, Long testFeatureId, Long testScenarioId, 
                                                     TestScenarioStatus status, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permissions for this company
        CompanyMember companyMember = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .orElseThrow(() -> new RuntimeException("Access denied - user is not a member of this company"));

        // Get test scenario
        TestScenario testScenario = testScenarioRepository.findActiveById(testScenarioId)
                .orElseThrow(() -> new RuntimeException("Test scenario not found"));

        // Validate hierarchy
        if (!testScenario.getTestFeature().getId().equals(testFeatureId) ||
            !testScenario.getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test scenario does not belong to the specified hierarchy");
        }

        testScenario.setStatus(status);
        testScenario = testScenarioRepository.save(testScenario);
        return convertToDto(testScenario);
    }

    /**
     * Delete test scenario (soft delete).
     */
    @Transactional
    public void deleteTestScenario(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, Long testScenarioId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can delete test scenarios.");
        }

        TestScenario testScenario = testScenarioRepository.findActiveById(testScenarioId)
                .orElseThrow(() -> new RuntimeException("Test scenario not found"));

        // Validate hierarchy
        if (!testScenario.getTestFeature().getId().equals(testFeatureId) ||
            !testScenario.getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testScenario.getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test scenario does not belong to the specified hierarchy");
        }

        // First, soft delete all test steps in this test scenario
        List<TestStep> testSteps = testStepRepository.findByTestScenarioOrderByStepOrder(testScenario);
        for (TestStep testStep : testSteps) {
            testStep.markAsDeleted();
        }
        testStepRepository.saveAll(testSteps);

        // Then, soft delete the test scenario
        testScenario.markAsDeleted();
        testScenarioRepository.save(testScenario);
    }

    /**
     * Convert TestScenario entity to DTO.
     */
    private TestScenarioDto convertToDto(TestScenario testScenario) {
        TestFeature testFeature = testScenario.getTestFeature();
        User createdBy = testScenario.getCreatedBy();
        User assignedTo = testScenario.getAssignedTo();

        int testStepCount = testStepRepository.findByTestScenarioOrderByStepOrder(testScenario).size();

        return new TestScenarioDto(
                testScenario.getId(),
                testScenario.getName(),
                testScenario.getDescription(),
                testScenario.getPreconditions(),
                testScenario.getExpectedResult(),
                testScenario.getPriority(),
                testScenario.getStatus(),
                testScenario.getEstimatedDurationMinutes(),
                testFeature.getId(),
                testFeature.getName(),
                createdBy.getId(),
                createdBy.getUsername() + " " + createdBy.getSurname(),
                assignedTo != null ? assignedTo.getId() : null,
                assignedTo != null ? assignedTo.getUsername() + " " + assignedTo.getSurname() : null,
                testStepCount,
                testScenario.getCreatedAt(),
                testScenario.getUpdatedAt()
        );
    }
}
