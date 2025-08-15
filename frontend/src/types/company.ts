// Company related interfaces
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

export interface UserCompany extends Company {
  userRole: CompanyRole; // User's role in this company
}

export interface CreateCompanyRequest {
  name: string;
}

export interface CompanyMember {
  id: number;
  username: string;
  surname: string;
  email: string;
  companyId: number;
  companyName: string;
  role: CompanyRole;
  joinedAt: string;
}

export const CompanyRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
} as const;

export type CompanyRole = typeof CompanyRole[keyof typeof CompanyRole];
