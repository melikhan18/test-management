import React from 'react';
import { Smartphone, Server, Globe } from 'lucide-react';
import { EnterpriseSelector, type SelectorOption } from './EnterpriseSelector';
import { usePlatform } from '../../contexts';
import type { Platform, PlatformType } from '../../types';

const platformTypeConfig: Record<PlatformType, { icon: React.ComponentType<any>; label: string; color: string }> = {
  ANDROID: { icon: Smartphone, label: 'Android', color: 'green' },
  IOS: { icon: Smartphone, label: 'iOS', color: 'gray' },
  WEB: { icon: Globe, label: 'Web', color: 'blue' },
  SERVICE: { icon: Server, label: 'Service', color: 'purple' }
};

export const EnterprisePlatformSelector: React.FC = () => {
  const { platforms, selectedPlatform, setSelectedPlatform, isLoading } = usePlatform();

  // Convert platforms to selector options
  const options: SelectorOption[] = platforms.map((platform: Platform) => {
    const config = platformTypeConfig[platform.platformType];
    const IconComponent = config.icon;
    
    return {
      id: platform.id,
      name: platform.name,
      description: platform.description || `${config.label} platform`,
      icon: <IconComponent className="w-3.5 h-3.5" />,
      badge: {
        text: config.label,
        variant: 'info'
      },
      metadata: {
        platformType: platform.platformType,
        description: platform.description,
        createdAt: platform.createdAt,
        updatedAt: platform.updatedAt,
        projectId: platform.projectId
      }
    };
  });

  // Convert selected platform to selector option
  const selectedOption: SelectorOption | null = selectedPlatform ? (() => {
    const config = platformTypeConfig[selectedPlatform.platformType];
    const IconComponent = config.icon;
    
    return {
      id: selectedPlatform.id,
      name: selectedPlatform.name,
      description: selectedPlatform.description || `${config.label} platform`,
      icon: <IconComponent className="w-3.5 h-3.5" />,
      badge: {
        text: config.label,
        variant: 'info'
      },
      metadata: {
        platformType: selectedPlatform.platformType,
        description: selectedPlatform.description,
        createdAt: selectedPlatform.createdAt,
        updatedAt: selectedPlatform.updatedAt,
        projectId: selectedPlatform.projectId
      }
    };
  })() : null;

  const handleSelect = (option: SelectorOption) => {
    const platform = platforms.find(p => p.id === option.id);
    if (platform) {
      setSelectedPlatform(platform);
    }
  };

  return (
    <EnterpriseSelector
      type="platform"
      selected={selectedOption}
      options={options}
      onSelect={handleSelect}
      loading={isLoading}
      error={null}
      placeholder="Select platform"
      searchable={true}
      size="md"
    />
  );
};
