import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCompany } from '../contexts';

export const ProjectsRedirectPage: React.FC = () => {
  const { selectedCompany } = useCompany();

  if (!selectedCompany) {
    return <Navigate to="/companies" replace />;
  }

  return <Navigate to={`/companies/${selectedCompany.id}/projects`} replace />;
};
