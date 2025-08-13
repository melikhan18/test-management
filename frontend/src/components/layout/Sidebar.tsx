import { useState } from 'react';
import { NavSection, navigationSections, filterNavigationByPermissions } from '../navigation';
import type { NavItemData } from '../navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Enterprise Sidebar Component
 * Responsive navigation with sections
 */
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard', 'projects', 'tasks']);

  // Mock user permissions - in real app, get from auth context
  const userPermissions = ['admin', 'read', 'write', 'test_execution'];
  
  // Filter navigation based on user permissions
  const filteredNavigation = filterNavigationByPermissions(navigationSections, userPermissions);

  const handleToggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: NavItemData) => {
    // Handle analytics, logging, etc.
    console.log('Navigation item clicked:', item.name);
    
    // Close mobile sidebar on navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden w-72 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo and Brand */}
        <div className="flex h-16 items-center justify-center px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-base font-bold text-white tracking-tight">TM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">Test Manager</span>
              <span className="text-xs text-gray-500 leading-tight">Enterprise Edition</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          <div className="space-y-6">
            {filteredNavigation.map((section) => (
              <NavSection
                key={section.id}
                section={section}
                isCollapsed={false}
                expandedItems={expandedItems}
                onToggleExpand={handleToggleExpand}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <div className="text-xs text-gray-500 text-center space-y-1 overflow-hidden">
            <p className="font-medium truncate">© 2025 Test Manager</p>
            <p className="text-gray-400 truncate">Enterprise Edition v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
