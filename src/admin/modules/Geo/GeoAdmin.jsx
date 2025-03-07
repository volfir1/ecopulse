import React, { useMemo, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Thermometer, X, Edit, Trash } from 'lucide-react';
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

// Import the correct store and utilities
import { stores } from '@store/admin/adminEnergyStrore';
import adminEnergyUtils from '@store/admin/adminEnergyUtil';

// Import the enhanced export utility
import { exportEnhancedPDF } from '@store/admin/adminExportUtils';

const GeothermalAdmin = () => {
  // Define energy type and get the store
  const ENERGY_TYPE = 'geothermal';
  const geothermalStore = stores[ENERGY_TYPE];

  // Get the toast object from your custom useSnackbar hook
  const toast = useSnackbar();

  // State from the store using direct selectors
  const data = geothermalStore(state => state.data);
  const generationData = geothermalStore(state => state.generationData);
  const currentProjection = geothermalStore(state => state.currentProjection);
  const loading = geothermalStore(state => state.loading);
  const isModalOpen = geothermalStore(state => state.isModalOpen);
  const selectedYear = geothermalStore(state => state.selectedYear);
  const generationValue = geothermalStore(state => state.generationValue);
  const isEditing = geothermalStore(state => state.isEditing);
  const selectedStartYear = geothermalStore(state => state.selectedStartYear);
  const selectedEndYear = geothermalStore(state => state.selectedEndYear);
  const config = geothermalStore(state => state.config);

  // Actions from the store
  const initialize = geothermalStore(state => state.initialize);
  const handleOpenAddModal = geothermalStore(state => state.handleOpenAddModal);
  const handleOpenEditModal = geothermalStore(state => state.handleOpenEditModal);
  const handleCloseModal = geothermalStore(state => state.handleCloseModal);
  const handleYearChange = geothermalStore(state => state.handleYearChange);
  const handleGenerationChange = geothermalStore(state => state.handleGenerationChange);
  const handleSubmit = geothermalStore(state => state.handleSubmit);
  const handleDelete = geothermalStore(state => state.handleDelete);
  const handleStartYearChange = geothermalStore(state => state.handleStartYearChange);
  const handleEndYearChange = geothermalStore(state => state.handleEndYearChange);
  const handleRefresh = geothermalStore(state => state.handleRefresh);

  // Chart ref
  const chartRef = React.useRef(null);

  // Initialize data on component mount
  useEffect(() => {
    initialize();
    geothermalStore.getState().setChartRef(chartRef);
  }, [initialize]);

  // For demo purposes, use sample data if no data is available
  const effectiveData = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      return adminEnergyUtils.generateSampleData(ENERGY_TYPE);
    }
  }, [data, ENERGY_TYPE]);

  // Filter data based on selected year range
  const filteredData = useMemo(() => {
    if (!effectiveData || !Array.isArray(effectiveData)) {
      return [];
    }
    return effectiveData.filter(item => 
      item.year >= selectedStartYear && item.year <= selectedEndYear
    );
  }, [effectiveData, selectedStartYear, selectedEndYear]);

  // Format data for chart
  const chartData = useMemo(() => {
    return adminEnergyUtils.formatDataForChart(filteredData);
  }, [filteredData]);

  // Define custom table columns
  const tableColumns = useMemo(() => [
    {
      id: 'year',
      field: 'year',
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
      format: (value) =>
        value !== undefined && value !== null
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

  // Enhanced export to PDF
  const handleExportData = useCallback(() => {
    return exportEnhancedPDF({
      data: filteredData,
      energyType: ENERGY_TYPE,
      startYear: selectedStartYear,
      endYear: selectedEndYear,
      chartRef: chartRef,
      currentProjection: currentProjection ||
        (chartData.length > 0 ? chartData[chartData.length - 1].value : 0),
      toast
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

  // Memoize chart config
  const chartConfig = useMemo(() => {
    const config = adminEnergyUtils.getChartConfig(ENERGY_TYPE);
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-red-100">
            <Thermometer className="text-red-500" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Geothermal Generation Data</h1>
            <p className="text-gray-500">Manage historical and projected geothermal generation data</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
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
              onStartYearChange={handleStartYearChange}
              onEndYearChange={handleEndYearChange}
            />
          </div>
        </div>
      </Card.Base>

      {/* Chart Section */}
      <Card.Base className="mb-6 overflow-hidden" ref={chartRef}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Generation Overview</h2>
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
        title={`Geothermal Generation Records (${selectedStartYear} - ${selectedEndYear})`}
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
          row: 'hover:bg-red-50'
        }}
        emptyMessage={`No geothermal generation data available for years ${selectedStartYear} - ${selectedEndYear}`}
      />

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6">
            {isEditing ? 'Edit Record' : 'Add New Record'}
          </Typography>
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
          <Button variant="secondary" onClick={handleCloseModal} className="mr-2">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formValidation.isValid}
            className="bg-red-500 hover:bg-red-600"
          >
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GeothermalAdmin;
