import api from './api';
import type { CompanyInvitation, CreateInvitationRequest } from '../types';

/**
 * Company invitation service for handling invitation-related operations
 */
export const invitationService = {
  /**
   * Send company invitation
   */
  sendInvitation: async (companyId: number, invitation: CreateInvitationRequest): Promise<CompanyInvitation> => {
    const response = await api.post<CompanyInvitation>(`/api/v1/companies/${companyId}/invitations`, invitation);
    return response.data;
  },

  /**
   * Get company invitations (sent by company)
   */
  getCompanyInvitations: async (companyId: number): Promise<CompanyInvitation[]> => {
    const response = await api.get<CompanyInvitation[]>(`/api/v1/companies/${companyId}/invitations`);
    return response.data;
  },

  /**
   * Get user invitations (received by user)
   */
  getUserInvitations: async (): Promise<CompanyInvitation[]> => {
    const response = await api.get<CompanyInvitation[]>('/api/v1/invitations');
    return response.data;
  },

  /**
   * Get pending invitations for user
   */
  getPendingInvitations: async (): Promise<CompanyInvitation[]> => {
    const response = await api.get<CompanyInvitation[]>('/api/v1/invitations/pending');
    return response.data;
  },

  /**
   * Accept invitation
   */
  acceptInvitation: async (token: string): Promise<CompanyInvitation> => {
    const response = await api.post<CompanyInvitation>(`/api/v1/invitations/${token}/accept`);
    return response.data;
  },

  /**
   * Reject invitation
   */
  rejectInvitation: async (token: string): Promise<CompanyInvitation> => {
    const response = await api.post<CompanyInvitation>(`/api/v1/invitations/${token}/reject`);
    return response.data;
  },
};
