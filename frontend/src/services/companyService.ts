import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { 
  Company, 
  CreateCompanyRequest, 
  CompanyMember,
  CompanyRole 
} from '../types/api';

/**
 * Additional Company Service Types (for future backend implementation)
 */
export interface AddMemberRequest {
  email: string;
  role: CompanyRole;
}

export interface UpdateMemberRoleRequest {
  role: CompanyRole;
}

/**
 * Company Service
 * Handles all company-related API calls
 * Updated to match backend endpoints exactly
 */
class CompanyService {
  
  /**
   * Create a new company
   * Backend: POST /api/v1/companies
   */
  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    try {
      return await httpClient.post<Company>(
        API_ENDPOINTS.COMPANIES.BASE,
        companyData
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all companies where user is a member
   * Backend: GET /api/v1/companies
   */
  async getUserCompanies(): Promise<Company[]> {
    try {
      return await httpClient.get<Company[]>(API_ENDPOINTS.COMPANIES.BASE);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get companies owned by the current user
   * Backend: GET /api/v1/companies/owned
   */
  async getOwnedCompanies(): Promise<Company[]> {
    try {
      return await httpClient.get<Company[]>(API_ENDPOINTS.COMPANIES.OWNED);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get company by ID
   * Backend: GET /api/v1/companies/{companyId}
   */
  async getCompanyById(companyId: number): Promise<Company> {
    try {
      return await httpClient.get<Company>(
        API_ENDPOINTS.COMPANIES.BY_ID(companyId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update company information
   * Backend: PUT /api/v1/companies/{companyId}
   * Note: Backend uses CreateCompanyRequest for update as well
   */
  async updateCompany(companyId: number, companyData: CreateCompanyRequest): Promise<Company> {
    try {
      return await httpClient.put<Company>(
        API_ENDPOINTS.COMPANIES.BY_ID(companyId),
        companyData
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete company (soft delete)
   * Backend: DELETE /api/v1/companies/{companyId}
   */
  async deleteCompany(companyId: number): Promise<void> {
    try {
      await httpClient.delete<void>(
        API_ENDPOINTS.COMPANIES.BY_ID(companyId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all members of a company
   * Backend: GET /api/v1/companies/{companyId}/members
   */
  async getCompanyMembers(companyId: number): Promise<CompanyMember[]> {
    try {
      return await httpClient.get<CompanyMember[]>(
        API_ENDPOINTS.COMPANIES.MEMBERS(companyId)
      );
    } catch (error) {
      throw error;
    }
  }

  // ======================================
  // FUTURE METHODS (Not implemented in backend yet)
  // ======================================

  /**
   * Add member to company
   * TODO: Backend implementation needed
   */
  async addMember(companyId: number, memberData: AddMemberRequest): Promise<CompanyMember> {
    try {
      return await httpClient.post<CompanyMember>(
        API_ENDPOINTS.COMPANIES.ADD_MEMBER(companyId),
        memberData
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove member from company
   * TODO: Backend implementation needed
   */
  async removeMember(companyId: number, userId: number): Promise<void> {
    try {
      await httpClient.delete<void>(
        API_ENDPOINTS.COMPANIES.REMOVE_MEMBER(companyId, userId)
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update member role in company
   * TODO: Backend implementation needed
   */
  async updateMemberRole(
    companyId: number, 
    userId: number, 
    roleData: UpdateMemberRoleRequest
  ): Promise<CompanyMember> {
    try {
      return await httpClient.put<CompanyMember>(
        API_ENDPOINTS.COMPANIES.UPDATE_MEMBER_ROLE(companyId, userId),
        roleData
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user has specific role in company
   */
  async checkUserRole(companyId: number, requiredRole: CompanyRole): Promise<boolean> {
    try {
      const members = await this.getCompanyMembers(companyId);
      const currentUserEmail = this.getCurrentUserEmail();
      
      const userMember = members.find(member => member.email === currentUserEmail);
      
      if (!userMember) return false;
      
      // Role hierarchy: OWNER > ADMIN > MEMBER
      const roleHierarchy = { 'OWNER': 3, 'ADMIN': 2, 'MEMBER': 1 };
      const userRoleLevel = roleHierarchy[userMember.role];
      const requiredRoleLevel = roleHierarchy[requiredRole];
      
      return userRoleLevel >= requiredRoleLevel;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user's email from stored user data
   */
  private getCurrentUserEmail(): string | null {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user.email;
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const companyService = new CompanyService();
export default companyService;
