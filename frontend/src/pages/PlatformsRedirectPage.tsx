import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany, useProject } from '../contexts';

const PlatformsRedirectPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const { selectedProject } = useProject();

  useEffect(() => {
    if (!selectedCompany) {
      navigate('/companies');
    } else if (!selectedProject) {
      navigate('/projects');
    } else {
      navigate(`/projects/${selectedProject.id}/platforms`);
    }
  }, [selectedCompany, selectedProject, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to platforms...</p>
      </div>
    </div>
  );
};

export default PlatformsRedirectPage;
