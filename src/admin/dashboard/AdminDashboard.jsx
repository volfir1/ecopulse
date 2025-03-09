// EnergyDashboard.jsx
import React, { useMemo } from 'react';
import {
  Typography,
  Box,
  Grid,
  Divider
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Zap,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart2,
  Calendar
} from 'lucide-react';

import {
  Button,
  Card,
  AppIcon,
  YearPicker
} from '@shared/index';

import useDashboardSummary from './hook';
import {
  formatNumber,
  formatPercentage,
  getChangeColor,
  getEnergyIcon,
  getSourceColor,
  getLineChartConfig,
  getBarChartConfig,
  getSummaryStats
} from './util';

const EnergyDashboard = () => {
  // Use the custom hook for dashboard data
  const {
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleRefresh,
    totalGeneration,
    energyMix,
    yearlyTrends,
    comparisonData,
    getForecastData,
    getFastestGrowingSource,
    mixChartRef,
    trendChartRef,
    comparisonChartRef
  } = useDashboardSummary();

  // Calculate summary statistics
  const summaryStats = useMemo(() => 
    getSummaryStats(yearlyTrends),
    [yearlyTrends]
  );

  // Get forecast data for future projections
  const forecastData = useMemo(() => 
    getForecastData(),
    [getForecastData]
  );

  // Combined data for trend chart (historical + forecast)
  const combinedTrendData = useMemo(() => {
    if (yearlyTrends.length === 0) return [];
    return [...yearlyTrends, ...forecastData];
  }, [yearlyTrends, forecastData]);

  // Get the fastest growing renewable energy source
  const fastestGrowingSource = useMemo(() => 
    getFastestGrowingSource(),
    [getFastestGrowingSource]
  );

  // Get lines for each energy source with consistent colors
  const renderTrendLines = useMemo(() => {
    if (yearlyTrends.length === 0) return null;
    
    // Get all available energy sources from the data
    const firstDataPoint = yearlyTrends[0];
    const sources = Object.keys(firstDataPoint).filter(key => 
      key !== 'year' && key !== 'total'
    );
    
    return sources.map(source => (
      <Line
        key={source}
        type="monotone"
        dataKey={source}
        name={source}
        stroke={getSourceColor(source)}
        strokeWidth={2}
        dot={{ r: 3, fill: getSourceColor(source), stroke: 'white', strokeWidth: 1 }}
        activeDot={{ r: 5, fill: getSourceColor(source), stroke: 'white', strokeWidth: 2 }}
      />
    ));
  }, [yearlyTrends]);

  // Get the chart configuration for line chart
  const lineChartConfig = useMemo(() => 
    getLineChartConfig(),
    []
  );

  // Get the chart configuration for bar chart
  const barChartConfig = useMemo(() => 
    getBarChartConfig(),
    []
  );

  // Render skeleton loader during initial data fetch
  if (loading && yearlyTrends.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <Zap className="text-purple-500" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Renewable Energy Dashboard</h1>
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          </div>
        </div>
        <Card.Base className="mb-6 p-4 flex justify-center items-center h-96">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-200 rounded-full mb-4"></div>
            <div className="h-4 w-36 bg-purple-200 rounded mb-2"></div>
            <div className="h-3 w-24 bg-purple-200 rounded"></div>
          </div>
        </Card.Base>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-100">
            <Zap className="text-purple-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Renewable Energy Dashboard</h1>
            <p className="text-gray-500">Summary of all renewable energy generation sources</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
          onClick={handleRefresh}
        >
          <AppIcon name="refresh" size={18} />
          Refresh Data
        </Button>
      </div>

      {/* Year Range Filter Card */}
      <Card.Base className="mb-6 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={20} />
            <Typography variant="h6" className="text-gray-700">
              Filter Data By Year Range
            </Typography>
          </div>
          <div className="min-w-64">
            <YearPicker
              initialStartYear={selectedStartYear}
              initialEndYear={selectedEndYear}
              onStartYearChange={handleStartYearChange}
              onEndYearChange={handleEndYearChange}
            />
          </div>
        </div>
      </Card.Base>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Generation */}
        <Card.Base className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-purple-100">
              <Zap className="text-purple-500" size={18} />
            </div>
            <Typography variant="subtitle1" className="text-gray-700">
              Total Generation
            </Typography>
          </div>
          <div className="mt-2">
            <Typography variant="h4" className="font-bold text-purple-700">
              {formatNumber(totalGeneration)} GWh
            </Typography>
            {summaryStats?.overallGrowth && (
              <div className="flex items-center mt-1">
                <TrendingUp size={16} className={getChangeColor(summaryStats.overallGrowth)} />
                <Typography 
                  variant="body2" 
                  className={`ml-1 ${getChangeColor(summaryStats.overallGrowth)}`}
                >
                  {formatPercentage(summaryStats.overallGrowth)} since {summaryStats.startYear}
                </Typography>
              </div>
            )}
          </div>
        </Card.Base>

        {/* Leading Source */}
        <Card.Base className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-blue-100">
              <TrendingUp className="text-blue-500" size={18} />
            </div>
            <Typography variant="subtitle1" className="text-gray-700">
              Leading Source
            </Typography>
          </div>
          {summaryStats?.highestSource && (
            <div className="mt-2">
              <div className="flex items-center">
                {getEnergyIcon(summaryStats.highestSource)}
                <Typography variant="h5" className="ml-2 font-bold">
                  {summaryStats.highestSource}
                </Typography>
              </div>
              <Typography variant="h6" className="mt-1 text-gray-600">
                {formatNumber(summaryStats.highestValue)} GWh
              </Typography>
            </div>
          )}
        </Card.Base>

        {/* Fastest Growing */}
        <Card.Base className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-green-100">
              <TrendingUp className="text-green-500" size={18} />
            </div>
            <Typography variant="subtitle1" className="text-gray-700">
              Fastest Growing Source
            </Typography>
          </div>
          {fastestGrowingSource && (
            <div className="mt-2">
              <div className="flex items-center">
                {getEnergyIcon(fastestGrowingSource.source)}
                <Typography variant="h5" className="ml-2 font-bold">
                  {fastestGrowingSource.source}
                </Typography>
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp size={16} className={getChangeColor(fastestGrowingSource.percentChange)} />
                <Typography 
                  variant="body2" 
                  className={`ml-1 ${getChangeColor(fastestGrowingSource.percentChange)}`}
                >
                  {formatPercentage(fastestGrowingSource.percentChange)}
                </Typography>
              </div>
            </div>
          )}
        </Card.Base>

        {/* Forecast */}
        <Card.Base className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-amber-100">
              <Calendar className="text-amber-500" size={18} />
            </div>
            <Typography variant="subtitle1" className="text-gray-700">
              Forecast Growth
            </Typography>
          </div>
          {forecastData.length > 0 && (
            <div className="mt-2">
              <Typography variant="h5" className="font-bold text-amber-700">
                {formatNumber(forecastData[forecastData.length - 1].total)} GWh
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Projected by {forecastData[forecastData.length - 1].year}
              </Typography>
            </div>
          )}
        </Card.Base>
      </div>

      {/* Energy Mix Chart */}
      <Card.Base className="mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PieChartIcon className="text-purple-500" size={20} />
            <h2 className="text-lg font-medium">Energy Mix</h2>
          </div>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Current distribution of renewable energy generation sources
          </Typography>
        </div>
        <div className="p-6 h-80" ref={mixChartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={energyMix}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                dataKey="value"
                nameKey="label"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {energyMix.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || getSourceColor(entry.label)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value.toFixed(2)} GWh`, 'Generation']}
                labelFormatter={(name) => `Source: ${name}`}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card.Base>

      {/* Trend Chart */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} lg={8}>
          <Card.Base className="h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-500" size={20} />
                <h2 className="text-lg font-medium">Generation Trends & Forecast</h2>
              </div>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Historical generation data with future projections (dashed lines indicate forecasts)
              </Typography>
            </div>
            <div className="p-6 h-96" ref={trendChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedTrendData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    {...lineChartConfig.xAxis} 
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    {...lineChartConfig.yAxis} 
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip
                    formatter={lineChartConfig.tooltip.formatter}
                    labelFormatter={lineChartConfig.tooltip.labelFormatter}
                  />
                  <Legend verticalAlign="top" height={36} />
                  {renderTrendLines}
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Generation"
                    stroke="#9333EA"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#9333EA", stroke: 'white', strokeWidth: 1 }}
                    activeDot={{ r: 6, fill: "#9333EA", stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Base>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card.Base className="h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <BarChart2 className="text-green-500" size={20} />
                <h2 className="text-lg font-medium">Year-over-Year Comparison</h2>
              </div>
              <Typography variant="body2" className="text-gray-500 mt-1">
                Current year compared to previous year by source
              </Typography>
            </div>
            <div className="p-6 h-96" ref={comparisonChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={comparisonData} 
                  margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                  barGap={2}
                  barCategoryGap={16}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    {...barChartConfig.xAxis} 
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    {...barChartConfig.yAxis} 
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip
                    formatter={barChartConfig.tooltip.formatter}
                    labelFormatter={barChartConfig.tooltip.labelFormatter}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar 
                    name={`Current (${comparisonData[0]?.currentYear})`}
                    dataKey="currentValue" 
                    fill="#9333EA" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  >
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || getSourceColor(entry.source)} />
                    ))}
                  </Bar>
                  <Bar 
                    name={`Previous (${comparisonData[0]?.prevYear})`}
                    dataKey="prevValue" 
                    fill="#D1D5DB" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Base>
        </Grid>
      </Grid>

      {/* Source Breakdown */}
      <Card.Base className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Zap className="text-purple-500" size={20} />
            <h2 className="text-lg font-medium">Renewable Energy Source Breakdown</h2>
          </div>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Details of each energy source and its contribution
          </Typography>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Generation</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change from Previous</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Projected Next Year</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {energyMix.map((source, index) => {
                const comparison = comparisonData.find(c => c.source === source.label);
                const forecast = forecastData.length > 0 ? forecastData[0][source.label] : 0;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                          {getEnergyIcon(source.label)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{source.label}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {formatNumber(source.value)} GWh
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {source.percentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {comparison && (
                        <span className={getChangeColor(comparison.percentChange)}>
                          {formatPercentage(comparison.percentChange)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {forecast ? `${formatNumber(forecast)} GWh` : '-'}
                    </td>
                  </tr>
                );
              })}
              {/* Total row */}
              <tr className="bg-purple-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                      <Zap className="text-purple-500" size={18} />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-bold text-gray-900">Total</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                  {formatNumber(totalGeneration)} GWh
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                  100.0%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                  {summaryStats?.overallGrowth && (
                    <span className={getChangeColor(summaryStats.overallGrowth)}>
                      {formatPercentage(summaryStats.overallGrowth)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                  {forecastData.length > 0 ? `${formatNumber(forecastData[0].total)} GWh` : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card.Base>

      {/* Data Sources Note */}
      <div className="text-center text-gray-500 text-sm mt-8 mb-4">
        <p>Data sourced from individual renewable energy analytics modules</p>
        <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default EnergyDashboard;