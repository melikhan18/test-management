import { createContext, useContext, useReducer, useEffect } from 'react';
import { companyService } from '../services';
import { formatErrorMessage } from '../utils/helpers';
import type { Company } from '../types';

// Company state interface
interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  isLoading: boolean;
  error: string | null;
}

// Company actions
type CompanyAction =
  | { type: 'COMPANIES_LOADING' }
  | { type: 'COMPANIES_SUCCESS'; payload: Company[] }
  | { type: 'COMPANIES_ERROR'; payload: string }
  | { type: 'SELECT_COMPANY'; payload: Company }
  | { type: 'CLEAR_COMPANIES' };

// Company context type
interface CompanyContextType {
  companies: Company[];
  selectedCompany: Company | null;
  isLoading: boolean;
  error: string | null;
  loadCompanies: () => Promise<void>;
  selectCompany: (company: Company) => void;
  refreshCompanies: () => Promise<void>;
  clearCompanies: () => void;
}

// Initial state
const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,
};

// Company reducer
const companyReducer = (state: CompanyState, action: CompanyAction): CompanyState => {
  switch (action.type) {
    case 'COMPANIES_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'COMPANIES_SUCCESS':
      return {
        ...state,
        companies: action.payload,
        isLoading: false,
        error: null,
        // Auto-select first company if none selected
        selectedCompany: state.selectedCompany || action.payload[0] || null,
      };
    case 'COMPANIES_ERROR':
      return {
        ...state,
        companies: [],
        isLoading: false,
        error: action.payload,
      };
    case 'SELECT_COMPANY':
      return {
        ...state,
        selectedCompany: action.payload,
      };
    case 'CLEAR_COMPANIES':
      return initialState;
    default:
      return state;
  }
};

// Create context
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Company provider component
export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  // Load companies from API
  const loadCompanies = async (): Promise<void> => {
    try {
      dispatch({ type: 'COMPANIES_LOADING' });
      const companies = await companyService.getUserCompanies();
      dispatch({ type: 'COMPANIES_SUCCESS', payload: companies });
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      dispatch({ type: 'COMPANIES_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Select a company
  const selectCompany = (company: Company): void => {
    dispatch({ type: 'SELECT_COMPANY', payload: company });
    // Store selected company in localStorage for persistence
    localStorage.setItem('selectedCompany', JSON.stringify(company));
  };

  // Refresh companies list
  const refreshCompanies = async (): Promise<void> => {
    await loadCompanies();
  };

  // Clear companies (on logout)
  const clearCompanies = (): void => {
    localStorage.removeItem('selectedCompany');
    dispatch({ type: 'CLEAR_COMPANIES' });
  };

  // Initialize companies on mount
  useEffect(() => {
    const initializeCompanies = async () => {
      try {
        // Load companies from API
        await loadCompanies();
        
        // Try to restore previously selected company
        const savedCompany = localStorage.getItem('selectedCompany');
        if (savedCompany) {
          try {
            const parsedCompany = JSON.parse(savedCompany);
            dispatch({ type: 'SELECT_COMPANY', payload: parsedCompany });
          } catch (error) {
            console.warn('Failed to parse saved company:', error);
            localStorage.removeItem('selectedCompany');
          }
        }
      } catch (error) {
        console.error('Failed to initialize companies:', error);
      }
    };

    initializeCompanies();
  }, []);

  const contextValue: CompanyContextType = {
    companies: state.companies,
    selectedCompany: state.selectedCompany,
    isLoading: state.isLoading,
    error: state.error,
    loadCompanies,
    selectCompany,
    refreshCompanies,
    clearCompanies,
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
