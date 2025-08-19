package com.test.backend.service;

import com.test.backend.dto.CreateTestFeatureRequest;
import com.test.backend.dto.TestFeatureDto;
import com.test.backend.entity.*;
import com.test.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for test feature management operations.
 */
@Service
public class TestFeatureService {

    @Autowired
    private TestFeatureRepository testFeatureRepository;

    @Autowired
    private TestSuiteRepository testSuiteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    @Autowired
    private TestScenarioRepository testScenarioRepository;

    /**
     * Create a new test feature in a test suite.
     */
    @Transactional
    public TestFeatureDto createTestFeature(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId,
                                           CreateTestFeatureRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN && userRole != CompanyRole.MEMBER) {
            throw new RuntimeException("Access denied. You must be a company member to create test features.");
        }

        // Get and validate test suite
        TestSuite testSuite = testSuiteRepository.findActiveById(testSuiteId)
                .orElseThrow(() -> new RuntimeException("Test suite not found"));

        // Validate hierarchy
        if (!testSuite.getVersion().getId().equals(versionId) ||
            !testSuite.getVersion().getPlatform().getId().equals(platformId) ||
            !testSuite.getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testSuite.getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test suite does not belong to the specified hierarchy");
        }

        // Check if test feature name already exists in this test suite
        if (testFeatureRepository.existsByNameAndTestSuite(request.getName(), testSuite)) {
            throw new RuntimeException("A test feature with this name already exists in this test suite");
        }

        // Create test feature
        TestFeature testFeature = new TestFeature();
        testFeature.setName(request.getName());
        testFeature.setDescription(request.getDescription());
        testFeature.setTestSuite(testSuite);
        testFeature.setCreatedBy(user);

        testFeature = testFeatureRepository.save(testFeature);
        return convertToDto(testFeature);
    }

    /**
     * Get all test features for a test suite that user has access to.
     */
    public List<TestFeatureDto> getTestFeaturesByTestSuite(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, String userEmail) {
        // Validate user access
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId()).isPresent()) {
            throw new RuntimeException("Access denied to this company");
        }

        // Get and validate test suite
        TestSuite testSuite = testSuiteRepository.findActiveById(testSuiteId)
                .orElseThrow(() -> new RuntimeException("Test suite not found"));

        // Validate hierarchy
        if (!testSuite.getVersion().getId().equals(versionId) ||
            !testSuite.getVersion().getPlatform().getId().equals(platformId) ||
            !testSuite.getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testSuite.getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test suite does not belong to the specified hierarchy");
        }

        List<TestFeature> testFeatures = testFeatureRepository.findByTestSuite(testSuite);
        return testFeatures.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get test feature by ID if user has access.
     */
    public TestFeatureDto getTestFeature(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, String userEmail) {
        // Validate user access
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId()).isPresent()) {
            throw new RuntimeException("Access denied to this company");
        }

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

        return convertToDto(testFeature);
    }

    /**
     * Update test feature.
     */
    @Transactional
    public TestFeatureDto updateTestFeature(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId,
                                           CreateTestFeatureRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can update test features.");
        }

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

        // Check if new name conflicts with existing test features (if name is changed)
        if (!testFeature.getName().equals(request.getName()) &&
            testFeatureRepository.existsByNameAndTestSuite(request.getName(), testFeature.getTestSuite())) {
            throw new RuntimeException("A test feature with this name already exists in this test suite");
        }

        testFeature.setName(request.getName());
        testFeature.setDescription(request.getDescription());

        testFeature = testFeatureRepository.save(testFeature);
        return convertToDto(testFeature);
    }

    /**
     * Delete test feature (soft delete).
     */
    @Transactional
    public void deleteTestFeature(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can delete test features.");
        }

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

        // First, soft delete all test scenarios in this test feature
        List<TestScenario> testScenarios = testScenarioRepository.findByTestFeature(testFeature);
        for (TestScenario testScenario : testScenarios) {
            testScenario.markAsDeleted();
        }
        testScenarioRepository.saveAll(testScenarios);

        // Then, soft delete the test feature
        testFeature.markAsDeleted();
        testFeatureRepository.save(testFeature);
    }

    /**
     * Convert TestFeature entity to DTO.
     */
    private TestFeatureDto convertToDto(TestFeature testFeature) {
        TestSuite testSuite = testFeature.getTestSuite();
        User createdBy = testFeature.getCreatedBy();

        int testScenarioCount = testScenarioRepository.findByTestFeature(testFeature).size();

        return new TestFeatureDto(
                testFeature.getId(),
                testFeature.getName(),
                testFeature.getDescription(),
                testSuite.getId(),
                testSuite.getName(),
                createdBy.getId(),
                createdBy.getUsername() + " " + createdBy.getSurname(),
                testScenarioCount,
                testFeature.getCreatedAt(),
                testFeature.getUpdatedAt()
        );
    }
}
