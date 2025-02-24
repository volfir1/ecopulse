// windUtil.js
import { theme } from '@shared/index';
const { elements, text, background, divider } = theme.palette;
const { wind, solar } = elements;

export const getAreaChartConfig = () => ({
  gradient: {
    stops: [
      { offset: '5%', color: wind, opacity: 0.3 },
      { offset: '95%', color: wind, opacity: 0 }
    ]
  },
  area: {
    type: 'monotone',
    dataKey: 'value',
    stroke: wind,
    fill: 'url(#windGradient)',
    strokeWidth: 2,
    dot: {
      r: 4,
      fill: wind,
      stroke: '#FFFFFF',
      strokeWidth: 2
    },
    activeDot: {
      r: 6,
      stroke: '#FFFFFF',
      strokeWidth: 2
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