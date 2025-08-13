import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronDown, FiLock } from 'react-icons/fi';

export interface NavItemData {
  id: string;
  name: string;
  href?: string;
  icon: React.ElementType;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItemData[];
  permissions?: string[];
  description?: string;
  comingSoon?: boolean;
}

interface NavItemProps {
  item: NavItemData;
  depth?: number;
  isCollapsed?: boolean;
  onItemClick?: (item: NavItemData) => void;
  expandedItems?: string[];
  onToggleExpand?: (itemId: string) => void;
}

/**
 * Enterprise Navigation Item Component
 * Supports nested structure, permissions, badges, and disabled states
 */
export default function NavItem({
  item,
  depth = 0,
  isCollapsed = false,
  onItemClick,
  expandedItems = [],
  onToggleExpand
}: NavItemProps) {
  const location = useLocation();
  const [localExpanded, setLocalExpanded] = useState(false);
  
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id) || localExpanded;
  const isCurrent = item.href ? (location.pathname === item.href || location.pathname.startsWith(item.href + '/')) : false;
  const isDisabled = item.disabled || item.comingSoon;

  const handleToggle = () => {
    if (isCollapsed || isDisabled) return;
    
    if (onToggleExpand) {
      onToggleExpand(item.id);
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const handleClick = () => {
    if (isDisabled) return;
    
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const baseClasses = `
    flex items-center rounded-xl text-sm font-medium transition-all duration-200 
    relative group min-w-0 w-full
    ${depth > 0 ? 'px-3 py-2 ml-0' : 'px-4 py-3'}
    ${isCollapsed ? 'justify-center' : ''}
    ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
  `;

  const getStateClasses = () => {
    if (isDisabled) {
      return 'text-gray-400 bg-gray-50';
    }
    
    if (isCurrent) {
      return 'bg-blue-50 text-blue-700 shadow-sm border-r-2 border-blue-500';
    }
    
    if (depth > 0) {
      return 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 text-sm';
    }
    
    return 'text-gray-700 hover:bg-gray-50 hover:text-gray-900';
  };

  const paddingLeft = isCollapsed ? '12px' : depth > 0 ? '16px' : '16px';

  const renderContent = () => (
    <>
      <div className="relative flex-shrink-0">
        <item.icon className={`${isCollapsed ? 'h-6 w-6' : depth > 0 ? 'h-4 w-4 mr-3' : 'h-5 w-5 mr-3'} flex-shrink-0`} />
        
        {/* Disabled/Coming Soon indicator */}
        {isDisabled && !isCollapsed && (
          <FiLock className="absolute -top-1 -right-1 h-3 w-3 text-gray-400" />
        )}
      </div>
      
      {!isCollapsed && (
        <div className="flex items-center justify-between min-w-0 flex-1">
          <span className={`truncate ${isDisabled ? 'line-through' : ''}`}>
            {item.name}
          </span>
          
          <div className="flex items-center space-x-2 ml-auto">
            {/* Coming Soon Badge */}
            {item.comingSoon && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full flex-shrink-0">
                Soon
              </span>
            )}
            
            {/* Regular Badge */}
            {item.badge && !item.comingSoon && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 flex-shrink-0">
                {item.badge}
              </span>
            )}
            
            {/* Expand/Collapse Arrow - Moved to the right */}
            {hasChildren && (
              <FiChevronDown
                className={`h-4 w-4 transition-transform flex-shrink-0 ${
                  isExpanded ? 'rotate-180' : ''
                } ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}
              />
            )}
          </div>
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="flex items-center">
            {item.name}
            {item.comingSoon && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500 rounded">Soon</span>
            )}
            {item.badge && !item.comingSoon && (
              <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs">
                {item.badge}
              </span>
            )}
            {isDisabled && <FiLock className="ml-2 h-3 w-3" />}
          </div>
          
          {item.description && (
            <div className="text-xs text-gray-300 mt-1 max-w-xs">
              {item.description}
            </div>
          )}
          
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </>
  );

  // Render as button for parent items or disabled items
  if (hasChildren || !item.href || isDisabled) {
    return (
      <div>
        <button
          onClick={hasChildren ? handleToggle : handleClick}
          className={`${baseClasses} w-full ${getStateClasses()}`}
          style={{ paddingLeft }}
          disabled={isDisabled}
          title={isDisabled ? (item.comingSoon ? 'Coming Soon' : 'Access Denied') : item.description}
        >
          {renderContent()}
        </button>

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1">
            <div className="ml-4 border-l-2 border-gray-100 pl-4 space-y-1">
              {item.children!.map(child => (
                <NavItem
                  key={child.id}
                  item={child}
                  depth={depth + 1}
                  isCollapsed={isCollapsed}
                  onItemClick={onItemClick}
                  expandedItems={expandedItems}
                  onToggleExpand={onToggleExpand}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render as Link for leaf items
  return (
    <Link
      to={item.href}
      onClick={handleClick}
      className={`${baseClasses} ${getStateClasses()}`}
      style={{ paddingLeft }}
      title={item.description}
    >
      {renderContent()}
    </Link>
  );
}
