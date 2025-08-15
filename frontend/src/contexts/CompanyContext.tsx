import { createContext, useContext, useState, useEffect } from 'react';
import { companyService } from '../services';
import { formatErrorMessage } from '../utils/helpers';
import { useAuth } from './AuthContext';
import type { Company } from '../types';

// Company context type
interface CompanyContextType {
  companies: Company[];
  selectedCompany: Company | null;
  userRoles: Record<number, string>;
  isLoading: boolean;
  error: string | null;
  selectCompany: (company: Company) => void;
  refreshCompanies: () => Promise<void>;
  getUserRole: (companyId: number) => Promise<string>;
}

// Create context
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Helper function to get saved company from localStorage
const getSavedCompany = (): Company | null => {
  try {
    const saved = localStorage.getItem('selectedCompany');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Helper function to save company to localStorage
const saveCompany = (company: Company | null): void => {
  if (company) {
    localStorage.setItem('selectedCompany', JSON.stringify(company));
  } else {
    localStorage.removeItem('selectedCompany');
  }
};

// Company provider component
export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(getSavedCompany());
  const [userRoles, setUserRoles] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  // Load companies from API
  const loadCompanies = async (): Promise<void> => {
    if (!isAuthenticated || !user) {
      setCompanies([]);
      setSelectedCompany(null);
      saveCompany(null);
      setUserRoles({});
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedCompanies = await companyService.getUserCompanies();
      setCompanies(fetchedCompanies);

      // Check if saved company still exists in the new list
      const savedCompany = getSavedCompany();
      
      if (savedCompany) {
        const stillExists = fetchedCompanies.find(c => c.id === savedCompany.id);
        
        if (stillExists) {
          setSelectedCompany(stillExists);
          saveCompany(stillExists);
        } else {
          // Saved company doesn't exist anymore, select first available
          const firstCompany = fetchedCompanies[0] || null;
          setSelectedCompany(firstCompany);
          saveCompany(firstCompany);
        }
      } else {
        // No saved company, select first one
        const firstCompany = fetchedCompanies[0] || null;
        setSelectedCompany(firstCompany);
        saveCompany(firstCompany);
      }
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      setError(errorMessage);
      console.error('Failed to load companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a company
  const selectCompany = (company: Company): void => {
    setSelectedCompany(company);
    saveCompany(company);
  };

  // Refresh companies list
  const refreshCompanies = async (): Promise<void> => {
    await loadCompanies();
  };

  // Get user role in company
  const getUserRole = async (companyId: number): Promise<string> => {
    if (!isAuthenticated || !user) {
      return 'MEMBER';
    }

    // Check if role is already cached
    if (userRoles[companyId]) {
      return userRoles[companyId];
    }

    try {
      const role = await companyService.getUserRoleInCompany(companyId);
      setUserRoles(prev => ({ ...prev, [companyId]: role }));
      return role;
    } catch (error) {
      console.error('Failed to get user role:', error);
      return 'MEMBER';
    }
  };

  // Load companies when user authentication changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCompanies();
    }
    // Sadece explicitly logout olduğunda temizle
    // Page load sırasında auth henüz hazır olmayabilir
  }, [isAuthenticated, user]);

  // Sadece user null olduğunda (logout) temizle
  useEffect(() => {
    if (user === null && !authLoading) {
      // Sadece loading tamamlandıktan sonra temizle
      setCompanies([]);
      setSelectedCompany(null);
      saveCompany(null);
      setUserRoles({});
      setError(null);
    }
  }, [user, authLoading]);

  const contextValue: CompanyContextType = {
    companies,
    selectedCompany,
    userRoles,
    isLoading,
    error,
    selectCompany,
    refreshCompanies,
    getUserRole,
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use company context
export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
