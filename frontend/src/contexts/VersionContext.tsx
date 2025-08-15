import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
