import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Check, 
  Search, 
  X, 
  Building2, 
  FolderOpen, 
  Smartphone, 
  Monitor, 
  Server, 
  Globe, 
  Package,
  AlertCircle
} from 'lucide-react';

export interface SelectorOption {
  id: string | number;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'error' | 'default' | 'owner' | 'admin' | 'member';
  };
  metadata?: Record<string, any>;
  disabled?: boolean;
}

export interface EnterpriseSelectorProps {
  /**
   * Type of selector - affects styling and default icons
   */
  type: 'company' | 'project' | 'platform' | 'version';
  
  /**
   * Current selected option
   */
  selected?: SelectorOption | null;
  
  /**
   * List of available options
   */
  options: SelectorOption[];
  
  /**
   * Callback when an option is selected
   */
  onSelect: (option: SelectorOption) => void;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Error state
   */
  error?: string | null;
  
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  
  /**
   * Enable search functionality
   */
  searchable?: boolean;
  
  /**
   * Custom width
   */
  width?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
}

const typeConfig = {
  company: {
    label: 'Company',
    defaultIcon: Building2,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600'
  },
  project: {
    label: 'Project',
    defaultIcon: FolderOpen,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600'
  },
  platform: {
    label: 'Platform',
    defaultIcon: Monitor,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600'
  },
  version: {
    label: 'Version',
    defaultIcon: Package,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600'
  }
};

const platformIcons = {
  ANDROID: Smartphone,
  IOS: Smartphone,
  WEB: Globe,
  SERVICE: Server
};

const badgeVariants = {
  success: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border border-emerald-200/60 shadow-sm',
  warning: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border border-amber-200/60 shadow-sm',
  info: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200/60 shadow-sm',
  error: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200/60 shadow-sm',
  default: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200/60 shadow-sm',
  owner: 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-800 border border-violet-200/60 shadow-sm',
  admin: 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-200/60 shadow-sm',
  member: 'bg-gradient-to-r from-gray-50 to-slate-50 text-slate-600 border border-slate-200/60 shadow-sm'
};

const sizeConfig = {
  sm: {
    button: 'px-2.5 py-1.5 min-w-[180px] h-12',
    icon: 'w-5 h-5',
    iconContainer: 'w-6 h-6',
    text: 'text-xs',
    label: 'text-[10px]',
    dropdown: 'w-[240px]'
  },
  md: {
    button: 'px-3 py-2 min-w-[220px] h-14',
    icon: 'w-3.5 h-3.5',
    iconContainer: 'w-7 h-7',
    text: 'text-sm',
    label: 'text-xs',
    dropdown: 'w-[280px]'
  },
  lg: {
    button: 'px-4 py-3 min-w-[280px] h-16',
    icon: 'w-4 h-4',
    iconContainer: 'w-8 h-8',
    text: 'text-base',
    label: 'text-sm',
    dropdown: 'w-[340px]'
  }
};

export const EnterpriseSelector: React.FC<EnterpriseSelectorProps> = ({
  type,
  selected,
  options,
  onSelect,
  loading = false,
  error = null,
  placeholder,
  searchable = false,
  width,
  disabled = false,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const config = typeConfig[type];
  const sizeStyles = sizeConfig[size];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, searchable]);

  // Filter options based on search query
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  const handleSelect = (option: SelectorOption) => {
    if (option.disabled) return;
    onSelect(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getIcon = (option: SelectorOption) => {
    if (option.icon) return option.icon;
    
    // Special handling for platform type
    if (type === 'platform' && option.metadata?.platformType) {
      const IconComponent = platformIcons[option.metadata.platformType as keyof typeof platformIcons] || config.defaultIcon;
      return <IconComponent className={sizeStyles.icon} />;
    }
    
    return <config.defaultIcon className={sizeStyles.icon} />;
  };

  const renderBadge = (badge: SelectorOption['badge']) => {
    if (!badge) return null;
    
    return (
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${badgeVariants[badge.variant]} backdrop-blur-sm`}>
        <span className="drop-shadow-sm">{badge.text}</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center space-x-2 ${sizeStyles.button} bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg`}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className={`${sizeStyles.text} text-gray-600`}>Loading...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center justify-center space-x-2 ${sizeStyles.button} bg-red-50/50 backdrop-blur-sm border border-red-200/60 rounded-lg`}>
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className={`${sizeStyles.text} text-red-600`}>Error loading {config.label.toLowerCase()}s</span>
      </div>
    );
  }

  // No options state
  if (!options.length) {
    return (
      <div className={`flex items-center justify-center space-x-2 ${sizeStyles.button} bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg`}>
        <config.defaultIcon className="w-4 h-4 text-gray-400" />
        <span className={`${sizeStyles.text} text-gray-500`}>No {config.label.toLowerCase()}s</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef} style={{ width }}>
      {/* Main Selector Button */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`group flex items-center space-x-2.5 ${sizeStyles.button} bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-white/90 hover:border-gray-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${width ? '' : sizeStyles.dropdown}`}
      >
        {/* Icon */}
        <div className="relative">
          <div className={`${sizeStyles.iconContainer} bg-gradient-to-br ${config.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
            {selected ? getIcon(selected) : <config.defaultIcon className={`${sizeStyles.icon} text-white`} />}
          </div>
          {/* Active indicator */}
          {selected && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 text-left min-w-0">
          <div className={`${sizeStyles.label} text-gray-500 font-medium mb-0.5`}>{config.label}</div>
          {selected ? (
            <div className="flex items-center justify-between">
              <span className={`${sizeStyles.text} font-medium text-gray-800 truncate flex-1 mr-2`}>
                {selected.name}
              </span>
              {selected.badge && (
                <div className="flex-shrink-0">
                  {renderBadge(selected.badge)}
                </div>
              )}
            </div>
          ) : (
            <div className={`${sizeStyles.text} text-gray-500`}>
              {placeholder || `Select ${config.label.toLowerCase()}`}
            </div>
          )}
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
          isOpen ? 'rotate-180 text-gray-600' : 'group-hover:text-gray-600'
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute left-0 mt-1 ${width ? '' : sizeStyles.dropdown} bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/60 z-50 overflow-hidden`}>
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-gray-100/80">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${config.label.toLowerCase()}s...`}
                  className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-gray-400 mb-2">
                  <config.defaultIcon className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-500">
                  {searchQuery ? `No ${config.label.toLowerCase()}s found` : `No ${config.label.toLowerCase()}s available`}
                </p>
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option, index) => {
                  const isSelected = selected?.id === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      disabled={option.disabled}
                      className={`group w-full px-4 py-3.5 text-left hover:bg-blue-50/50 focus:outline-none focus:bg-blue-50/60 transition-all duration-200 ${
                        isSelected ? 'bg-blue-50/70' : ''
                      } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
                        index !== filteredOptions.length - 1 ? 'border-b border-gray-100/50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {/* Option Icon */}
                          <div className="relative flex-shrink-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isSelected 
                                ? `bg-gradient-to-br ${config.gradient} ring-2 ring-blue-200` 
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100/60 group-hover:to-blue-200/60'
                            }`}>
                              <div className={isSelected ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}>
                                {getIcon(option)}
                              </div>
                            </div>
                            {/* Active indicator - moved to bottom right */}
                            {isSelected && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm">
                                <Check className="w-1.5 h-1.5 text-white absolute top-0.5 left-0.5" />
                              </div>
                            )}
                          </div>
                          
                          {/* Option Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-0.5">
                              <h4 className={`text-sm font-medium truncate flex-1 mr-3 ${
                                isSelected ? 'text-blue-900' : 'text-gray-800 group-hover:text-blue-900'
                              }`}>
                                {option.name}
                              </h4>
                              {/* Badge moved to the right side */}
                              {option.badge && (
                                <div className="flex-shrink-0">
                                  {renderBadge(option.badge)}
                                </div>
                              )}
                            </div>
                            {option.description && (
                              <p className="text-xs text-gray-500 truncate">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Selection Check - larger and more separated */}
                        {isSelected && (
                          <div className="flex-shrink-0 ml-4 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
