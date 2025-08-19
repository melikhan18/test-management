package com.test.backend.service;

import com.test.backend.dto.CreateTestSuiteRequest;
import com.test.backend.dto.TestSuiteDto;
import com.test.backend.entity.*;
import com.test.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for test suite management operations.
 */
@Service
public class TestSuiteService {

    @Autowired
    private TestSuiteRepository testSuiteRepository;

    @Autowired
    private VersionRepository versionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    @Autowired
    private TestFeatureRepository testFeatureRepository;

    /**
     * Create a new test suite in a version.
     */
    @Transactional
    public TestSuiteDto createTestSuite(Long companyId, Long projectId, Long platformId, Long versionId, 
                                       CreateTestSuiteRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN && userRole != CompanyRole.MEMBER) {
            throw new RuntimeException("Access denied. You must be a company member to create test suites.");
        }

        // Get and validate version
        Version version = versionRepository.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        // Validate hierarchy
        if (!version.getPlatform().getId().equals(platformId) ||
            !version.getPlatform().getProject().getId().equals(projectId) ||
            !version.getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Version does not belong to the specified hierarchy");
        }

        // Check if test suite name already exists in this version
        if (testSuiteRepository.existsByNameAndVersion(request.getName(), version)) {
            throw new RuntimeException("A test suite with this name already exists in this version");
        }

        // Create test suite
        TestSuite testSuite = new TestSuite();
        testSuite.setName(request.getName());
        testSuite.setDescription(request.getDescription());
        testSuite.setVersion(version);
        testSuite.setCreatedBy(user);

        testSuite = testSuiteRepository.save(testSuite);
        return convertToDto(testSuite);
    }

    /**
     * Get all test suites for a version that user has access to.
     */
    public List<TestSuiteDto> getTestSuitesByVersion(Long companyId, Long projectId, Long platformId, Long versionId, String userEmail) {
        // Validate user access
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId()).isPresent()) {
            throw new RuntimeException("Access denied to this company");
        }

        // Get and validate version
        Version version = versionRepository.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        // Validate hierarchy
        if (!version.getPlatform().getId().equals(platformId) ||
            !version.getPlatform().getProject().getId().equals(projectId) ||
            !version.getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Version does not belong to the specified hierarchy");
        }

        List<TestSuite> testSuites = testSuiteRepository.findByVersion(version);
        return testSuites.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get test suite by ID if user has access.
     */
    public TestSuiteDto getTestSuite(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, String userEmail) {
        // Validate user access
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId()).isPresent()) {
            throw new RuntimeException("Access denied to this company");
        }

        TestSuite testSuite = testSuiteRepository.findActiveById(testSuiteId)
                .orElseThrow(() -> new RuntimeException("Test suite not found"));

        // Validate hierarchy
        if (!testSuite.getVersion().getId().equals(versionId) ||
            !testSuite.getVersion().getPlatform().getId().equals(platformId) ||
            !testSuite.getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testSuite.getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test suite does not belong to the specified hierarchy");
        }

        return convertToDto(testSuite);
    }

    /**
     * Update test suite.
     */
    @Transactional
    public TestSuiteDto updateTestSuite(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId,
                                       CreateTestSuiteRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can update test suites.");
        }

        TestSuite testSuite = testSuiteRepository.findActiveById(testSuiteId)
                .orElseThrow(() -> new RuntimeException("Test suite not found"));

        // Validate hierarchy
        if (!testSuite.getVersion().getId().equals(versionId) ||
            !testSuite.getVersion().getPlatform().getId().equals(platformId) ||
            !testSuite.getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testSuite.getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test suite does not belong to the specified hierarchy");
        }

        // Check if new name conflicts with existing test suites (if name is changed)
        if (!testSuite.getName().equals(request.getName()) &&
            testSuiteRepository.existsByNameAndVersion(request.getName(), testSuite.getVersion())) {
            throw new RuntimeException("A test suite with this name already exists in this version");
        }

        testSuite.setName(request.getName());
        testSuite.setDescription(request.getDescription());

        testSuite = testSuiteRepository.save(testSuite);
        return convertToDto(testSuite);
    }

    /**
     * Delete test suite (soft delete).
     */
    @Transactional
    public void deleteTestSuite(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can delete test suites.");
        }

        TestSuite testSuite = testSuiteRepository.findActiveById(testSuiteId)
                .orElseThrow(() -> new RuntimeException("Test suite not found"));

        // Validate hierarchy
        if (!testSuite.getVersion().getId().equals(versionId) ||
            !testSuite.getVersion().getPlatform().getId().equals(platformId) ||
            !testSuite.getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testSuite.getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test suite does not belong to the specified hierarchy");
        }

        // First, soft delete all test features in this test suite
        List<TestFeature> testFeatures = testFeatureRepository.findByTestSuite(testSuite);
        for (TestFeature testFeature : testFeatures) {
            testFeature.markAsDeleted();
        }
        testFeatureRepository.saveAll(testFeatures);

        // Then, soft delete the test suite
        testSuite.markAsDeleted();
        testSuiteRepository.save(testSuite);
    }

    /**
     * Convert TestSuite entity to DTO.
     */
    private TestSuiteDto convertToDto(TestSuite testSuite) {
        Version version = testSuite.getVersion();
        Platform platform = version.getPlatform();
        Project project = platform.getProject();
        Company company = project.getCompany();
        User createdBy = testSuite.getCreatedBy();

        int testFeatureCount = testFeatureRepository.findByTestSuite(testSuite).size();

        return new TestSuiteDto(
                testSuite.getId(),
                testSuite.getName(),
                testSuite.getDescription(),
                version.getId(),
                version.getVersionName(),
                platform.getId(),
                platform.getName(),
                project.getId(),
                project.getName(),
                company.getId(),
                company.getName(),
                createdBy.getId(),
                createdBy.getUsername() + " " + createdBy.getSurname(),
                testFeatureCount,
                testSuite.getCreatedAt(),
                testSuite.getUpdatedAt()
        );
    }
}
