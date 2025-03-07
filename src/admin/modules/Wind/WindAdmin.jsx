// WindAdmin.jsx
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Wind, X, Edit, Trash } from 'lucide-react';
import {
  Button,
  Card,
  AppIcon,
  SingleYearPicker,
  YearPicker,
  NumberBox,
  DataTable,
  useSnackbar
} from '@shared/index';

// Import from the store instead of the custom hook
import { stores } from '@store/admin/adminEnergyStrore';
import adminEnergyUtils from '@store/admin/adminEnergyUtil';

// Import the enhanced export utility
import { exportEnhancedPDF } from '@store/admin/adminExportUtils';

const WindAdmin = () => {
  // Define energy type and get the store
  const ENERGY_TYPE = 'wind';
  const windStore = stores[ENERGY_TYPE];
  
  // Get the toast object from your custom useSnackbar hook
  const toast = useSnackbar();
  
  // State from the store using direct selectors
  const data = windStore(state => state.data);
  const generationData = windStore(state => state.generationData);
  const currentProjection = windStore(state => state.currentProjection);
  const loading = windStore(state => state.loading);
  const isModalOpen = windStore(state => state.isModalOpen);
  const selectedYear = windStore(state => state.selectedYear);
  const generationValue = windStore(state => state.generationValue);
  const isEditing = windStore(state => state.isEditing);
  const selectedStartYear = windStore(state => state.selectedStartYear);
  const selectedEndYear = windStore(state => state.selectedEndYear);
  const config = windStore(state => state.config);
  
  // Actions from the store
  const initialize = windStore(state => state.initialize);
  const handleOpenAddModal = windStore(state => state.openAddModal);
  const handleOpenEditModal = windStore(state => state.openEditModal);
  const handleCloseModal = windStore(state => state.closeModal);
  const handleYearChange = windStore(state => state.setSelectedYear);
  const handleGenerationChange = windStore(state => state.setGenerationValue);
  const handleSubmit = windStore(state => state.submitForm);
  const handleDelete = windStore(state => state.deleteRecord);
  const handleStartYearChange = windStore(state => state.setYearRange);
  const handleEndYearChange = useCallback((year) => {
    windStore.getState().setYearRange(selectedStartYear, year);
  }, [selectedStartYear]);
  const handleRefresh = windStore(state => state.refresh);
  
  // Chart ref
  const chartRef = React.useRef(null);
  
  // Initialize data on component mount
  useEffect(() => {
    initialize();
    windStore.getState().setChartRef(chartRef);
  }, [initialize]);

  // For demo purposes, use sample data if no data is available
  const effectiveData = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      return adminEnergyUtils.generateSampleData(ENERGY_TYPE);
    }
  }, [data, ENERGY_TYPE]);

  // Filter data based on selected year range - used for both chart and table
  const filteredData = useMemo(() => {
    if (!effectiveData || !Array.isArray(effectiveData)) {
      return [];
    }
    
    return effectiveData.filter(item => 
      item.year >= selectedStartYear && 
      item.year <= selectedEndYear
    );
  }, [effectiveData, selectedStartYear, selectedEndYear]);

  // Format data for chart
  const chartData = useMemo(() => {
    return adminEnergyUtils.formatDataForChart(filteredData);
  }, [filteredData]);

  // Define custom table columns with explicit id properties instead of field
  const tableColumns = useMemo(() => [
    {
      id: 'year',
      field: 'year', // Added field for compatibility
      label: 'Year',
      headerName: 'Year',
      align: 'left',
      sortable: true
    },
    {
      id: 'generation',
      field: 'generation',
      label: 'Generation (GWh)',
      headerName: 'Generation (GWh)',
      align: 'right',
      sortable: true,
      format: (value) => value !== undefined && value !== null 
        ? typeof value === 'number' ? value.toFixed(2) : value.toString()
        : 'N/A'
    },
    {
      id: 'dateAdded',
      field: 'dateAdded',
      label: 'Date Added',
      headerName: 'Date Added',
      align: 'left',
      sortable: true,
      format: (value) => {
        if (!value) return 'N/A';
        try {
          return new Date(value).toLocaleDateString();
        } catch (error) {
          console.error("Date formatting error:", error);
          return 'Invalid Date';
        }
      }
    },
    {
      id: 'actions',
      field: 'actions',
      label: 'Actions',
      headerName: 'Actions',
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <div className="flex justify-center gap-2">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(row);
            }}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
          >
            <Trash size={16} />
          </IconButton>
        </div>
      )
    }
  ], [handleOpenEditModal, handleDelete]);
  
  // Enhanced export to PDF with recommendations and professional formatting
  const handleExportData = useCallback(() => {
    // Call the enhanced export function with all required parameters
    return exportEnhancedPDF({
      data: filteredData,
      energyType: ENERGY_TYPE,
      startYear: selectedStartYear,
      endYear: selectedEndYear,
      chartRef: chartRef,
      currentProjection: currentProjection || 
        (chartData.length > 0 ? chartData[chartData.length - 1].value : 0),
      toast // Pass your toast object directly
    });
  }, [
    filteredData, 
    ENERGY_TYPE, 
    selectedStartYear, 
    selectedEndYear, 
    chartData, 
    currentProjection, 
    toast
  ]);

  // Memoize chart config to prevent recreation
  const chartConfig = useMemo(() => {
    const config = adminEnergyUtils.getChartConfig(ENERGY_TYPE);
    
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
  }, [ENERGY_TYPE]);

  // Form validation
  const formValidation = useMemo(() => {
    if (selectedYear && generationValue) {
      return adminEnergyUtils.validateInputs(ENERGY_TYPE, selectedYear, generationValue);
    }
    return { isValid: false, errors: {} };
  }, [selectedYear, generationValue, ENERGY_TYPE]);

  if (loading && !effectiveData.length) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-100">
              <Wind className="text-slate-500" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Wind Generation Data</h1>
              <p className="text-gray-500">Loading wind generation data...</p>
            </div>
          </div>
        </div>
        <Card.Base className="mb-6 p-4 flex justify-center items-center h-96">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
            <div className="h-4 w-36 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 w-24 bg-slate-200 rounded"></div>
          </div>
        </Card.Base>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-100">
            <Wind className="text-slate-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Wind Generation Data</h1>
            <p className="text-gray-500">Manage historical and projected wind generation data</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="bg-slate-500 hover:bg-slate-600 flex items-center gap-2"
          onClick={handleOpenAddModal}
        >
          <AppIcon name="plus" size={18} />
          Add New Record
        </Button>
      </div>

      {/* Year Range Filter Card */}
      <Card.Base className="mb-6 p-4">
        <div className="flex justify-between items-center">
          <Typography variant="h6" className="text-gray-700">
            Filter Data By Year Range
          </Typography>
          <div className="min-w-64">
            <YearPicker
              initialStartYear={selectedStartYear}
              initialEndYear={selectedEndYear}
              onStartYearChange={(year) => handleStartYearChange(year, selectedEndYear)}
              onEndYearChange={handleEndYearChange}
            />
          </div>
        </div>
      </Card.Base>

      {/* Chart Section */}
      <Card.Base className="mb-6 overflow-hidden" ref={chartRef}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Generation Overview</h2>
          {currentProjection && (
            <div className="mt-2">
              <span className="text-gray-500">Latest Projection:</span>
              <span className="ml-2 text-xl font-semibold text-slate-700">{currentProjection.toFixed(2)} GWh</span>
            </div>
          )}
        </div>
        <div className="p-6 h-96">
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
      </Card.Base>

      {/* Data Table */}
      <DataTable
        title={`Wind Generation Records (${selectedStartYear} - ${selectedEndYear})`}
        columns={tableColumns}
        data={filteredData}
        loading={loading}
        selectable={true}
        searchable={true}
        exportable={true}
        filterable={true}
        refreshable={true}
        pagination={true}
        onExport={handleExportData}
        onRefresh={handleRefresh}
        tableClasses={{
          paper: 'shadow-md rounded-md',
          headerCell: 'bg-gray-50',
          row: 'hover:bg-slate-50'
        }}
        emptyMessage={`No wind generation data available for years ${selectedStartYear} - ${selectedEndYear}`}
      />

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6">{isEditing ? 'Edit Record' : 'Add New Record'}</Typography>
          <IconButton onClick={handleCloseModal} size="small">
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
                onYearChange={handleYearChange}
              />
            </div>
            <div>
              <NumberBox
                label="Generation (GWh)"
                value={generationValue}
                onChange={handleGenerationChange}
                placeholder="Enter generation value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors.generation ? true : false}
                helperText={formValidation.errors.generation}
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formValidation.isValid}
            className="bg-slate-500 hover:bg-slate-600"
          >
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WindAdmin;