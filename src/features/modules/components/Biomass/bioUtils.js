import jsPDF from 'jspdf';
import 'jspdf-autotable';

// PDF Generation
export const downloadSummary = (generationData) => {
  const doc = new jsPDF();
  doc.text('Biomass Power Generation Summary', 14, 16);
  doc.autoTable({
    head: [['Year', 'Predicted Production (GWh)']],
    body: generationData.map(item => [item.date, item.value]),
    startY: 20,
  });
  doc.save('Biomass_Power_Generation_Summary.pdf');
};

// Area Chart Configuration (Main Generation Chart)
export const getAreaChartConfig = (theme) => ({
  gradient: {
    id: 'biomassGradient',
    stops: [
      { offset: '5%', color: '#16A34A', opacity: 0.2 },
      { offset: '95%', color: '#16A34A', opacity: 0.05 }
    ]
  },
  area: {
    type: 'monotone',
    dataKey: 'value',
    stroke: '#16A34A',
    fill: 'url(#biomassGradient)',
    strokeWidth: 2,
    dot: {
      r: 4,
      fill: '#16A34A'
    },
    activeDot: {
      r: 6,
      fill: '#16A34A'
    }
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  }
});

// Line Chart Configuration (Feedstock Chart)
export const getLineChartConfig = () => ({
  agricultural: {
    type: 'monotone',
    dataKey: 'agricultural',
    name: 'Agricultural',
    stroke: '#16A34A',
    strokeWidth: 2,
    dot: { 
      r: 4,
      fill: '#16A34A' 
    },
    activeDot: {
      r: 6,
      fill: '#16A34A'
    }
  },
  forestry: {
    type: 'monotone',
    dataKey: 'forestry',
    name: 'Forestry',
    stroke: '#0EA5E9',
    strokeWidth: 2,
    dot: { 
      r: 4,
      fill: '#0EA5E9' 
    },
    activeDot: {
      r: 6,
      fill: '#0EA5E9'
    }
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  }
});

// Bar Chart Configuration (Efficiency Chart)
export const getBarChartConfig = () => ({
  bar: {
    dataKey: 'efficiency',
    fill: '#16A34A',
    radius: [4, 4, 0, 0],
    opacity: 0.8
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  }
});

// Grid Configuration
export const getGridConfig = () => ({
  cartesianGrid: {
    strokeDasharray: '3 3',
    vertical: false,
    stroke: '#e5e7eb'
  },
  xAxis: {
    stroke: '#6b7280',
    tickLine: true,
    fontSize: 12,
    tickMargin: 12
  },
  yAxis: {
    stroke: '#6b7280',
    tickLine: true,
    fontSize: 12,
    tickMargin: 12
  }
});

// Metric Card Data
export const getMetricCardData = (currentProjection) => [
  {
    title: 'Total Generation',
    value: '95.2 MWh',
    subtitle: 'Monthly total'
  },
  {
    title: 'Feedstock Usage',
    value: '5,200 tons',
    subtitle: 'Current stock'
  },
  {
    title: 'Conversion Rate',
    value: '82.3%',
    subtitle: 'Average efficiency'
  }
];