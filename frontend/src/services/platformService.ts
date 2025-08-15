import api from './api';
import type { Platform, CreatePlatformRequest, UpdatePlatformRequest } from '../types';

export const platformService = {
  // Get all platforms for a project
  getPlatforms: async (companyId: number, projectId: number): Promise<Platform[]> => {
    const response = await api.get(`/api/v1/companies/${companyId}/projects/${projectId}/platforms`);
    return response.data;
  },

  // Get a specific platform
  getPlatform: async (companyId: number, projectId: number, platformId: number): Promise<Platform> => {
    const response = await api.get(`/api/v1/companies/${companyId}/projects/${projectId}/platforms/${platformId}`);
    return response.data;
  },

  // Create a new platform
  createPlatform: async (companyId: number, projectId: number, data: CreatePlatformRequest): Promise<Platform> => {
    const response = await api.post(`/api/v1/companies/${companyId}/projects/${projectId}/platforms`, data);
    return response.data;
  },

  // Update a platform
  updatePlatform: async (
    companyId: number, 
    projectId: number, 
    platformId: number, 
    data: UpdatePlatformRequest
  ): Promise<Platform> => {
    const response = await api.put(`/api/v1/companies/${companyId}/projects/${projectId}/platforms/${platformId}`, data);
    return response.data;
  },

  // Delete a platform
  deletePlatform: async (companyId: number, projectId: number, platformId: number): Promise<void> => {
    await api.delete(`/api/v1/companies/${companyId}/projects/${projectId}/platforms/${platformId}`);
  }
};
