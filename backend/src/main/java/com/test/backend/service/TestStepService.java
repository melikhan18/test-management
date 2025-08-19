package com.test.backend.service;

import com.test.backend.dto.CreateTestStepRequest;
import com.test.backend.dto.TestStepDto;
import com.test.backend.dto.ReorderTestStepsRequest;
import com.test.backend.entity.*;
import com.test.backend.entity.CompanyRole;
import com.test.backend.enums.TestStepStatus;
import com.test.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for test step management operations.
 */
@Service
public class TestStepService {

    @Autowired
    private TestStepRepository testStepRepository;

    @Autowired
    private TestScenarioRepository testScenarioRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyMemberRepository companyMemberRepository;

    /**
     * Create a new test step in a test scenario.
     */
    @Transactional
    public TestStepDto createTestStep(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, Long testScenarioId,
                                     CreateTestStepRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN && userRole != CompanyRole.MEMBER) {
            throw new RuntimeException("Access denied. You must be a company member to create test steps.");
        }

        // Get and validate test scenario
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

        // Check if step order already exists
        if (testStepRepository.findByTestScenarioAndStepOrder(testScenario, request.getStepOrder()).isPresent()) {
            throw new RuntimeException("A test step with this order already exists in this test scenario");
        }

        // Create test step
        TestStep testStep = new TestStep();
        testStep.setStepOrder(request.getStepOrder());
        testStep.setAction(request.getAction());
        testStep.setExpectedResult(request.getExpectedResult());
        testStep.setNotes(request.getNotes());
        testStep.setStatus(TestStepStatus.NOT_EXECUTED);
        testStep.setTestScenario(testScenario);

        testStep = testStepRepository.save(testStep);
        return convertToDto(testStep);
    }

    /**
     * Get all test steps for a test scenario that user has access to.
     */
    public List<TestStepDto> getTestStepsByTestScenario(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, Long testScenarioId, String userEmail) {
        // Validate user access
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId()).isPresent()) {
            throw new RuntimeException("Access denied to this company");
        }

        // Get and validate test scenario
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

        List<TestStep> testSteps = testStepRepository.findByTestScenarioOrderByStepOrder(testScenario);
        return testSteps.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get test step by ID if user has access.
     */
    public TestStepDto getTestStep(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, Long testScenarioId, Long testStepId, String userEmail) {
        // Validate user access
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is member of this company
        if (!companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId()).isPresent()) {
            throw new RuntimeException("Access denied to this company");
        }

        TestStep testStep = testStepRepository.findActiveById(testStepId)
                .orElseThrow(() -> new RuntimeException("Test step not found"));

        // Validate hierarchy
        if (!testStep.getTestScenario().getId().equals(testScenarioId) ||
            !testStep.getTestScenario().getTestFeature().getId().equals(testFeatureId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test step does not belong to the specified hierarchy");
        }

        return convertToDto(testStep);
    }

    /**
     * Update test step.
     */
    @Transactional
    public TestStepDto updateTestStep(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, Long testScenarioId, Long testStepId,
                                     CreateTestStepRequest request, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can update test steps.");
        }

        TestStep testStep = testStepRepository.findActiveById(testStepId)
                .orElseThrow(() -> new RuntimeException("Test step not found"));

        // Validate hierarchy
        if (!testStep.getTestScenario().getId().equals(testScenarioId) ||
            !testStep.getTestScenario().getTestFeature().getId().equals(testFeatureId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test step does not belong to the specified hierarchy");
        }

        // Check if new step order conflicts with existing test steps (if order is changed)
        if (!testStep.getStepOrder().equals(request.getStepOrder()) &&
            testStepRepository.findByTestScenarioAndStepOrder(testStep.getTestScenario(), request.getStepOrder()).isPresent()) {
            throw new RuntimeException("A test step with this order already exists in this test scenario");
        }

        testStep.setStepOrder(request.getStepOrder());
        testStep.setAction(request.getAction());
        testStep.setExpectedResult(request.getExpectedResult());
        testStep.setNotes(request.getNotes());

        testStep = testStepRepository.save(testStep);
        return convertToDto(testStep);
    }

    /**
     * Delete test step (soft delete).
     */
    @Transactional
    public void deleteTestStep(Long companyId, Long projectId, Long platformId, Long versionId, Long testSuiteId, Long testFeatureId, Long testScenarioId, Long testStepId, String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permission for this company
        CompanyRole userRole = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .map(member -> member.getRole())
                .orElseThrow(() -> new RuntimeException("Access denied to this company"));

        if (userRole != CompanyRole.OWNER && userRole != CompanyRole.ADMIN) {
            throw new RuntimeException("Access denied. Only company owners and admins can delete test steps.");
        }

        TestStep testStep = testStepRepository.findActiveById(testStepId)
                .orElseThrow(() -> new RuntimeException("Test step not found"));

        // Validate hierarchy
        if (!testStep.getTestScenario().getId().equals(testScenarioId) ||
            !testStep.getTestScenario().getTestFeature().getId().equals(testFeatureId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test step does not belong to the specified hierarchy");
        }

        // Soft delete the test step
        testStep.markAsDeleted();
        testStepRepository.save(testStep);
    }

    /**
     * Get next available step order for a test scenario.
     */
    public Integer getNextStepOrder(Long testScenarioId) {
        TestScenario testScenario = testScenarioRepository.findActiveById(testScenarioId)
                .orElseThrow(() -> new RuntimeException("Test scenario not found"));
        
        Integer maxOrder = testStepRepository.findMaxStepOrderByTestScenario(testScenario);
        return maxOrder + 1;
    }

    /**
     * Convert TestStep entity to DTO.
     */
    private TestStepDto convertToDto(TestStep testStep) {
        TestScenario testScenario = testStep.getTestScenario();
        User executedBy = testStep.getExecutedBy();

        return new TestStepDto(
                testStep.getId(),
                testStep.getStepOrder(),
                testStep.getAction(),
                testStep.getExpectedResult(),
                testStep.getActualResult(),
                testStep.getStatus(),
                testStep.getNotes(),
                testScenario.getId(),
                testScenario.getName(),
                executedBy != null ? executedBy.getId() : null,
                executedBy != null ? executedBy.getUsername() + " " + executedBy.getSurname() : null,
                testStep.getCreatedAt(),
                testStep.getUpdatedAt()
        );
    }

    /**
     * Reorder test steps within a test scenario.
     */
    @Transactional
    public List<TestStepDto> reorderTestSteps(Long companyId, Long projectId, Long platformId, Long versionId, 
                                               Long testSuiteId, Long testFeatureId, Long testScenarioId, 
                                               List<ReorderTestStepsRequest.StepOrderDto> stepOrders, String userEmail) {
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

        // Update step orders
        for (ReorderTestStepsRequest.StepOrderDto stepOrder : stepOrders) {
            TestStep testStep = testStepRepository.findActiveById(stepOrder.getStepId())
                    .orElseThrow(() -> new RuntimeException("Test step not found: " + stepOrder.getStepId()));
            
            if (!testStep.getTestScenario().getId().equals(testScenarioId)) {
                throw new RuntimeException("Test step does not belong to the specified test scenario");
            }
            
            testStep.setStepOrder(stepOrder.getStepOrder());
            testStepRepository.save(testStep);
        }

        // Return updated list
        return getTestStepsByTestScenario(companyId, projectId, platformId, versionId, 
                                          testSuiteId, testFeatureId, testScenarioId, userEmail);
    }

    /**
     * Update test step execution result.
     */
    @Transactional
    public TestStepDto updateTestStepExecution(Long companyId, Long projectId, Long platformId, Long versionId, 
                                                Long testSuiteId, Long testFeatureId, Long testScenarioId, 
                                                Long testStepId, String actualResult, String executionNotes, 
                                                String userEmail) {
        // Validate user and permissions
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user permissions for this company
        CompanyMember companyMember = companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .orElseThrow(() -> new RuntimeException("Access denied - user is not a member of this company"));

        // Get test step
        TestStep testStep = testStepRepository.findActiveById(testStepId)
                .orElseThrow(() -> new RuntimeException("Test step not found"));

        // Validate hierarchy
        if (!testStep.getTestScenario().getId().equals(testScenarioId) ||
            !testStep.getTestScenario().getTestFeature().getId().equals(testFeatureId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getId().equals(testSuiteId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getId().equals(versionId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getId().equals(platformId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getId().equals(projectId) ||
            !testStep.getTestScenario().getTestFeature().getTestSuite().getVersion().getPlatform().getProject().getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Test step does not belong to the specified hierarchy");
        }

        testStep.setActualResult(actualResult);
        testStep.setNotes(executionNotes);
        testStep.setExecutedBy(user);
        testStep = testStepRepository.save(testStep);
        
        return convertToDto(testStep);
    }
}
