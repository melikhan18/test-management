import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Platform, PlatformContextType } from '../types';
import { platformService } from '../services';
import { useProject } from './ProjectContext';
import { useCompany } from './CompanyContext';

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedCompany } = useCompany();
  const { selectedProject } = useProject();

  // Load platforms when company or project changes
  useEffect(() => {
    if (selectedCompany && selectedProject) {
      loadPlatforms();
    } else {
      setPlatforms([]);
      setSelectedPlatform(null);
    }
  }, [selectedCompany, selectedProject]);

  // Auto-select first platform when platforms change
  useEffect(() => {
    if (Array.isArray(platforms) && platforms.length > 0 && !selectedPlatform) {
      setSelectedPlatform(platforms[0]);
    } else if (!Array.isArray(platforms) || platforms.length === 0) {
      setSelectedPlatform(null);
    } else if (selectedPlatform && Array.isArray(platforms) && !platforms.find(p => p.id === selectedPlatform.id)) {
      // Selected platform no longer exists, select first available
      setSelectedPlatform(platforms.length > 0 ? platforms[0] : null);
    }
  }, [platforms, selectedPlatform]);

  const loadPlatforms = async () => {
    if (!selectedCompany || !selectedProject) return;

    setIsLoading(true);
    try {
      const data = await platformService.getPlatforms(selectedCompany.id, selectedProject.id);
      setPlatforms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading platforms:', error);
      setPlatforms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetSelectedPlatform = (platform: Platform | null) => {
    setSelectedPlatform(platform);
  };

  const handleSetPlatforms = (newPlatforms: Platform[]) => {
    setPlatforms(newPlatforms);
  };

  const value: PlatformContextType = {
    selectedPlatform,
    setSelectedPlatform: handleSetSelectedPlatform,
    selectPlatform: handleSetSelectedPlatform, // Alias for consistency with other contexts
    platforms,
    setPlatforms: handleSetPlatforms,
    isLoading,
    setIsLoading,
    loadPlatforms
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
