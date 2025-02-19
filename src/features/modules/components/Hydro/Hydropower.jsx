import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area, ResponsiveContainer, CartesianGrid,
  ComposedChart, Bar
} from 'recharts';
import { Droplets } from 'lucide-react';
import { p, s, t, bg, elements, Button, Card, YearPicker } from '@shared/index';
import { useHydroPowerAnalytics } from './hook';
import { getGenerationConfig, getFlowConfig, getEfficiencyConfig } from './script';

const HydroPower = () => {
  const {
    generationData,
    currentStats,
    projectedStats,
    growthPercentages,
    startYear,
    endYear,
    handleYearChange
  } = useHydroPowerAnalytics();

  const generationConfig = getGenerationConfig(generationData, startYear, endYear);
  const flowConfig = getFlowConfig(generationData, startYear, endYear);
  const efficiencyConfig = getEfficiencyConfig(generationData, startYear, endYear);

  return (
    <div className="p-6" style={{ backgroundColor: bg.subtle }}>
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: elements.hydropower }}>
          <Droplets size={24} />
          Hydropower Energy Analytics
        </h1>
        
        <YearPicker 
          startYear={startYear}
          endYear={endYear}
          onYearChange={handleYearChange}
        />
        
        <div className="flex gap-4">
          <Button 
            variant="outlined" 
            style={{ 
              borderColor: elements.hydropower,
              color: elements.hydropower 
            }}
          >
            Flow Report
          </Button>
          <Button style={{ 
            backgroundColor: elements.hydropower,
            color: '#ffffff'
          }}>
            Download Summary
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card.Base className="p-4" style={{ backgroundColor: bg.paper }}>
          <h3 className="text-sm mb-1" style={{ color: t.secondary }}>Current Generation</h3>
          <p className="text-2xl font-bold" style={{ color: elements.hydropower }}>
            {currentStats.generation.toLocaleString()} MWh
          </p>
          <p className="text-sm mt-1" style={{ color: t.hint }}>
            Growth: {growthPercentages.generation}%
          </p>
        </Card.Base>
        
        <Card.Base className="p-4" style={{ backgroundColor: bg.paper }}>
          <h3 className="text-sm mb-1" style={{ color: t.secondary }}>Water Flow</h3>
          <p className="text-2xl font-bold" style={{ color: elements.hydropower }}>
            {currentStats.flow.toLocaleString()} m³/s
          </p>
          <p className="text-sm mt-1" style={{ color: t.hint }}>
            Change: {growthPercentages.flow}%
          </p>
        </Card.Base>
        
        <Card.Base className="p-4" style={{ backgroundColor: bg.paper }}>
          <h3 className="text-sm mb-1" style={{ color: t.secondary }}>System Efficiency</h3>
          <p className="text-2xl font-bold" style={{ color: elements.hydropower }}>
            {currentStats.efficiency}%
          </p>
          <p className="text-sm mt-1" style={{ color: t.hint }}>
            Improvement: {growthPercentages.efficiency}%
          </p>
        </Card.Base>
      </div>

      {/* Generation Chart */}
      <Card.Base className="p-6 mb-6" style={{ backgroundColor: bg.paper }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>Power Generation Trend</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={generationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
            >
              <defs>
                <linearGradient id="hydroGradient" x1="0" y1="0" x2="0" y2="1">
                  {generationConfig.gradient.colors.map((color, index) => (
                    <stop 
                      key={index}
                      offset={color.offset} 
                      stopColor={color.color}
                      stopOpacity={color.opacity}
                    />
                  ))}
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.disabled} />
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

      {/* Water Flow Chart */}
      <Card.Base className="p-6 mb-6" style={{ backgroundColor: bg.paper }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>Water Flow Analysis</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={generationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.disabled} />
              <XAxis {...flowConfig.xAxis} stroke={t.secondary} />
              <YAxis {...flowConfig.yAxis} stroke={t.secondary} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: bg.paper,
                  borderRadius: '6px',
                  border: `1px solid ${t.disabled}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Line {...flowConfig.line} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card.Base>

      {/* Efficiency Chart */}
      <Card.Base className="p-6" style={{ backgroundColor: bg.paper }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>System Efficiency</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={generationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.disabled} />
              <XAxis {...efficiencyConfig.xAxis} stroke={t.secondary} />
              <YAxis {...efficiencyConfig.yAxis} stroke={t.secondary} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: bg.paper,
                  borderRadius: '6px',
                  border: `1px solid ${t.disabled}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Bar {...efficiencyConfig.bar} />
              <Line {...efficiencyConfig.line} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card.Base>
    </div>
  );
};

export default HydroPower;