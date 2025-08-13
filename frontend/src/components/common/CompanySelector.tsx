import { useState } from 'react';
import {
  FiChevronDown,
  FiCheck,
  FiHome,
  FiSearch,
  FiPlus,
  FiStar,
  FiUsers,
  FiMapPin
} from 'react-icons/fi';

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  location?: string;
  memberCount?: number;
  isActive?: boolean;
  isFavorite?: boolean;
  role?: 'Owner' | 'Admin' | 'Member' | 'Viewer';
}

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany?: Company;
  onCompanySelect: (company: Company) => void;
  onAddCompany?: () => void;
  className?: string;
}

/**
 * Enterprise Company Selector Component
 * Professional company switching with search and favorites
 */
export default function CompanySelector({
  companies,
  selectedCompany,
  onCompanySelect,
  onAddCompany,
  className = ''
}: CompanySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteCompanies = filteredCompanies.filter(c => c.isFavorite);
  const regularCompanies = filteredCompanies.filter(c => !c.isFavorite);

  const handleCompanySelect = (company: Company) => {
    onCompanySelect(company);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'Owner': return 'text-purple-600 bg-purple-50';
      case 'Admin': return 'text-blue-600 bg-blue-50';
      case 'Member': return 'text-green-600 bg-green-50';
      case 'Viewer': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Company Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 rounded-xl bg-gray-50 px-4 py-2.5 text-left transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 active:bg-gray-100 min-w-0 group"
      >
        {/* Company Logo/Avatar */}
        <div className="relative flex-shrink-0">
          {selectedCompany?.logoUrl ? (
            <img
              src={selectedCompany.logoUrl}
              alt={selectedCompany.name}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {selectedCompany ? getCompanyInitials(selectedCompany.name) : 'NC'}
              </span>
            </div>
          )}
          {selectedCompany?.isActive && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          )}
        </div>

        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {selectedCompany?.name || 'Select Company'}
            </p>
            {selectedCompany?.isFavorite && (
              <FiStar className="h-3 w-3 text-yellow-500 fill-current" />
            )}
          </div>
          {selectedCompany && (
            <div className="flex items-center space-x-2 mt-0.5">
              <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getRoleColor(selectedCompany.role)}`}>
                {selectedCompany.role}
              </span>
              {selectedCompany.memberCount && (
                <span className="text-xs text-gray-500 flex items-center">
                  <FiUsers className="h-3 w-3 mr-1" />
                  {selectedCompany.memberCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Dropdown Arrow */}
        <FiChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 z-50">
          {/* Search */}
          <div className="px-3 pb-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors"
              />
            </div>
          </div>

          {/* Company List */}
          <div className="max-h-64 overflow-y-auto">
            {/* Favorites Section */}
            {favoriteCompanies.length > 0 && (
              <>
                <div className="px-3 py-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorites</p>
                </div>
                {favoriteCompanies.map((company) => (
                  <CompanyOption
                    key={company.id}
                    company={company}
                    isSelected={selectedCompany?.id === company.id}
                    onSelect={() => handleCompanySelect(company)}
                  />
                ))}
                {regularCompanies.length > 0 && <div className="border-t border-gray-100 my-1" />}
              </>
            )}

            {/* Regular Companies */}
            {regularCompanies.length > 0 && (
              <>
                {favoriteCompanies.length > 0 && (
                  <div className="px-3 py-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">All Companies</p>
                  </div>
                )}
                {regularCompanies.map((company) => (
                  <CompanyOption
                    key={company.id}
                    company={company}
                    isSelected={selectedCompany?.id === company.id}
                    onSelect={() => handleCompanySelect(company)}
                  />
                ))}
              </>
            )}

            {/* No Results */}
            {filteredCompanies.length === 0 && (
              <div className="px-3 py-8 text-center">
                <FiHome className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No companies found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>

          {/* Add Company Button */}
          {onAddCompany && (
            <>
              <div className="border-t border-gray-100 mt-2" />
              <button
                onClick={() => {
                  onAddCompany();
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mx-2"
              >
                <FiPlus className="h-4 w-4 mr-3" />
                Add New Company
              </button>
            </>
          )}
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Company Option Component
interface CompanyOptionProps {
  company: Company;
  isSelected: boolean;
  onSelect: () => void;
}

function CompanyOption({ company, isSelected, onSelect }: CompanyOptionProps) {
  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'Owner': return 'text-purple-600 bg-purple-50';
      case 'Admin': return 'text-blue-600 bg-blue-50';
      case 'Member': return 'text-green-600 bg-green-50';
      case 'Viewer': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center px-3 py-3 text-left hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50' : ''
      }`}
    >
      {/* Company Logo */}
      <div className="relative flex-shrink-0 mr-3">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.name}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {getCompanyInitials(company.name)}
            </span>
          </div>
        )}
        {company.isActive && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
        )}
      </div>

      {/* Company Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900 truncate">{company.name}</p>
          {company.isFavorite && (
            <FiStar className="h-3 w-3 text-yellow-500 fill-current" />
          )}
          {isSelected && (
            <FiCheck className="h-4 w-4 text-blue-600" />
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-1">
          <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${getRoleColor(company.role)}`}>
            {company.role}
          </span>
          {company.memberCount && (
            <span className="text-xs text-gray-500 flex items-center">
              <FiUsers className="h-3 w-3 mr-1" />
              {company.memberCount}
            </span>
          )}
        </div>
        
        {company.industry && (
          <p className="text-xs text-gray-500 mt-0.5">{company.industry}</p>
        )}
        
        {company.location && (
          <p className="text-xs text-gray-400 flex items-center mt-0.5">
            <FiMapPin className="h-3 w-3 mr-1" />
            {company.location}
          </p>
        )}
      </div>
    </button>
  );
}
