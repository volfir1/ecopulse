// geoUtils.js
import { theme } from '@shared/index';
const { elements, text, background, divider } = theme.palette;
const { geothermal, solar } = elements;

export const getAreaChartConfig = () => ({
  gradient: {
    stops: [
      { offset: '5%', color: '#FF8B8B', opacity: 0.3 },  // Lighter geothermal color
      { offset: '95%', color: '#FF8B8B', opacity: 0 }
    ]
  },
  area: {
    type: 'monotone',
    dataKey: 'value',
    stroke: '#FF6B6B',  // Geothermal primary color
    fill: 'url(#geothermalGradient)',
    strokeWidth: 2,
    dot: {
      r: 4,
      fill: '#FF6B6B',
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
      dataKey: 'surface',
      name: 'Surface Temperature',
      stroke: geothermal,
      strokeWidth: 2,
      dot: { fill: geothermal }
    },
    {
      type: 'monotone',
      dataKey: 'deep',
      name: 'Deep Well Temperature',
      stroke: solar,
      strokeWidth: 2,
      dot: { fill: solar }
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
    dataKey: 'pressure',
    fill: geothermal,
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