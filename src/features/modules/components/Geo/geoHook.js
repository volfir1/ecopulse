// useGeothermalAnalytics.js
import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Import custom logos
import companyLogo from '@assets/images/logo.png';
import schoolLogo from '@assets/images/tup_logo.png';

export const useGeothermalAnalytics = () => {
  const toast = useSnackbar();
  const [generationData, setGenerationData] = useState([]);
  const [currentProjection, setCurrentProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStartYear, setSelectedStartYear] = useState(new Date().getFullYear());
  const [selectedEndYear, setSelectedEndYear] = useState(new Date().getFullYear() + 1);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData(selectedStartYear, selectedEndYear);
  }, [selectedStartYear, selectedEndYear]);

  const fetchData = (startYear, endYear) => {
    setLoading(true);
    api.get(`/api/predictions/geothermal/?start_year=${startYear}&end_year=${endYear}`)
      .then(response => {
        const data = response.data.predictions;
        console.log('Fetched data:', data);
        
        const formattedData = data.map(item => ({
          date: item.Year,
          value: item['Predicted Production']
        }));

        console.log('Formatted data:', formattedData);
        setGenerationData(formattedData);
 
        if (formattedData.length > 0) {
          setCurrentProjection(formattedData[formattedData.length - 1].value);
        }
 
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch geothermal data');
        setLoading(false);
      });
  };

  const handleStartYearChange = (year) => {
    console.log('Start Year Changed:', year);
    setSelectedStartYear(year);
  };

  const handleEndYearChange = (year) => {
    console.log('End Year Changed:', year);
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
      
      // 1) HEADER BACKGROUND (Red/Orange fill for geothermal theme)
      const headerHeight = 30;
      doc.setFillColor(255, 107, 107); // Red/orange for geothermal theme
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
      
      // 2) ADD CUSTOM LOGOS
      // Left logo (company)
      doc.addImage(companyLogo, 'PNG', 15, 5, 20, 20);
      
      // Right logo (school)
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
          const chartTitleText = 'Geothermal Power Generation Chart';
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
      const tableTitleText = 'Geothermal Power Generation Data Table';
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
          fillColor: [255, 107, 107], // Red for geothermal theme
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
          fillColor: [255, 240, 240] // Light red for alternate rows
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
      
      // Geothermal header bar for RECOMMENDATIONS
      doc.setFillColor(255, 107, 107);
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
      doc.setDrawColor(255, 107, 107);
      doc.setLineWidth(0.5);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;
      
      // Introduction text
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.text("Based on the projected increase in geothermal power generation, we recommend:", 20, yPosition);
      doc.setFont(undefined, 'normal');
      
      yPosition += 10;
      
      // Geothermal-specific recommendations
      const recommendations = [
        "Invest in advanced drilling technologies to access deeper geothermal resources.",
        "Implement enhanced geothermal systems (EGS) to expand potential generation sites.",
        "Develop comprehensive thermal gradient mapping to identify new resource areas.",
        "Establish predictive maintenance protocols to maximize plant efficiency and uptime."
      ];
      
      recommendations.forEach((rec) => {
        // Red bullet points
        doc.setFillColor(255, 107, 107);
        doc.circle(20, yPosition - 1, 2, 'F');
        
        // Recommendation text
        doc.setFontSize(9);
        doc.text(rec, 25, yPosition);
        yPosition += 8;
      });
      
      yPosition += 7;
      
      // Add horizontal line for footer
      doc.setDrawColor(255, 107, 107);
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
      
      // Geothermal-specific sources
      doc.text("1. Placeholder source for thermal gradient data", 20, yPosition + 7);
      doc.text("2. Placeholder source for geothermal models", 20, yPosition + 14);
      
      doc.text("3. Placeholder source for well performance", 20 + colWidth, yPosition + 7);
      doc.text("4. Placeholder source for resource assessment", 20 + colWidth, yPosition + 14);
      
      // Add small company logo at the footer
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
      doc.save('Geothermal_Power_Generation_Summary.pdf');
      toast.success('Summary downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download summary. Please try again.');
    }
  }, [generationData, selectedStartYear, selectedEndYear, currentProjection, toast, chartRef]);

  // Mock data for temperature and well performance
  const temperatureData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    surface: 150 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
    deep: 280 + Math.sin(i * 0.3) * 5 + Math.random() * 3
  }));

  const wellPerformance = Array.from({ length: 6 }, (_, i) => ({
    well: `Well ${i + 1}`,
    pressure: 85 + Math.sin(i * 0.7) * 10 + Math.random() * 5,
    output: 2600 + Math.sin(i * 0.6) * 300 + Math.random() * 200
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
    temperatureData,
    wellPerformance,
    chartRef // Export the chart ref
  };
};

export default useGeothermalAnalytics;