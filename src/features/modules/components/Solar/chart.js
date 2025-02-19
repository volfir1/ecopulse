import { curveMonotoneX } from 'd3-shape';

export const getAreaChartConfig = (data, years, startYear, endYear) => {
  const getAllYears = () => {
    const start = parseInt(startYear.format('YYYY'));
    const end = parseInt(endYear.format('YYYY'));
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year.toString());
    }
    return years;
  };

  return {
    xAxis: {
      dataKey: "year",
      type: "category",
      tickLine: true,
      axisLine: true,
      ticks: getAllYears(),
      angle: -45,
      textAnchor: 'end',
      height: 120,
      interval: 0,
      fontSize: 12,
      stroke: '#374151',
      dy: 16,
      dx: -8
    },
    yAxis: {
      tickLine: true,
      axisLine: true,
      label: { 
        value: 'Energy Generation (kWh)', 
        angle: -90, 
        position: 'insideLeft',
        offset: -5
      },
      stroke: '#374151'
    },
    area: {
      dataKey: "generation",
      stroke: "#EAB308",
      fill: "url(#solarGradient)",
      strokeWidth: 2,
      dot: true,
      activeDot: { r: 6, fill: "#EAB308" },
      type: curveMonotoneX
    },
    gradient: {
      id: "solarGradient",
      colors: [
        { offset: "0%", color: "rgba(234, 179, 8, 0.2)" },
        { offset: "100%", color: "rgba(234, 179, 8, 0.05)" }
      ]
    }
  };
};

export const getEfficiencyChartConfig = (data, years, startYear, endYear) => {
  const getAllYears = () => {
    const start = parseInt(startYear.format('YYYY'));
    const end = parseInt(endYear.format('YYYY'));
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year.toString());
    }
    return years;
  };

  return {
    xAxis: {
      dataKey: "year",
      type: "category",
      tickLine: true,
      axisLine: true,
      ticks: getAllYears(),
      angle: -45,
      textAnchor: 'end',
      height: 120,
      interval: 0,
      fontSize: 12,
      stroke: '#374151',
      dy: 16,
      dx: -8
    },
    yAxis: {
      tickLine: true,
      axisLine: true,
      domain: [80, 100],
      label: { 
        value: 'Efficiency (%)', 
        angle: -90, 
        position: 'insideLeft',
        offset: -5
      },
      stroke: '#374151'
    },
    line: {
      dataKey: "efficiency",
      stroke: "#22C55E",
      strokeWidth: 3,
      dot: true,
      type: curveMonotoneX,
      activeDot: { r: 6, fill: "#22C55E" }
    }
  };
};