import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import adminEnergyUtils from '@store/admin/adminEnergyUtil';

// Import your logo files directly
import companyLogo from '@assets/images/logo.png';
import schoolLogo from '@assets/images/tup_logo.png';

/**
 * Energy type specific configurations for PDF export
 */
const exportConfigs = {
  solar: {
    color: '#FFB800', // Solar yellow
    fileName: 'Solar_Power_Generation_Summary.pdf',
    title: 'Solar Power Generation Chart',
    tableTitle: 'Solar Power Generation Data Table',
    recommendations: [
      "Invest in additional solar panel infrastructure to capitalize on the projected growth trend.",
      "Develop energy storage solutions to address intermittency challenges.",
      "Evaluate technological upgrades to improve solar capture efficiency.",
      "Consider strategic placement of new solar installations based on irradiance data."
    ],
    pdfStyles: {
      fillColor: [255, 180, 0], // Sunny yellow/orange for solar theme
      lightFill: [252, 248, 227] // Light yellow for alternate rows
    }
  },
  hydro: {
    color: '#2E90E5', // Hydro blue
    fileName: 'Hydropower_Generation_Summary.pdf',
    title: 'Hydropower Generation Chart',
    tableTitle: 'Hydropower Generation Data Table',
    recommendations: [
      "Implement advanced water flow monitoring systems to optimize reservoir management.",
      "Invest in turbine efficiency upgrades to increase power output during peak seasons.",
      "Develop comprehensive drought contingency plans for low-water periods.",
      "Explore hybrid renewable integration to balance seasonal hydropower fluctuations."
    ],
    pdfStyles: {
      fillColor: [46, 144, 229], // Blue color for hydro theme
      lightFill: [235, 245, 255] // Light blue for alternate rows
    }
  },
  wind: {
    color: '#64748B', // Wind slate
    fileName: 'Wind_Power_Generation_Summary.pdf',
    title: 'Wind Power Generation Chart',
    tableTitle: 'Wind Power Generation Data Table',
    recommendations: [
      "Invest in advanced turbine technology to improve efficiency in varying wind conditions.",
      "Develop more sophisticated wind forecasting systems to optimize generation scheduling.",
      "Implement smart grid integration to better manage intermittency challenges.",
      "Explore hybrid wind-storage solutions to enhance reliability and grid stability."
    ],
    pdfStyles: {
      fillColor: [100, 116, 139], // Slate color for wind theme
      lightFill: [240, 244, 248] // Light slate for alternate rows
    }
  },
  biomass: {
    color: '#16A34A', // Biomass green
    fileName: 'Biomass_Power_Generation_Summary.pdf',
    title: 'Biomass Generation Chart',
    tableTitle: 'Biomass Generation Data Table',
    recommendations: [
      "Invest in additional processing capacity to handle the projected increase.",
      "Develop partnerships with agricultural suppliers to ensure consistent feedstock availability.",
      "Evaluate efficiency improvements to current generation facilities.",
      "Consider expanding storage capabilities to manage seasonal fluctuations."
    ],
    pdfStyles: {
      fillColor: [22, 163, 74], // Green for biomass theme
      lightFill: [240, 248, 240] // Light green for alternate rows
    }
  },
  geothermal: {
    color: '#FF6B6B', // Geothermal red
    fileName: 'Geothermal_Power_Generation_Summary.pdf',
    title: 'Geothermal Generation Chart',
    tableTitle: 'Geothermal Generation Data Table',
    recommendations: [
      "Optimize well management and resource extraction to maximize long-term sustainability.",
      "Implement advanced heat exchange technologies to increase efficiency.",
      "Develop enhanced geothermal systems (EGS) for areas with lower natural temperatures.",
      "Explore cascade applications to utilize residual heat in multiple processes."
    ],
    pdfStyles: {
      fillColor: [255, 107, 107], // Red for geothermal theme
      lightFill: [255, 235, 235] // Light red for alternate rows
    }
  }
};

/**
 * Enhanced PDF export with professional formatting, recommendations, and branding
 * Compatible with your custom Toast notification component
 * @param {Object} options - Export options
 * @param {Array} options.data - Data to export (filtered data from component)
 * @param {string} options.energyType - Energy type ('solar', 'wind', etc.)
 * @param {number} options.startYear - Start year for filtering
 * @param {number} options.endYear - End year for filtering
 * @param {Object} options.chartRef - React ref to the chart element
 * @param {number} options.currentProjection - Current projection value
 * @param {Object} options.toast - Your custom toast notification object
 * @returns {Object} Result of the export operation
 */
export const exportEnhancedPDF = async ({ 
  data, 
  energyType, 
  startYear, 
  endYear, 
  chartRef,
  currentProjection,
  toast 
}) => {
  try {
    // Use your custom toast implementation if available
    if (toast?.info) {
      toast.info('Preparing your download...');
    } else {
      console.log('Preparing download...');
    }
    
    // Normalize energy type
    const normalizedType = energyType.toLowerCase();
    
    // Get configuration based on energy type
    const config = exportConfigs[normalizedType] || exportConfigs.solar;
    
    // Ensure we're working with an array
    let dataToExport = [];
    
    // Use provided data if it's a proper array
    if (Array.isArray(data) && data.length > 0) {
      dataToExport = data;
    } 
    // Last resort - use sample data
    else {
      // Create some sample data if nothing else is available
      dataToExport = adminEnergyUtils.generateSampleData(normalizedType);
    }
    
    // Format data for table - convert to the format expected in generationData
    const generationData = dataToExport.map(item => ({
      date: item.year,
      value: item.generation
    }));
    
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
    
    const yearRangeText = `Year Range: ${startYear} - ${endYear}`;
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
        yPosition += 10; // Add some space if chart capture fails
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
    doc.text(`Based on the projected increase in ${normalizedType} power generation, we recommend:`, 20, yPosition);
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
    doc.text(`1. Placeholder source for ${normalizedType} data`, 20, yPosition + 7);
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
    
    // Success notification using your custom toast
    if (toast?.success) {
      toast.success('Summary downloaded successfully!');
    } else {
      console.log('Summary downloaded successfully!');
    }
    
    return { success: true, message: `${normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)} generation data exported to PDF successfully` };
  } catch (error) {
    // Log error and show notification
    console.error('Export error:', error);
    
    // Using your custom toast for error notification
    if (toast?.error) {
      toast.error('Failed to download summary. Please try again.');
    } else {
      console.error('Failed to download summary. Please try again.');
    }
    
    return { success: false, message: `Failed to export data to PDF: ${error.message}` };
  }
};

/**
 * Simple PDF export with basic formatting (fallback if enhanced version fails)
 * Compatible with your custom Toast notification component
 * @param {Object} options - Export options
 * @param {Array} options.data - Data to export
 * @param {string} options.energyType - Energy type ('solar', 'wind', etc.)
 * @param {number} options.startYear - Start year for filtering
 * @param {number} options.endYear - End year for filtering
 * @param {Object} options.toast - Your custom toast notification object
 * @returns {Object} Result of the export operation
 */
export const exportSimplePDF = ({ data, energyType, startYear, endYear, toast }) => {
  try {
    // Show info notification
    if (toast?.info) {
      toast.info('Preparing simple PDF...');
    }
    
    // Normalize energy type
    const normalizedType = energyType.toLowerCase();
    
    // Get configuration based on energy type
    const config = exportConfigs[normalizedType] || exportConfigs.solar;
    
    // Ensure we're working with an array
    let dataToExport = [];
    
    // Use provided data if it's a proper array
    if (Array.isArray(data) && data.length > 0) {
      dataToExport = data;
    } 
    // Last resort - use sample data
    else {
      dataToExport = adminEnergyUtils.generateSampleData(normalizedType);
    }
    
    // Create new PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title and metadata
    doc.setFontSize(16);
    doc.text(`${normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)} Generation Data Export`, 15, 15);
    
    doc.setFontSize(11);
    doc.text(`Year Range: ${startYear} - ${endYear}`, 15, 25);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 30);
    
    // Create table data
    const tableData = dataToExport.map(row => [
      row.year || 'N/A',
      (row.generation !== undefined && row.generation !== null) 
        ? typeof row.generation === 'number' 
          ? row.generation.toFixed(2) 
          : row.generation.toString()
        : 'N/A',
      row.dateAdded 
        ? new Date(row.dateAdded).toLocaleDateString() 
        : 'N/A'
    ]);
    
    doc.autoTable({
      head: [['Year', 'Generation (GWh)', 'Date Added']],
      body: tableData,
      startY: 35,
      margin: { left: 15, right: 15 },
      headStyles: { fillColor: config.pdfStyles.fillColor },
      styles: {
        fontSize: 10,
        cellPadding: 3
      }
    });
    
    // Save PDF
    doc.save(config.fileName);
    
    // Show success notification
    if (toast?.success) {
      toast.success('Basic data export completed successfully');
    }
    
    return { success: true, message: 'Data exported to PDF successfully' };
  } catch (error) {
    console.error('Export error:', error);
    
    // Show error notification
    if (toast?.error) {
      toast.error(`Export failed: ${error.message}`);
    }
    
    return { success: false, message: `Failed to export data to PDF: ${error.message}` };
  }
};

export default {
  exportEnhancedPDF,
  exportSimplePDF
};