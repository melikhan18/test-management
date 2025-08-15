export interface CompanyInvitation {
  id: number;
  companyId: number;
  companyName: string;
  invitedByName: string;
  invitedByEmail: string;
  invitedEmail: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  message?: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

export interface CreateInvitationRequest {
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  message?: string;
}
