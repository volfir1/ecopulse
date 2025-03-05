import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Import custom logos
import companyLogo from '@assets/images/logo.png';
import schoolLogo from '@assets/images/tup_logo.png';

export const useBiomassAnalytics = () => {
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);

  const toast = useSnackbar();
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData(selectedStartYear, selectedEndYear);
  }, [selectedStartYear, selectedEndYear]);

  const fetchData = (startYear, endYear) => {
    setLoading(true);
    api.get(`/api/predictions/biomass/?start_year=${startYear}&end_year=${endYear}`)
      .then(response => {
        const data = response.data.predictions;
        console.log('Fetched data:', data);

        // Process the data to match the chart's expected format
        const formattedData = data.map(item => ({
          date: item.Year,
          value: item['Predicted Production']
        }));

        console.log('Formatted data:', formattedData);
        setGenerationData(formattedData);

        // Assuming the current month's projection is the last item in the array
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch biomass data. Please try again.');
        setLoading(false);
      });
  };

  const handleStartYearChange = (year) => {
    setSelectedStartYear(year);
  };

  const handleEndYearChange = (year) => {
    setSelectedEndYear(year);
  };

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
      
      // 1) HEADER BACKGROUND (Green fill with gradient effect)
      const headerHeight = 30;
      const gradientHeight = headerHeight / 5;
      
      // Main header background
      doc.setFillColor(22, 163, 74); // Main green
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
      
      // Subtle dark gradient at top edge for professional look
      doc.setFillColor(18, 140, 64); // Slightly darker green
      doc.rect(0, 0, pageWidth, gradientHeight, 'F');
      
      // Subtle light gradient at bottom edge for depth
      doc.setFillColor(26, 180, 82); // Slightly lighter green
      doc.rect(0, headerHeight - gradientHeight, pageWidth, gradientHeight, 'F');
  
      // 2) ADD CUSTOM LOGOS
      // Add company logo (left side)
      doc.addImage(companyLogo, 'PNG', 15, 5, 20, 20);
      
      // Add school logo (right side)
      doc.addImage(schoolLogo, 'PNG', pageWidth - 35, 5, 20, 20);
  
      // 3) HEADER TEXT - CENTERED with better typography
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      
      // Calculate text width to center
      const titleText = 'Ecopulse';
      const titleWidth = doc.getStringUnitWidth(titleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(titleText, titleX, 17);
  
      // 4) DATE - CENTERED BELOW TITLE with better visual separation
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const dateText = `Date Generated: ${new Date().toLocaleDateString()}`;
      const dateWidth = doc.getStringUnitWidth(dateText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const dateX = (pageWidth - dateWidth) / 2;
      doc.text(dateText, dateX, 25);
  
      // 5) SWITCH BACK TO BLACK TEXT AFTER HEADER
      doc.setTextColor(0, 0, 0);
  
      // 6) SPACING AFTER HEADER
      let yPosition = headerHeight + 15;
  
      // 7) METADATA SECTION with subtle background and border
      const metadataHeight = 30;
      doc.setFillColor(248, 248, 248); // Very light gray background
      doc.setDrawColor(230, 230, 230); // Light gray border
      doc.rect(30, yPosition - 5, pageWidth - 60, metadataHeight, 'FD');
      
      // Add metadata content
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80); // Darker gray for text
      doc.setFont(undefined, 'bold');
      
      const yearRangeText = `Year Range: ${selectedStartYear} - ${selectedEndYear}`;
      const yearRangeWidth = doc.getStringUnitWidth(yearRangeText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const yearRangeX = (pageWidth - yearRangeWidth) / 2;
      doc.text(yearRangeText, yearRangeX, yPosition + 5);
      
      doc.setFont(undefined, 'normal');
      const projectionText = `Current Projection: ${currentProjection ? currentProjection.toFixed(2) : 'N/A'} GWh`;
      const projectionWidth = doc.getStringUnitWidth(projectionText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const projectionX = (pageWidth - projectionWidth) / 2;
      doc.text(projectionText, projectionX, yPosition + 18);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition += metadataHeight + 5;
  
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
  
          // Add title with section number and underline
          doc.setFillColor(22, 163, 74, 0.1); // Very light green background
          doc.rect(20, yPosition - 3, pageWidth - 40, 18, 'F');
          
          doc.setFontSize(13);
          doc.setTextColor(22, 163, 74); // Green text for title
          doc.setFont(undefined, 'bold');
          const chartTitleText = 'Biomass Generation Chart';
          const chartTitleWidth = doc.getStringUnitWidth(chartTitleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
          const chartTitleX = (pageWidth - chartTitleWidth) / 2;
          doc.text(chartTitleText, chartTitleX, yPosition + 8);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(0, 0, 0); // Reset text color
          yPosition += 16;
  
          // Use wider chart with border and shadow for professional look
          const chartWidth = 180;
          const chartHeight = 90;
          const chartX = (pageWidth - chartWidth) / 2;
          
          // Add subtle shadow for depth
          doc.setFillColor(100, 100, 100, 0.1);
          doc.rect(chartX + 2, yPosition + 2, chartWidth, chartHeight, 'F');
          
          // Add the chart image with border
          doc.addImage(chartImageData, 'PNG', chartX, yPosition, chartWidth, chartHeight);
          doc.setDrawColor(240, 240, 240);
          doc.rect(chartX, yPosition, chartWidth, chartHeight);
          
          yPosition += chartHeight + 15;
        } catch (chartError) {
          console.error('Error capturing chart:', chartError);
        }
      }
  
      // 9) TABLE SECTION - CENTERED with section title
      doc.setFillColor(22, 163, 74, 0.1); // Very light green background
      doc.rect(20, yPosition - 3, pageWidth - 40, 18, 'F');
      
      doc.setFontSize(13);
      doc.setTextColor(22, 163, 74); // Green text for title
      doc.setFont(undefined, 'bold');
      const tableTitleText = 'Biomass Generation Data Table';
      const tableTitleWidth = doc.getStringUnitWidth(tableTitleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const tableTitleX = (pageWidth - tableTitleWidth) / 2;
      doc.text(tableTitleText, tableTitleX, yPosition + 8);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0); // Reset text color
      yPosition += 16;
  
      // Table with properly sized columns - wider table
      doc.autoTable({
        head: [['Year', 'Predicted Production (GWh)']],
        body: generationData.map(item => [item.date, item.value.toFixed(2)]),
        startY: yPosition,
        margin: { left: 30, right: 30 }, // Reduced margins for wider table
        headStyles: { 
          fillColor: [22, 163, 74],
          halign: 'center', // Center header text
          fontSize: 11
        },
        columnStyles: {
          0: { cellWidth: 60, halign: 'center' }, // Year column - wider
          1: { cellWidth: 100, halign: 'center' }  // Predicted Production column - wider
        },
        styles: { 
          fontSize: 10, 
          cellPadding: 5,
          overflow: 'linebreak'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
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
      
      // Green header bar for RECOMMENDATIONS - full width but very slim
      doc.setFillColor(22, 163, 74);
      doc.rect(15, yPosition, pageWidth - 30, 20, 'F');
      
      // White text for RECOMMENDATIONS
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      const recTitleText = 'RECOMMENDATIONS';
      doc.text(recTitleText, pageWidth/2, yPosition + 13, { align: 'center' });
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      yPosition += 25; // Minimal spacing
      
      // Add a horizontal line below title
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.5);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;
      
      // Introduction text with minimal spacing
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.text("Based on the projected increase in biomass generation, we recommend:", 20, yPosition);
      doc.setFont(undefined, 'normal');
      
      yPosition += 10; // Minimal spacing
      
      // Create bullet points with absolutely minimal spacing
      const recommendations = [
        "Invest in additional processing capacity to handle the 33% projected increase by 2030.",
        "Develop partnerships with agricultural suppliers to ensure consistent feedstock availability.",
        "Evaluate efficiency improvements to current generation facilities.",
        "Consider expanding storage capabilities to manage seasonal fluctuations."
      ];
      
      recommendations.forEach((rec) => {
        // Green circle bullet
        doc.setFillColor(22, 163, 74);
        doc.circle(20, yPosition - 1, 2, 'F');
        
        // Recommendation text with smaller font
        doc.setFontSize(9);
        doc.text(rec, 25, yPosition);
        yPosition += 8; // Minimal spacing between items
      });
      
      yPosition += 7; // Small space before footer
      
      // Add horizontal line for footer
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.5);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      
      // Add Sources label and content in a more compact layout
      yPosition += 7;
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text("Sources:", 20, yPosition);
      doc.setFont(undefined, 'normal');
      
      // Two columns layout with minimal spacing
      const colWidth = (pageWidth - 40) / 2;
      
      // Left column sources
      doc.text("1. Placeholder source for biomass data", 20, yPosition + 7);
      doc.text("2. Placeholder source for prediction models", 20, yPosition + 14);
      
      // Right column sources
      doc.text("3. Placeholder source for efficiency calculation", 20 + colWidth, yPosition + 7);
      doc.text("4. Placeholder source for energy conversion factors", 20 + colWidth, yPosition + 14);
      
      // Add small company logo at the footer
      doc.addImage(companyLogo, 'PNG', pageWidth - 25, yPosition + 5, 15, 15);
      
      // Copyright at the bottom with minimal spacing
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
      doc.save('Biomass_Power_Generation_Summary.pdf');
      toast.success('Summary downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download summary. Please try again.');
    }
  }, [generationData, selectedStartYear, selectedEndYear, currentProjection, toast, chartRef]);
  
  // Mock data for feedstock and efficiency since they're not in the API
  const feedstockData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    agricultural: 2800 + Math.sin(i * 0.8) * 500 + Math.random() * 300,
    forestry: 2200 + Math.cos(i * 0.8) * 400 + Math.random() * 250
  }));

  const efficiencyData = Array.from({ length: 6 }, (_, i) => ({
    source: ['Wood', 'Crop', 'Waste', 'Biogas', 'Pellets', 'Other'][i],
    efficiency: 75 + Math.sin(i * 0.7) * 15 + Math.random() * 10,
    output: 2400 + Math.sin(i * 0.6) * 500 + Math.random() * 300
  }));

  return {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleDownload,
    feedstockData,
    efficiencyData,
    chartRef
  };
};

export default useBiomassAnalytics;