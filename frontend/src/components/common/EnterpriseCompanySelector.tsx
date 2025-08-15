import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { EnterpriseSelector, type SelectorOption } from './EnterpriseSelector';
import { useCompany } from '../../contexts';
import type { Company } from '../../types';

export const EnterpriseCompanySelector: React.FC = () => {
  const { companies, selectedCompany, selectCompany, isLoading, error, getUserRole } = useCompany();
  const [userRoles, setUserRoles] = useState<Record<number, string>>({});

  // Load user roles for all companies
  useEffect(() => {
    const loadUserRoles = async () => {
      if (companies.length === 0) return;

      const rolePromises = companies.map(async (company) => {
        try {
          const role = await getUserRole(company.id);
          return { companyId: company.id, role };
        } catch (error) {
          console.error(`Failed to get role for company ${company.id}:`, error);
          return { companyId: company.id, role: 'MEMBER' };
        }
      });

      const roles = await Promise.all(rolePromises);
      const rolesMap = roles.reduce((acc, { companyId, role }) => {
        acc[companyId] = role;
        return acc;
      }, {} as Record<number, string>);

      setUserRoles(rolesMap);
    };

    loadUserRoles();
  }, [companies, getUserRole]);

  // Convert companies to selector options
  const options: SelectorOption[] = companies.map((company: Company) => {
    const userRole = userRoles[company.id] || 'MEMBER';
    
    return {
      id: company.id,
      name: company.name,
      description: `${company.memberCount || 0} members`,
      icon: <Building2 className="w-3.5 h-3.5" />,
      badge: {
        text: getRoleDisplayName(userRole),
        variant: getRoleBadgeVariant(userRole)
      },
      metadata: {
        userRole,
        memberCount: company.memberCount,
        createdAt: company.createdAt
      }
    };
  });

  // Convert selected company to selector option
  const selectedOption: SelectorOption | null = selectedCompany ? {
    id: selectedCompany.id,
    name: selectedCompany.name,
    description: `${selectedCompany.memberCount || 0} members`,
    icon: <Building2 className="w-3.5 h-3.5" />,
    badge: {
      text: getRoleDisplayName(userRoles[selectedCompany.id] || 'MEMBER'),
      variant: getRoleBadgeVariant(userRoles[selectedCompany.id] || 'MEMBER')
    },
    metadata: {
      userRole: userRoles[selectedCompany.id] || 'MEMBER',
      memberCount: selectedCompany.memberCount
    }
  } : null;

  const handleSelect = (option: SelectorOption) => {
    const company = companies.find(c => c.id === option.id);
    if (company) {
      selectCompany(company);
    }
  };

  return (
    <EnterpriseSelector
      type="company"
      selected={selectedOption}
      options={options}
      onSelect={handleSelect}
      loading={isLoading}
      error={error}
      placeholder="Select your workspace"
      searchable={true}
      size="md"
    />
  );
};

// Helper functions
function getRoleDisplayName(role: string): string {
  const displayNames: Record<string, string> = {
    OWNER: 'Owner',
    ADMIN: 'Admin',
    MEMBER: 'Member'
  };
  return displayNames[role] || 'Member';
}

function getRoleBadgeVariant(role: string): 'success' | 'warning' | 'info' | 'error' | 'default' | 'owner' | 'admin' | 'member' {
  const variants: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default' | 'owner' | 'admin' | 'member'> = {
    OWNER: 'owner',
    ADMIN: 'admin', 
    MEMBER: 'member'
  };
  return variants[role] || 'member';
}
