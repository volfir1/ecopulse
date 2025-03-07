import { create } from 'zustand';
import api from '@features/modules/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Create a factory function that will generate a store for each energy type
const createAdminEnergyStore = (energyType) => {
  // Define config based on energy type
  const configs = {
    solar: {
      color: '#FFB800', // Solar yellow
      endpoint: '/api/predictions/solar/',
      fileName: 'Solar_Power_Generation_Summary.pdf',
      title: 'Solar Power Generation Chart',
      tableTitle: 'Solar Power Generation Data Table',
      pdfStyles: {
        fillColor: [255, 180, 0] // Sunny yellow/orange for solar theme
      }
    },
    hydro: {
      color: '#2E90E5', // Hydro blue
      endpoint: '/api/predictions/hydro/',
      fileName: 'Hydropower_Generation_Summary.pdf',
      title: 'Hydropower Generation Chart',
      tableTitle: 'Hydropower Generation Data Table',
      pdfStyles: {
        fillColor: [46, 144, 229] // Blue color for hydro theme
      }
    },
    wind: {
      color: '#64748B', // Wind slate
      endpoint: '/api/predictions/wind/',
      fileName: 'Wind_Power_Generation_Summary.pdf',
      title: 'Wind Power Generation Chart',
      tableTitle: 'Wind Power Generation Data Table',
      pdfStyles: {
        fillColor: [100, 116, 139] // Slate color for wind theme
      }
    },
    biomass: {
      color: '#16A34A', // Biomass green
      endpoint: '/api/predictions/biomass/',
      fileName: 'Biomass_Power_Generation_Summary.pdf',
      title: 'Biomass Generation Chart',
      tableTitle: 'Biomass Generation Data Table',
      pdfStyles: {
        fillColor: [22, 163, 74] // Green for biomass theme
      }
    },
    geothermal: {
      color: '#FF6B6B', // Geothermal red
      endpoint: '/api/predictions/geothermal/',
      fileName: 'Geothermal_Power_Generation_Summary.pdf',
      title: 'Geothermal Generation Chart',
      tableTitle: 'Geothermal Generation Data Table',
      pdfStyles: {
        fillColor: [255, 107, 107] // Red for geothermal theme
      }
    }
  };

  // Get the configuration for the specified energy type
  const config = configs[energyType] || configs.solar; // Default to solar if type not found

  // Create store with all the state and actions needed across all energy types
  return create((set, get) => ({
    // State
    energyType,
    config,
    data: [], // For table data
    generationData: [], // For chart data
    currentProjection: null,
    loading: true,
    isModalOpen: false,
    selectedYear: new Date().getFullYear(),
    generationValue: '',
    isEditing: false,
    editId: null,
    selectedStartYear: new Date().getFullYear() - 4,
    selectedEndYear: new Date().getFullYear() + 1,
    chartRef: null,
    refreshTrigger: 0,
    
    // Set chart reference
    setChartRef: (ref) => set({ chartRef: ref }),
    
    // CRUD operations
    
    // Fetch data based on year range (for chart)
    fetchData: async (startYear, endYear) => {
      set({ loading: true });
      
      try {
        // Try to get data from API
        try {
          const response = await api.get(`${config.endpoint}?start_year=${startYear}&end_year=${endYear}`);
          const data = response.data.predictions;
          const formattedData = data.map(item => ({
            date: item.Year,
            value: parseFloat(item['Predicted Production'])
          }));

          set({ 
            generationData: formattedData,
            currentProjection: formattedData.length > 0 ? formattedData[formattedData.length - 1].value : null
          });
        } catch (apiError) {
          console.error(`API Error for ${energyType}:`, apiError);
          
          // For development, generate sample data when API fails
          const sampleData = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
            date: startYear + i,
            value: 800 + Math.random() * 400 + i * 70 // Different formula can be applied per energy type
          }));
          
          set({ 
            generationData: sampleData,
            currentProjection: sampleData.length > 0 ? sampleData[sampleData.length - 1].value : null
          });
        }
      } catch (error) {
        console.error(`Error fetching ${energyType} data:`, error);
      } finally {
        set({ loading: false });
      }
    },
    
    // Fetch all data (for table)
    fetchAllData: async () => {
      set({ loading: true });
      
      try {
        // Try to get data from API
        try {
          const response = await api.get(config.endpoint);
          const formattedData = response.data.predictions.map((item, index) => ({
            id: index + 1,
            year: item.Year,
            generation: parseFloat(item['Predicted Production']),
            dateAdded: new Date().toISOString() // In a real app, this would come from the API
          }));
          
          set({ data: formattedData });
        } catch (apiError) {
          console.error(`API Error for ${energyType}:`, apiError);
          
          // For development, generate sample data when API fails
          const currentYear = new Date().getFullYear();
          const sampleData = Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            year: currentYear - 4 + i,
            generation: 800 + Math.random() * 400 + i * 70,
            dateAdded: new Date(Date.now() - i * 86400000).toISOString()
          }));
          
          set({ data: sampleData });
        }
      } catch (error) {
        console.error(`Error fetching ${energyType} data:`, error);
      } finally {
        set({ loading: false });
      }
    },
    
    // Initialize data - call this when component mounts
    initialize: () => {
      const { fetchData, fetchAllData, selectedStartYear, selectedEndYear } = get();
      fetchData(selectedStartYear, selectedEndYear);
      fetchAllData();
    },
    
    // Modal actions
    handleOpenAddModal: () => set({ 
      isEditing: false,
      selectedYear: new Date().getFullYear(),
      generationValue: '',
      isModalOpen: true 
    }),
    
    handleOpenEditModal: (row) => set({ 
      isEditing: true,
      editId: row.id,
      selectedYear: row.year,
      generationValue: row.generation.toString(),
      isModalOpen: true 
    }),
    
    handleCloseModal: () => set({ isModalOpen: false }),
    
    // Form handlers
    handleYearChange: (year) => set({ selectedYear: year }),
    
    handleGenerationChange: (event) => set({ generationValue: event.target.value }),
    
    // Year range handlers
    handleStartYearChange: (year) => {
      set({ selectedStartYear: year });
      get().fetchData(year, get().selectedEndYear);
    },
    
    handleEndYearChange: (year) => {
      set({ selectedEndYear: year });
      get().fetchData(get().selectedStartYear, year);
    },
    
    // Form submission (add/edit)
    handleSubmit: async () => {
      const { selectedYear, generationValue, isEditing, editId } = get();
      
      if (!selectedYear || !generationValue) {
        return { success: false, message: 'Please fill all fields' };
      }
      
      const payload = {
        Year: selectedYear,
        'Predicted Production': parseFloat(generationValue)
      };
      
      set({ loading: true });
      
      try {
        if (isEditing) {
          // Update
          await api.put(`${config.endpoint}${editId}`, payload);
        } else {
          // Add
          await api.post(config.endpoint, payload);
        }
        
        set({ isModalOpen: false });
        get().handleRefresh();
        
        return {
          success: true,
          message: `${energyType.charAt(0).toUpperCase() + energyType.slice(1)} generation data ${isEditing ? 'updated' : 'added'} successfully`
        };
      } catch (error) {
        console.error(`Error ${isEditing ? 'updating' : 'adding'} data:`, error);
        return {
          success: false,
          message: `Failed to ${isEditing ? 'update' : 'add'} ${energyType} generation data`
        };
      } finally {
        set({ loading: false });
      }
    },
    
    // Delete record
    handleDelete: async (id) => {
      if (!window.confirm('Are you sure you want to delete this record?')) {
        return { success: false };
      }
      
      set({ loading: true });
      
      try {
        await api.delete(`${config.endpoint}${id}`);
        get().handleRefresh();
        
        return {
          success: true,
          message: `${energyType.charAt(0).toUpperCase() + energyType.slice(1)} generation data deleted successfully`
        };
      } catch (error) {
        console.error(`Error deleting data:`, error);
        return {
          success: false,
          message: `Failed to delete ${energyType} generation data`
        };
      } finally {
        set({ loading: false });
      }
    },
    
    // Refresh data
    handleRefresh: () => {
      const { fetchData, fetchAllData, selectedStartYear, selectedEndYear } = get();
      fetchData(selectedStartYear, selectedEndYear);
      fetchAllData();
    },
    
    // Export data to CSV
    handleExportData: (data) => {
      if (!data || data.length === 0) {
        return { success: false, message: 'No data to export' };
      }
      
      const headers = ['Year', 'Generation (GWh)', 'Date Added'];
      const csvData = data.map(row => [
        row.year,
        row.generation,
        new Date(row.dateAdded).toLocaleDateString()
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${energyType.charAt(0).toUpperCase() + energyType.slice(1)}_Generation_Data.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, message: 'Data exported successfully' };
    },
    
    // Download PDF with chart and table
    handleDownload: async () => {
      const { generationData, selectedStartYear, selectedEndYear, currentProjection, chartRef } = get();
      
      try {
        // Create new PDF
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Add title and metadata
        doc.setFontSize(16);
        doc.text(config.title, 15, 15);
        
        doc.setFontSize(11);
        doc.text(`Year Range: ${selectedStartYear} - ${selectedEndYear}`, 15, 25);
        doc.text(`Current Projection: ${currentProjection ? currentProjection.toFixed(2) : 'N/A'} GWh`, 15, 30);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 35);
        
        // If there's a chart reference, capture it
        if (chartRef && chartRef.current) {
          try {
            // Capture chart as image
            const chartElement = chartRef.current;
            const canvas = await html2canvas(chartElement, {
              scale: 2,
              useCORS: true,
              logging: false
            });
            
            const chartImageData = canvas.toDataURL('image/png');
            
            // Add chart image to PDF
            doc.addImage(
              chartImageData, 
              'PNG', 
              15, // x position
              45, // y position
              180, // width
              80  // height
            );
            
            // Add chart title
            doc.setFontSize(12);
            doc.text(config.title, 15, 45);
          } catch (chartError) {
            console.error('Error capturing chart:', chartError);
            // Continue without chart if it fails
          }
        }
        
        // Add table data - position depends on if chart was included
        const tableY = chartRef && chartRef.current ? 140 : 45;
        
        // Add table header
        doc.setFontSize(12);
        doc.text(config.tableTitle, 15, tableY - 5);
        
        // Create table data
        doc.autoTable({
          head: [['Year', 'Predicted Production (GWh)']],
          body: generationData.map(item => [item.date, item.value.toFixed(2)]),
          startY: tableY,
          margin: { left: 15, right: 15 },
          headStyles: { fillColor: config.pdfStyles.fillColor },
          styles: {
            fontSize: 10,
            cellPadding: 3
          }
        });
        
        // Save PDF
        doc.save(config.fileName);
        
        return { success: true, message: 'Summary downloaded successfully!' };
      } catch (error) {
        console.error('Download error:', error);
        return { success: false, message: 'Failed to download summary. Please try again.' };
      }
    }
  }));
};

// Create individual stores for each energy type
export const solarStore = createAdminEnergyStore('solar');
export const hydroStore = createAdminEnergyStore('hydro');
export const windStore = createAdminEnergyStore('wind');
export const biomassStore = createAdminEnergyStore('biomass');
export const geothermalStore = createAdminEnergyStore('geothermal');

// Map of energy types to their stores
export const stores = {
  solar: solarStore,
  hydro: hydroStore,
  wind: windStore,
  biomass: biomassStore,
  geothermal: geothermalStore
};

export default createAdminEnergyStore;