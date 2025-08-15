import { useState, useEffect, useRef } from 'react';
import { Building2, ChevronDown, Settings } from 'lucide-react';
import { useCompany } from '../../contexts';

export const CompanySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<Record<number, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { companies, selectedCompany, selectCompany, isLoading, getUserRole } = useCompany();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load user roles for all companies
  useEffect(() => {
    const loadUserRoles = async () => {
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

    if (companies.length > 0) {
      loadUserRoles();
    }
  }, [companies, getUserRole]);

  const handleCompanySelect = (company: any) => {
    selectCompany(company);
    setIsOpen(false);
  };

  const getCompanyUserRole = (company: any): string => {
    return userRoles[company.id] || 'MEMBER';
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      OWNER: 'bg-amber-50/80 text-amber-700 border border-amber-100/60',
      ADMIN: 'bg-blue-50/80 text-blue-700 border border-blue-100/60',
      MEMBER: 'bg-gray-50/80 text-gray-600 border border-gray-100/60'
    };
    
    return styles[role as keyof typeof styles] || styles.MEMBER;
  };

  const getRoleDisplayName = (role: string) => {
    const displayNames = {
      OWNER: 'Owner',
      ADMIN: 'Admin',
      MEMBER: 'Member'
    };
    
    return displayNames[role as keyof typeof displayNames] || 'Member';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return (
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
        );
      case 'ADMIN':
        return (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
        );
      default:
        return (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!companies.length) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg">
        <Building2 className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">No companies</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2.5 px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-white/90 hover:border-gray-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 min-w-[240px] shadow-sm hover:shadow-md"
      >
        {/* Company Icon */}
        <div className="relative">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500/90 to-blue-600/90 rounded-lg flex items-center justify-center shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
          {/* Simplified status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></div>
        </div>
        
        {/* Company Info */}
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs text-gray-500 font-medium mb-0.5">Company</div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-800 truncate">
              {selectedCompany?.name || 'Select Company'}
            </span>
            {selectedCompany && (
              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs ${getRoleBadge(getCompanyUserRole(selectedCompany))}`}>
                {getRoleIcon(getCompanyUserRole(selectedCompany))}
                <span className="font-medium text-[11px]">{getRoleDisplayName(getCompanyUserRole(selectedCompany))}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 ${isOpen ? 'rotate-180 text-gray-600' : 'group-hover:text-gray-600'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-[320px] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/60 z-50 overflow-hidden">
          {/* Company List */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            <div className="py-1">{companies.map((company, index) => {
                const userRole = getCompanyUserRole(company);
                const isSelected = selectedCompany?.id === company.id;
                
                return (
                  <button
                    key={company.id}
                    onClick={() => handleCompanySelect(company)}
                    className={`group w-full px-4 py-3.5 text-left hover:bg-blue-50/50 focus:outline-none focus:bg-blue-50/60 transition-all duration-200 ${
                      isSelected ? 'bg-blue-50/70' : ''
                    } ${index !== companies.length - 1 ? 'border-b border-gray-100/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Company Avatar */}
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            isSelected 
                              ? 'bg-gradient-to-br from-blue-500/90 to-blue-600/90 ring-2 ring-blue-200' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100/60 group-hover:to-blue-200/60'
                          }`}>
                            <Building2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
                          </div>
                          {/* Active indicator for selected company */}
                          {isSelected && (
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                          )}
                        </div>
                        
                        {/* Company Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <h4 className={`text-sm font-medium truncate max-w-[140px] ${
                                isSelected ? 'text-blue-900' : 'text-gray-800 group-hover:text-blue-900'
                              }`}>
                                {company.name}
                              </h4>
                              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs ${getRoleBadge(userRole)}`}>
                                {getRoleIcon(userRole)}
                                <span className="font-medium text-[11px]">{getRoleDisplayName(userRole)}</span>
                              </div>
                            </div>
                          </div>
                          {/* Company meta info */}
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {company.memberCount || 0} members
                            </span>
                            {isSelected && (
                              <span className="text-xs text-emerald-600 font-medium">
                                • Active workspace
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="bg-gray-50/60 backdrop-blur-sm border-t border-gray-100/60 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {selectedCompany ? `Active: ${selectedCompany.name}` : 'No selection'}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to company settings
                }}
                className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 bg-white/60 border border-gray-200/60 rounded-md hover:bg-white/80 hover:border-gray-300/60 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all duration-200"
              >
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
