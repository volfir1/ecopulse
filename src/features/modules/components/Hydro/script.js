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
    stroke: "#2563EB",
    fill: "url(#hydroGradient)",
    strokeWidth: 2,
    dot: true,
    activeDot: { r: 6, fill: "#2563EB" },
    type: curveMonotoneX
  },
  gradient: {
    colors: [
      { offset: "0%", color: "rgba(37, 99, 235, 0.2)" },
      { offset: "100%", color: "rgba(37, 99, 235, 0.05)" }
    ]
  }
});

export const getFlowConfig = (data, startYear, endYear) => ({
  xAxis: baseAxisConfig(startYear, endYear),
  yAxis: {
    tickLine: true,
    axisLine: true,
    label: { 
      value: 'Water Flow (m³/s)', 
      angle: -90, 
      position: 'insideLeft',
      offset: -5
    },
    stroke: '#374151'
  },
  line: {
    type: curveMonotoneX,
    dataKey: "flow",
    stroke: "#2563EB",
    strokeWidth: 2,
    dot: true,
    activeDot: { r: 6, fill: "#2563EB" }
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
    stroke: "#1D4ED8",
    strokeWidth: 3,
    dot: true,
    activeDot: { r: 6, fill: "#1D4ED8" }
  },
  bar: {
    dataKey: "efficiency",
    fill: "#2563EB20",
    barSize: 20,
    radius: [4, 4, 0, 0]
  }
});