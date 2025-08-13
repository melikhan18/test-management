import NavItem from './NavItem';
import type { NavItemData } from './NavItem';

export interface NavSectionData {
  id: string;
  title: string;
  items: NavItemData[];
  icon?: React.ElementType;
  collapsed?: boolean;
  permissions?: string[];
}

interface NavSectionProps {
  section: NavSectionData;
  isCollapsed?: boolean;
  expandedItems?: string[];
  onToggleExpand?: (itemId: string) => void;
  onItemClick?: (item: NavItemData) => void;
  className?: string;
}

/**
 * Enterprise Navigation Section Component
 * Groups navigation items by section with optional section headers
 */
export default function NavSection({
  section,
  isCollapsed = false,
  expandedItems = [],
  onToggleExpand,
  onItemClick,
  className = ''
}: NavSectionProps) {
  
  if (section.collapsed) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Section Header */}
      {!isCollapsed && (
        <div className="mb-4">
          <div className="flex items-center px-3">
            {section.icon && (
              <section.icon className="h-4 w-4 text-gray-400 mr-2" />
            )}
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {section.title}
            </h3>
          </div>
        </div>
      )}

      {/* Section Items */}
      <div className={`space-y-${isCollapsed ? '1' : '2'}`}>
        {section.items.map(item => (
          <NavItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            expandedItems={expandedItems}
            onToggleExpand={onToggleExpand}
            onItemClick={onItemClick}
          />
        ))}
      </div>

      {/* Separator for collapsed mode */}
      {isCollapsed && (
        <div className="mx-auto my-4 h-px w-8 bg-gray-200"></div>
      )}
    </div>
  );
}
