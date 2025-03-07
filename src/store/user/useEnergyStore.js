import { create } from 'zustand';
import api from '@features/modules/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Import your logo files directly
import companyLogo from '@assets/images/logo.png';
import schoolLogo from '@assets/images/tup_logo.png';

// Create a factory function that will generate a store for each energy type
const createEnergyStore = (energyType) => {
  // Define config based on energy type
  const configs = {
    solar: {
      color: '#FFB800', // Solar yellow
      endpoint: '/api/predictions/solar/',
      fileName: 'Solar_Power_Generation_Summary.pdf',
      title: 'Solar Power Generation Chart',
      tableTitle: 'Solar Power Generation Data Table',
      recommendations: [
        "Invest in additional solar panel infrastructure to capitalize on the projected growth trend.",
        "Develop energy storage solutions to address intermittency challenges.",
        "Evaluate technological upgrades to improve solar capture efficiency.",
        "Consider strategic placement of new solar installations based on irradiance data."
      ],
      // Solar-specific formatting
      pdfStyles: {
        fillColor: [255, 180, 0], // Sunny yellow/orange for solar theme
        lightFill: [252, 248, 227] // Light yellow for alternate rows
      }
    },
    hydro: {
      color: '#2E90E5', // Hydro blue
      endpoint: '/api/predictions/hydro/',
      fileName: 'Hydropower_Generation_Summary.pdf',
      title: 'Hydropower Generation Chart',
      tableTitle: 'Hydropower Generation Data Table',
      recommendations: [
        "Implement advanced water flow monitoring systems to optimize reservoir management.",
        "Invest in turbine efficiency upgrades to increase power output during peak seasons.",
        "Develop comprehensive drought contingency plans for low-water periods.",
        "Explore hybrid renewable integration to balance seasonal hydropower fluctuations."
      ],
      // Hydro-specific formatting
      pdfStyles: {
        fillColor: [46, 144, 229], // Blue color for hydro theme
        lightFill: [235, 245, 255] // Light blue for alternate rows
      }
    },
    wind: {
      color: '#64748B', // Wind slate
      endpoint: '/api/predictions/wind/',
      fileName: 'Wind_Power_Generation_Summary.pdf',
      title: 'Wind Power Generation Chart',
      tableTitle: 'Wind Power Generation Data Table',
      recommendations: [
        "Invest in advanced turbine technology to improve efficiency in varying wind conditions.",
        "Develop more sophisticated wind forecasting systems to optimize generation scheduling.",
        "Implement smart grid integration to better manage intermittency challenges.",
        "Explore hybrid wind-storage solutions to enhance reliability and grid stability."
      ],
      // Wind-specific formatting
      pdfStyles: {
        fillColor: [100, 116, 139], // Slate color for wind theme
        lightFill: [240, 244, 248] // Light slate for alternate rows
      }
    },
    biomass: {
      color: '#16A34A', // Biomass green
      endpoint: '/api/predictions/biomass/',
      fileName: 'Biomass_Power_Generation_Summary.pdf',
      title: 'Biomass Generation Chart',
      tableTitle: 'Biomass Generation Data Table',
      recommendations: [
        "Invest in additional processing capacity to handle the projected increase.",
        "Develop partnerships with agricultural suppliers to ensure consistent feedstock availability.",
        "Evaluate efficiency improvements to current generation facilities.",
        "Consider expanding storage capabilities to manage seasonal fluctuations."
      ],
      // Biomass-specific formatting
      pdfStyles: {
        fillColor: [22, 163, 74], // Green for biomass theme
        lightFill: [240, 248, 240] // Light green for alternate rows
      }
    },
    // Add geothermal configuration
    geothermal: {
      color: '#FF6B6B', // Geothermal red
      endpoint: '/api/predictions/geothermal/',
      fileName: 'Geothermal_Power_Generation_Summary.pdf',
      title: 'Geothermal Generation Chart',
      tableTitle: 'Geothermal Generation Data Table',
      recommendations: [
        "Optimize well management and resource extraction to maximize long-term sustainability.",
        "Implement advanced heat exchange technologies to increase efficiency.",
        "Develop enhanced geothermal systems (EGS) for areas with lower natural temperatures.",
        "Explore cascade applications to utilize residual heat in multiple processes."
      ],
      // Geothermal-specific formatting
      pdfStyles: {
        fillColor: [255, 107, 107], // Red for geothermal theme
        lightFill: [255, 235, 235] // Light red for alternate rows
      }
    }
  };

  // Get the configuration for the specified energy type
  const config = configs[energyType] || configs.solar; // Default to solar if type not found

  return create((set, get) => ({
    // State
    energyType,
    config,
    generationData: [],
    currentProjection: null,
    loading: true,
    selectedStartYear: new Date().getFullYear(),
    selectedEndYear: new Date().getFullYear() + 1,
    chartRef: null,
    additionalData: {}, // For energy-type specific data
    
    // Set chart reference
    setChartRef: (ref) => set({ chartRef: ref }),
    
    // Actions
    setYearRange: (startYear, endYear) => {
      set({ selectedStartYear: startYear, selectedEndYear: endYear });
      // Fetch new data with updated years
      get().fetchData(startYear, endYear);
    },
    
    // Fetch data method
    fetchData: async (startYear, endYear) => {
      // Update state to show loading
      set({ loading: true });
      
      try {
        // Make API request to the appropriate endpoint for this energy type
        const response = await api.get(`${config.endpoint}?start_year=${startYear}&end_year=${endYear}`);
        const data = response.data.predictions;
        
        // Format the data
        const formattedData = data.map(item => ({
          date: item.Year,
          value: item['Predicted Production']
        }));
        
        // Calculate current projection
        const projection = formattedData.length > 0 
          ? formattedData[formattedData.length - 1].value
          : null;
        
        // Additional data processing based on energy type
        let additionalData = {};
        
        if (energyType === 'hydro') {
          // Hydro-specific data
          additionalData = {
            waterFlowData: response.data.water_flow || get().getWaterFlowData(),
            turbineEfficiency: response.data.efficiency || get().getTurbineEfficiency()
          };
        } else if (energyType === 'solar') {
          // Solar-specific data
          additionalData = {
            irradianceData: response.data.irradiance || get().getSolarIrradianceData(),
            panelPerformance: response.data.performance || get().getPanelPerformance()
          };
        } else if (energyType === 'wind') {
          // Wind-specific data
          additionalData = {
            windSpeedData: response.data.wind_speed || get().getWindSpeedData(),
            turbinePerformance: response.data.turbine_data || get().getTurbinePerformance()
          };
        } else if (energyType === 'biomass') {
          // Biomass-specific data
          additionalData = {
            feedstockData: response.data.feedstock || get().getFeedstockData(),
            efficiencyData: response.data.efficiency || get().getEfficiencyData()
          };
        } else if (energyType === 'geothermal') {
          // Geothermal-specific data
          additionalData = {
            temperatureData: response.data.temperature || get().getTemperatureData(),
            wellPerformance: response.data.wells || get().getWellPerformance()
          };
        }
        
        // Update state with new data
        set({ 
          generationData: formattedData,
          currentProjection: projection,
          additionalData,
          loading: false
        });
      } catch (error) {
        console.error(`Error fetching ${energyType} data:`, error);
        set({ loading: false });
      }
    },
    
    // Initialize data - call this when component mounts
    initialize: () => {
      const { selectedStartYear, selectedEndYear, fetchData } = get();
      fetchData(selectedStartYear, selectedEndYear);
    },
    
    // Mock data methods for each energy type
    // These will be used if API doesn't return specific data
    
    // Solar mock data
    getSolarIrradianceData: () => Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      irradiance: 800 + Math.sin(i * 0.8) * 200 + Math.random() * 100,
      power: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400
    })),
    
    getPanelPerformance: () => Array.from({ length: 6 }, (_, i) => ({
      array: `Array ${i + 1}`,
      efficiency: 95 + Math.sin(i * 0.5) * 3 + Math.random() * 2,
      output: 2500 + Math.sin(i * 0.5) * 300 + Math.random() * 200
    })),
    
    // Hydro mock data
    getWaterFlowData: () => Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      flow: 4200 + Math.sin(i * 0.8) * 800 + Math.random() * 400,
      generation: 3800 + Math.sin(i * 0.8) * 600 + Math.random() * 300
    })),
    
    getTurbineEfficiency: () => Array.from({ length: 8 }, (_, i) => ({
      turbine: `T${i + 1}`,
      efficiency: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
      output: 2800 + Math.sin(i * 0.7) * 400 + Math.random() * 200
    })),
    
    // Wind mock data
    getWindSpeedData: () => Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      speed: 15 + Math.sin(i * 0.8) * 5 + Math.random() * 3,
      power: 3500 + Math.sin(i * 0.8) * 800 + Math.random() * 500
    })),
    
    getTurbinePerformance: () => Array.from({ length: 6 }, (_, i) => ({
      turbine: `Turbine ${i + 1}`,
      efficiency: 92 + Math.sin(i * 0.7) * 5 + Math.random() * 3,
      output: 2200 + Math.sin(i * 0.6) * 400 + Math.random() * 200
    })),
    
    // Biomass mock data
    getFeedstockData: () => Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      agricultural: 2800 + Math.sin(i * 0.8) * 500 + Math.random() * 300,
      forestry: 2200 + Math.cos(i * 0.8) * 400 + Math.random() * 250
    })),
    
    getEfficiencyData: () => Array.from({ length: 6 }, (_, i) => ({
      source: ['Wood', 'Crop', 'Waste', 'Biogas', 'Pellets', 'Other'][i],
      efficiency: 75 + Math.sin(i * 0.7) * 15 + Math.random() * 10,
      output: 2400 + Math.sin(i * 0.6) * 500 + Math.random() * 300
    })),
    
    // Geothermal mock data
    getTemperatureData: () => Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      temperature: 220 + Math.sin(i * 0.3) * 30 + Math.random() * 15,
      output: 3200 + Math.sin(i * 0.3) * 500 + Math.random() * 250
    })),
    
    getWellPerformance: () => Array.from({ length: 5 }, (_, i) => ({
      well: `Well ${i + 1}`,
      temperature: 240 + Math.sin(i * 0.6) * 40 + Math.random() * 20,
      pressure: 85 + Math.sin(i * 0.4) * 10 + Math.random() * 5,
      output: 2600 + Math.sin(i * 0.5) * 400 + Math.random() * 300
    })),
    
    // Handle download with PDF generation
    handleDownload: async (toast) => {
      const { 
        generationData, 
        selectedStartYear, 
        selectedEndYear, 
        currentProjection, 
        chartRef,
        config
      } = get();
      
      try {
        if (toast) toast.info('Preparing your download...');
        
        // Create new PDF document
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
    
        // Document dimensions for reference
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // 1) HEADER BACKGROUND (using energy-specific color)
        const headerHeight = 30;
        doc.setFillColor(...config.pdfStyles.fillColor); // Energy-specific color
        doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
        // 2) ADD LOGOS
        // Add company logo on the left
        doc.addImage(companyLogo, 'PNG', 15, 5, 20, 20);
        
        // Add school logo on the right
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
        if (chartRef && chartRef.current) {
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
            const chartTitleText = config.title;
            const chartTitleWidth = doc.getStringUnitWidth(chartTitleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const chartTitleX = (pageWidth - chartTitleWidth) / 2;
            doc.text(chartTitleText, chartTitleX, yPosition);
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
        const tableTitleText = config.tableTitle;
        const tableTitleWidth = doc.getStringUnitWidth(tableTitleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const tableTitleX = (pageWidth - tableTitleWidth) / 2;
        doc.text(tableTitleText, tableTitleX, yPosition);
        yPosition += 8;
    
        // Table with properly sized columns
        doc.autoTable({
          head: [['Year', 'Predicted Production (GWh)']],
          body: generationData.map(item => [item.date, item.value.toFixed(2)]),
          startY: yPosition,
          margin: { left: 30, right: 30 }, // Reduced margins for wider table
          headStyles: { 
            fillColor: config.pdfStyles.fillColor, // Match energy theme
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
            fillColor: config.pdfStyles.lightFill // Light color for alternate rows
          }
        });
    
        // 10) RECOMMENDATIONS SECTION
        yPosition = doc.autoTable.previous.finalY + 15;
        
        // Determine if we need to add a page break
        if (yPosition > pageHeight - 140) {
          // Add a new page if there's not enough space
          doc.addPage();
          yPosition = 20;
        }
        
        // Energy-themed header bar for RECOMMENDATIONS
        doc.setFillColor(...config.pdfStyles.fillColor);
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
        doc.setDrawColor(...config.pdfStyles.fillColor);
        doc.setLineWidth(0.5);
        doc.line(15, yPosition, pageWidth - 15, yPosition);
        yPosition += 10;
        
        // Introduction text
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.text(`Based on the projected increase in ${energyType} power generation, we recommend:`, 20, yPosition);
        doc.setFont(undefined, 'normal');
        
        yPosition += 10;
        
        // Energy-specific recommendations
        const recommendations = config.recommendations;
        
        recommendations.forEach((rec) => {
          // Colored bullet points matching energy theme
          doc.setFillColor(...config.pdfStyles.fillColor);
          doc.circle(20, yPosition - 1, 2, 'F');
          
          // Recommendation text
          doc.setFontSize(9);
          doc.text(rec, 25, yPosition);
          yPosition += 8;
        });
        
        yPosition += 7;
        
        // Add horizontal line for footer
        doc.setDrawColor(...config.pdfStyles.fillColor);
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
        
        // Generic sources that can be customized per energy type if needed
        doc.text(`1. Placeholder source for ${energyType} data`, 20, yPosition + 7);
        doc.text("2. Placeholder source for prediction models", 20, yPosition + 14);
        
        doc.text("3. Placeholder source for efficiency calculation", 20 + colWidth, yPosition + 7);
        doc.text("4. Placeholder source for energy conversion factors", 20 + colWidth, yPosition + 14);
    
        // Add small logo at the footer
        doc.addImage(companyLogo, 'PNG', pageWidth - 25, yPosition + 5, 15, 15);
        
        // Copyright notice
        doc.setFontSize(7);
        const copyrightText = `© ${new Date().getFullYear()} Ecopulse. All rights reserved.`;
        const copyrightWidth = doc.getStringUnitWidth(copyrightText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const copyrightX = (pageWidth - copyrightWidth) / 2;
        doc.text(copyrightText, copyrightX, yPosition + 22);
    
        // Final check for page overflow
        if (yPosition > pageHeight - 30) {
          doc.addPage();
        }
        
        // Save the PDF
        doc.save(config.fileName);
        if (toast) toast.success('Summary downloaded successfully!');
        
        return { success: true };
      } catch (error) {
        console.error('Download error:', error);
        if (toast) toast.error('Failed to download summary. Please try again.');
        return { success: false, error };
      }
    }
  }));
};

// Export the factory function
export default createEnergyStore;