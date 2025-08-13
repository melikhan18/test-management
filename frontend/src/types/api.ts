// Base API Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Types - Backend: UserDto
export interface User {
  id: number;
  username: string;
  surname: string;
  email: string;
}

// Auth Types - Backend: AuthRequest
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth Types - Backend: RegisterRequest
export interface RegisterRequest {
  username: string;
  surname: string;
  email: string;
  password: string;
}

// Auth Types - Backend: AuthResponse
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// Company Types - Backend: CompanyDto
export interface Company {
  id: number;
  name: string;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
}

// Company Request Types - Backend: CreateCompanyRequest
export interface CreateCompanyRequest {
  name: string;
}

// Company Member Types - Backend: CompanyRole enum
export type CompanyRole = 'OWNER' | 'ADMIN' | 'MEMBER';

// Company Member Types - Backend: CompanyMemberDto
export interface CompanyMember {
  userId: number;
  username: string;
  surname: string;
  email: string;
  companyId: number;
  companyName: string;
  role: CompanyRole;
  joinedAt: string;
}

// Project Types (for future use - not implemented in backend yet)
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
  companyId: number;
}

// Version Types (for future use - not implemented in backend yet)
export interface Version {
  id: number;
  versionName: string;
  projectId: number;
  projectName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVersionRequest {
  versionName: string;
  projectId: number;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiException extends Error {
  public readonly status: number;
  public readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
  }
}
