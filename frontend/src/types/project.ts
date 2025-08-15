// Project related interfaces
export interface Project {
  id: number;
  name: string;
  description?: string;
  companyId: number;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}
