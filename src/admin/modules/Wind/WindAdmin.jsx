// WindAdmin.jsx
import React, { useMemo, useState, useCallback } from 'react';
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
import { Wind, X } from 'lucide-react';
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

import useWindAnalytics from './adminWindHook';
import { getTableColumns, formatDataForChart, getChartConfig, generateSampleData, validateInputs } from './adminWindUtil';

const WindAdmin = () => {
  // Custom hooks
  const {
    generationData,
    currentProjection,
    loading,
    selectedStartYear,
    selectedEndYear,
    handleStartYearChange,
    handleEndYearChange,
    handleRefresh,
    handleDownload,
    addRecord,
    updateRecord,
    deleteRecord,
    windSpeedData,
    turbinePerformance,
    chartRef
  } = useWindAnalytics();

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generationValue, setGenerationValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Define all handlers at the top of component - BEFORE any useMemo calls
  
  // Modal handlers
  const handleOpenAddModal = useCallback(() => {
    setIsEditing(false);
    setSelectedYear(new Date().getFullYear());
    setGenerationValue('');
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((row) => {
    setIsEditing(true);
    setEditId(row.id);
    setSelectedYear(row.year);
    setGenerationValue(row.generation.toString());
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
  }, []);

  const handleGenerationChange = useCallback((event) => {
    setGenerationValue(event.target.value);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }
    
    try {
      await deleteRecord(id);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }, [deleteRecord]);

  // Form submit handler
  const handleSubmit = useCallback(async () => {
    if (!selectedYear || !generationValue) {
      return;
    }

    try {
      setIsModalOpen(false);
      
      if (isEditing) {
        await updateRecord(editId, selectedYear, parseFloat(generationValue));
      } else {
        await addRecord(selectedYear, parseFloat(generationValue));
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [selectedYear, generationValue, isEditing, editId, updateRecord, addRecord]);

  // Export data handler - DEFINED BEFORE IT'S USED
  const handleExportData = useCallback(() => {
    // Delegate to the download handler from the hook
    handleDownload();
  }, [handleDownload]);

  // For demo purposes, use the data from the hook or sample data if empty
  const effectiveData = useMemo(() => {
    if (generationData.length > 0) {
      return generationData.map((item, index) => ({
        id: index + 1,
        year: item.date,
        generation: item.value,
        dateAdded: new Date().toISOString()
      }));
    }
    return generateSampleData();
  }, [generationData]);

  // Year range for filtering
  const yearRange = useMemo(() => ({
    startYear: selectedStartYear,
    endYear: selectedEndYear
  }), [selectedStartYear, selectedEndYear]);

  // Filter data based on selected year range
  const filteredData = useMemo(() => {
    return effectiveData.filter(item => 
      item.year >= yearRange.startYear && 
      item.year <= yearRange.endYear
    );
  }, [effectiveData, yearRange]);

  // Format data for chart
  const chartData = useMemo(() => 
    formatDataForChart(filteredData),
    [filteredData]
  );

  // Configure data table columns
  const tableColumns = useMemo(() => 
    getTableColumns(handleOpenEditModal, handleDelete), 
    [handleOpenEditModal, handleDelete]);
  
  // Use useDataTable hook with filtered data - NOW handleExportData is defined BEFORE it's used here
  const {
    data: tableData,
    loading: tableLoading,
    handleExport,
    handleRefresh: refreshTable,
  } = useDataTable({
    data: filteredData,
    columns: tableColumns,
    onExport: handleExportData, // Now this is safe
    onRefresh: handleRefresh
  });
  
  // Memoize chart config to prevent recreation
  const chartConfig = useMemo(() => {
    const config = getChartConfig();
    // Add line chart specific configuration
    config.line = {
      stroke: '#64748B', // Slate color for wind
      strokeWidth: 2,
      dot: {
        r: 5,
        fill: '#64748B',
        stroke: '#fff',
        strokeWidth: 2
      },
      activeDot: {
        r: 7,
        fill: '#64748B',
        stroke: '#fff',
        strokeWidth: 2
      }
    };
    
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
    if (selectedYear && generationValue) {
      return validateInputs(selectedYear, generationValue);
    }
    return { isValid: false, errors: {} };
  }, [selectedYear, generationValue]);

  if (loading && generationData.length === 0) {
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
          {currentProjection && (
            <div className="mt-2">
              <span className="text-gray-500">Latest Projection:</span>
              <span className="ml-2 text-xl font-semibold text-slate-700">{currentProjection.toFixed(2)} GWh</span>
            </div>
          )}
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
      </Card.Base>

      {/* Data Table */}
      <DataTable
        title={`Wind Generation Records (${yearRange.startYear} - ${yearRange.endYear})`}
        columns={tableColumns}
        data={tableData}
        loading={tableLoading}
        selectable={true}
        searchable={true}
        exportable={true}
        filterable={true}
        refreshable={true}
        pagination={true}
        onExport={handleExport}
        onRefresh={refreshTable}
        tableClasses={{
          paper: 'shadow-md rounded-md',
          headerCell: 'bg-gray-50',
          row: 'hover:bg-slate-50'
        }}
        emptyMessage={`No wind generation data available for years ${yearRange.startYear} - ${yearRange.endYear}`}
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