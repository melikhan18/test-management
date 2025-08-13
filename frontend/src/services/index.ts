// Export all services from a single entry point
export { default as httpClient } from './httpClient';
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as companyService } from './companyService';

// Export service types
export type { UpdateProfileRequest, ChangePasswordRequest } from './userService';
export type { AddMemberRequest, UpdateMemberRoleRequest } from './companyService';

// Re-export API types for convenience
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Company,
  CreateCompanyRequest,
  CompanyMember,
  CompanyRole,
  ApiException,
} from '../types/api';
