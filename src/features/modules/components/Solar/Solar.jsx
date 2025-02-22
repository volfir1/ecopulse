import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area, ResponsiveContainer, CartesianGrid,
  ComposedChart, Bar
} from 'recharts';
import { Sun } from 'lucide-react';
import { p, s, bg, t, success, elements, Button, YearPicker, Card } from '@shared/index';
import { getAreaChartConfig, getEfficiencyChartConfig } from './chart';
import { useSolarAnalytics } from './hook';


// Enhanced skeleton components for loading state
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}></div>
);

const SkeletonSun = () => (
  <div className="relative w-6 h-6 rounded-full overflow-hidden">
    <SkeletonPulse className="absolute inset-0" />
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-200 to-amber-100 opacity-30 animate-pulse"></div>
  </div>
);

const SkeletonButton = ({ width = "w-36" }) => (
  <div className={`${width} h-10 rounded-md overflow-hidden relative`}>
    <SkeletonPulse className="absolute inset-0" />
    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 opacity-30 animate-pulse"></div>
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
    
    {/* Simulated area chart */}
    <div 
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-100 to-transparent animate-pulse"
      style={{ height: '60%', clipPath: 'polygon(0 100%, 20% 80%, 40% 90%, 60% 60%, 80% 70%, 100% 40%, 100% 100%)' }}
    ></div>
  </div>
);

const SolarEnergy = () => {
  const {
    generationData,
    currentGeneration,
    projectedGeneration,
    growthPercentage,
    startYear,
    endYear,
    handleYearChange,
    handleDownloadSummary,
    isLoading,
    handleClick
  } = useSolarAnalytics();

  const areaChartConfig = !isLoading ? getAreaChartConfig(generationData, null, startYear, endYear) : {};
  const efficiencyChartConfig = !isLoading ? getEfficiencyChartConfig(generationData, null, startYear, endYear) : {};

  // Enhanced Skeleton UI
  if (isLoading) {
    return (
      <div className="p-6">
        {/* Header Section Skeleton with improved aesthetics */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <SkeletonSun />
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
        
        {/* Metrics cards skeleton */}
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
          <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: elements.solar }}>
            <Sun size={24} />
            Solar Energy Analytics
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

<Button 
  className="whitespace-nowrap"
  style={{
    backgroundColor: elements.solar,
    color: p.text
  }}
  onClick={handleClick}
>
  Download Summary
</Button>
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
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={elements.solar} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={elements.solar} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={t.disabled}
              />
              <XAxis {...areaChartConfig.xAxis} stroke={t.secondary} />
              <YAxis {...areaChartConfig.yAxis} stroke={t.secondary} />
              <Tooltip
                contentStyle={{
                  backgroundColor: bg.paper,
                  borderRadius: '6px',
                  border: `1px solid ${t.disabled}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Area
                {...areaChartConfig.area}
                fill="url(#solarGradient)"
                stroke={elements.solar}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card.Base>
    </div>
  );
};

export default SolarEnergy;