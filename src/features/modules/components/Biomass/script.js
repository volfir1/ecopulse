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
    stroke: "#16A34A",
    fill: "url(#biomassGradient)",
    strokeWidth: 2,
    dot: true,
    activeDot: { r: 6, fill: "#16A34A" },
    type: curveMonotoneX
  },
  gradient: {
    colors: [
      { offset: "0%", color: "rgba(22, 163, 74, 0.2)" },
      { offset: "100%", color: "rgba(22, 163, 74, 0.05)" }
    ]
  }
});

export const getFeedstockConfig = (data, startYear, endYear) => ({
  xAxis: baseAxisConfig(startYear, endYear),
  yAxis: {
    tickLine: true,
    axisLine: true,
    label: { 
      value: 'Feedstock Usage (tons)', 
      angle: -90, 
      position: 'insideLeft',
      offset: -5
    },
    stroke: '#374151'
  },
  line: {
    type: curveMonotoneX,
    dataKey: "feedstock",
    stroke: "#16A34A",
    strokeWidth: 2,
    dot: true,
    activeDot: { r: 6, fill: "#16A34A" }
  }
});

export const getEfficiencyConfig = (data, startYear, endYear) => ({
  xAxis: baseAxisConfig(startYear, endYear),
  yAxis: {
    tickLine: true,
    axisLine: true,
    domain: [70, 100],
    label: { 
      value: 'Conversion Efficiency (%)', 
      angle: -90, 
      position: 'insideLeft',
      offset: -5
    },
    stroke: '#374151'
  },
  line: {
    type: curveMonotoneX,
    dataKey: "efficiency",
    stroke: "#15803D",
    strokeWidth: 3,
    dot: true,
    activeDot: { r: 6, fill: "#15803D" }
  },
  bar: {
    dataKey: "efficiency",
    fill: "#16A34A20",
    barSize: 20,
    radius: [4, 4, 0, 0]
  }
});