import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Users, 
  Settings, 
  Trash2, 
  Eye, 
  Crown, 
  Shield, 
  User,
  UserPlus,
  ChevronDown,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { DashboardLayout } from '../components/layout';
import { InviteUserModal, ConfirmDeleteModal } from '../components/common';
import { companyService } from '../services';
import { formatErrorMessage } from '../utils/helpers';
import { useCompany } from '../contexts';
import type { Company, CreateCompanyRequest, CompanyRole, UserCompany } from '../types';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'memberCount' | 'createdAt' | 'updatedAt';
type SortOrder = 'asc' | 'desc';

export const CompaniesPage = () => {
  const { selectedCompany, selectCompany, refreshCompanies } = useCompany();
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCompanyForInvite, setSelectedCompanyForInvite] = useState<Company | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompanyForDelete, setSelectedCompanyForDelete] = useState<UserCompany | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newCompany, setNewCompany] = useState<CreateCompanyRequest>({ name: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const allCompanies = await companyService.getUserCompaniesWithRoles();
      setCompanies(allCompanies);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name.trim()) return;

    try {
      setIsCreating(true);
      await companyService.createCompany(newCompany);
      setShowCreateModal(false);
      setNewCompany({ name: '' });
      await loadCompanies();
      
      // Also refresh the company context to update header selector
      await refreshCompanies();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCompany = (company: UserCompany) => {
    setSelectedCompanyForDelete(company);
    setShowDeleteModal(true);
  };

  const confirmDeleteCompany = async () => {
    if (!selectedCompanyForDelete) return;

    setIsDeleting(true);
    try {
      await companyService.deleteCompany(selectedCompanyForDelete.id);
      
      // If the deleted company is currently selected, clear the selection
      if (selectedCompany && selectedCompany.id === selectedCompanyForDelete.id) {
        selectCompany(null);
      }
      
      await loadCompanies();
      setShowDeleteModal(false);
      setSelectedCompanyForDelete(null);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteCompany = () => {
    setShowDeleteModal(false);
    setSelectedCompanyForDelete(null);
  };

  const getUserRole = (company: UserCompany): CompanyRole => {
    return company.userRole;
  };

  const getRoleIcon = (role: CompanyRole) => {
    switch (role) {
      case 'OWNER': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'ADMIN': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: CompanyRole) => {
    const colors = {
      OWNER: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200',
      ADMIN: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200',
      MEMBER: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[role]}`}>
        {getRoleIcon(role)}
        <span className="ml-1.5 capitalize">{role.toLowerCase()}</span>
      </span>
    );
  };

  const filteredAndSortedCompanies = companies
    .filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'memberCount':
          aValue = a.memberCount;
          bValue = b.memberCount;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading companies...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your organizations and workspaces
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4 flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Company
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Sort
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>

                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-2">
                        {[
                          { field: 'name' as SortField, label: 'Company Name' },
                          { field: 'memberCount' as SortField, label: 'Member Count' },
                          { field: 'createdAt' as SortField, label: 'Created Date' },
                          { field: 'updatedAt' as SortField, label: 'Last Updated' },
                        ].map(({ field, label }) => (
                          <button
                            key={field}
                            onClick={() => {
                              handleSort(field);
                              setShowFilterMenu(false);
                            }}
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <span>{label}</span>
                            {sortField === field && (
                              sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Companies Grid/List */}
        {filteredAndSortedCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating your first company.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Company
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredAndSortedCompanies.map((company) => {
              const userRole = getUserRole(company);
              
              if (viewMode === 'grid') {
                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {company.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              {getRoleBadge(userRole)}
                            </div>
                          </div>
                        </div>
                        <div className="relative">
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-all duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Members</span>
                          <div className="flex items-center space-x-1 text-gray-900 font-medium">
                            <Users className="w-4 h-4" />
                            <span>{company.memberCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Created</span>
                          <span className="text-gray-900">{formatDate(company.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Updated</span>
                          <span className="text-gray-900">{formatRelativeTime(company.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/companies/${company.id}/projects`}
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Projects
                        </Link>
                        <div className="flex items-center space-x-2">
                          {(userRole === 'OWNER' || userRole === 'ADMIN') && (
                            <>
                              <button 
                                onClick={() => {
                                  setSelectedCompanyForInvite(company);
                                  setShowInviteModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200"
                                title="Invite user"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200">
                                <Settings className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {userRole === 'OWNER' && (
                            <button 
                              onClick={() => handleDeleteCompany(company)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              {getRoleBadge(userRole)}
                              <span className="text-sm text-gray-500">
                                {company.memberCount} members
                              </span>
                              <span className="text-sm text-gray-500">
                                Updated {formatRelativeTime(company.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/companies/${company.id}/projects`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Projects
                          </Link>
                          {(userRole === 'OWNER' || userRole === 'ADMIN') && (
                            <button 
                              onClick={() => {
                                setSelectedCompanyForInvite(company);
                                setShowInviteModal(true);
                              }}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200"
                              title="Invite user"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Invite
                            </button>
                          )}
                          {userRole === 'OWNER' && (
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200">
                                <Settings className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCompany(company)}
                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}

        {/* Create Company Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create New Company</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new company workspace for your team
                </p>
              </div>
              
              <form onSubmit={handleCreateCompany} className="p-6">
                <div className="mb-6">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ name: e.target.value })}
                    placeholder="Enter company name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewCompany({ name: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newCompany.name.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Creating...' : 'Create Company'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invite User Modal */}
        {selectedCompanyForInvite && (
          <InviteUserModal
            isOpen={showInviteModal}
            onClose={() => {
              setShowInviteModal(false);
              setSelectedCompanyForInvite(null);
            }}
            companyId={selectedCompanyForInvite.id}
            companyName={selectedCompanyForInvite.name}
            onInviteSent={() => {
              // Optionally refresh companies or show success message
              loadCompanies();
            }}
          />
        )}

        {/* Confirm Delete Modal */}
        {selectedCompanyForDelete && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={cancelDeleteCompany}
            onConfirm={confirmDeleteCompany}
            title="Delete Company"
            message={`Are you sure you want to delete "${selectedCompanyForDelete.name}"? This will permanently delete the company and all its projects. This action cannot be undone.`}
            confirmText={`Please type "${selectedCompanyForDelete.name}" to confirm:`}
            itemName={selectedCompanyForDelete.name}
            isLoading={isDeleting}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
