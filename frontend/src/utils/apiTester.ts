import { authService, companyService, userService } from '../services';

/**
 * API Test Utilities
 * Helper functions to test API connectivity and functionality
 */
export class ApiTester {
  
  /**
   * Test basic API connectivity
   */
  static async testConnection(): Promise<boolean> {
    try {
      // Test health endpoint (if available)
      const response = await fetch('http://localhost:8080/api/v1/health');
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Test authentication flow
   */
  static async testAuth(): Promise<void> {
    const testUser = {
      username: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: 'testpassword123'
    };

    try {
      console.log('🧪 Testing authentication...');
      
      // Test registration
      console.log('📝 Testing registration...');
      const registerResponse = await authService.register(testUser);
      console.log('✅ Registration successful:', registerResponse.user);

      // Test getting current user
      console.log('👤 Testing get current user...');
      const currentUser = await authService.getCurrentUser();
      console.log('✅ Current user retrieved:', currentUser);

      // Test logout
      console.log('🚪 Testing logout...');
      authService.logout();
      console.log('✅ Logout successful');

      // Test login
      console.log('🔑 Testing login...');
      const loginResponse = await authService.login({
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', loginResponse.user);

    } catch (error) {
      console.error('❌ Auth test failed:', error);
      throw error;
    }
  }

  /**
   * Test company operations
   */
  static async testCompanyOperations(): Promise<void> {
    try {
      console.log('🏢 Testing company operations...');

      // Create company
      console.log('🏗️ Testing company creation...');
      const newCompany = await companyService.createCompany({
        name: 'Test Company'
      });
      console.log('✅ Company created:', newCompany);

      // Get user companies
      console.log('📋 Testing get user companies...');
      const userCompanies = await companyService.getUserCompanies();
      console.log('✅ User companies retrieved:', userCompanies);

      // Get owned companies
      console.log('👑 Testing get owned companies...');
      const ownedCompanies = await companyService.getOwnedCompanies();
      console.log('✅ Owned companies retrieved:', ownedCompanies);

      // Get company by ID
      console.log('🔍 Testing get company by ID...');
      const company = await companyService.getCompanyById(newCompany.id);
      console.log('✅ Company retrieved by ID:', company);

      // Get company members
      console.log('👥 Testing get company members...');
      const members = await companyService.getCompanyMembers(newCompany.id);
      console.log('✅ Company members retrieved:', members);

    } catch (error) {
      console.error('❌ Company operations test failed:', error);
      throw error;
    }
  }

  /**
   * Test user operations
   */
  static async testUserOperations(): Promise<void> {
    try {
      console.log('👤 Testing user operations...');

      // Get user profile
      console.log('📄 Testing get user profile...');
      const profile = await userService.getProfile();
      console.log('✅ User profile retrieved:', profile);

      // Update profile
      console.log('✏️ Testing update user profile...');
      const updatedProfile = await userService.updateProfile({
        username: 'Updated Test',
        surname: 'User',
        email: profile.email
      });
      console.log('✅ User profile updated:', updatedProfile);

    } catch (error) {
      console.error('❌ User operations test failed:', error);
      throw error;
    }
  }

  /**
   * Run all tests
   */
  static async runAllTests(): Promise<void> {
    console.log('🚀 Starting API tests...');
    
    try {
      // Test connection
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('API connection failed');
      }
      console.log('✅ API connection successful');

      // Test auth
      await this.testAuth();

      // Test user operations
      await this.testUserOperations();

      // Test company operations
      await this.testCompanyOperations();

      console.log('🎉 All API tests passed!');
    } catch (error) {
      console.error('💥 API tests failed:', error);
      throw error;
    }
  }
}

// Export for easy testing
export default ApiTester;
