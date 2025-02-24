import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { Leaf } from 'lucide-react';
import { Button, Card, YearPicker } from '@shared/index';
import { useBiomassAnalytics } from './bioHook';
import { 
  getAreaChartConfig, 
  getLineChartConfig, 
  getBarChartConfig, 
  getGridConfig,
  getMetricCardData,
  downloadSummary 
} from './bioUtils';

// Enhanced skeleton components for loading state
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}></div>
);

const SkeletonLeaf = () => (
  <div className="relative w-6 h-6 rounded-full overflow-hidden">
    <SkeletonPulse className="absolute inset-0" />
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-200 to-emerald-100 opacity-30 animate-pulse"></div>
  </div>
);

const SkeletonButton = ({ width = "w-36" }) => (
  <div className={`${width} h-10 rounded-md overflow-hidden relative`}>
    <SkeletonPulse className="absolute inset-0" />
    <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-50 opacity-30 animate-pulse"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="w-full h-80 relative overflow-hidden">
    <SkeletonPulse className="absolute inset-0" />
    {/* Simulated chart elements */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
    <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-300"></div>
    {[...Array(5)].map((_, i) => (
      <div 
        key={i} 
        className="absolute left-0 right-0 h-px bg-gray-300 opacity-50"
        style={{ top: `${20 + i * 15}%` }}
      ></div>
    ))}
    <div 
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-200 to-transparent animate-pulse"
      style={{ height: '60%', clipPath: 'polygon(0 100%, 20% 80%, 40% 90%, 60% 60%, 80% 70%, 100% 40%, 100% 100%)' }}
    ></div>
  </div>
);

const Biomass = () => {
  const {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleDownload
  } = useBiomassAnalytics();

  const areaChartConfig = getAreaChartConfig();

  const gridConfig = getGridConfig();

  if (loading) {
    return (
      <div className="p-6">
        {/* Header Section Skeleton */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <SkeletonLeaf />
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

        <Card.Base className="p-6 mb-6">
          <div className="space-y-2 mb-6">
            <SkeletonPulse className="w-48 h-7" />
            <SkeletonPulse className="w-64 h-4 opacity-70" />
          </div>
          <SkeletonChart />
        </Card.Base>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-green-600">
            <Leaf size={24} />
            Biomass Energy Analytics
          </h1>
          <div className="text-gray-500">
            <div className="text-sm font-medium">
              Selected Range: {selectedStartYear} - {selectedEndYear}  ({selectedEndYear - selectedStartYear} year/s)
            </div>
          
          </div>
        </div>

        <div className="flex justify-between items-center">
          <YearPicker
            initialStartYear={selectedStartYear}
            initialEndYear={selectedEndYear}
            onStartYearChange={handleStartYearChange}
            onEndYearChange={handleEndYearChange}
          />
          <div className="flex gap-2">
            <Button 
              className="whitespace-nowrap bg-green-600 text-white hover:bg-green-700"
              onClick={handleDownload}
            >
              Download Summary
            </Button>
          </div>
        </div>
      </div>



      {/* Charts Section */}

<Card.Biomass className="p-6 mb-6 bg-white shadow-sm">
  <h2 className="text-xl font-semibold mb-4 text-gray-800">
    Power Generation Trend
  </h2>
  <div className="text-3xl font-bold mb-1 text-green-600">
    {currentProjection} GWH
  </div>
  <p className="text-gray-600 mb-4">Predictive Analysis Generation projection</p>
  <div className="h-[250px]"> {/* Reduced from 300px to 250px */}
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={generationData}>
        <defs>
          <linearGradient id="biomassGradient" x1="0" y1="0" x2="0" y2="1">
            {areaChartConfig.gradient.stops.map((stop, index) => (
              <stop
                key={index}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </linearGradient>
        </defs>
        <CartesianGrid {...gridConfig.cartesianGrid} />
        <XAxis {...gridConfig.xAxis} dataKey="date" />
        <YAxis {...gridConfig.yAxis} />
        <Tooltip {...areaChartConfig.tooltip} />
        <Area {...areaChartConfig.area} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</Card.Biomass>
    
      
    </div>
  );
};

export default Biomass;