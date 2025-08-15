import api from './api';
import type { Version, CreateVersionRequest } from '../types';

export const versionService = {
  // Get all versions for a platform
  getVersions: async (companyId: number, projectId: number, platformId: number): Promise<Version[]> => {
    const response = await api.get(`/api/v1/companies/${companyId}/projects/${projectId}/platforms/${platformId}/versions`);
    return response.data;
  },

  // Get a single version
  getVersion: async (companyId: number, projectId: number, platformId: number, versionId: number): Promise<Version> => {
    const response = await api.get(`/api/v1/companies/${companyId}/projects/${projectId}/platforms/${platformId}/versions/${versionId}`);
    return response.data;
  },

  // Create a new version
  createVersion: async (companyId: number, projectId: number, platformId: number, data: CreateVersionRequest): Promise<Version> => {
    const response = await api.post(`/api/v1/companies/${companyId}/projects/${projectId}/platforms/${platformId}/versions`, data);
    return response.data;
  },

  // Update a version
  updateVersion: async (companyId: number, projectId: number, platformId: number, versionId: number, data: CreateVersionRequest): Promise<Version> => {
    const response = await api.put(`/api/v1/companies/${companyId}/projects/${projectId}/platforms/${platformId}/versions/${versionId}`, data);
    return response.data;
  },

  // Delete a version
  deleteVersion: async (companyId: number, projectId: number, platformId: number, versionId: number): Promise<void> => {
    await api.delete(`/api/v1/companies/${companyId}/projects/${projectId}/platforms/${platformId}/versions/${versionId}`);
  }
};
