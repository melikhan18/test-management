import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Settings, 
  Trash2, 
  Eye,
  ChevronDown,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ArrowLeft,
  Building2
} from 'lucide-react';
import { DashboardLayout } from '../components/layout';
import { ConfirmDeleteModal } from '../components/common';
import { projectService, companyService } from '../services';
import { formatErrorMessage } from '../utils/helpers';
import { useProject } from '../contexts';
import type { Project, CreateProjectRequest, Company } from '../types';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'createdAt' | 'updatedAt';
type SortOrder = 'asc' | 'desc';

export const ProjectsPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { selectedProject, clearSelectedProject, refreshProjects } = useProject();
  const [projects, setProjects] = useState<Project[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newProject, setNewProject] = useState<CreateProjectRequest>({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (companyId) {
      loadData();
    }
  }, [companyId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const companyIdNum = parseInt(companyId!);
      const [companyData, projectsData] = await Promise.all([
        companyService.getCompany(companyIdNum),
        projectService.getCompanyProjects(companyIdNum)
      ]);
      
      setCompany(companyData);
      setProjects(projectsData);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !companyId) return;

    try {
      setIsCreating(true);
      await projectService.createProject(parseInt(companyId), newProject);
      setShowCreateModal(false);
      setNewProject({ name: '', description: '' });
      await loadData();
      
      // Also refresh the project context to update header selector
      await refreshProjects();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProjectForDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!selectedProjectForDelete || !companyId) return;

    try {
      setIsDeleting(true);
      await projectService.deleteProject(parseInt(companyId), selectedProjectForDelete.id);
      
      // If the deleted project is currently selected, clear the selection
      if (selectedProject && selectedProject.id === selectedProjectForDelete.id) {
        clearSelectedProject();
      }
      
      setShowDeleteModal(false);
      setSelectedProjectForDelete(null);
      await loadData();
      
      // Also refresh the project context
      await refreshProjects();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAndSortedProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
            <p className="text-gray-500">Loading projects...</p>
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
              <Link
                to="/companies"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                  {company && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Building2 className="w-3 h-3 mr-1" />
                      {company.name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Manage projects in {company?.name || 'this company'}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4 flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
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
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
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
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-purple-600 shadow-sm' 
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
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Sort
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>

                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-2">
                        {[
                          { field: 'name' as SortField, label: 'Project Name' },
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

        {/* Projects Grid/List */}
        {filteredAndSortedProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try adjusting your search query.' : 'Get started by creating your first project.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredAndSortedProjects.map((project) => {
              if (viewMode === 'grid') {
                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                            <FolderOpen className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {project.description}
                              </p>
                            )}
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
                          <span className="text-gray-500">Created</span>
                          <span className="text-gray-900">{formatDate(project.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Updated</span>
                          <span className="text-gray-900">{formatRelativeTime(project.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/companies/${companyId}/projects/${project.id}/versions`}
                          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Versions
                        </Link>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project)}
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
                    key={project.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                            <FolderOpen className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              {project.description && (
                                <span className="text-sm text-gray-500 truncate">
                                  {project.description}
                                </span>
                              )}
                              <span className="text-sm text-gray-500 whitespace-nowrap">
                                Updated {formatRelativeTime(project.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <Link
                            to={`/companies/${companyId}/projects/${project.id}/versions`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Versions
                          </Link>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project)}
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

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new project in {company?.name}
                </p>
              </div>
              
              <form onSubmit={handleCreateProject} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      id="projectName"
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="Enter project name"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      id="projectDescription"
                      value={newProject.description || ''}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Enter project description"
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewProject({ name: '', description: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newProject.name.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedProjectForDelete && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedProjectForDelete(null);
            }}
            onConfirm={confirmDeleteProject}
            title="Delete Project"
            message={`Are you sure you want to delete the project "${selectedProjectForDelete.name}"? This action cannot be undone.`}
            confirmText={`Type "${selectedProjectForDelete.name}" to confirm`}
            itemName={selectedProjectForDelete.name}
            isLoading={isDeleting}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
