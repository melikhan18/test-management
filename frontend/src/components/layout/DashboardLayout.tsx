import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Home, 
  Building2, 
  Users, 
  FolderOpen, 
  Settings, 
  Menu, 
  X,
  User,
  ChevronDown,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  UserPlus,
  Briefcase,
  Calendar,
  MessageSquare,
  Bug,
  Target,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { CompanySelector, ProjectSelector, NotificationDropdown } from '../common';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavigationItem[];
  type?: 'item' | 'section';
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    type: 'item'
  },
  {
    name: 'Projects',
    icon: FolderOpen,
    type: 'section',
    children: [
      { name: 'All Projects', href: '/projects', icon: Briefcase },
      { name: 'My Projects', href: '/projects/my', icon: User },
      { name: 'Recent', href: '/projects/recent', icon: Calendar },
      { name: 'Archived', href: '/projects/archived', icon: FileText },
    ]
  },
  {
    name: 'Issues',
    icon: Bug,
    type: 'section',
    children: [
      { name: 'All Issues', href: '/issues', icon: Bug },
      { name: 'My Issues', href: '/issues/my', icon: Target },
      { name: 'Reported by me', href: '/issues/reported', icon: MessageSquare },
      { name: 'Recently updated', href: '/issues/recent', icon: Calendar },
    ]
  },
  {
    name: 'Reports',
    icon: BarChart3,
    type: 'section',
    children: [
      { name: 'Analytics', href: '/reports/analytics', icon: BarChart3 },
      { name: 'Test Coverage', href: '/reports/coverage', icon: Target },
      { name: 'Performance', href: '/reports/performance', icon: FileText },
    ]
  },
  {
    name: 'Team',
    icon: Users,
    type: 'section',
    children: [
      { name: 'Members', href: '/team/members', icon: Users },
      { name: 'Invite Users', href: '/team/invite', icon: UserPlus },
      { name: 'Roles & Permissions', href: '/team/permissions', icon: Shield },
    ]
  },
  { 
    name: 'Companies', 
    href: '/companies', 
    icon: Building2,
    type: 'item'
  },
];

const secondaryNavigation: NavigationItem[] = [
  { name: 'Settings', href: '/settings', icon: Settings, type: 'item' },
  { name: 'Help & Support', href: '/support', icon: HelpCircle, type: 'item' },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<{
    items: NavigationItem[];
    title: string;
    position: { x: number; y: number };
  } | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Projects: true,
    Issues: false,
    Reports: false,
    Team: false,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href;
  };

  const isChildActive = (children?: NavigationItem[]) => {
    if (!children) return false;
    return children.some(child => child.href && location.pathname === child.href);
  };

  const toggleSection = (sectionName: string) => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const handleSubmenuHover = (event: React.MouseEvent, item: NavigationItem) => {
    if (!sidebarCollapsed || !item.children) return;
    
    // Clear existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredSubmenu({
      items: item.children,
      title: item.name,
      position: {
        x: rect.right + 8,
        y: rect.top
      }
    });
  };

  const handleSubmenuLeave = () => {
    // Add a small delay before hiding
    const timeout = window.setTimeout(() => {
      setHoveredSubmenu(null);
    }, 100);
    setHoverTimeout(timeout);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setHoveredSubmenu(null); // Close any open submenus
    if (!sidebarCollapsed) {
      // Close all sections when collapsing
      setExpandedSections({});
    } else {
      // Open default sections when expanding
      setExpandedSections({
        Projects: true,
        Issues: false,
        Reports: false,
        Team: false,
      });
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none transition-all duration-200 hover:bg-white hover:bg-opacity-20"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-72'
      }`}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className={`flex flex-col flex-1 min-h-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'
      }`}>
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none transition-all duration-200 hover:text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Header content */}
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Company Selector */}
              <CompanySelector />
              {/* Project Selector */}
              <ProjectSelector />
            </div>
            
            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationDropdown />

              {/* Profile dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 focus:outline-none transition-all duration-200 hover-lift"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {/* User Avatar */}
                  <div className="relative">
                    <div className="user-avatar h-9 w-9 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    {/* Online Status Indicator */}
                    <div className="status-indicator absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  
                  {/* User Info */}
                  <div className="hidden md:block text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {user?.username} {user?.surname}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`} />
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user?.role?.toLowerCase()}
                    </div>
                  </div>
                  
                  {/* Mobile ChevronDown */}
                  <ChevronDown className={`md:hidden h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="dropdown-shadow absolute right-0 mt-2 w-64 bg-white rounded-xl ring-1 ring-black ring-opacity-5 py-2 z-50 transform opacity-100 scale-100 transition-all duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="user-avatar h-10 w-10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.username} {user?.surname}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          <p className="text-xs text-blue-600 capitalize font-medium">{user?.role?.toLowerCase()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3 text-gray-500" />
                        Your Profile
                      </Link>
                      
                      <Link 
                        to="/account" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                        Account Settings
                      </Link>
                      
                      <Link 
                        to="/preferences" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-500" />
                        Preferences
                      </Link>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <Link 
                        to="/help" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <HelpCircle className="h-4 w-4 mr-3 text-gray-500" />
                        Help & Support
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Global Submenu Popover */}
      {hoveredSubmenu && (
        <div
          className="fixed bg-white rounded-xl shadow-xl ring-1 ring-gray-200 py-3 z-[9999] min-w-56 max-w-72 backdrop-blur-sm border border-gray-100"
          style={{
            left: `${hoveredSubmenu.position.x}px`,
            top: `${hoveredSubmenu.position.y}px`,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.05)'
          }}
          onMouseEnter={() => {
            if (hoverTimeout) {
              clearTimeout(hoverTimeout);
              setHoverTimeout(null);
            }
          }}
          onMouseLeave={handleSubmenuLeave}
        >
          {/* Submenu Header */}
          <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                {hoveredSubmenu.items[0] && (
                  React.createElement(navigation.find(nav => nav.name === hoveredSubmenu.title)?.icon || FolderOpen, {
                    className: "w-4 h-4 text-white"
                  })
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 tracking-tight">{hoveredSubmenu.title}</span>
                <div className="text-xs text-gray-500 mt-0.5">{hoveredSubmenu.items.length} items</div>
              </div>
            </div>
          </div>
          
          {/* Submenu Items */}
          <div className="py-2 px-2">
            {hoveredSubmenu.items.map((child, index) => (
              <Link
                key={child.name}
                to={child.href!}
                className={`${
                  isActive(child.href)
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-3 border-blue-500 shadow-sm'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900'
                } group flex items-center px-4 py-3 text-sm transition-all duration-200 relative rounded-lg mx-1 ${
                  index === 0 ? 'mt-1' : ''
                } ${index === hoveredSubmenu.items.length - 1 ? 'mb-1' : ''}`}
                onClick={() => setHoveredSubmenu(null)}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
                  isActive(child.href) 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}>
                  <child.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{child.name}</div>
                  {isActive(child.href) && (
                    <div className="text-xs text-blue-600 mt-0.5 font-medium">Active</div>
                  )}
                </div>
                {isActive(child.href) && (
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                )}
              </Link>
            ))}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-b-xl">
            <div className="text-xs text-gray-500 text-center">
              Click any item to navigate
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function SidebarContent() {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-lg">
        {/* Logo */}
        <div className={`flex items-center h-16 flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-500 transition-all duration-300 ${
          sidebarCollapsed ? 'justify-center px-2' : 'px-4'
        }`}>
          <div className={`sidebar-element-transition ${
            sidebarCollapsed 
              ? 'sidebar-logo-collapsed' 
              : 'flex items-center'
          }`}>
            {!sidebarCollapsed ? (
              <>
                <div className="sidebar-logo-icon w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-white logo-text-fade">
                  <div className="text-lg font-bold">TestManager</div>
                  <div className="text-xs text-blue-100">Enterprise</div>
                </div>
              </>
            ) : (
              <div 
                className="sidebar-logo-icon w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                title="TestManager Enterprise"
                onClick={toggleSidebarCollapse}
              >
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        </div>
        
        {/* Main Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <nav className={`space-y-1 transition-all duration-300 ${
            sidebarCollapsed ? 'px-1 py-4' : 'px-2 py-4'
          }`}>
            {navigation.map((item) => {
              if (item.type === 'item') {
                return (
                    <Link
                      key={item.name}
                      to={item.href!}
                      className={`nav-link group flex items-center transition-all duration-300 relative ${
                        sidebarCollapsed 
                          ? 'justify-center px-0 py-3 rounded-xl w-12 h-12 mx-auto' 
                          : 'px-4 py-3 rounded-xl mx-2'
                      } ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 font-semibold shadow-lg ring-2 ring-blue-200'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 hover:shadow-sm'
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      {isActive(item.href) && !sidebarCollapsed && (
                        <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 shadow-md"></span>
                      )}
                      <div className={`rounded-lg flex items-center justify-center transition-all duration-200 ${
                        sidebarCollapsed 
                          ? 'w-8 h-8' 
                          : 'w-8 h-8 mr-3'
                      } ${
                        isActive(item.href) 
                          ? 'bg-gradient-to-br from-blue-200 to-indigo-200 text-blue-700 shadow-md' 
                          : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      {!sidebarCollapsed && (
                        <>
                          <div className="flex-1">
                            <div className={`font-medium tracking-tight ${isActive(item.href) ? 'text-blue-700' : ''}`}>{item.name}</div>
                            {isActive(item.href) && (
                              <div className="text-xs text-blue-600 mt-0.5 font-semibold">Aktif</div>
                            )}
                          </div>
                          {item.badge && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${isActive(item.href) ? 'bg-gradient-to-r from-blue-200 to-indigo-200 text-blue-800' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800'}`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                );
              }

              // Section with children
              const isExpanded = expandedSections[item.name] || false;
              const hasActiveChild = isChildActive(item.children);

              return (
                <div key={item.name} className="relative">
                  <button
                    onClick={() => toggleSection(item.name)}
                    onMouseEnter={(e) => handleSubmenuHover(e, item)}
                    onMouseLeave={handleSubmenuLeave}
                    className={`nav-link ${
                      hasActiveChild
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 hover:shadow-sm'
                    } group flex items-center w-full transition-all duration-300 focus:outline-none ${
                      sidebarCollapsed 
                        ? 'justify-center px-0 py-3 rounded-xl h-12 collapsed-item mx-auto' 
                        : 'px-4 py-3 rounded-xl mx-2'
                    }`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <div className={`rounded-lg flex items-center justify-center transition-all duration-200 ${
                      sidebarCollapsed 
                        ? 'w-8 h-8' 
                        : 'w-8 h-8 mr-3'
                    } ${
                      hasActiveChild 
                        ? 'bg-blue-100 text-blue-600 shadow-sm' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1 text-left">
                          <div className="font-medium tracking-tight">{item.name}</div>
                          {hasActiveChild && (
                            <div className="text-xs text-blue-600 mt-0.5 font-medium">Has active items</div>
                          )}
                        </div>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
                          hasActiveChild ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                          <ChevronDown
                            className={`h-3 w-3 transition-all duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            } ${hasActiveChild ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`}
                          />
                        </div>
                      </>
                    )}
                  </button>

                  {/* Submenu for expanded sidebar */}
                  {!sidebarCollapsed && isExpanded && item.children && (
                    <div className="mt-2 space-y-1 ml-6 pl-4 border-l border-gray-200">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href!}
                          className={`nav-link ${
                            isActive(child.href)
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-2 border-blue-500 shadow-sm'
                              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 hover:border-l-2 hover:border-blue-300'
                          } group flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200 focus:outline-none ml-2 mr-4`}
                        >
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-3 transition-all duration-200 ${
                            isActive(child.href) 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                          }`}>
                            <child.icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{child.name}</div>
                            {isActive(child.href) && (
                              <div className="text-xs text-blue-600 mt-0.5 font-medium">Active</div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200">
          {/* Secondary Navigation */}
          <div className="px-2 py-3 space-y-1">
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href!}
                className={`nav-link ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-500 shadow-sm'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 hover:shadow-sm'
                } group flex items-center transition-all duration-300 focus:outline-none ${
                  sidebarCollapsed 
                    ? 'justify-center px-0 py-3 rounded-xl w-12 h-12 mx-auto' 
                    : 'px-4 py-3 rounded-xl mx-2'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <div className={`rounded-lg flex items-center justify-center transition-all duration-200 ${
                  sidebarCollapsed 
                    ? 'w-8 h-8' 
                    : 'w-8 h-8 mr-3'
                } ${
                  isActive(item.href) 
                    ? 'bg-blue-100 text-blue-600 shadow-sm' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}>
                  <item.icon className="h-4 w-4" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1">
                    <div className="font-medium tracking-tight">{item.name}</div>
                    {isActive(item.href) && (
                      <div className="text-xs text-blue-600 mt-0.5 font-medium">Current</div>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Collapse/Expand Button at bottom */}
          <div className="border-t border-gray-200 p-4 flex justify-center">
            <button
              onClick={toggleSidebarCollapse}
              className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
};
