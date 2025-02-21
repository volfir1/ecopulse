import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area, ResponsiveContainer, CartesianGrid,
  ComposedChart, Bar
} from 'recharts';
import { Thermometer } from 'lucide-react';
import { p, s, t, bg, elements, Button, Card, YearPicker } from '@shared/index';
import { useGeothermalAnalytics } from './hook';
import { getGenerationConfig, getTemperatureConfig, getEfficiencyConfig } from './script';

// Enhanced skeleton components for loading state
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}></div>
);

const SkeletonThermometer = () => (
  <div className="relative w-6 h-6 rounded-full overflow-hidden">
    <SkeletonPulse className="absolute inset-0" />
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-200 to-orange-100 opacity-30 animate-pulse"></div>
  </div>
);

const SkeletonButton = ({ width = "w-36" }) => (
  <div className={`${width} h-10 rounded-md overflow-hidden relative`}>
    <SkeletonPulse className="absolute inset-0" />
    <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-50 opacity-30 animate-pulse"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="w-full h-80 relative overflow-hidden">
    <SkeletonPulse className="absolute inset-0" />
    
    {/* Simulated X-axis */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
    
    {/* Simulated Y-axis */}
    <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-300"></div>
    
    {/* Simulated chart lines */}
    {[...Array(5)].map((_, i) => (
      <div 
        key={i} 
        className="absolute left-0 right-0 h-px bg-gray-300 opacity-50"
        style={{ top: `${20 + i * 15}%` }}
      ></div>
    ))}
    
    {/* Simulated area chart - with steady upward curve for geothermal */}
    <div 
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-100 to-transparent animate-pulse"
      style={{ 
        height: '65%', 
        clipPath: 'polygon(0 100%, 20% 92%, 40% 85%, 60% 78%, 80% 72%, 100% 65%, 100% 100%)' 
      }}
    ></div>
  </div>
);

const Geothermal = () => {
  const {
    generationData,
    currentStats,
    projectedStats,
    growthPercentages,
    startYear,
    endYear,
    handleYearChange,
    isLoading
  } = useGeothermalAnalytics();

  const generationConfig = !isLoading ? getGenerationConfig(generationData, startYear, endYear) : {};
  const temperatureConfig = !isLoading ? getTemperatureConfig(generationData, startYear, endYear) : {};
  const efficiencyConfig = !isLoading ? getEfficiencyConfig(generationData, startYear, endYear) : {};

  // Enhanced Skeleton UI
  if (isLoading) {
    return (
      <div className="p-6">
        {/* Header Section Skeleton with improved aesthetics */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <SkeletonThermometer />
              <div className="space-y-2">
                <SkeletonPulse className="w-48 h-8" />
                <SkeletonPulse className="w-24 h-4 opacity-70" />
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <SkeletonPulse className="w-36 h-5" />
              <SkeletonPulse className="w-24 h-4 opacity-70" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <SkeletonPulse className="w-32 h-10 rounded-md" />
              <SkeletonPulse className="w-32 h-10 rounded-md" />
            </div>
            <SkeletonButton width="w-44" />
          </div>
        </div>

        {/* Enhanced Generation Chart Skeleton */}
        <div className="p-6 mb-6 rounded-lg overflow-hidden" style={{ 
          backgroundColor: bg.paper,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Title with subtitle simulation */}
          <div className="space-y-2 mb-6">
            <SkeletonPulse className="w-48 h-7" />
            <SkeletonPulse className="w-64 h-4 opacity-70" />
          </div>
          
          {/* Chart with visual elements that suggest the shape of the data */}
          <SkeletonChart />
          
          {/* Legend items */}
          <div className="flex gap-4 mt-4 justify-end">
            <div className="flex items-center gap-2">
              <SkeletonPulse className="w-3 h-3 rounded" />
              <SkeletonPulse className="w-20 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonPulse className="w-3 h-3 rounded" />
              <SkeletonPulse className="w-20 h-4" />
            </div>
          </div>
        </div>
        
        {/* Metrics cards skeleton - more stable pattern for geothermal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg" style={{ 
              backgroundColor: bg.paper,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <SkeletonPulse className="w-24 h-5" />
                  <SkeletonPulse className="w-16 h-8" />
                </div>
                <SkeletonPulse className="w-10 h-10 rounded-full" />
              </div>
              <SkeletonPulse className="w-full h-2 mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Actual content
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: elements.geothermal }}>
            <Thermometer size={24} />
            Geothermal Energy Analytics
          </h1>
          <div className="text-gray-500 text-sm">
            Selected Range: {startYear.format('YYYY')} - {endYear.format('YYYY')}
            ({endYear.diff(startYear, 'year')} years)
          </div>
        </div>

        <div className="flex justify-between items-center">
          <YearPicker
            startYear={startYear}
            endYear={endYear}
            onYearChange={handleYearChange}
          />

          <div className="flex gap-2">
            <Button 
              className="whitespace-nowrap"
              style={{
                backgroundColor: elements.geothermal,
                color: '#ffffff'
              }}
            >
              Download Summary
            </Button>
          </div>
        </div>
      </div>

      {/* Generation Chart */}
      <Card.Base 
        className="p-6 mb-6" 
        style={{ 
          backgroundColor: bg.paper,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>
          Power Generation Trend
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={generationData}
              margin={{ top: 0, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="geothermalGradient" x1="0" y1="0" x2="0" y2="1">
                  {generationConfig.gradient?.colors?.map((color, index) => (
                    <stop
                      key={index}
                      offset={color.offset}
                      stopColor={color.color}
                      stopOpacity={color.opacity || 1}
                    />
                  )) || []}
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={t.disabled} 
              />
              <XAxis {...generationConfig.xAxis} stroke={t.secondary} />
              <YAxis {...generationConfig.yAxis} stroke={t.secondary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: bg.paper,
                  borderRadius: '6px',
                  border: `1px solid ${t.disabled}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Area {...generationConfig.area} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card.Base>
    </div>
  );
};

export default Geothermal;