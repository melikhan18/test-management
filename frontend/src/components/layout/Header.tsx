import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBell, 
  FiSettings, 
  FiUser, 
  FiLogOut,
  FiChevronDown,
  FiMaximize2,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { useAuth } from '../../contexts';
import CompanySelector from '../common/CompanySelector';
import type { Company } from '../common/CompanySelector';

interface HeaderProps {
  // Header component props if needed in future
}

/**
 * Enterprise Header Component
 * Contains notifications and user menu
 */
export default function Header(_props: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Refs for dropdown containers
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Mock companies data - in real app, fetch from API
  const mockCompanies: Company[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      industry: 'Technology',
      location: 'San Francisco, CA',
      memberCount: 156,
      isActive: true,
      isFavorite: true,
      role: 'Owner'
    },
    {
      id: '2',
      name: 'TechStart Inc.',
      industry: 'Software Development',
      location: 'New York, NY',
      memberCount: 89,
      isActive: true,
      isFavorite: false,
      role: 'Admin'
    },
    {
      id: '3',
      name: 'Global Solutions Ltd.',
      industry: 'Consulting',
      location: 'London, UK',
      memberCount: 234,
      isActive: false,
      isFavorite: true,
      role: 'Member'
    },
    {
      id: '4',
      name: 'Innovation Labs',
      industry: 'Research & Development',
      location: 'Tokyo, Japan',
      memberCount: 67,
      isActive: true,
      isFavorite: false,
      role: 'Viewer'
    }
  ];

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company>(mockCompanies[0]); // Default to first company

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns when pressing Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (!userMenuOpen) {
      setNotificationsOpen(false); // Close notifications when opening user menu
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      setUserMenuOpen(false); // Close user menu when opening notifications
    }
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    console.log('Selected company:', company.name);
  };

  const handleAddCompany = () => {
    console.log('Add new company clicked');
    // Navigate to add company page or open modal
  };

  const mockNotifications = [
    { id: 1, title: 'New project assigned', message: 'You have been assigned to Project Alpha', time: '2 min ago', unread: true },
    { id: 2, title: 'Meeting reminder', message: 'Team standup in 15 minutes', time: '10 min ago', unread: true },
    { id: 3, title: 'Task completed', message: 'Database migration completed successfully', time: '1 hour ago', unread: false },
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Company Selector */}
        <div className="flex items-center">
          <CompanySelector
            companies={mockCompanies}
            selectedCompany={selectedCompany}
            onCompanySelect={handleCompanySelect}
            onAddCompany={handleAddCompany}
            className="max-w-xs"
          />
        </div>

        {/* Right side - Actions and User Menu */}
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="group relative rounded-lg p-2.5 text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 active:bg-gray-100"
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {darkMode ? 'Light mode' : 'Dark mode'}
            </div>
          </button>

          {/* Fullscreen Toggle */}
          <button className="group relative rounded-lg p-2.5 text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 active:bg-gray-100">
            <FiMaximize2 className="h-5 w-5" />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Fullscreen
            </div>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className="group relative rounded-lg p-2.5 text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 active:bg-gray-100"
            >
              <FiBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </div>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread notifications</p>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-2 ${
                        notification.unread ? 'border-blue-500 bg-blue-50/30' : 'border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-3 rounded-xl px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1 active:bg-gray-100"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-white">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username} {user?.surname}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <FiChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.username} {user?.surname}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <div className="py-1">
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <FiUser className="mr-3 h-4 w-4 text-gray-400" />
                    Profile Settings
                  </button>
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <FiSettings className="mr-3 h-4 w-4 text-gray-400" />
                    Account Settings
                  </button>
                </div>
                
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
