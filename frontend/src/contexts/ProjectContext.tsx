import { createContext, useContext, useState, useEffect } from 'react';
import { projectService } from '../services';
import { formatErrorMessage } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';
import type { Project } from '../types';

// Project context type
interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  selectProject: (project: Project) => void;
  refreshProjects: () => Promise<void>;
  clearSelectedProject: () => void;
}

// Create context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Helper function to get saved project from localStorage
const getSavedProject = (): Project | null => {
  try {
    const saved = localStorage.getItem('selectedProject');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Helper function to save project to localStorage
const saveProject = (project: Project | null): void => {
  if (project) {
    localStorage.setItem('selectedProject', JSON.stringify(project));
  } else {
    localStorage.removeItem('selectedProject');
  }
};

// Project provider component
export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(getSavedProject());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { selectedCompany } = useCompany();

  // Load projects from API
  const loadProjects = async (): Promise<void> => {
    console.log('loadProjects called - selectedCompany:', selectedCompany, 'isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated || !user || !selectedCompany) {
      console.log('No auth/company, skipping project loading');
      // Sadece explicit olarak company değiştiğinde temizle, auth loading sırasında değil
      if (!selectedCompany && isAuthenticated && user) {
        setProjects([]);
        setSelectedProject(null);
        saveProject(null);
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedProjects = await projectService.getCompanyProjects(selectedCompany.id);
      setProjects(fetchedProjects);

      // Check if saved project still exists in the new list and belongs to current company
      const savedProject = getSavedProject();
      console.log('Saved project:', savedProject);
      console.log('Fetched projects:', fetchedProjects);
      
      if (savedProject && savedProject.companyId === selectedCompany.id) {
        const stillExists = fetchedProjects.find((p: Project) => p.id === savedProject.id);
        console.log('Saved project still exists:', stillExists);
        
        if (stillExists) {
          setSelectedProject(stillExists);
          saveProject(stillExists);
        } else {
          // Saved project doesn't exist anymore, clear selection
          console.log('Saved project not found, clearing selection');
          setSelectedProject(null);
          saveProject(null);
        }
      } else if (savedProject && savedProject.companyId !== selectedCompany.id) {
        // Different company, clear selection
        console.log('Different company, clearing selection');
        setSelectedProject(null);
        saveProject(null);
      }
      // Eğer saved project yoksa ve aynı company'deyse, seçimi koruyalım
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      setError(errorMessage);
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a project
  const selectProject = (project: Project): void => {
    setSelectedProject(project);
    saveProject(project);
  };

  // Clear selected project
  const clearSelectedProject = (): void => {
    setSelectedProject(null);
    saveProject(null);
  };

  // Refresh projects list
  const refreshProjects = async (): Promise<void> => {
    await loadProjects();
  };

  // Load projects when company changes
  useEffect(() => {
    if (selectedCompany && isAuthenticated && user) {
      loadProjects();
    }
    // Sadece company değiştiğinde temizle, auth loading sırasında değil
  }, [selectedCompany, isAuthenticated, user]);

  // Sadece explicit logout olduğunda temizle
  useEffect(() => {
    if (user === null && !authLoading) {
      console.log('User logged out, clearing projects');
      setProjects([]);
      setSelectedProject(null);
      saveProject(null);
      setError(null);
    }
  }, [user, authLoading]);

  const contextValue: ProjectContextType = {
    projects,
    selectedProject,
    isLoading,
    error,
    selectProject,
    refreshProjects,
    clearSelectedProject,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use project context
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
