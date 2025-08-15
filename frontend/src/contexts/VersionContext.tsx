import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProject } from './ProjectContext';
import type { Version, VersionContextType } from '../types';

const VersionContext = createContext<VersionContextType | undefined>(undefined);

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};

interface VersionProviderProps {
  children: React.ReactNode;
}

export const VersionProvider: React.FC<VersionProviderProps> = ({ children }) => {
  const [selectedVersion, setSelectedVersionState] = useState<Version | null>(null);
  const [versions, setVersionsState] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();

  // Load selected version from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedVersion');
    if (saved) {
      try {
        const version = JSON.parse(saved);
        setSelectedVersionState(version);
      } catch (error) {
        console.error('Failed to parse selected version from localStorage:', error);
        localStorage.removeItem('selectedVersion');
      }
    }
  }, []);

  // Save selected version to localStorage when it changes
  const setSelectedVersion = (version: Version | null) => {
    setSelectedVersionState(version);
    if (version) {
      localStorage.setItem('selectedVersion', JSON.stringify(version));
    } else {
      localStorage.removeItem('selectedVersion');
    }
  };

  // Updated setVersions with auto-selection logic
  const setVersions = (newVersions: Version[]) => {
    setVersionsState(newVersions);
    
    // Check if current selected version still exists in the new list and belongs to current project
    const savedVersion = localStorage.getItem('selectedVersion');
    let currentSelectedVersion = null;
    
    if (savedVersion && selectedProject) {
      try {
        const version = JSON.parse(savedVersion);
        if (version.projectId === selectedProject.id) {
          const stillExists = newVersions.find((v: Version) => v.id === version.id);
          if (stillExists) {
            currentSelectedVersion = stillExists;
            setSelectedVersionState(stillExists);
          } else {
            // Saved version doesn't exist anymore, clear selection
            setSelectedVersionState(null);
            localStorage.removeItem('selectedVersion');
          }
        } else {
          // Different project, clear selection
          setSelectedVersionState(null);
          localStorage.removeItem('selectedVersion');
        }
      } catch (error) {
        console.error('Failed to parse selected version:', error);
        localStorage.removeItem('selectedVersion');
      }
    }
    
    // If no version is selected and there are versions available, select the first one
    if (!currentSelectedVersion && newVersions.length > 0 && selectedProject) {
      const firstVersion = newVersions[0];
      console.log('No version selected, auto-selecting first version:', firstVersion);
      setSelectedVersionState(firstVersion);
      localStorage.setItem('selectedVersion', JSON.stringify(firstVersion));
    }
  };

  const value: VersionContextType = {
    selectedVersion,
    setSelectedVersion,
    versions,
    setVersions,
    isLoading,
    setIsLoading,
  };

  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
};
