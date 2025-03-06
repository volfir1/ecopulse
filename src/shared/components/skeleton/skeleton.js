import React from 'react';
import { elements } from '../ui/colors'; // Import from your colors file

// Unified skeleton components that use energy type for theming
const Skeleton = {
  // Base skeleton pulse with energy-specific color variations
  SkeletonPulse: ({ className, energyType }) => {
    const energyColor = elements[energyType] || '#6b7280'; // Default to gray if type not found
    
    return (
      <div 
        className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
        style={{ 
          '--energy-color-faded': `${energyColor}20` // Using hex with alpha
        }}
      ></div>
    );
  },

  // Energy icon skeleton (sun, droplets, etc.)
  SkeletonIcon: ({ energyType }) => {
    const energyColor = elements[energyType] || '#6b7280';
    
    return (
      <div className="relative w-6 h-6 rounded-full overflow-hidden">
        <div className="absolute inset-0 rounded-full animate-pulse"
          style={{ 
            background: `linear-gradient(to top right, ${energyColor}40, ${energyColor}20)`,
          }}
        ></div>
      </div>
    );
  },

  // Button skeleton with energy-specific styling
  SkeletonButton: ({ width = "w-36", energyType }) => {
    const energyColor = elements[energyType] || '#6b7280';
    
    return (
      <div className={`${width} h-10 rounded-md overflow-hidden relative`}>
        <div className="absolute inset-0 animate-pulse bg-gray-200"></div>
        <div 
          className="absolute inset-0 animate-pulse opacity-30"
          style={{ 
            background: `linear-gradient(to right, ${energyColor}30, ${energyColor}10)`
          }}
        ></div>
      </div>
    );
  },

  // Chart skeleton with energy-specific styling
  SkeletonChart: ({ energyType }) => {
    const energyColor = elements[energyType] || '#6b7280';
    
    return (
      <div className="w-full h-64 relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-gray-200"></div>
        
        {/* Chart grid lines simulation */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-300"></div>
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="absolute left-0 right-0 h-px bg-gray-300 opacity-50"
            style={{ top: `${20 + i * 15}%` }}
          ></div>
        ))}
        
        {/* Energy-specific chart area simulation */}
        <div 
          className="absolute bottom-0 left-0 right-0 animate-pulse"
          style={{ 
            height: '60%', 
            background: `linear-gradient(to top, ${energyColor}50, transparent)`,
            clipPath: 'polygon(0 100%, 20% 80%, 40% 90%, 60% 60%, 80% 70%, 100% 40%, 100% 100%)'
          }}
        ></div>
      </div>
    );
  },

  // Full energy page loading skeleton
  EnergyPageSkeleton: ({ energyType, CardComponent }) => {
    const { SkeletonPulse, SkeletonIcon, SkeletonButton, SkeletonChart } = Skeleton;
    
    return (
      <div className="p-6">
        {/* Header Section Skeleton */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <SkeletonIcon energyType={energyType} />
              <div className="space-y-2">
                <SkeletonPulse className="w-48 h-8" energyType={energyType} />
                <SkeletonPulse className="w-24 h-4 opacity-70" energyType={energyType} />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <SkeletonPulse className="w-64 h-10 rounded-md" energyType={energyType} />
              <SkeletonButton energyType={energyType} />
              <SkeletonButton energyType={energyType} />
            </div>
          </div>
        </div>

        {/* Card Component - use generic card styling if CardComponent not provided */}
        <div className="p-6 mb-6" style={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
          <div className="space-y-2 mb-6">
            <SkeletonPulse className="w-48 h-7" energyType={energyType} />
            <SkeletonPulse className="w-64 h-4 opacity-70" energyType={energyType} />
          </div>
          <SkeletonChart energyType={energyType} />
        </div>
      </div>
    );
  }
};

export default Skeleton;