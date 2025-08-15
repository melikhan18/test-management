import api from './api';
import type { Project, CreateProjectRequest } from '../types';

/**
 * Project service for handling project-related operations
 */
export const projectService = {
  /**
   * Create a new project in a company
   */
  createProject: async (companyId: number, projectData: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>(`/api/v1/companies/${companyId}/projects`, projectData);
    return response.data;
  },

  /**
   * Get all projects in a company
   */
  getCompanyProjects: async (companyId: number): Promise<Project[]> => {
    const response = await api.get<Project[]>(`/api/v1/companies/${companyId}/projects`);
    return response.data;
  },

  /**
   * Get project by ID
   */
  getProject: async (companyId: number, projectId: number): Promise<Project> => {
    const response = await api.get<Project>(`/api/v1/companies/${companyId}/projects/${projectId}`);
    return response.data;
  },

  /**
   * Update project
   */
  updateProject: async (companyId: number, projectId: number, projectData: CreateProjectRequest): Promise<Project> => {
    const response = await api.put<Project>(`/api/v1/companies/${companyId}/projects/${projectId}`, projectData);
    return response.data;
  },

  /**
   * Delete project (soft delete)
   */
  deleteProject: async (companyId: number, projectId: number): Promise<void> => {
    await api.delete(`/api/v1/companies/${companyId}/projects/${projectId}`);
  },
};
