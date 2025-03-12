// WindAdmin.jsx - With Integrated Improved Chart
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Alert
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { Wind, X, Database, TrendingUp, Info, AlertCircle } from 'lucide-react';
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
import { formatDataForChart, getChartConfig, validateInputs, formatTableData, getDataTypeStyles, getDataType } from './adminWindUtil';

// Improved Chart Component
const ImprovedWindChart = ({
  chartData,
  chartRef,
  yearRange,
  loading,
  currentProjection
}) => {
  // Calculate trend line based on historical data
  const historicalData = chartData.filter(item => !item.isPredicted);
  
  // Only calculate trend if we have enough historical data points
  const showTrendLine = historicalData.length >= 2;
  
  // Simple linear regression for trend line
  const getTrendData = () => {
    if (!showTrendLine) return [];
    
    // Extract x and y values
    const xValues = historicalData.map(d => d.year);
    const yValues = historicalData.map(d => d.value);
    
    // Calculate means
    const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
    const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;
    
    // Calculate slope and intercept
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < xValues.length; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += Math.pow(xValues[i] - xMean, 2);
    }
    
    const slope = numerator / denominator;
    const intercept = yMean - (slope * xMean);
    
    // Generate trend line data points
    const predictedYears = chartData
      .filter(item => item.isPredicted)
      .map(item => item.year);
      
    // Include historical years and predicted years in the trend
    const allYears = [...new Set([...xValues, ...predictedYears])].sort((a, b) => a - b);
    
    return allYears.map(year => ({
      year,
      trend: slope * year + intercept
    }));
  };
  
  // Get trend data
  const trendData = getTrendData();
  
  // Last historical year (for transition annotation)
  const lastHistoricalYear = historicalData.length > 0 
    ? Math.max(...historicalData.map(d => d.year))
    : null;
    
  // First predicted year
  const firstPredictedYear = chartData.find(d => d.isPredicted)?.year || null;
  
  // Define reference areas and lines for the transition
  const showTransitionElements = lastHistoricalYear && firstPredictedYear;
  
  // Y-axis domain with padding to ensure all points are visible
  const allValues = chartData.map(d => d.value).filter(v => !isNaN(v));
  const minValue = Math.min(...allValues) * 0.9; // 10% padding below
  const maxValue = Math.max(...allValues) * 1.1; // 10% padding above
  
  // Custom chart colors
  const colors = {
    historical: "#1E40AF", // Deep blue
    predicted: "#6B7280",  // Gray
    trend: "#10B981",      // Green
    transition: "#EF4444"  // Red
  };
  
  return (
    <Card.Base className="mb-6 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Generation Overview</h2>
        {currentProjection && (
          <div className="mt-2">
            <span className="text-gray-500">Latest Projection:</span>
            <span className="ml-2 text-xl font-semibold text-slate-600">
              {!isNaN(currentProjection) ? currentProjection.toFixed(2) : 'N/A'} GWh
            </span>
          </div>
        )}
      </div>
      
      {/* Info alert about data transition */}
      {showTransitionElements && (
        <Alert severity="info" className="mx-4 mt-4">
          <div className="flex items-center gap-2">
            <Info size={16} />
            <Typography variant="body2">
              Historical data ends at {lastHistoricalYear}. Predicted data begins at {firstPredictedYear}.
            </Typography>
          </div>
        </Alert>
      )}
      
      <div className="p-6 h-96" ref={chartRef}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="year" 
                type="number"
                domain={[yearRange.startYear, yearRange.endYear]}
                ticks={Array.from(
                  { length: yearRange.endYear - yearRange.startYear + 1 }, 
                  (_, i) => yearRange.startYear + i
                ).filter(year => year % Math.ceil((yearRange.endYear - yearRange.startYear) / 10) === 0)}
                tickMargin={10}
              />
              <YAxis 
                domain={[minValue, maxValue]}
                tickFormatter={(value) => value.toLocaleString()}
                label={{ 
                  value: 'Wind Generation (GWh)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' } 
                }}
              />
              
              {/* Tooltip with improved formatting */}
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}
                formatter={(value, name) => {
                  if (isNaN(value)) return ['N/A', ''];
                  
                  let formattedValue = `${parseFloat(value).toLocaleString(undefined, { 
                    maximumFractionDigits: 2 
                  })} GWh`;
                  
                  let formattedName = name;
                  if (name === "historical") {
                    formattedName = "Historical Generation";
                  } else if (name === "predicted") {
                    formattedName = "Predicted Generation";
                  } else if (name === "trend") {
                    formattedName = "Trend Based on Historical Data";
                  }
                  
                  return [formattedValue, formattedName];
                }}
                labelFormatter={(label) => `Year: ${label}`}
              />
              
              {/* Custom Legend */}
              <Legend 
                payload={[
                  { value: 'Historical Data', type: 'line', color: colors.historical },
                  { value: 'Predicted Data', type: 'line', color: colors.predicted, strokeDasharray: '5 5' },
                  ...(showTrendLine ? [{ value: 'Trend Line', type: 'line', color: colors.trend }] : [])
                ]}
                iconType="plainline"
                iconSize={14}
                margin={{ top: 10, bottom: 10 }}
              />
              
              {/* Transition reference line */}
              {showTransitionElements && (
                <ReferenceLine 
                  x={lastHistoricalYear + 0.5} 
                  stroke={colors.transition}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  label={{
                    position: 'top',
                    value: 'Data Transition',
                    fill: colors.transition,
                    fontSize: 12
                  }}
                />
              )}
              
              {/* Trend Line */}
              {showTrendLine && (
                <Line
                  data={trendData}
                  type="monotone"
                  dataKey="trend"
                  name="trend"
                  stroke={colors.trend}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                  strokeDasharray="6 3"
                />
              )}
              
              {/* Historical Data Line */}
              <Line 
                type="monotone"
                name="historical"
                dataKey={(datum) => datum.isPredicted ? null : datum.value}
                stroke={colors.historical}
                strokeWidth={3}
                dot={(props) => {
                  if (!props || !props.payload || props.payload.isPredicted) return null;
                  return (
                    <circle 
                      key={`historical-dot-${props.payload.id || props.index}`}
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill={colors.historical}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{
                  r: 7,
                  fill: colors.historical,
                  stroke: '#fff',
                  strokeWidth: 2
                }}
                connectNulls={true}
              />
              
              {/* Predicted Data Line */}
              <Line 
                type="monotone"
                name="predicted"
                dataKey={(datum) => datum.isPredicted ? datum.value : null}
                stroke={colors.predicted}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={(props) => {
                  if (!props || !props.payload || !props.payload.isPredicted) return null;
                  return (
                    <circle 
                      key={`predicted-dot-${props.payload.id || props.index}`}
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={colors.predicted}
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  );
                }}
                activeDot={{
                  r: 6,
                  fill: colors.predicted,
                  stroke: '#fff',
                  strokeWidth: 2
                }}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card.Base>
  );
};

// Function to get table columns with better data type indication
const getTableColumns = (handleOpenEditModal, handleDelete, dataType) => {
  // Base columns
  const baseColumns = [
    {
      id: 'year',
      header: 'Year',
      accessor: 'year',
      sortable: true,
      cell: (info) => (
        <span className="font-medium">{info.getValue()}</span>
      )
    },
    {
      id: 'generation',
      header: 'Wind Generation (GWh)',
      accessor: 'generation',
      sortable: true,
      cell: (info) => {
        const row = info.row.original;
        const styles = row.isPredicted ? 'text-gray-600 italic' : 'text-blue-600 font-semibold';
        const value = parseFloat(info.getValue());
        
        return (
          <span className={styles}>
            {isNaN(value) ? 'N/A' : value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        );
      }
    },
    {
      id: 'nonRenewableEnergy',
      header: 'Non-Renewable (GWh)',
      accessor: 'nonRenewableEnergy',
      sortable: true,
      cell: (info) => {
        const value = info.getValue();
        if (value === null || value === undefined || isNaN(parseFloat(value))) {
          return <span className="text-gray-400">N/A</span>;
        }
        return <span>{parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>;
      }
    },
    {
      id: 'population',
      header: 'Population (M)',
      accessor: 'population',
      sortable: true,
      cell: (info) => {
        const value = info.getValue();
        if (value === null || value === undefined || isNaN(parseFloat(value))) {
          return <span className="text-gray-400">N/A</span>;
        }
        return <span>{parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>;
      }
    },
    {
      id: 'gdp',
      header: 'GDP (USD)',
      accessor: 'gdp',
      sortable: true,
      cell: (info) => {
        const value = info.getValue();
        if (value === null || value === undefined || isNaN(parseFloat(value))) {
          return <span className="text-gray-400">N/A</span>;
        }
        return <span>{parseFloat(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>;
      }
    }
  ];
  
  // Only add action column for MongoDB data (not predicted)
  if (dataType === 'mongodb') {
    return [
      ...baseColumns,
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleOpenEditModal(row)}
                className="bg-blue-50 hover:bg-blue-100"
              >
                <AppIcon name="edit" size={16} />
              </IconButton>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(row.year)}
                className="bg-red-50 hover:bg-red-100"
              >
                <AppIcon name="trash" size={16} />
              </IconButton>
            </div>
          );
        }
      }
    ];
  }

  // For predicted data, add a status column with tooltip explanation
  return [
    ...baseColumns,
    {
      id: 'status',
      header: 'Status',
      cell: () => (
        <Tooltip title="This data is predicted by AI and cannot be edited">
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            Predicted
            <Info size={12} className="text-gray-400" />
          </span>
        </Tooltip>
      )
    }
  ];
};

const WindAdmin = () => {
  // State for debug alerts
  const [dataStatus, setDataStatus] = useState({ 
    mongo: 0, 
    predicted: 0 
  });

  // Reference to track initial mount
  const isInitialMount = useRef(true);

  // Custom hooks
  const {
    generationData,
    mongoDbData,      // MongoDB data only (has edit/delete)
    predictedData,    // Predicted data only (no edit/delete)
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
    isRecordEditable,  // Helper function to check if a record is editable
    windSpeedData,
    turbinePerformance,
    chartRef,
    requestInProgress
  } = useWindAnalytics();

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generationValue, setGenerationValue] = useState('');
  const [nonRenewableEnergy, setNonRenewableEnergy] = useState('');
  const [population, setPopulation] = useState('');
  const [gdp, setGdp] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // FIXED: Only perform initial data load on first mount
  useEffect(() => {
    if (isInitialMount.current) {
      console.log("Initial mount detected - triggering one-time initial data load");
      isInitialMount.current = false;
      
      // Don't need to call handleRefresh() here as the hook will handle initial load
    }
  }, []);

  // Update data status counters whenever data changes for debugging
  useEffect(() => {
    setDataStatus({
      mongo: mongoDbData.length,
      predicted: predictedData.length
    });
    
    console.log("Data status updated:");
    console.log("MongoDB data:", mongoDbData.length, "records");
    console.log("Predicted data:", predictedData.length, "records");
  }, [mongoDbData, predictedData]);

  // Modal handlers
  const handleOpenAddModal = useCallback(() => {
    if (requestInProgress) return;
    
    setIsEditing(false);
    setSelectedYear(new Date().getFullYear());
    setGenerationValue('');
    setNonRenewableEnergy('');
    setPopulation('');
    setGdp('');
    setIsModalOpen(true);
  }, [requestInProgress]);

  const handleOpenEditModal = useCallback((row) => {
    if (requestInProgress) return;
    
    // Only allow editing MongoDB data (not predicted)
    if (!isRecordEditable(row.year)) {
      return; // Early return if not editable
    }
    
    setIsEditing(true);
    setEditId(row.id);
    setSelectedYear(row.year || new Date().getFullYear());
    setGenerationValue(row.generation?.toString() || '');
    setNonRenewableEnergy(row.nonRenewableEnergy?.toString() || '');
    setPopulation(row.population?.toString() || '');
    setGdp(row.gdp?.toString() || '');
    setIsModalOpen(true);
  }, [isRecordEditable, requestInProgress]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
  }, []);

  const handleGenerationChange = useCallback((event) => {
    setGenerationValue(event.target.value);
  }, []);

  const handleNonRenewableEnergyChange = useCallback((event) => {
    setNonRenewableEnergy(event.target.value);
  }, []);

  const handlePopulationChange = useCallback((event) => {
    setPopulation(event.target.value);
  }, []);

  const handleGdpChange = useCallback((event) => {
    setGdp(event.target.value);
  }, []);

  const handleDelete = useCallback(async (year) => {
    if (requestInProgress) return;
    
    // Only allow deleting MongoDB data (not predicted)
    if (!isRecordEditable(year)) {
      return; // Early return if not editable
    }
    
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }
    
    try {
      await deleteRecord(year);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }, [deleteRecord, isRecordEditable, requestInProgress]);

  // Form submit handler
  const handleSubmit = useCallback(async () => {
    if (requestInProgress || !selectedYear || !generationValue) {
      return;
    }
  
    try {
      setIsModalOpen(false);
      
      if (isEditing) {
        // For update operations
        const payload = {
          Year: selectedYear,
          'Predicted Production': parseFloat(generationValue),
          'Wind (GWh)': parseFloat(generationValue), // Include both field names
          'Non-Renewable Energy (GWh)': nonRenewableEnergy ? parseFloat(nonRenewableEnergy) : null,
          'Population (in millions)': population ? parseFloat(population) : null,
          'Gross Domestic Product': gdp ? parseFloat(gdp) : null,
          isPredicted: false // Explicitly mark as not predicted
        };
        
        await updateRecord(selectedYear, payload);
      } else {
        // For add operations
        const additionalData = {
          nonRenewableEnergy: nonRenewableEnergy ? parseFloat(nonRenewableEnergy) : null,
          population: population ? parseFloat(population) : null,
          gdp: gdp ? parseFloat(gdp) : null
        };
        await addRecord(selectedYear, parseFloat(generationValue), additionalData);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [selectedYear, generationValue, nonRenewableEnergy, population, gdp, isEditing, updateRecord, addRecord, requestInProgress]);

  // Handle tab change
  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  // Export data handler
  const handleExportData = useCallback(() => {
    handleDownload();
  }, [handleDownload]);

  // Format MongoDB data for the table with improved consistency
  const formattedMongoData = useMemo(() => {
    return mongoDbData.map((item, index) => ({
      id: item._id || `mongo-${index}`,
      year: item.date,
      generation: item.value,
      nonRenewableEnergy: item.nonRenewableEnergy,
      population: item.population,
      gdp: item.gdp,
      dateAdded: new Date().toISOString(),
      isPredicted: false,
      dataType: 'historical'
    }));
  }, [mongoDbData]);

  // Format predicted data for the table with clear indication
  const formattedPredictedData = useMemo(() => {
    return predictedData.map((item, index) => ({
      id: item._id || `predicted-${index}`,
      year: item.date,
      generation: item.value,
      nonRenewableEnergy: item.nonRenewableEnergy,
      population: item.population,
      gdp: item.gdp,
      dateAdded: new Date().toISOString(),
      isPredicted: true,
      dataType: 'predicted'
    }));
  }, [predictedData]);

  // Get the active data based on selected tab
  const activeData = useMemo(() => {
    return activeTab === 0 
      ? formattedMongoData 
      : formattedPredictedData;
  }, [activeTab, formattedMongoData, formattedPredictedData]);

  // Year range for filtering
  const yearRange = useMemo(() => ({
    startYear: selectedStartYear,
    endYear: selectedEndYear
  }), [selectedStartYear, selectedEndYear]);

  // Filter data based on selected year range
  const filteredData = useMemo(() => {
    console.log("Filtering years:", yearRange.startYear, "-", yearRange.endYear);
    
    // Only filter by year range, preserving data classification (historical/predicted)
    const filtered = activeData.filter(item => {
      // Parse year as number to ensure proper comparison
      const itemYear = parseInt(item.year);
      return !isNaN(itemYear) && 
             itemYear >= parseInt(yearRange.startYear) && 
             itemYear <= parseInt(yearRange.endYear);
    });
    
    console.log("Data after filtering:", filtered.length);
    return filtered;
  }, [activeData, yearRange]);

  // Format all data for chart with clear distinction between predicted and historical
  const chartData = useMemo(() => {
    // Combine both types of data but keep them clearly marked
    const mongoChartData = formattedMongoData
      .filter(item => 
        item.year >= yearRange.startYear && 
        item.year <= yearRange.endYear
      )
      .map(item => ({
        year: item.year,
        value: item.generation,
        isPredicted: false,
        id: `historical-${item.year}`
      }));
      
    const predictedChartData = formattedPredictedData
      .filter(item => 
        item.year >= yearRange.startYear && 
        item.year <= yearRange.endYear
      )
      .map(item => ({
        year: item.year,
        value: item.generation,
        isPredicted: true,
        id: `predicted-${item.year}`
      }));
    
    // Sort by year for proper chart display
    return [...mongoChartData, ...predictedChartData]
      .sort((a, b) => a.year - b.year);
  }, [formattedMongoData, formattedPredictedData, yearRange]);

  // Configure data table columns based on active tab
  const tableColumns = useMemo(() => 
    getTableColumns(
      handleOpenEditModal, 
      handleDelete, 
      activeTab === 0 ? 'mongodb' : 'predicted'
    ), 
    [handleOpenEditModal, handleDelete, activeTab]
  );
  
  // Use useDataTable hook with filtered data
  const {
    data: tableData,
    loading: tableLoading,
    handleExport,
    handleRefresh: refreshTable,
  } = useDataTable({
    data: filteredData,
    columns: tableColumns,
    onExport: handleExportData,
    onRefresh: handleRefresh
  });
  
  // Memoize chart config
  const chartConfig = useMemo(() => {
    return getChartConfig();
  }, []);

  // Form validation
  const formValidation = useMemo(() => {
    if (selectedYear && generationValue) {
      return validateInputs(selectedYear, generationValue, nonRenewableEnergy, population, gdp);
    }
    return { isValid: false, errors: {} };
  }, [selectedYear, generationValue, nonRenewableEnergy, population, gdp]);

  // Skeleton loader for initial loading state
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
          disabled={requestInProgress}
        >
          <AppIcon name="plus" size={18} />
          Add New Record
        </Button>
      </div>

      {/* Data debug (remove in production) */}
      <Alert severity="info" className="mb-4">
        <div className="flex items-center gap-4">
          <Typography variant="body2">
            Historical Records: {dataStatus.mongo} | Predicted Records: {dataStatus.predicted}
          </Typography>
          {requestInProgress && <div className="text-blue-500 animate-pulse">Request in progress...</div>}
        </div>
      </Alert>

      {/* Data Summary Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card.Base className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Database size={20} className="text-blue-600" />
            </div>
            <div>
              <Typography className="text-sm text-gray-500">Historical Records</Typography>
              <Typography className="text-2xl font-semibold">{formattedMongoData.length}</Typography>
            </div>
          </div>
        </Card.Base>
        
        <Card.Base className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-3 rounded-full">
              <TrendingUp size={20} className="text-gray-600" />
            </div>
            <div>
              <Typography className="text-sm text-gray-500">Predicted Records</Typography>
              <Typography className="text-2xl font-semibold">{formattedPredictedData.length}</Typography>
            </div>
          </div>
        </Card.Base>
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
              minYear={2000} // Set minimum selectable year
              maxYear={new Date().getFullYear() + 50} // Allow up to 50 years in future
              disabled={requestInProgress}
            />
          </div>
        </div>
      </Card.Base>

      {/* Improved Chart Section */}
      {chartData.length === 0 ? (
        <Card.Base className="mb-6 p-4">
          <div className="flex flex-col items-center justify-center h-64">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <Typography variant="h6" className="text-gray-500">
              No data available for the selected year range
            </Typography>
            <Typography variant="body2" className="text-gray-400 mt-2">
              Try adjusting the year range or add some records
            </Typography>
          </div>
        </Card.Base>
      ) : (
        <ImprovedWindChart
          chartData={chartData}
          chartRef={chartRef}
          yearRange={yearRange}
          loading={loading || requestInProgress}
          currentProjection={currentProjection}
        />
      )}

      {/* Tabbed Data Table */}
      <Card.Base className="mb-6 overflow-hidden">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            aria-label="data source tabs"
          >
            <Tab 
              icon={<Database size={16} />} 
              iconPosition="start" 
              label={
                <Badge 
                  badgeContent={formattedMongoData.length} 
                  color="primary"
                  sx={{ '.MuiBadge-badge': { right: -15, top: -2 } }}
                >
                  <span className="mr-3">Historical Data</span>
                </Badge>
              } 
            />
            <Tab 
              icon={<TrendingUp size={16} />} 
              iconPosition="start" 
              label={
                <Badge 
                  badgeContent={formattedPredictedData.length} 
                  color="secondary"
                  sx={{ '.MuiBadge-badge': { right: -15, top: -2 } }}
                >
                  <span className="mr-3">Predicted Data</span>
                </Badge>
              } 
            />
          </Tabs>
        </Box>
        <Box sx={{ p: 1 }}>
          <DataTable
            title={`${activeTab === 0 ? 'Historical' : 'Predicted'} Wind Generation Records (${yearRange.startYear} - ${yearRange.endYear})`}
            columns={tableColumns}
            data={tableData}
            loading={tableLoading || requestInProgress}
            selectable={true}
            searchable={true}
            exportable={true}
            filterable={true}
            refreshable={true}
            pagination={true}
            onExport={handleExport}
            onRefresh={refreshTable}
            tableClasses={{
              paper: "shadow-md rounded-md",
              headerCell: "bg-gray-50",
              row: (row) => row.isPredicted ? "hover:bg-gray-50 bg-gray-50" : "hover:bg-blue-50"
            }}
            emptyMessage={`No ${activeTab === 0 ? 'historical' : 'predicted'} wind generation data available for years ${yearRange.startYear} - ${yearRange.endYear}`}
          />
        </Box>
      </Card.Base>

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
                label="Wind Generation (GWh)"
                value={generationValue}
                onChange={handleGenerationChange}
                placeholder="Enter wind generation value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors.generation ? true : false}
                helperText={formValidation.errors.generation}
              />
            </div>
            <div>
              <NumberBox
                label="Non-Renewable Energy (GWh)"
                value={nonRenewableEnergy}
                onChange={handleNonRenewableEnergyChange}
                placeholder="Enter non-renewable energy value in GWh"
                variant="outlined"
                size="medium"
                min={0}
                step={0.01}
                fullWidth
                error={formValidation.errors.nonRenewableEnergy ? true : false}
                helperText={formValidation.errors.nonRenewableEnergy}
              />
            </div>
            <div>
              <NumberBox
                label="Population (in millions)"
                value={population}
                onChange={handlePopulationChange}
                placeholder="Enter population value in millions"
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
                label="Gross Domestic Product"
                value={gdp}
                onChange={handleGdpChange}
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
            disabled={!formValidation.isValid || requestInProgress}
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