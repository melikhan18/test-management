import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Settings, 
  Trash2, 
  Smartphone, 
  Monitor, 
  Server, 
  Globe, 
  Eye,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ChevronDown,
  Target,
  MoreVertical
} from 'lucide-react';
import { DashboardLayout } from '../components/layout';
import { ConfirmDeleteModal } from '../components/common';
import { platformService } from '../services';
import { useCompany, useProject, usePlatform } from '../contexts';
import { formatErrorMessage } from '../utils/helpers';
import type { Platform, PlatformType } from '../types';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'platformType' | 'createdAt' | 'updatedAt';
type SortOrder = 'asc' | 'desc';

interface CreatePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (platform: Platform) => void;
  companyId: number;
  projectId: number;
}

const CreatePlatformModal: React.FC<CreatePlatformModalProps> = ({ isOpen, onClose, onSuccess, companyId, projectId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platformType: 'WEB' as PlatformType
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const platform = await platformService.createPlatform(companyId, projectId, formData);
      onSuccess(platform);
      setFormData({ name: '', description: '', platformType: 'WEB' });
      onClose();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New Platform</h3>
          <p className="text-sm text-gray-500 mt-1">
            Add a new platform to organize your versions
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                id="platformName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Android App"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="platformDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="platformDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Brief description of the platform"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="platformType" className="block text-sm font-medium text-gray-700 mb-2">
                Platform Type
              </label>
              <select
                id="platformType"
                value={formData.platformType}
                onChange={(e) => setFormData({ ...formData, platformType: e.target.value as PlatformType })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                disabled={isLoading}
              >
                <option value="ANDROID">📱 Android</option>
                <option value="IOS">🍎 iOS</option>
                <option value="WEB">🌐 Web</option>
                <option value="SERVICE">⚙️ Service</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                onClose();
                setFormData({ name: '', description: '', platformType: 'WEB' });
                setError(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Platform'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlatformsPage: React.FC = () => {
  const { companyId, projectId } = useParams<{ companyId: string; projectId: string }>();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const { selectedProject } = useProject();
  const { platforms, setPlatforms, isLoading } = usePlatform();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [platformToDelete, setPlatformToDelete] = useState<Platform | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId || !projectId) {
      navigate('/dashboard');
      return;
    }

    loadPlatforms();
  }, [companyId, projectId, navigate]);

  const loadPlatforms = async () => {
    if (!companyId || !projectId) return;

    try {
      setError(null);
      const platformData = await platformService.getPlatforms(Number(companyId), Number(projectId));
      setPlatforms(Array.isArray(platformData) ? platformData : []);
    } catch (err) {
      setError(formatErrorMessage(err));
      setPlatforms([]);
    }
  };

  const handleCreateSuccess = (newPlatform: Platform) => {
    setPlatforms([...platforms, newPlatform]);
  };

  const handleDeletePlatform = async () => {
    if (!platformToDelete || !companyId || !projectId) return;

    try {
      await platformService.deletePlatform(Number(companyId), Number(projectId), platformToDelete.id);
      setPlatforms(platforms.filter(p => p.id !== platformToDelete.id));
      setShowDeleteModal(false);
      setPlatformToDelete(null);
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  // Filtering and sorting
  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    platform.platformType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (platform.description && platform.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedPlatforms = [...filteredPlatforms].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
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

  const getPlatformIcon = (platformType: PlatformType) => {
    switch (platformType) {
      case 'ANDROID':
        return <Smartphone className="w-5 h-5 text-white" />;
      case 'IOS':
        return <Smartphone className="w-5 h-5 text-white" />;
      case 'WEB':
        return <Globe className="w-5 h-5 text-white" />;
      case 'SERVICE':
        return <Server className="w-5 h-5 text-white" />;
      default:
        return <Monitor className="w-5 h-5 text-white" />;
    }
  };

  const getPlatformColor = (platformType: PlatformType) => {
    switch (platformType) {
      case 'ANDROID':
        return 'bg-green-100 text-green-800';
      case 'IOS':
        return 'bg-gray-100 text-gray-800';
      case 'WEB':
        return 'bg-blue-100 text-blue-800';
      case 'SERVICE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedCompany || !selectedProject) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Platform Management</h1>
            <p className="text-gray-600">Please select a company and project first.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading platforms...</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Platforms</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage platforms for {selectedProject.name}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4 flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Platform
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
                    placeholder="Search platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
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
                        ? 'bg-white text-green-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-green-600 shadow-sm' 
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
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Sort
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>

                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            handleSort('name');
                            setShowFilterMenu(false);
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <span>Name</span>
                          {sortField === 'name' && (
                            sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            handleSort('platformType');
                            setShowFilterMenu(false);
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <span>Type</span>
                          {sortField === 'platformType' && (
                            sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            handleSort('createdAt');
                            setShowFilterMenu(false);
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <span>Created</span>
                          {sortField === 'createdAt' && (
                            sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            handleSort('updatedAt');
                            setShowFilterMenu(false);
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <span>Updated</span>
                          {sortField === 'updatedAt' && (
                            sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                          )}
                        </button>
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {sortedPlatforms.length === 0 && !isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No platforms found' : 'No platforms yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search criteria.'
                  : 'Create your first platform to start managing versions across different environments.'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Platform
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {sortedPlatforms.map((platform) => {
              if (viewMode === 'grid') {
                return (
                  <div
                    key={platform.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                            {getPlatformIcon(platform.platformType)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors truncate">
                              {platform.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(platform.platformType)}`}>
                              {platform.platformType}
                            </span>
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
                      {platform.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{platform.description}</p>
                      )}
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Versions</span>
                          <span className="text-gray-900 font-medium">{platform.versionCount || 0}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Created</span>
                          <span className="text-gray-900">{formatDate(platform.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Updated</span>
                          <span className="text-gray-900">{formatRelativeTime(platform.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => navigate(`/companies/${companyId}/projects/${projectId}/platforms/${platform.id}/versions`)}
                          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Versions
                        </button>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setPlatformToDelete(platform);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div
                    key={platform.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                            {getPlatformIcon(platform.platformType)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{platform.name}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(platform.platformType)}`}>
                                {platform.platformType}
                              </span>
                              {platform.description && (
                                <span className="text-sm text-gray-500 truncate">
                                  {platform.description}
                                </span>
                              )}
                              <span className="text-sm text-gray-500 whitespace-nowrap">
                                Updated {formatRelativeTime(platform.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <button
                            onClick={() => navigate(`/companies/${companyId}/projects/${projectId}/platforms/${platform.id}/versions`)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Versions
                          </button>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setPlatformToDelete(platform);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}

        {/* Create Platform Modal */}
        {showCreateModal && (
          <CreatePlatformModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
            companyId={Number(companyId)}
            projectId={Number(projectId)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && platformToDelete && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setPlatformToDelete(null);
            }}
            onConfirm={handleDeletePlatform}
            title="Delete Platform"
            message={`Are you sure you want to delete the platform "${platformToDelete.name}"? This action cannot be undone and will also delete all versions in this platform.`}
            confirmText={`Type "${platformToDelete.name}" to confirm`}
            itemName={platformToDelete.name}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlatformsPage;
