import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCompany, useProject, usePlatform } from '../contexts';

export const VersionsRedirectPage: React.FC = () => {
  const { selectedCompany } = useCompany();
  const { selectedProject } = useProject();
  const { selectedPlatform } = usePlatform();

  if (!selectedCompany) {
    return <Navigate to="/companies" replace />;
  }

  if (!selectedProject) {
    return <Navigate to="/projects" replace />;
  }

  if (!selectedPlatform) {
    return <Navigate to={`/projects/${selectedProject.id}/platforms`} replace />;
  }

  return <Navigate to={`/projects/${selectedProject.id}/platforms/${selectedPlatform.id}/versions`} replace />;
};
