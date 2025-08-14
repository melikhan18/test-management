import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Company, CreateCompanyRequest, CompanyMember } from '../types';

/**
 * Company service for handling company-related operations
 */
export const companyService = {
  /**
   * Create a new company
   */
  createCompany: async (companyData: CreateCompanyRequest): Promise<Company> => {
    const response = await api.post<Company>(API_ENDPOINTS.COMPANIES.BASE, companyData);
    return response.data;
  },

  /**
   * Get all companies where user is a member
   */
  getUserCompanies: async (): Promise<Company[]> => {
    const response = await api.get<Company[]>(API_ENDPOINTS.COMPANIES.BASE);
    return response.data;
  },

  /**
   * Get companies owned by user
   */
  getOwnedCompanies: async (): Promise<Company[]> => {
    const response = await api.get<Company[]>(API_ENDPOINTS.COMPANIES.OWNED);
    return response.data;
  },

  /**
   * Get company by ID
   */
  getCompany: async (companyId: number): Promise<Company> => {
    const response = await api.get<Company>(`${API_ENDPOINTS.COMPANIES.BASE}/${companyId}`);
    return response.data;
  },

  /**
   * Get company members
   */
  getCompanyMembers: async (companyId: number): Promise<CompanyMember[]> => {
    const response = await api.get<CompanyMember[]>(API_ENDPOINTS.COMPANIES.MEMBERS(companyId));
    return response.data;
  },

  /**
   * Update company
   */
  updateCompany: async (companyId: number, companyData: CreateCompanyRequest): Promise<Company> => {
    const response = await api.put<Company>(`${API_ENDPOINTS.COMPANIES.BASE}/${companyId}`, companyData);
    return response.data;
  },

  /**
   * Delete company (soft delete)
   */
  deleteCompany: async (companyId: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.COMPANIES.BASE}/${companyId}`);
  },
};
