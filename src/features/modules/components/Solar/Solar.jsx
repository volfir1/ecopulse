import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area, ResponsiveContainer, CartesianGrid,
  ComposedChart, Bar
} from 'recharts';
import { Sun } from 'lucide-react';
// Import components and color objects directly from central index
import { p, s, bg, t, success, elements, Button, Card, YearPicker } from '@shared/index';
import { getAreaChartConfig, getEfficiencyChartConfig } from './chart';
import { useSolarAnalytics } from './hook';

const SolarEnergy = () => {
  const {
    generationData,
    currentGeneration,
    projectedGeneration,
    growthPercentage,
    startYear,
    endYear,
    handleYearChange,
    efficiency
  } = useSolarAnalytics();

  const areaChartConfig = getAreaChartConfig(generationData, null, startYear, endYear);
  const efficiencyChartConfig = getEfficiencyChartConfig(generationData, null, startYear, endYear);

  return (
    <div className="p-6" style={{ backgroundColor: bg.subtle }}>
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2" style={{ color: elements.solar }}>
          <Sun size={24} />
          Solar Energy Analytics
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
              borderColor: elements.solar, 
              color: elements.solar 
            }}
          >
            Panel Report
          </Button>
          <Button style={{ 
            backgroundColor: elements.solar, 
            color: p.text 
          }}>
            Download Summary
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card.Base className="p-4" style={{ backgroundColor: bg.paper }}>
          <h3 className="text-sm mb-1" style={{ color: t.secondary }}>
            Current Generation
          </h3>
          <p className="text-2xl font-bold" style={{ color: elements.solar }}>
            {currentGeneration.toLocaleString()} kWh
          </p>
        </Card.Base>
        
        <Card.Base className="p-4" style={{ backgroundColor: bg.paper }}>
          <h3 className="text-sm mb-1" style={{ color: t.secondary }}>
            Projected Generation
          </h3>
          <p className="text-2xl font-bold" style={{ color: success.main }}>
            {projectedGeneration.toLocaleString()} kWh
          </p>
        </Card.Base>
        
        <Card.Base className="p-4" style={{ backgroundColor: bg.paper }}>
          <h3 className="text-sm mb-1" style={{ color: t.secondary }}>
            Growth Projection
          </h3>
          <p className="text-2xl font-bold" style={{ color: s.main }}>
            +{growthPercentage}%
          </p>
        </Card.Base>
      </div>

      {/* Generation Chart */}
      <Card.Base className="p-6 mb-6" style={{ backgroundColor: bg.paper }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>
          Power Generation Trend
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={generationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
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

      {/* Efficiency Chart */}
      <Card.Base className="p-6" style={{ backgroundColor: bg.paper }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: t.main }}>
          System Efficiency
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={generationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke={t.disabled}
              />
              <XAxis {...efficiencyChartConfig.xAxis} stroke={t.secondary} />
              <YAxis {...efficiencyChartConfig.yAxis} stroke={t.secondary} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: bg.paper,
                  borderRadius: '6px',
                  border: `1px solid ${t.disabled}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                {...efficiencyChartConfig.line}
                stroke={success.main}
              />
              <Bar
                dataKey="efficiency"
                fill={`${success.main}20`}
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card.Base>
    </div>
  );
};

export default SolarEnergy;