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

const Geothermal = () => {
  const {
    generationData,
    currentStats,
    projectedStats,
    growthPercentages,
    startYear,
    endYear,
    handleYearChange
  } = useGeothermalAnalytics();

  const generationConfig = getGenerationConfig(generationData, startYear, endYear);
  const temperatureConfig = getTemperatureConfig(generationData, startYear, endYear);
  const efficiencyConfig = getEfficiencyConfig(generationData, startYear, endYear);

  return (
    <div className="p-6" style={{ backgroundColor: bg.subtle }}>
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: elements.geothermal }}>
          <Thermometer size={24} />
          Geothermal Energy Analytics
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
              borderColor: elements.geothermal,
              color: elements.geothermal 
            }}
          >
            Well Report
          </Button>
          <Button style={{ 
            backgroundColor: elements.geothermal,
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
          <p className="text-2xl font-bold" style={{ color: elements.geothermal }}>
            {currentStats.generation.toLocaleString()} MWh
          </p>
          <p className="text-sm mt-1" style={{ color: t.hint }}>
            Growth: {growthPercentages.generation}%
          </p>
        </Card.Base>
        
        <Card.Base className="p-4" style={{ backgroundColor: bg.paper }}>
          <h3 className="text-sm mb-1" style={{ color: t.secondary }}>Well Temperature</h3>
          <p className="text-2xl font-bold" style={{ color: elements.geothermal }}>
            {currentStats.wellTemp}°C
          </p>
          <p className="text-sm mt-1" style={{ color: t.hint }}>
            Change: {growthPercentages.wellTemp}%
          </p>
        </Card.Base>
        
        <Card.Base className="p-4" style={{ backgroundColor: bg.paper }}>
          <h3 className="text-sm mb-1" style={{ color: t.secondary }}>System Efficiency</h3>
          <p className="text-2xl font-bold" style={{ color: elements.geothermal }}>
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
                <linearGradient id="geothermalGradient" x1="0" y1="0" x2="0" y2="1">
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

      {/* Temperature Chart */}
      <Card.Base className="p-6 mb-6" style={{ backgroundColor: bg.paper }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>Well Temperature Analysis</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={generationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.disabled} />
              <XAxis {...temperatureConfig.xAxis} stroke={t.secondary} />
              <YAxis {...temperatureConfig.yAxis} stroke={t.secondary} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: bg.paper,
                  borderRadius: '6px',
                  border: `1px solid ${t.disabled}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Line {...temperatureConfig.line} />
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

export default Geothermal;