// SolarAdmin.jsx
import React, { useMemo, useState } from 'react';
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

import useSolarAdmin from './solarAdminHook';
import { getTableColumns, formatDataForChart, getChartConfig, generateSampleData, validateInputs } from './adminSolarUtil';

const SolarAdmin = () => {
  // Custom hooks
  const {
    data,
    loading,
    isModalOpen,
    selectedYear,
    generationValue,
    isEditing,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleYearChange,
    handleGenerationChange,
    handleSubmit,
    handleDelete,
    handleExportData,
  } = useSolarAdmin();

  // State for year range filtering (used for both chart and table)
  const [yearRange, setYearRange] = useState({
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear() + 1
  });

  // For demo purposes, use sample data if no data is available
  const effectiveData = useMemo(() => 
    data.length > 0 ? data : generateSampleData(), 
    [data]
  );

  // Filter data based on selected year range - used for both chart and table
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

  // Configure data table - using useMemo to prevent recreation on each render
  const tableColumns = useMemo(() => 
    getTableColumns(handleOpenEditModal, handleDelete), 
    [handleOpenEditModal, handleDelete]
  );
  
  // Use useDataTable hook with memoized dependencies and filtered data
  const {
    data: tableData,
    loading: tableLoading,
    handleExport,
    handleRefresh,
  } = useDataTable({
    data: filteredData, // Use the filtered data here instead of all data
    columns: tableColumns,
    onExport: handleExportData,
    onRefresh: () => console.log('Refresh triggered')
  });
  
  // Memoize chart config to prevent recreation
  const chartConfig = useMemo(() => {
    const config = getChartConfig();
    // Add line chart specific configuration
    config.line = {
      stroke: '#FFD700', // Gold color
      strokeWidth: 2,
      dot: {
        r: 5,
        fill: '#FFD700',
        stroke: '#fff',
        strokeWidth: 2
      },
      activeDot: {
        r: 7,
        fill: '#FFD700',
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

  // Handle year range change for both chart and table filtering
  const handleStartYearChange = (year) => {
    setYearRange(prev => ({ ...prev, startYear: year }));
  };

  const handleEndYearChange = (year) => {
    setYearRange(prev => ({ ...prev, endYear: year }));
  };

  // Form validation
  const formValidation = useMemo(() => {
    if (selectedYear && generationValue) {
      return validateInputs(selectedYear, generationValue);
    }
    return { isValid: false, errors: {} };
  }, [selectedYear, generationValue]);

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
        onExport={handleExport}
        onRefresh={handleRefresh}
        tableClasses={{
          paper: 'shadow-md rounded-md',
          headerCell: 'bg-gray-50',
          row: 'hover:bg-amber-50'
        }}
        emptyMessage={`No solar generation data available for years ${yearRange.startYear} - ${yearRange.endYear}`}
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
                label="Total Renewable Energy (GWh)"
                value={generationValue.totalRenewable}
                onChange={(e) => handleGenerationChange(e, 'totalRenewable')}
                placeholder="Enter total renewable energy value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors.totalRenewable ? true : false}
                helperText={formValidation.errors.totalRenewable}
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
                error={formValidation.errors.geothermal ? true : false}
                helperText={formValidation.errors.geothermal}
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
                error={formValidation.errors.hydro ? true : false}
                helperText={formValidation.errors.hydro}
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
                error={formValidation.errors.biomass ? true : false}
                helperText={formValidation.errors.biomass}
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
                error={formValidation.errors.solar ? true : false}
                helperText={formValidation.errors.solar}
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
                error={formValidation.errors.wind ? true : false}
                helperText={formValidation.errors.wind}
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
                error={formValidation.errors.nonRenewable ? true : false}
                helperText={formValidation.errors.nonRenewable}
              />
            </div>
            <div>
              <NumberBox
                label="Total Power Generation (GWh)"
                value={generationValue.totalPower}
                onChange={(e) => handleGenerationChange(e, 'totalPower')}
                placeholder="Enter total power generation value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors.totalPower ? true : false}
                helperText={formValidation.errors.totalPower}
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
                error={formValidation.errors.population ? true : false}
                helperText={formValidation.errors.population}
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
                error={formValidation.errors.gdp ? true : false}
                helperText={formValidation.errors.gdp}
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
            // disabled={!formValidation.isValid}
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