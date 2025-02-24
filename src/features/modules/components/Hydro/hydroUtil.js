// hydroUtils.js
import { theme } from '@shared/index';
const { elements, text, background, divider } = theme.palette;
const { hydropower, wind } = elements;

export const getAreaChartConfig = () => ({
  gradient: {
    stops: [
      { offset: '5%', color: '#4FA2EA', opacity: 0.3 },  // Lighter hydropower color
      { offset: '95%', color: '#4FA2EA', opacity: 0 }
    ]
  },
  area: {
    type: 'monotone',
    dataKey: 'value',
    stroke: '#2E90E5',  // Hydropower primary color
    fill: 'url(#hydroGradient)',
    strokeWidth: 2,
    dot: {
      r: 4,
      fill: '#2E90E5',
      strokeWidth: 2,
      stroke: '#FFFFFF'
    }
  },
  tooltip: {
    contentStyle: {
      backgroundColor: background.paper,
      border: `1px solid ${divider}`,
      borderRadius: '6px'
    }
  }
});

export const getLineChartConfig = () => ({
  lines: [
    {
      type: 'monotone',
      dataKey: 'flow',
      name: 'Water Flow',
      stroke: hydropower,
      strokeWidth: 2,
      dot: { fill: hydropower }
    },
    {
      type: 'monotone',
      dataKey: 'generation',
      name: 'Generation',
      stroke: wind,
      strokeWidth: 2,
      dot: { fill: wind }
    }
  ],
  tooltip: {
    contentStyle: {
      backgroundColor: background.paper,
      border: `1px solid ${divider}`,
      borderRadius: '6px'
    }
  }
});

export const getBarChartConfig = () => ({
  bar: {
    dataKey: 'efficiency',
    fill: hydropower,
    radius: [4, 4, 0, 0]
  },
  tooltip: {
    contentStyle: {
      backgroundColor: background.paper,
      border: `1px solid ${divider}`,
      borderRadius: '6px'
    }
  }
});

export const getGridConfig = () => ({
  cartesianGrid: {
    strokeDasharray: '3 3',
    stroke: '#e5e7eb'
  },
  xAxis: {
    stroke: text.secondary,
    tick: { fill: text.secondary }
  },
  yAxis: {
    stroke: text.secondary,
    tick: { fill: text.secondary }
  }
});