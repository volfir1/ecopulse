// useEnergyAnalytics.js
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Import your logo files directly
import companyLogo from '@assets/images/logo.png';
import schoolLogo from '@assets/images/tup_logo.png';

// Energy source configuration
const ENERGY_SOURCES = {
  solar: {
    apiEndpoint: 'solar',
    title: 'Solar',
    color: { r: 255, g: 180, b: 0 }, // Yellow/orange
    lightColor: { r: 252, g: 248, b: 227 }, // Light yellow
    getMockData: () => ({
      dailyData: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        primaryMetric: 800 + Math.sin(i * 0.8) * 200 + Math.random() * 100, // irradiance
        powerOutput: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400
      })),
      performanceData: Array.from({ length: 6 }, (_, i) => ({
        unit: `Array ${i + 1}`,
        efficiency: 95 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
        output: 2500 + Math.sin(i * 0.5) * 300 + Math.random() * 200
      }))
    }),
    chartTitle: 'Solar Power Generation Chart',
    tableTitle: 'Solar Power Generation Data Table',
    primaryMetricName: 'Irradiance (W/m²)',
    recommendations: [
      "Invest in additional solar panel infrastructure to capitalize on the projected growth trend.",
      "Develop energy storage solutions to address intermittency challenges.",
      "Evaluate technological upgrades to improve solar capture efficiency.",
      "Consider strategic placement of new solar installations based on irradiance data."
    ],
    sources: [
      "Placeholder source for solar irradiance data",
      "Placeholder source for prediction models",
      "Placeholder source for efficiency calculation",
      "Placeholder source for energy conversion factors"
    ]
  },
  wind: {
    apiEndpoint: 'wind',
    title: 'Wind',
    color: { r: 100, g: 116, b: 139 }, // Slate blue
    lightColor: { r: 240, g: 244, b: 248 }, // Light slate
    getMockData: () => ({
      dailyData: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        primaryMetric: 15 + Math.sin(i * 0.8) * 5 + Math.random() * 3, // wind speed
        powerOutput: 3500 + Math.sin(i * 0.8) * 800 + Math.random() * 500
      })),
      performanceData: Array.from({ length: 6 }, (_, i) => ({
        unit: `Turbine ${i + 1}`,
        efficiency: 92 + Math.sin(i * 0.7) * 5 + Math.random() * 3,
        output: 2200 + Math.sin(i * 0.6) * 400 + Math.random() * 200
      }))
    }),
    chartTitle: 'Wind Power Generation Chart',
    tableTitle: 'Wind Power Generation Data Table',
    primaryMetricName: 'Wind Speed (m/s)',
    recommendations: [
      "Invest in advanced turbine technology to improve efficiency in varying wind conditions.",
      "Develop more sophisticated wind forecasting systems to optimize generation scheduling.",
      "Implement smart grid integration to better manage intermittency challenges.",
      "Explore hybrid wind-storage solutions to enhance reliability and grid stability."
    ],
    sources: [
      "Placeholder source for wind pattern data",
      "Placeholder source for turbine performance",
      "Placeholder source for efficiency models",
      "Placeholder source for capacity forecasts"
    ]
  },
  hydro: {
    apiEndpoint: 'hydro',
    title: 'Hydropower',
    color: { r: 46, g: 144, b: 229 }, // Blue
    lightColor: { r: 235, g: 245, b: 255 }, // Light blue
    getMockData: () => ({
      dailyData: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        primaryMetric: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400, // water flow
        powerOutput: 3800 + Math.sin(i * 0.8) * 600 + Math.random() * 300
      })),
      performanceData: Array.from({ length: 8 }, (_, i) => ({
        unit: `T${i + 1}`,
        efficiency: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
        output: 2800 + Math.sin(i * 0.7) * 400 + Math.random() * 200
      }))
    }),
    chartTitle: 'Hydropower Generation Chart',
    tableTitle: 'Hydropower Generation Data Table',
    primaryMetricName: 'Water Flow (m³/s)',
    recommendations: [
      "Implement advanced water flow monitoring systems to optimize reservoir management.",
      "Invest in turbine efficiency upgrades to increase power output during peak seasons.",
      "Develop comprehensive drought contingency plans for low-water periods.",
      "Explore hybrid renewable integration to balance seasonal hydropower fluctuations."
    ],
    sources: [
      "Placeholder source for water flow data",
      "Placeholder source for hydropower models",
      "Placeholder source for turbine efficiency",
      "Placeholder source for reservoir forecasts"
    ]
  },
  geothermal: {
    apiEndpoint: 'geothermal',
    title: 'Geothermal',
    color: { r: 255, g: 107, b: 107 }, // Red/orange
    lightColor: { r: 255, g: 240, b: 240 }, // Light red
    getMockData: () => ({
      dailyData: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        primaryMetric: 150 + Math.sin(i * 0.5) * 10 + Math.random() * 5, // surface temp
        secondaryMetric: 280 + Math.sin(i * 0.3) * 5 + Math.random() * 3 // deep temp
      })),
      performanceData: Array.from({ length: 6 }, (_, i) => ({
        unit: `Well ${i + 1}`,
        efficiency: 85 + Math.sin(i * 0.7) * 10 + Math.random() * 5,
        output: 2600 + Math.sin(i * 0.6) * 300 + Math.random() * 200
      }))
    }),
    chartTitle: 'Geothermal Power Generation Chart',
    tableTitle: 'Geothermal Power Generation Data Table',
    primaryMetricName: 'Temperature (°C)',
    recommendations: [
      "Invest in advanced drilling technologies to access deeper geothermal resources.",
      "Implement enhanced geothermal systems (EGS) to expand potential generation sites.",
      "Develop comprehensive thermal gradient mapping to identify new resource areas.",
      "Establish predictive maintenance protocols to maximize plant efficiency and uptime."
    ],
    sources: [
      "Placeholder source for thermal gradient data",
      "Placeholder source for geothermal models",
      "Placeholder source for well performance",
      "Placeholder source for resource assessment"
    ]
  },
  biomass: {
    apiEndpoint: 'biomass',
    title: 'Biomass',
    color: { r: 22, g: 163, b: 74 }, // Green
    lightColor: { r: 240, g: 240, b: 240 }, // Light gray
    getMockData: () => ({
      dailyData: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        primaryMetric: 2800 + Math.sin(i * 0.8) * 500 + Math.random() * 300, // agricultural
        secondaryMetric: 2200 + Math.cos(i * 0.8) * 400 + Math.random() * 250 // forestry
      })),
      performanceData: Array.from({ length: 6 }, (_, i) => ({
        unit: ['Wood', 'Crop', 'Waste', 'Biogas', 'Pellets', 'Other'][i],
        efficiency: 75 + Math.sin(i * 0.7) * 15 + Math.random() * 10,
        output: 2400 + Math.sin(i * 0.6) * 500 + Math.random() * 300
      }))
    }),
    chartTitle: 'Biomass Generation Chart',
    tableTitle: 'Biomass Generation Data Table',
    primaryMetricName: 'Feedstock (tons)',
    recommendations: [
      "Invest in additional processing capacity to handle the projected increase by 2030.",
      "Develop partnerships with agricultural suppliers to ensure consistent feedstock availability.",
      "Evaluate efficiency improvements to current generation facilities.",
      "Consider expanding storage capabilities to manage seasonal fluctuations."
    ],
    sources: [
      "Placeholder source for biomass data",
      "Placeholder source for prediction models",
      "Placeholder source for efficiency calculation",
      "Placeholder source for energy conversion factors"
    ]
  }
};

/**
 * Custom hook for energy analytics that works with all energy sources
 * @param {string} energySource - The energy source type ('solar', 'wind', 'hydro', 'geothermal', 'biomass')
 * @returns {object} State and functions for the energy analytics
 */
export const useEnergyAnalytics = (energySource) => {
  // Validate energy source
  if (!ENERGY_SOURCES[energySource]) {
    console.error(`Invalid energy source: ${energySource}. Using solar as default.`);
    energySource = 'solar';
  }

  const config = ENERGY_SOURCES[energySource];
  const toast = useSnackbar();
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);
  const chartRef = useRef(null);
  
  // Get source-specific mock data
  const mockData = config.getMockData();

  useEffect(() => {
    fetchData(selectedStartYear, selectedEndYear);
  }, [selectedStartYear, selectedEndYear, energySource]);

  const fetchData = (startYear, endYear) => {
    setLoading(true);
    api.get(`/api/predictions/${config.apiEndpoint}/?start_year=${startYear}&end_year=${endYear}`)
      .then(response => {
        const data = response.data.predictions;
        
        const formattedData = data.map(item => ({
          date: item.Year,
          value: item['Predicted Production']
        }));

        setGenerationData(formattedData);
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching ${energySource} data:`, error);
        toast.error(`Failed to fetch ${energySource} data`);
        setLoading(false);
      });
  };

  const handleStartYearChange = (year) => setSelectedStartYear(year);
  const handleEndYearChange = (year) => setSelectedEndYear(year);

  const handleDownload = useCallback(async () => {
    try {
      toast.info('Preparing your download...');
  
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
  
      // Document dimensions for reference
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // 1) HEADER BACKGROUND
      const headerHeight = 30;
      doc.setFillColor(config.color.r, config.color.g, config.color.b);
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
      // 2) ADD LOGOS
      doc.addImage(companyLogo, 'PNG', 15, 5, 20, 20);
      doc.addImage(schoolLogo, 'PNG', pageWidth - 35, 5, 20, 20);
  
      // 3) HEADER TEXT - CENTERED
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      
      // Calculate text width to center
      const titleText = 'Ecopulse';
      const titleWidth = doc.getStringUnitWidth(titleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(titleText, titleX, 17);
  
      // 4) DATE - CENTERED BELOW TITLE
      doc.setFontSize(11);
      const dateText = `Date Generated: ${new Date().toLocaleDateString()}`;
      const dateWidth = doc.getStringUnitWidth(dateText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const dateX = (pageWidth - dateWidth) / 2;
      doc.text(dateText, dateX, 25);
  
      // 5) SWITCH BACK TO BLACK TEXT AFTER HEADER
      doc.setTextColor(0, 0, 0);
  
      // 6) SPACING AFTER HEADER
      let yPosition = headerHeight + 15;
  
      // 7) METADATA (Year Range, Current Projection) - CENTERED
      doc.setFontSize(12);
      
      const yearRangeText = `Year Range: ${selectedStartYear} - ${selectedEndYear}`;
      const yearRangeWidth = doc.getStringUnitWidth(yearRangeText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const yearRangeX = (pageWidth - yearRangeWidth) / 2;
      doc.text(yearRangeText, yearRangeX, yPosition);
      yPosition += 8;
      
      const projectionText = `Current Projection: ${currentProjection ? currentProjection.toFixed(2) : 'N/A'} GWh`;
      const projectionWidth = doc.getStringUnitWidth(projectionText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const projectionX = (pageWidth - projectionWidth) / 2;
      doc.text(projectionText, projectionX, yPosition);
      yPosition += 15;
  
      // 8) CHART SECTION - CENTERED
      if (chartRef.current) {
        try {
          const chartElement = chartRef.current;
          const canvas = await html2canvas(chartElement, {
            scale: 2,
            useCORS: true,
            logging: false
          });
          const chartImageData = canvas.toDataURL('image/png');
  
          // Add title - centered
          doc.setFontSize(14);
          const chartTitleWidth = doc.getStringUnitWidth(config.chartTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
          const chartTitleX = (pageWidth - chartTitleWidth) / 2;
          doc.text(config.chartTitle, chartTitleX, yPosition);
          yPosition += 8;
  
          // Use wider chart that spans more of the page
          const chartWidth = 180; // Wider chart
          const chartX = (pageWidth - chartWidth) / 2;
          
          // Add the chart image
          doc.addImage(chartImageData, 'PNG', chartX, yPosition, chartWidth, 90);
          yPosition += 100; // move below chart
        } catch (chartError) {
          console.error('Error capturing chart:', chartError);
        }
      } else {
        // If there's no chart, add a table directly
        yPosition += 10;
      }
  
      // 9) TABLE SECTION - CENTERED
      doc.setFontSize(14);
      const tableTitleWidth = doc.getStringUnitWidth(config.tableTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const tableTitleX = (pageWidth - tableTitleWidth) / 2;
      doc.text(config.tableTitle, tableTitleX, yPosition);
      yPosition += 8;
  
      // Table with properly sized columns
      doc.autoTable({
        head: [['Year', 'Predicted Production (GWh)']],
        body: generationData.map(item => [item.date, item.value.toFixed(2)]),
        startY: yPosition,
        margin: { left: 30, right: 30 }, // Reduced margins for wider table
        headStyles: { 
          fillColor: [config.color.r, config.color.g, config.color.b],
          halign: 'center',
          fontSize: 11
        },
        columnStyles: {
          0: { cellWidth: 60, halign: 'center' },
          1: { cellWidth: 100, halign: 'center' }
        },
        styles: { 
          fontSize: 10, 
          cellPadding: 5,
          overflow: 'linebreak'
        },
        alternateRowStyles: {
          fillColor: [config.lightColor.r, config.lightColor.g, config.lightColor.b]
        }
      });
  
      // 10) RECOMMENDATIONS SECTION - MINIMAL VERSION
      yPosition = doc.autoTable.previous.finalY + 15;
      
      // Determine if we need to add a page break
      if (yPosition > pageHeight - 140) {
        // Add a new page if there's not enough space
        doc.addPage();
        yPosition = 20;
      }
      
      // Themed header bar for RECOMMENDATIONS
      doc.setFillColor(config.color.r, config.color.g, config.color.b);
      doc.rect(15, yPosition, pageWidth - 30, 20, 'F');
      
      // White text for RECOMMENDATIONS
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      const recTitleText = 'RECOMMENDATIONS';
      doc.text(recTitleText, pageWidth/2, yPosition + 13, { align: 'center' });
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      yPosition += 25;
      
      // Add a horizontal line below title
      doc.setDrawColor(config.color.r, config.color.g, config.color.b);
      doc.setLineWidth(0.5);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;
      
      // Introduction text
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.text(`Based on the projected increase in ${energySource} power generation, we recommend:`, 20, yPosition);
      doc.setFont(undefined, 'normal');
      
      yPosition += 10;
      
      // Source-specific recommendations
      config.recommendations.forEach((rec) => {
        // Colored bullet points
        doc.setFillColor(config.color.r, config.color.g, config.color.b);
        doc.circle(20, yPosition - 1, 2, 'F');
        
        // Recommendation text
        doc.setFontSize(9);
        doc.text(rec, 25, yPosition);
        yPosition += 8;
      });
      
      yPosition += 7;
      
      // Add horizontal line for footer
      doc.setDrawColor(config.color.r, config.color.g, config.color.b);
      doc.setLineWidth(0.5);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      
      // Add Sources label and content
      yPosition += 7;
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text("Sources:", 20, yPosition);
      doc.setFont(undefined, 'normal');
      
      // Two columns layout
      const colWidth = (pageWidth - 40) / 2;
      
      // Source-specific sources
      doc.text(`1. ${config.sources[0]}`, 20, yPosition + 7);
      doc.text(`2. ${config.sources[1]}`, 20, yPosition + 14);
      
      doc.text(`3. ${config.sources[2]}`, 20 + colWidth, yPosition + 7);
      doc.text(`4. ${config.sources[3]}`, 20 + colWidth, yPosition + 14);
      
      // Add small logo at the footer
      doc.addImage(companyLogo, 'PNG', pageWidth - 25, yPosition + 5, 15, 15);
      
      // Copyright notice
      doc.setFontSize(7);
      const copyrightText = `© ${new Date().getFullYear()} Ecopulse. All rights reserved.`;
      const copyrightWidth = doc.getStringUnitWidth(copyrightText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const copyrightX = (pageWidth - copyrightWidth) / 2;
      doc.text(copyrightText, copyrightX, yPosition + 22);
  
      // Save the PDF
      doc.save(`${config.title}_Power_Generation_Summary.pdf`);
      toast.success('Summary downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download summary. Please try again.');
    }
  }, [generationData, selectedStartYear, selectedEndYear, currentProjection, toast, chartRef, energySource, config]);

  return {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleDownload,
    chartRef,
    energyConfig: config,
    // Return source-specific mock data with consistent naming
    dailyData: mockData.dailyData,
    performanceData: mockData.performanceData
  };
};

export default useEnergyAnalytics;