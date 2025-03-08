// SolarAdmin.jsx
import React, { useMemo, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sun, X } from 'lucide-react';
import {
  DataTable,
  Button,
  Card,
  AppIcon,
  SingleYearPicker,
  YearPicker,
  NumberBox,
  useDataTable
} from '@shared/index';
import { useSnackbar } from 'notistack';

// Import the Zustand store and utils - fix duplicate imports
import { useSolarStore } from '@store/admin/adminEnergyStore';
import { exportSolarToPdf } from '@store/admin/adminEnergyExport';
import energyUtils from '@store/admin/adminEnergyUtil';

/**
 * Solar Administration Component
 * @returns {React.ReactElement} The solar admin component
 */
const SolarAdmin = () => {
  // Use the snackbar for notifications
  const { enqueueSnackbar } = useSnackbar();
  
  // Reference for chart export
  const chartRef = useRef(null);
  
  // Access the solar store
  const {
    data,
    loading,
    error,
    isModalOpen,
    selectedYear,
    generationValue,
    isEditing,
    yearRange,
    fetchData,
    openAddModal,
    openEditModal,
    closeModal,
    setSelectedYear,
    handleGenerationChange,
    setYearRange,
    submitData,
    deleteRecord,
    calculateTotals
  } = useSolarStore();
  
  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Show notifications when errors occur
  useEffect(() => {
    if (error) {
      enqueueSnackbar(`Error: ${error}`, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);
  
  // Handle year changes for filtering
  const handleStartYearChange = (year) => {
    setYearRange(year, undefined);
  };
  
  const handleEndYearChange = (year) => {
    setYearRange(undefined, year);
  };
  
  // Enhanced handlers with notifications
  const handleSubmit = async () => {
    try {
      const success = await submitData();
      
      if (success) {
        enqueueSnackbar(
          `Solar generation data ${isEditing ? 'updated' : 'added'} successfully`, 
          { variant: 'success' }
        );
      }
    } catch (err) {
      enqueueSnackbar(
        `Failed to ${isEditing ? 'update' : 'add'} solar generation data`, 
        { variant: 'error' }
      );
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const success = await deleteRecord(id);
      
      if (success) {
        enqueueSnackbar(`Solar generation data deleted successfully`, { 
          variant: 'success' 
        });
      }
    } catch (err) {
      enqueueSnackbar(`Failed to delete solar generation data`, { 
        variant: 'error' 
      });
    }
  };
  
  // Handler for downloading chart as image
  const handleDownload = () => {
    if (!chartRef.current) {
      enqueueSnackbar('Chart reference not available', { variant: 'warning' });
      return;
    }
    
    try {
      // Find the SVG element
      const svgElement = chartRef.current.querySelector('svg');
      
      if (!svgElement) {
        enqueueSnackbar('SVG element not found', { variant: 'warning' });
        return;
      }
      
      // Clone the SVG for manipulation
      const svgClone = svgElement.cloneNode(true);
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      // Convert SVG to a data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'solar_generation_chart.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      enqueueSnackbar('Chart downloaded successfully', { variant: 'success' });
    } catch (err) {
      console.error('Error downloading chart:', err);
      enqueueSnackbar('Failed to download chart', { variant: 'error' });
    }
  };
  
  // Handle export to PDF
  const handleExportData = () => {
    try {
      const toast = (message, { type }) => {
        const variantMap = {
          success: 'success',
          error: 'error',
          info: 'info',
          warning: 'warning'
        };
        enqueueSnackbar(message, { variant: variantMap[type] || 'default' });
      };
      
      // Make sure we're passing the actual table columns array to the export function
      exportSolarToPdf({
        data: tableData,
        energyType: 'solar',
        title: `Solar Generation Data (${yearRange.startYear} - ${yearRange.endYear})`,
        filename: 'Solar_Generation_Data.pdf',
        columns: tableColumns,
        chartData: chartData,
        yearRange: yearRange,
        chartRef: chartRef
      }, toast);
    } catch (err) {
      console.error('Error exporting data to PDF:', err);
      enqueueSnackbar('Failed to export data to PDF', { variant: 'error' });
    }
  };
  
  // For demo purposes, use sample data if no data is available
  const effectiveData = useMemo(() => 
    data.length > 0 ? data : energyUtils.generateSampleData('solar'), 
    [data]
  );

  // Filter data based on selected year range
  const filteredData = useMemo(() => {
    return effectiveData.filter(item => 
      item.year >= yearRange.startYear && 
      item.year <= yearRange.endYear
    );
  }, [effectiveData, yearRange]);

  // Format data for chart
  const chartData = useMemo(() => 
    energyUtils.formatDataForChart(filteredData),
    [filteredData]
  );

  // Configure data table columns
  const tableColumns = useMemo(() => 
    energyUtils.getTableColumns(openEditModal, handleDelete), 
    [openEditModal, handleDelete]
  );
  
  // Use useDataTable hook with memoized dependencies and filtered data
  const {
    data: tableData,
    loading: tableLoading,
    handleRefresh,
  } = useDataTable({
    data: filteredData,
    columns: tableColumns,
    onExport: handleExportData,
    onRefresh: fetchData
  });
  
  // Memoize chart config to prevent recreation
  const chartConfig = useMemo(() => {
    const config = energyUtils.getChartConfig('solar');
    
    // Enhanced Y-axis configuration with proper label
    config.yAxis = {
      ...config.yAxis,
      label: {
        value: 'Generation (GWh)',
        angle: -90,
        position: 'insideLeft',
        style: { textAnchor: 'middle' },
        offset: -5
      }
    };
    
    return config;
  }, []);

  // Form validation
  const formValidation = useMemo(() => {
    return energyUtils.validateInputs(selectedYear, generationValue);
  }, [selectedYear, generationValue]);

  // Calculate totals on form changes
  useEffect(() => {
    const hasRelevantFields = generationValue.solar || 
                             generationValue.wind || 
                             generationValue.hydro || 
                             generationValue.biomass || 
                             generationValue.geothermal || 
                             generationValue.nonRenewable;
    
    if (hasRelevantFields) {
      calculateTotals();
    }
  }, [
    generationValue.solar,
    generationValue.wind,
    generationValue.hydro,
    generationValue.biomass,
    generationValue.geothermal,
    generationValue.nonRenewable,
    calculateTotals
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100">
            <Sun className="text-amber-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Solar Generation Data</h1>
            <p className="text-gray-500">Manage historical and projected solar generation data</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
          onClick={openAddModal}
        >
          <AppIcon name="plus" size={18} />
          Add New Record
        </Button>
      </div>

      {/* Year Range Filter Card */}
      <Card.Base className="mb-6 p-4">
        <div className="flex justify-between items-center">
          <div className="text-gray-700 font-medium">
            Filter Data By Year Range
          </div>
          <div className="min-w-64">
            <YearPicker
              initialStartYear={yearRange.startYear}
              initialEndYear={yearRange.endYear}
              onStartYearChange={handleStartYearChange}
              onEndYearChange={handleEndYearChange}
            />
          </div>
        </div>
      </Card.Base>

      {/* Chart Section */}
      <Card.Base className="mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Generation Overview</h2>
        </div>
        <div className="p-6 h-96" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis {...chartConfig.xAxis} />
              <YAxis {...chartConfig.yAxis} />
              <Tooltip
                formatter={chartConfig.tooltip.formatter}
                labelFormatter={chartConfig.tooltip.labelFormatter}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartConfig.line.stroke}
                strokeWidth={chartConfig.line.strokeWidth}
                dot={chartConfig.line.dot}
                activeDot={chartConfig.line.activeDot}
                name="Generation (GWh)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200">
          <Button
            variant="secondary"
            className="flex items-center gap-2 mr-2"
            onClick={handleDownload}
          >
            <AppIcon name="download" size={18} />
            Download Chart
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600"
            onClick={handleExportData}
          >
            <AppIcon name="file-pdf" size={18} />
            Export to PDF
          </Button>
        </div>
      </Card.Base>

      {/* Data Table */}
      <DataTable
        title={`Solar Generation Records (${yearRange.startYear} - ${yearRange.endYear})`}
        columns={tableColumns}
        data={tableData}
        loading={loading || tableLoading}
        selectable={true}
        searchable={true}
        exportable={true}
        filterable={true}
        refreshable={true}
        pagination={true}
        onExport={handleExportData}
        onRefresh={handleRefresh}
        tableClasses={{
          paper: "shadow-md rounded-md",
          headerCell: "bg-gray-50",
          row: "hover:bg-amber-50"
        }}
        emptyMessage={`No solar generation data available for years ${yearRange.startYear} - ${yearRange.endYear}`}
      />

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span className="text-lg font-medium">{isEditing ? 'Edit Record' : 'Add New Record'}</span>
          <IconButton onClick={closeModal} size="small">
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <SingleYearPicker
                initialYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            </div>
            <div>
              <NumberBox
                label="Total Renewable Energy (GWh)"
                value={generationValue.totalRenewable}
                onChange={(e) => handleGenerationChange(e, 'totalRenewable')}
                placeholder="Total renewable energy in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                readOnly
                disabled
                error={formValidation.errors?.totalRenewable ? true : false}
                helperText={formValidation.errors?.totalRenewable}
              />
            </div>
            <div>
              <NumberBox
                label="Geothermal (GWh)"
                value={generationValue.geothermal}
                onChange={(e) => handleGenerationChange(e, 'geothermal')}
                placeholder="Enter geothermal energy value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors?.geothermal ? true : false}
                helperText={formValidation.errors?.geothermal}
              />
            </div>
            <div>
              <NumberBox
                label="Hydro (GWh)"
                value={generationValue.hydro}
                onChange={(e) => handleGenerationChange(e, 'hydro')}
                placeholder="Enter hydro energy value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors?.hydro ? true : false}
                helperText={formValidation.errors?.hydro}
              />
            </div>
            <div>
              <NumberBox
                label="Biomass (GWh)"
                value={generationValue.biomass}
                onChange={(e) => handleGenerationChange(e, 'biomass')}
                placeholder="Enter biomass energy value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors?.biomass ? true : false}
                helperText={formValidation.errors?.biomass}
              />
            </div>
            <div>
              <NumberBox
                label="Solar (GWh)"
                value={generationValue.solar}
                onChange={(e) => handleGenerationChange(e, 'solar')}
                placeholder="Enter solar energy value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors?.solar ? true : false}
                helperText={formValidation.errors?.solar}
              />
            </div>
            <div>
              <NumberBox
                label="Wind (GWh)"
                value={generationValue.wind}
                onChange={(e) => handleGenerationChange(e, 'wind')}
                placeholder="Enter wind energy value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors?.wind ? true : false}
                helperText={formValidation.errors?.wind}
              />
            </div>
            <div>
              <NumberBox
                label="Non-Renewable Energy (GWh)"
                value={generationValue.nonRenewable}
                onChange={(e) => handleGenerationChange(e, 'nonRenewable')}
                placeholder="Enter non-renewable energy value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors?.nonRenewable ? true : false}
                helperText={formValidation.errors?.nonRenewable}
              />
            </div>
            <div>
              <NumberBox
                label="Total Power Generation (GWh)"
                value={generationValue.totalPower}
                onChange={(e) => handleGenerationChange(e, 'totalPower')}
                placeholder="Total power generation in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                readOnly
                disabled
                error={formValidation.errors?.totalPower ? true : false}
                helperText={formValidation.errors?.totalPower}
              />
            </div>
            <div>
              <NumberBox
                label="Population (in millions)"
                value={generationValue.population}
                onChange={(e) => handleGenerationChange(e, 'population')}
                placeholder="Enter population in millions"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors?.population ? true : false}
                helperText={formValidation.errors?.population}
              />
            </div>
            <div>
              <NumberBox
                label="Gross Domestic Product (GDP)"
                value={generationValue.gdp}
                onChange={(e) => handleGenerationChange(e, 'gdp')}
                placeholder="Enter GDP value"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors?.gdp ? true : false}
                helperText={formValidation.errors?.gdp}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            variant="secondary"
            onClick={closeModal}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SolarAdmin;