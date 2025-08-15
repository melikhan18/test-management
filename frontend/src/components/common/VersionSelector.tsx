import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Tag } from 'lucide-react';
import { useVersion, useProject, useCompany } from '../../contexts';
import { versionService } from '../../services';
import { formatErrorMessage } from '../../utils/helpers';
import type { Version } from '../../types';

const VersionSelector: React.FC = () => {
  const { selectedVersion, setSelectedVersion, versions, setVersions, isLoading, setIsLoading } = useVersion();
  const { selectedProject } = useProject();
  const { selectedCompany } = useCompany();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Load versions when project changes
  useEffect(() => {
    if (selectedCompany && selectedProject) {
      loadVersions();
    } else {
      setVersions([]);
      setSelectedVersion(null);
    }
  }, [selectedCompany, selectedProject]);

  // Check if selected version still exists in the current versions list
  useEffect(() => {
    if (selectedVersion && versions.length > 0) {
      const versionExists = versions.some(v => v.id === selectedVersion.id);
      if (!versionExists) {
        setSelectedVersion(null);
      }
    }
  }, [versions, selectedVersion, setSelectedVersion]);

  const loadVersions = async () => {
    if (!selectedCompany || !selectedProject) return;

    try {
      setIsLoading(true);
      setError(null);
      const versionData = await versionService.getVersions(selectedCompany.id, selectedProject.id);
      setVersions(versionData);

      // If there's a selected version but it's not in the current project, clear it
      if (selectedVersion && selectedVersion.projectId !== selectedProject.id) {
        setSelectedVersion(null);
      }
    } catch (err) {
      setError(formatErrorMessage(err));
      setVersions([]);
      setSelectedVersion(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVersionSelect = (version: Version) => {
    setSelectedVersion(version);
    setIsOpen(false);
  };

  // Don't show if no project is selected
  if (!selectedProject) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2.5 px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-white/90 hover:border-gray-300/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-all duration-200 min-w-[200px] shadow-sm hover:shadow-md"
        disabled={!selectedProject}
      >
        {/* Version Icon */}
        <div className="relative">
          <div className="w-7 h-7 bg-gradient-to-br from-orange-500/90 to-orange-600/90 rounded-lg flex items-center justify-center shadow-sm">
            <Tag className="w-3.5 h-3.5 text-white" />
          </div>
          {/* Active indicator */}
          {selectedVersion && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></div>
          )}
        </div>
        
        {/* Version Info */}
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs text-gray-500 font-medium mb-0.5">Version</div>
          {selectedVersion ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-800 truncate">
                {selectedVersion.versionName}
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {!selectedProject ? 'Select project first' : 'No version selected'}
            </div>
          )}
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 ${isOpen ? 'rotate-180 text-gray-600' : 'group-hover:text-gray-600'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-[300px] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/60 z-50 overflow-hidden">
          {error ? (
            <div className="p-4 text-sm text-red-600 bg-red-50/50">
              {error}
            </div>
          ) : versions.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              <Tag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-medium">No versions found</p>
              <p className="text-xs text-gray-400 mt-1">Create your first version for this project</p>
            </div>
          ) : (
            <>
              {/* Version List */}
              <div className="max-h-64 overflow-y-auto scrollbar-thin">
                <div className="py-1">
                  {versions.map((version) => {
                    const isSelected = selectedVersion?.id === version.id;
                    
                    return (
                      <button
                        key={version.id}
                        onClick={() => handleVersionSelect(version)}
                        className={`group w-full px-4 py-3.5 text-left hover:bg-orange-50/50 focus:outline-none focus:bg-orange-50/60 transition-all duration-200 ${
                          isSelected ? 'bg-orange-50/70' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Version Icon */}
                          <div className="relative flex-shrink-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isSelected 
                                ? 'bg-gradient-to-br from-orange-500/90 to-orange-600/90 ring-2 ring-orange-200' 
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-orange-100/60 group-hover:to-orange-200/60'
                            }`}>
                              <Tag className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-orange-600'}`} />
                            </div>
                            {/* Active indicator for selected version */}
                            {isSelected && (
                              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                            )}
                          </div>
                          
                          {/* Version Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`text-sm font-medium truncate ${
                                isSelected ? 'text-orange-900' : 'text-gray-800 group-hover:text-orange-900'
                              }`}>
                                {version.versionName}
                              </h4>
                            </div>
                            <div className="text-xs text-gray-500">
                              Created {new Date(version.createdAt).toLocaleDateString()}
                              {isSelected && (
                                <span className="text-emerald-600 font-medium ml-2">
                                  • Active version
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Footer with Create Button */}
          <div className="bg-gray-50/60 backdrop-blur-sm border-t border-gray-100/60 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {selectedVersion ? `Active: ${selectedVersion.versionName}` : `${versions.length} version${versions.length !== 1 ? 's' : ''} available`}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Open create version modal or navigate
                }}
                className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-orange-600 bg-orange-50/60 border border-orange-200/60 rounded-md hover:bg-orange-100/60 hover:border-orange-300/60 focus:outline-none focus:ring-1 focus:ring-orange-500/40 transition-all duration-200"
              >
                <Plus className="w-3 h-3 mr-1" />
                New Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionSelector;
