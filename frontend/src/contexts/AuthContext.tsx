import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/api';

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods to children
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state
   */
  const initializeAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (authService.isAuthenticated()) {
        // Get stored user data first (for immediate UI update)
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
        
        // Fetch fresh user data from server
        try {
          const freshUserData = await authService.getCurrentUser();
          setUser(freshUserData);
          authService.updateStoredUser(freshUserData);
        } catch (error) {
          console.warn('Failed to fetch fresh user data:', error);
          // If stored user exists, keep using it
          if (!storedUser) {
            authService.logout();
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register user
   */
  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = (): void => {
    setUser(null);
    authService.logout();
  };

  /**
   * Refresh user data from server
   */
  const refreshUser = async (): Promise<void> => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        authService.updateStoredUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logout();
    }
  };

  /**
   * Update user data in state and storage
   */
  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
    authService.updateStoredUser(updatedUser);
  };

  // Context value
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
