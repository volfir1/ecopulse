// SolarEnergy.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { Sun } from 'lucide-react';
import { Button, Card, YearPicker } from '@shared/index';
import { useSolarAnalytics } from './solarHook';
import { getAreaChartConfig, getGridConfig } from './solarUtil';

// Skeleton components
const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}></div>
);

const SkeletonSun = () => (
  <div className="relative w-6 h-6 rounded-full overflow-hidden">
    <SkeletonPulse className="absolute inset-0" />
    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-200 to-yellow-100 opacity-30 animate-pulse"></div>
  </div>
);

const SkeletonButton = ({ width = "w-36" }) => (
  <div className={`${width} h-10 rounded-md overflow-hidden relative`}>
    <SkeletonPulse className="absolute inset-0" />
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-50 opacity-30 animate-pulse"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="w-full h-64 relative overflow-hidden">
    <SkeletonPulse className="absolute inset-0" />
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
    <div 
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-200 to-transparent animate-pulse"
      style={{ height: '60%', clipPath: 'polygon(0 100%, 20% 80%, 40% 90%, 60% 60%, 80% 70%, 100% 40%, 100% 100%)' }}
    ></div>
  </div>
);

const SolarEnergy = () => {
  const {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleDownload
  } = useSolarAnalytics();

  const areaChartConfig = getAreaChartConfig();
  const gridConfig = getGridConfig();

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <SkeletonSun />
              <div className="space-y-2">
                <SkeletonPulse className="w-48 h-8" />
                <SkeletonPulse className="w-24 h-4 opacity-70" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SkeletonPulse className="w-64 h-10 rounded-md" />
              <SkeletonButton />
            </div>
          </div>
        </div>

        <Card.Solar className="p-6 mb-6">
          <div className="space-y-2 mb-6">
            <SkeletonPulse className="w-48 h-7" />
            <SkeletonPulse className="w-64 h-4 opacity-70" />
          </div>
          <SkeletonChart />
        </Card.Solar>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2 text-[#FFB800]">
            <Sun size={24} />
            Solar Energy Analytics
          </h1>
          <div className="text-gray-500">
            Selected Range: {selectedStartYear} - {selectedEndYear}
            <span className="text-sm ml-1">({selectedEndYear - selectedStartYear} years)</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
        <YearPicker
    startYear={selectedStartYear}    // Changed from startYear to selectedStartYear
    endYear={selectedEndYear}        // Changed from endYear to selectedEndYear
    onStartYearChange={handleStartYearChange}
    onEndYearChange={handleEndYearChange}
    className="w-full"
  />
          <div className="flex gap-2">
            <Button 
              className="whitespace-nowrap bg-[#FFB800] text-white hover:bg-[#F0AB00] transition-colors"
              onClick={handleDownload}
            >
              Download Summary
            </Button>
          </div>
        </div>
      </div>

      <Card.Solar className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Power Generation Trend
        </h2>
        <div className="text-3xl font-bold mb-1 text-[#FFB800]">
          {currentProjection} GWH
        </div>
        <p className="text-gray-600 mb-4">Predictive Analysis Generation projection</p>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={generationData}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
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
      </Card.Solar>
    </div>
  );
};

export default SolarEnergy;