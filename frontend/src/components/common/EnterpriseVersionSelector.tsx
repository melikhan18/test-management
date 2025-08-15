import React from 'react';
import { Package } from 'lucide-react';
import { EnterpriseSelector, type SelectorOption } from './EnterpriseSelector';
import { useVersion } from '../../contexts';
import type { Version } from '../../types';

export const EnterpriseVersionSelector: React.FC = () => {
  const { versions, selectedVersion, setSelectedVersion, isLoading } = useVersion();

  // Convert versions to selector options
  const options: SelectorOption[] = versions.map((version: Version) => ({
    id: version.id,
    name: version.versionName,
    description: `${version.platformName} • ${formatDate(version.createdAt)}`,
    icon: <Package className="w-3.5 h-3.5" />,
    metadata: {
      platformId: version.platformId,
      platformName: version.platformName,
      projectId: version.projectId,
      projectName: version.projectName,
      createdAt: version.createdAt,
      updatedAt: version.updatedAt
    }
  }));

  // Convert selected version to selector option
  const selectedOption: SelectorOption | null = selectedVersion ? {
    id: selectedVersion.id,
    name: selectedVersion.versionName,
    description: `${selectedVersion.platformName} • ${formatDate(selectedVersion.createdAt)}`,
    icon: <Package className="w-3.5 h-3.5" />,
    metadata: {
      platformId: selectedVersion.platformId,
      platformName: selectedVersion.platformName,
      projectId: selectedVersion.projectId,
      projectName: selectedVersion.projectName,
      createdAt: selectedVersion.createdAt,
      updatedAt: selectedVersion.updatedAt
    }
  } : null;

  const handleSelect = (option: SelectorOption) => {
    const version = versions.find(v => v.id === option.id);
    if (version) {
      setSelectedVersion(version);
    }
  };

  return (
    <EnterpriseSelector
      type="version"
      selected={selectedOption}
      options={options}
      onSelect={handleSelect}
      loading={isLoading}
      error={null}
      placeholder="Select version"
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
    return `${diffDays}d ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}w ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}mo ago`;
  } else {
    return date.toLocaleDateString();
  }
}
