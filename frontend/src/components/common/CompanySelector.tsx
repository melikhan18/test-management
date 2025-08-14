import { useState, useEffect, useRef } from 'react';
import { Building2, ChevronDown, Check, Plus } from 'lucide-react';
import { useCompany } from '../../contexts';

export const CompanySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { companies, selectedCompany, selectCompany, isLoading } = useCompany();

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

  const handleCompanySelect = (company: any) => {
    selectCompany(company);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!companies.length) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500">
        <Building2 className="w-4 h-4" />
        <span>No companies</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="company-selector flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none transition-all duration-200"
      >
        <Building2 className="w-4 h-4 text-gray-500" />
        <span className="max-w-32 truncate">
          {selectedCompany?.name || 'Select Company'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1 max-h-60 overflow-auto">
            {/* Company List Header */}
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              Your Companies ({companies.length})
            </div>
            
            {/* Company List */}
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleCompanySelect(company)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 truncate max-w-36">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {company.memberCount} member{company.memberCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                {selectedCompany?.id === company.id && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
            
            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>
            
            {/* Create New Company */}
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to create company page
                // You can implement this navigation
              }}
              className="flex items-center w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 focus:outline-none focus:bg-blue-100 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-3" />
              Create New Company
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
