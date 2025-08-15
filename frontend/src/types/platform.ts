export const PlatformType = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
  WEB: 'WEB',
  SERVICE: 'SERVICE'
} as const;

export type PlatformType = typeof PlatformType[keyof typeof PlatformType];

export interface Platform {
  id: number;
  name: string;
  description: string;
  platformType: PlatformType;
  projectId: number;
  projectName: string;
  versionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlatformRequest {
  name: string;
  description: string;
  platformType: PlatformType;
}

export interface UpdatePlatformRequest {
  name: string;
  description: string;
  platformType: PlatformType;
}

export interface PlatformContextType {
  selectedPlatform: Platform | null;
  setSelectedPlatform: (platform: Platform | null) => void;
  selectPlatform: (platform: Platform | null) => void; // Alias for consistency
  platforms: Platform[];
  setPlatforms: (platforms: Platform[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
