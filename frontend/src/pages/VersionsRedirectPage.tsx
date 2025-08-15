import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCompany, useProject } from '../contexts';

export const VersionsRedirectPage: React.FC = () => {
  const { selectedCompany } = useCompany();
  const { selectedProject } = useProject();

  if (!selectedCompany) {
    return <Navigate to="/companies" replace />;
  }

  if (!selectedProject) {
    return <Navigate to={`/companies/${selectedCompany.id}/projects`} replace />;
  }

  return <Navigate to={`/companies/${selectedCompany.id}/projects/${selectedProject.id}/versions`} replace />;
};
