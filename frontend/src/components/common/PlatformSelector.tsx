import React, { useState, useEffect, useRef } from 'react';
import { Target, ChevronDown, Smartphone, Globe, Server, Monitor } from 'lucide-react';
import { usePlatform } from '../../contexts';
import { PlatformType } from '../../types';
import type { Platform } from '../../types';

const PlatformSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedPlatform, platforms, selectPlatform, isLoading } = usePlatform();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePlatformSelect = (platform: Platform) => {
    selectPlatform(platform);
    setIsOpen(false);
  };

  const getPlatformIcon = (platformType: PlatformType, className: string = "w-3.5 h-3.5") => {
    switch (platformType) {
      case PlatformType.ANDROID:
        return <Smartphone className={`${className} text-white`} />;
      case PlatformType.IOS:
        return <Smartphone className={`${className} text-white`} />;
      case PlatformType.WEB:
        return <Globe className={`${className} text-white`} />;
      case PlatformType.SERVICE:
        return <Server className={`${className} text-white`} />;
      default:
        return <Monitor className={`${className} text-white`} />;
    }
  };

  const getPlatformGradient = (platformType: PlatformType) => {
    switch (platformType) {
      case PlatformType.ANDROID:
        return 'from-green-500/90 to-green-600/90';
      case PlatformType.IOS:
        return 'from-gray-500/90 to-gray-600/90';
      case PlatformType.WEB:
        return 'from-blue-500/90 to-blue-600/90';
      case PlatformType.SERVICE:
        return 'from-purple-500/90 to-purple-600/90';
      default:
        return 'from-green-500/90 to-green-600/90';
    }
  };

  const getPlatformColor = (platformType: PlatformType) => {
    switch (platformType) {
      case PlatformType.ANDROID:
        return 'bg-green-100 text-green-800';
      case PlatformType.IOS:
        return 'bg-gray-100 text-gray-800';
      case PlatformType.WEB:
        return 'bg-blue-100 text-blue-800';
      case PlatformType.SERVICE:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!platforms.length || !Array.isArray(platforms)) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg">
        <Target className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">No platforms</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2.5 px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-white/90 hover:border-gray-300/60 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-300 transition-all duration-200 min-w-[220px] shadow-sm hover:shadow-md"
      >
        {/* Platform Icon */}
        <div className="relative">
          <div className={`w-7 h-7 bg-gradient-to-br ${selectedPlatform ? getPlatformGradient(selectedPlatform.platformType) : 'from-green-500/90 to-green-600/90'} rounded-lg flex items-center justify-center shadow-sm`}>
            {selectedPlatform ? getPlatformIcon(selectedPlatform.platformType) : <Target className="w-3.5 h-3.5 text-white" />}
          </div>
          {/* Active indicator */}
          {selectedPlatform && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></div>
          )}
        </div>
        
        {/* Platform Info */}
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs text-gray-500 font-medium mb-0.5">Platform</div>
          {selectedPlatform ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {selectedPlatform.name}
                </span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPlatformColor(selectedPlatform.platformType)}`}>
                  {selectedPlatform.platformType}
                </span>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">
              Select platform
            </div>
          )}
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 ${isOpen ? 'rotate-180 text-gray-600' : 'group-hover:text-gray-600'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-[280px] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/60 z-50 overflow-hidden">
          {/* Platforms List */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            <div className="py-1">
              {platforms.map((platform: Platform) => {
                const isSelected = selectedPlatform?.id === platform.id;
                
                return (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform)}
                    className={`group w-full px-4 py-3.5 text-left hover:bg-green-50/50 focus:outline-none focus:bg-green-50/60 transition-all duration-200 ${
                      isSelected ? 'bg-green-50/70' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Platform Icon */}
                      <div className={`w-8 h-8 bg-gradient-to-br ${getPlatformGradient(platform.platformType)} rounded-lg flex items-center justify-center shadow-sm`}>
                        {getPlatformIcon(platform.platformType, "w-4 h-4")}
                      </div>
                      
                      {/* Platform Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium truncate ${
                            isSelected ? 'text-green-900' : 'text-gray-900'
                          }`}>
                            {platform.name}
                          </span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPlatformColor(platform.platformType)}`}>
                            {platform.platformType}
                          </span>
                        </div>
                        {platform.description && (
                          <div className="text-xs text-gray-500 mt-0.5 truncate">
                            {platform.description}
                          </div>
                        )}
                      </div>
                      
                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformSelector;
