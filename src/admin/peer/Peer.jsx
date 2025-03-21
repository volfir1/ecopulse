import React, { useState, useCallback, useEffect } from 'react';
import api from '../../features/modules/api';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Box, 
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

import {
  SingleYearPicker,
} from '@shared/index';

// Import custom hook
import { usePeerForm } from './peerUtil';

// Prototype only - this would normally be imported
const Button = ({ children, className, variant, onClick, disabled }) => (
  <button 
    className={`px-4 py-2 rounded-md font-medium ${
      variant === 'primary' 
        ? 'bg-blue-500 text-white hover:bg-blue-600' 
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    } ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

// Prototype only - this would normally be imported
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Prototype NumberBox component
const NumberBox = ({ label, value, placeholder, disabled, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      className={`border rounded-md p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
      placeholder={placeholder}
      value={value || ''}
      disabled={disabled}
      readOnly={disabled}
      onChange={onChange}
    />
  </div>
);

const PeerToPeerAdminPrototype = () => {
  // State for modal and form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  // State for data from MongoDB
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the custom hook for form state management
  const { formValues, setFormValue, resetForm, handleSubmit } = usePeerForm();
  
  // Fetch data from MongoDB via API - now without year filtering
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data for all available years');
      
      // Make a request to retrieve data from MongoDB without year range parameters
      const response = await api.get('/api/peertopeer/records');
      
      console.log('MongoDB data response:', response.data);
      
      if (response.data.status === 'success') {
        const records = response.data.records || [];
        console.log(`Received ${records.length} records from MongoDB`);
        
        // Log a sample of the data to see its structure
        if (records.length > 0) {
          console.log('Sample record:', records[0]);
          
          // Process the MongoDB data for table display
          const processedData = processMongoDataForTable(records);
          console.log('Processed data:', processedData);
          setTableData(processedData);
        } else {
          setError('No data available in the database');
        }
      } else {
        setError(`Error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error fetching peer-to-peer data:', err);
      setError(`Error fetching data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Process MongoDB data for table display - improved to handle different data structures

  const processMongoDataForTable = (records) => {
    // Sort records by year
    const sortedRecords = records.sort((a, b) => a.Year - b.Year);
  
    // Process each record to extract the required fields
    const processedData = sortedRecords.map(record => {
      // Helper function to safely parse and clean numeric values
      const parseAndClean = (value) => {
        if (value === null || value === undefined) return 0; // Handle null/undefined
        if (typeof value === 'number') return value; // If it's already a number, return it
        if (typeof value === 'string') {
          // Remove commas and parse as float
          const cleanedValue = value.replace(/,/g, '');
          return parseFloat(cleanedValue) || 0; // Fallback to 0 if parsing fails
        }
        return 0; // Fallback for other types
      };
    
      return {
        _id: record._id,
        year: record.Year,
        cebuTotal: parseAndClean(record['Cebu Total Power Generation (GWh)']),
        negrosTotal: parseAndClean(record['Negros Total Power Generation (GWh)']),
        panayTotal: parseAndClean(record['Panay Total Power Generation (GWh)']),
        leyteSamarTotal: parseAndClean(record['Leyte-Samar Total Power Generation (GWh)']),
        boholTotal: parseAndClean(record['Bohol Total Power Generation (GWh)']),
        visayasTotal: parseAndClean(record['Visayas Total Power Generation (GWh)']),
        visayasConsumption: parseAndClean(record['Visayas Total Power Consumption (GWh)']),
        solarCost: parseAndClean(record['Solar Cost (PHP/W)']),
        meralcoRate: parseAndClean(record['MERALCO Rate (PHP/kWh)']),
        allData: [record] // Store the original record for reference
      };
    });
  
    console.log('Processed data:', processedData);
    return processedData;
  };
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Functions for modal and form
  const openModal = (record = {}) => {
    setSelectedRecord(record);
    setIsEditing(!!record._id);
    
    // Populate the form with the selected record's data
    if (record._id && record.allData) {
      // Reset form before populating
      resetForm();
      
      // Set the year
      setSelectedYear(record.year);
      setFormValue('year', record.year);
      
      // Populate form with data from all records of this year
      record.allData.forEach(item => {
        const place = item.Place;
        const energyType = item['Energy Type'];
        const value = item['Predicted Value'] || item.value || 0;
        
        if (place && energyType) {
          const formKey = `${place} ${energyType}`;
          setFormValue(formKey, value);
        } else if (energyType === 'Visayas Total Power Generation (GWh)') {
          setFormValue('Visayas Total Power Generation (GWh)', value);
        } else if (energyType === 'Visayas Total Power Consumption (GWh)') {
          setFormValue('Visayas Total Power Consumption (GWh)', value);
        } else if (energyType === 'Solar Cost (PHP/W)') {
          setFormValue('Solar Cost (PHP/W)', value);
        } else if (energyType === 'MERALCO Rate (PHP/kWh)') {
          setFormValue('MERALCO Rate (PHP/kWh)', value);
        }
      });
    }
    
    setIsModalOpen(true);
  };

  // Handle delete functionality
  const handleDeleteRecord = useCallback(async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    setIsLoading(true);
    try {
      const response = await api.delete(`/api/peertopeer/records/${recordId}`);
      
      if (response.data.status === 'success') {
        setNotification({
          open: true,
          message: 'Record deleted successfully!',
          type: 'success'
        });
        fetchData();
      } else {
        setNotification({
          open: true,
          message: `Error: ${response.data.message}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      setNotification({
        open: true,
        message: `Error: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleOpenAddModal = useCallback(() => {
    setIsEditing(false);
    setSelectedRecord({});
    resetForm();
    setSelectedYear(new Date().getFullYear());
    setIsModalOpen(true);
  }, [resetForm]);  

  const closeModal = () => setIsModalOpen(false);
  
  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    setFormValue('year', year);
  }, [setFormValue]);

  const handleInputChange = useCallback((field, event) => {
    setFormValue(field, event.target.value);
  }, [setFormValue]);

  const handleSaveRecord = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const result = await handleSubmit(isEditing, selectedRecord._id);
      
      if (result.success) {
        setNotification({
          open: true,
          message: isEditing ? 'Record updated successfully!' : 'Record created successfully!',
          type: 'success'
        });
        setIsModalOpen(false);
        // Refresh data after successful save
        fetchData();
      } else {
        setNotification({
          open: true,
          message: `Error: ${result.message}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Error in handleSaveRecord:', err);
      setNotification({
        open: true,
        message: `Error: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [formValues, isEditing, selectedRecord._id, handleSubmit, fetchData]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Peer-to-Peer Energy Data</h1>
            <p className="text-gray-500">Manage regional energy generation and consumption data</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={handleOpenAddModal}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Record
        </Button>
      </div>

      {/* Data Table */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Peer-to-Peer Energy Records</h2>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input type="text" placeholder="Search records..." className="border rounded-md p-2 mr-2" disabled={isLoading} />
              <Button variant="secondary" className="mr-2" disabled={isLoading}>
                Search
              </Button>
            </div>
            <div className="flex items-center">
              <Button variant="secondary" className="mr-2" onClick={fetchData} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button variant="primary" disabled={isLoading || !tableData.length}>
                Export
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-8">
              {error}
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-gray-500 text-center p-8">
              No data available.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cebu Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negros Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Panay Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leyte-Samar Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bohol Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visayas Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visayas Consumption</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solar Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MERALCO Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row) => (
                  <tr key={row._id || row.year} className="hover:bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.cebuTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.negrosTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.panayTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.leyteSamarTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.boholTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.visayasTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.visayasConsumption.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.solarCost.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.meralcoRate.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => openModal(row)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteRecord(row._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{tableData.length}</span> of <span className="font-medium">{tableData.length}</span> records
          </div>
          <div className="flex items-center">
            <Button variant="secondary" className="mr-2" disabled>
              Previous
            </Button>
            <Button variant="secondary" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span className="text-lg font-medium">{isEditing ? 'Edit Record' : 'Add New Record'}</span>
          <IconButton onClick={closeModal} size="small">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
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
            
            {/* Cebu Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Cebu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Total Power Generation (GWh)"
                  value={formValues["Cebu Total Power Generation (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Total Non-Renewable Energy (GWh)"
                  value={formValues["Cebu Total Non-Renewable Energy (GWh)"]}
                  onChange={(e) => handleInputChange("Cebu Total Non-Renewable Energy (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Total Renewable Energy (GWh)"
                  value={formValues["Cebu Total Renewable Energy (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Geothermal (GWh)"
                  value={formValues["Cebu Geothermal (GWh)"]}
                  onChange={(e) => handleInputChange("Cebu Geothermal (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Hydro (GWh)"
                  value={formValues["Cebu Hydro (GWh)"]}
                  onChange={(e) => handleInputChange("Cebu Hydro (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Biomass (GWh)"
                  value={formValues["Cebu Biomass (GWh)"]}
                  onChange={(e) => handleInputChange("Cebu Biomass (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Solar (GWh)"
                  value={formValues["Cebu Solar (GWh)"]}
                  onChange={(e) => handleInputChange("Cebu Solar (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Wind (GWh)"
                  value={formValues["Cebu Wind (GWh)"]}
                  onChange={(e) => handleInputChange("Cebu Wind (GWh)", e)}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Negros Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Negros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Total Power Generation (GWh)"
                  value={formValues["Negros Total Power Generation (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Total Non-Renewable Energy (GWh)"
                  value={formValues["Negros Total Non-Renewable Energy (GWh)"]}
                  onChange={(e) => handleInputChange("Negros Total Non-Renewable Energy (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Total Renewable Energy (GWh)"
                  value={formValues["Negros Total Renewable Energy (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Geothermal (GWh)"
                  value={formValues["Negros Geothermal (GWh)"]}
                  onChange={(e) => handleInputChange("Negros Geothermal (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Hydro (GWh)"
                  value={formValues["Negros Hydro (GWh)"]}
                  onChange={(e) => handleInputChange("Negros Hydro (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Biomass (GWh)"
                  value={formValues["Negros Biomass (GWh)"]}
                  onChange={(e) => handleInputChange("Negros Biomass (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Solar (GWh)"
                  value={formValues["Negros Solar (GWh)"]}
                  onChange={(e) => handleInputChange("Negros Solar (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Wind (GWh)"
                  value={formValues["Negros Wind (GWh)"]}
                  onChange={(e) => handleInputChange("Negros Wind (GWh)", e)}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Panay Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Panay</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Total Power Generation (GWh)"
                  value={formValues["Panay Total Power Generation (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Total Non-Renewable Energy (GWh)"
                  value={formValues["Panay Total Non-Renewable Energy (GWh)"]}
                  onChange={(e) => handleInputChange("Panay Total Non-Renewable Energy (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Total Renewable Energy (GWh)"
                  value={formValues["Panay Total Renewable Energy (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Geothermal (GWh)"
                  value={formValues["Panay Geothermal (GWh)"]}
                  onChange={(e) => handleInputChange("Panay Geothermal (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Hydro (GWh)"
                  value={formValues["Panay Hydro (GWh)"]}
                  onChange={(e) => handleInputChange("Panay Hydro (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Biomass (GWh)"
                  value={formValues["Panay Biomass (GWh)"]}
                  onChange={(e) => handleInputChange("Panay Biomass (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Solar (GWh)"
                  value={formValues["Panay Solar (GWh)"]}
                  onChange={(e) => handleInputChange("Panay Solar (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Wind (GWh)"
                  value={formValues["Panay Wind (GWh)"]}
                  onChange={(e) => handleInputChange("Panay Wind (GWh)", e)}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Leyte-Samar Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Leyte-Samar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Total Power Generation (GWh)"
                  value={formValues["Leyte-Samar Total Power Generation (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Total Non-Renewable Energy (GWh)"
                  value={formValues["Leyte-Samar Total Non-Renewable (GWh)"]}
                  onChange={(e) => handleInputChange("Leyte-Samar Total Non-Renewable (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Total Renewable Energy (GWh)"
                  value={formValues["Leyte-Samar Total Renewable (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Geothermal (GWh)"
                  value={formValues["Leyte-Samar Geothermal (GWh)"]}
                  onChange={(e) => handleInputChange("Leyte-Samar Geothermal (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Hydro (GWh)"
                  value={formValues["Leyte-Samar Hydro (GWh)"]}
                  onChange={(e) => handleInputChange("Leyte-Samar Hydro (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Biomass (GWh)"
                  value={formValues["Leyte-Samar Biomass (GWh)"]}
                  onChange={(e) => handleInputChange("Leyte-Samar Biomass (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Solar (GWh)"
                  value={formValues["Leyte-Samar Solar (GWh)"]}
                  onChange={(e) => handleInputChange("Leyte-Samar Solar (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Wind (GWh)"
                  value={formValues["Leyte-Samar Wind (GWh)"]}
                  onChange={(e) => handleInputChange("Leyte-Samar Wind (GWh)", e)}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Bohol Section */}
            <div className="border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Bohol</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Total Power Generation (GWh)"
                  value={formValues["Bohol Total Power Generation (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Total Non-Renewable Energy (GWh)"
                  value={formValues["Bohol Total Non-Renewable (GWh)"]}
                  onChange={(e) => handleInputChange("Bohol Total Non-Renewable (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Total Renewable Energy (GWh)"
                  value={formValues["Bohol Total Renewable (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Geothermal (GWh)"
                  value={formValues["Bohol Geothermal (GWh)"]}
                  onChange={(e) => handleInputChange("Bohol Geothermal (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Hydro (GWh)"
                  value={formValues["Bohol Hydro (GWh)"]}
                  onChange={(e) => handleInputChange("Bohol Hydro (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Biomass (GWh)"
                  value={formValues["Bohol Biomass (GWh)"]}
                  onChange={(e) => handleInputChange("Bohol Biomass (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Solar (GWh)"
                  value={formValues["Bohol Solar (GWh)"]}
                  onChange={(e) => handleInputChange("Bohol Solar (GWh)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="Wind (GWh)"
                  value={formValues["Bohol Wind (GWh)"]}
                  onChange={(e) => handleInputChange("Bohol Wind (GWh)", e)}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Visayas Total */}
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Visayas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Total Power Generation (GWh)"
                  value={formValues["Visayas Total Power Generation (GWh)"]}
                  disabled={true}
                  placeholder="Auto-calculated"
                />
                <NumberBox
                  label="Total Power Consumption (GWh)"
                  value={formValues["Visayas Total Power Consumption (GWh)"]}
                  onChange={(e) => handleInputChange("Visayas Total Power Consumption (GWh)", e)}
                  placeholder="Enter value"
                />
              </div>
            </div>
            
            {/* Recommendation Parameters */}
            <div className="border p-4 rounded-md bg-blue-50">
              <h3 className="text-lg font-medium mb-4">Recommendation Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Solar Cost (PHP/W)"
                  value={formValues["Solar Cost (PHP/W)"]}
                  onChange={(e) => handleInputChange("Solar Cost (PHP/W)", e)}
                  placeholder="Enter value"
                />
                <NumberBox
                  label="MERALCO Rate (PHP/kWh)"
                  value={formValues["MERALCO Rate (PHP/kWh)"]}
                  onChange={(e) => handleInputChange("MERALCO Rate (PHP/kWh)", e)}
                  placeholder="Enter value"
                />
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            variant="secondary"
            onClick={closeModal}
            className="mr-2"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveRecord}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isEditing ? 'Update' : 'Save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleNotificationClose}>
        <Alert onClose={handleNotificationClose} severity={notification.type} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PeerToPeerAdminPrototype;