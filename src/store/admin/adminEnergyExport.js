// adminEnergyExports.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Import your logo files directly
import companyLogo from '@assets/images/logo.png';
import schoolLogo from '@assets/images/tup_logo.png';

// Energy type configurations for PDF exports
const energyConfig = {
  solar: {
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
      fillColor: [255, 184, 0], // Sunny yellow/orange for solar theme
      lightFill: [252, 248, 227] // Light yellow for alternate rows
    }
  },
  hydro: {
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
  geothermal: {
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

/**
 * Export admin energy data to PDF with detailed formatting
 * @param {Object} options - Export options
 * @param {Array} options.data - Energy data to export
 * @param {string} options.energyType - Type of energy (solar, wind, etc.)
 * @param {string} options.title - PDF title
 * @param {string} options.filename - PDF filename
 * @param {Array} options.columns - Table columns configuration
 * @param {Array} options.chartData - Chart data for visualization
 * @param {Object} options.yearRange - Year range for filtering
 * @param {React.RefObject} options.chartRef - Reference to chart component
 * @param {Function} toast - Function to display toast notifications
 * @returns {Promise<Object>} Object with success status
 */
export const exportToPdf = async (options, toast) => {
  const {
    data = [],
    energyType = 'solar',
    title = '',
    filename = '',
    columns = [],
    chartData = [],
    yearRange = { startYear: new Date().getFullYear() - 5, endYear: new Date().getFullYear() },
    chartRef = null
  } = options;
  
  // Get the configuration for the specified energy type
  const config = energyConfig[energyType] || energyConfig.solar;
  
  try {
    if (toast) toast('Preparing your download...', { type: 'info' });
    
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
    try {
      // Add company logo on the left
      doc.addImage(companyLogo, 'PNG', 15, 5, 20, 20);
      
      // Add school logo on the right
      doc.addImage(schoolLogo, 'PNG', pageWidth - 35, 5, 20, 20);
    } catch (logoError) {
      console.warn('Could not add logos:', logoError);
      // Continue without logos
    }

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
    
    const yearRangeText = `Year Range: ${yearRange.startYear} - ${yearRange.endYear}`;
    const yearRangeWidth = doc.getStringUnitWidth(yearRangeText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const yearRangeX = (pageWidth - yearRangeWidth) / 2;
    doc.text(yearRangeText, yearRangeX, yPosition);
    yPosition += 8;
    
    // Calculate current projection based on latest data
    const sortedData = [...data].sort((a, b) => b.year - a.year);
    const latestData = sortedData.length > 0 ? sortedData[0] : null;
    const currentProjection = latestData ? 
      (typeof latestData.generation === 'number' ? 
        latestData.generation : 
        latestData.generation[energyType] || 0) : 
      null;
      
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

    // Prepare table headers and data
    let tableHeaders = [];
    let tableData = [];
    
    // If columns is an array, filter out action columns
    if (Array.isArray(columns)) {
      // Filter out action columns
      const dataColumns = columns.filter(col => col.id !== 'actions');
      
      // Extract headers from columns
      tableHeaders = dataColumns.map(col => col.label);
      
      // Prepare data rows
      tableData = data.map(item => {
        return dataColumns.map(col => {
          // Get value from item
          const value = item[col.id];
          
          // Format value using column format function if available
          if (col.format && typeof col.format === 'function') {
            return col.format(value, item);
          }
          
          return value?.toString() || '';
        });
      });
    } else {
      // Fallback if columns isn't an array - just use simple Year and Generation
      tableHeaders = ['Year', 'Generation (GWh)'];
      tableData = data.map(item => [
        item.year.toString(),
        typeof item.generation === 'number' 
          ? item.generation.toFixed(2) 
          : (item.generation[energyType] || 0).toFixed(2)
      ]);
    }

    // Create the table with headers and data
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: yPosition,
      margin: { left: 30, right: 30 }, // Reduced margins for wider table
      headStyles: { 
        fillColor: config.pdfStyles.fillColor, // Match energy theme
        halign: 'center',
        fontSize: 11,
        textColor: [255, 255, 255]
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
      doc.text(rec, 25, yPosition, { maxWidth: pageWidth - 50 });
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
    try {
      doc.addImage(companyLogo, 'PNG', pageWidth - 25, yPosition + 5, 15, 15);
    } catch (logoError) {
      console.warn('Could not add footer logo:', logoError);
    }
    
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
    doc.save(filename || config.fileName);
    if (toast) toast('Summary downloaded successfully!', { type: 'success' });
    
    return { success: true };
  } catch (error) {
    console.error('Download error:', error);
    if (toast) toast('Failed to download summary. Please try again.', { type: 'error' });
    return { success: false, error };
  }
};

/**
 * Create exporter functions for each energy type
 */
export const exportSolarToPdf = (options, toast) => 
  exportToPdf({ ...options, energyType: 'solar' }, toast);

export const exportHydroToPdf = (options, toast) => 
  exportToPdf({ ...options, energyType: 'hydro' }, toast);

export const exportWindToPdf = (options, toast) => 
  exportToPdf({ ...options, energyType: 'wind' }, toast);

export const exportBiomassToPdf = (options, toast) => 
  exportToPdf({ ...options, energyType: 'biomass' }, toast);

export const exportGeothermalToPdf = (options, toast) => 
  exportToPdf({ ...options, energyType: 'geothermal' }, toast);

export default {
  exportToPdf,
  exportSolarToPdf,
  exportHydroToPdf,
  exportWindToPdf,
  exportBiomassToPdf,
  exportGeothermalToPdf
};