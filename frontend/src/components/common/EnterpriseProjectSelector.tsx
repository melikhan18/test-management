import React from 'react';
import { FolderOpen } from 'lucide-react';
import { EnterpriseSelector, type SelectorOption } from './EnterpriseSelector';
import { useProject } from '../../contexts';
import type { Project } from '../../types';

export const EnterpriseProjectSelector: React.FC = () => {
  const { projects, selectedProject, selectProject, isLoading, error } = useProject();

  // Convert projects to selector options
  const options: SelectorOption[] = projects.map((project: Project) => ({
    id: project.id,
    name: project.name,
    description: project.description || `Created ${formatDate(project.createdAt)}`,
    icon: <FolderOpen className="w-3.5 h-3.5" />,
    metadata: {
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      companyId: project.companyId
    }
  }));

  // Convert selected project to selector option
  const selectedOption: SelectorOption | null = selectedProject ? {
    id: selectedProject.id,
    name: selectedProject.name,
    description: selectedProject.description || `Created ${formatDate(selectedProject.createdAt)}`,
    icon: <FolderOpen className="w-3.5 h-3.5" />,
    metadata: {
      description: selectedProject.description,
      createdAt: selectedProject.createdAt,
      updatedAt: selectedProject.updatedAt,
      companyId: selectedProject.companyId
    }
  } : null;

  const handleSelect = (option: SelectorOption) => {
    const project = projects.find(p => p.id === option.id);
    if (project) {
      selectProject(project);
    }
  };

  return (
    <EnterpriseSelector
      type="project"
      selected={selectedOption}
      options={options}
      onSelect={handleSelect}
      loading={isLoading}
      error={error}
      placeholder="Select project"
      searchable={true}
      size="md"
    />
  );
};

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
