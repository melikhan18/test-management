export interface Version {
  id: number;
  versionName: string;
  projectId: number;
  projectName: string;
  companyId: number;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVersionRequest {
  versionName: string;
}

export interface VersionContextType {
  selectedVersion: Version | null;
  setSelectedVersion: (version: Version | null) => void;
  versions: Version[];
  setVersions: (versions: Version[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
