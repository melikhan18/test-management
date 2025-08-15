import { useState, useEffect, useRef } from 'react';
import { FolderOpen, ChevronDown } from 'lucide-react';
import { useProject } from '../../contexts';
import type { Project } from '../../types';

export const ProjectSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { projects, selectedProject, selectProject, isLoading } = useProject();

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

  const handleProjectSelect = (project: Project) => {
    selectProject(project);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg">
        <FolderOpen className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">No projects</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2.5 px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-white/90 hover:border-gray-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 min-w-[220px] shadow-sm hover:shadow-md"
      >
        {/* Project Icon */}
        <div className="relative">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500/90 to-purple-600/90 rounded-lg flex items-center justify-center shadow-sm">
            <FolderOpen className="w-3.5 h-3.5 text-white" />
          </div>
          {/* Active indicator */}
          {selectedProject && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></div>
          )}
        </div>
        
        {/* Project Info */}
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs text-gray-500 font-medium mb-0.5">Project</div>
          {selectedProject ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {selectedProject.name}
                </span>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">
              No projects
            </div>
          )}
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 ${isOpen ? 'rotate-180 text-gray-600' : 'group-hover:text-gray-600'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-[280px] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/60 z-50 overflow-hidden">
          {/* Projects List */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            <div className="py-1">
              {projects.map((project: Project) => {
                const isSelected = selectedProject?.id === project.id;
                
                return (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSelect(project)}
                    className={`group w-full px-4 py-3.5 text-left hover:bg-indigo-50/50 focus:outline-none focus:bg-indigo-50/60 transition-all duration-200 ${
                      isSelected ? 'bg-indigo-50/70' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Project Icon */}
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 rounded-lg flex items-center justify-center shadow-sm">
                          <FolderOpen className="w-4 h-4 text-white" />
                        </div>
                        {/* Active indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></div>
                      </div>
                      
                      {/* Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {project.name}
                          </p>
                        </div>
                        {project.description && (
                          <p className="text-xs text-gray-500 truncate">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100/80 bg-gray-50/30">
            <span className="text-xs text-gray-600">
              {projects.length} project{projects.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
