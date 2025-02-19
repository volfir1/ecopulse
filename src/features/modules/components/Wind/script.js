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

export const getWindGenerationConfig = (data, startYear, endYear) => ({
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
    stroke: "#0EA5E9",
    fill: "url(#windGradient)",
    strokeWidth: 2,
    dot: true,
    activeDot: { r: 6, fill: "#0EA5E9" },
    type: curveMonotoneX
  },
  gradient: {
    colors: [
      { offset: "0%", color: "rgba(14, 165, 233, 0.2)" },
      { offset: "100%", color: "rgba(14, 165, 233, 0.05)" }
    ]
  }
});

export const getWindSpeedConfig = (data, startYear, endYear) => ({
  xAxis: baseAxisConfig(startYear, endYear),
  yAxis: {
    tickLine: true,
    axisLine: true,
    label: { 
      value: 'Wind Speed (m/s)', 
      angle: -90, 
      position: 'insideLeft',
      offset: -5
    },
    stroke: '#374151'
  },
  line: {
    type: curveMonotoneX,
    dataKey: "windSpeed",
    stroke: "#0EA5E9",
    strokeWidth: 2,
    dot: true,
    activeDot: { r: 6, fill: "#0EA5E9" }
  }
});

export const getEfficiencyConfig = (data, startYear, endYear) => ({
  xAxis: baseAxisConfig(startYear, endYear),
  yAxis: {
    tickLine: true,
    axisLine: true,
    domain: [70, 100],
    label: { 
      value: 'Turbine Efficiency (%)', 
      angle: -90, 
      position: 'insideLeft',
      offset: -5
    },
    stroke: '#374151'
  },
  line: {
    type: curveMonotoneX,
    dataKey: "efficiency",
    stroke: "#0284C7",
    strokeWidth: 3,
    dot: true,
    activeDot: { r: 6, fill: "#0284C7" }
  },
  bar: {
    dataKey: "efficiency",
    fill: "#0284C720",
    barSize: 20,
    radius: [4, 4, 0, 0]
  }
});