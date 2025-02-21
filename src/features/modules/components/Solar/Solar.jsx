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

          <div className="flex gap-2">
            <Button 
              className="whitespace-nowrap"
              style={{
                backgroundColor: elements.solar,
                color: p.text
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