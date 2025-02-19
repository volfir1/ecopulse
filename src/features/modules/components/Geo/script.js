import { curveMonotoneX } from 'd3-shape';

const getAllYears = (startYear, endYear) => {
  const start = parseInt(startYear.format('YYYY'));
  const end = parseInt(endYear.format('YYYY'));
  const years = [];
  for (let year = start; year <= end; year++) {
    years.push(year.toString());
  }
  return years;
};

const baseAxisConfig = (startYear, endYear) => ({
  dataKey: "year",
  type: "category",
  allowDuplicatedCategory: false,
  ticks: getAllYears(startYear, endYear),
  tickFormatter: (value) => value,
  angle: -45,
  textAnchor: 'end',
  height: 120,
  interval: 0,
  fontSize: 12,
  stroke: '#374151',
  dy: 16,
  dx: -8
});

export const getGenerationConfig = (data, startYear, endYear) => ({
  xAxis: baseAxisConfig(startYear, endYear),
  yAxis: {
    tickLine: true,
    axisLine: true,
    label: { 
      value: 'Energy Generation (MWh)', 
      angle: -90, 
      position: 'insideLeft',
      offset: -5
    },
    stroke: '#374151'
  },
  area: {
    dataKey: "generation",
    stroke: "#DC2626",
    fill: "url(#geothermalGradient)",
    strokeWidth: 2,
    dot: true,
    activeDot: { r: 6, fill: "#DC2626" },
    type: curveMonotoneX
  },
  gradient: {
    colors: [
      { offset: "0%", color: "rgba(220, 38, 38, 0.2)" },
      { offset: "100%", color: "rgba(220, 38, 38, 0.05)" }
    ]
  }
});

export const getTemperatureConfig = (data, startYear, endYear) => ({
  xAxis: baseAxisConfig(startYear, endYear),
  yAxis: {
    tickLine: true,
    axisLine: true,
    domain: [200, 300],
    label: { 
      value: 'Well Temperature (°C)', 
      angle: -90, 
      position: 'insideLeft',
      offset: -5
    },
    stroke: '#374151'
  },
  line: {
    type: curveMonotoneX,
    dataKey: "wellTemp",
    stroke: "#DC2626",
    strokeWidth: 2,
    dot: true,
    activeDot: { r: 6, fill: "#DC2626" }
  }
});

export const getEfficiencyConfig = (data, startYear, endYear) => ({
  xAxis: baseAxisConfig(startYear, endYear),
  yAxis: {
    tickLine: true,
    axisLine: true,
    domain: [80, 100],
    label: { 
      value: 'System Efficiency (%)', 
      angle: -90, 
      position: 'insideLeft',
      offset: -5
    },
    stroke: '#374151'
  },
  line: {
    type: curveMonotoneX,
    dataKey: "efficiency",
    stroke: "#B91C1C",
    strokeWidth: 3,
    dot: true,
    activeDot: { r: 6, fill: "#B91C1C" }
  },
  bar: {
    dataKey: "efficiency",
    fill: "#DC262620",
    barSize: 20,
    radius: [4, 4, 0, 0]
  }
});