import React, { useState, useEffect, useCallback } from 'react';
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
import api from '../../features/modules/api';

// Import dummy data
import { 
  tableData
} from './dummyData';

// Add import for SingleYearPicker
import {
  SingleYearPicker,
} from '@shared/index';

// Prototype only - this would normally be imported
const Button = ({ children, className, variant, onClick }) => (
  <button 
    className={`px-4 py-2 rounded-md font-medium ${
      variant === 'primary' 
        ? 'bg-green-500 text-white hover:bg-green-600' 
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    } ${className}`}
    onClick={onClick}
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
      onChange={onChange} // Add onChange handler
    />
  </div>
);

// Prototype TextBox component
const TextBox = ({ label, value, placeholder, multiline, rows, disabled }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {multiline ? (
      <textarea
        className={`border rounded-md p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
        placeholder={placeholder}
        value={value || ''}
        rows={rows || 3}
        disabled={disabled}
        readOnly={disabled}
      />
    ) : (
      <input
        type="text"
        className={`border rounded-md p-2 w-full ${disabled ? 'bg-gray-100' : ''}`}
        placeholder={placeholder}
        value={value || ''}
        disabled={disabled}
        readOnly={disabled}
      />
    )}
  </div>
);

const RecommendationAdminPrototype = () => {
  // Separate state for add and edit modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  // Add state for selected year 
  const [addModalYear, setAddModalYear] = useState(new Date().getFullYear());
  const [editModalYear, setEditModalYear] = useState(new Date().getFullYear());
  // Add loading and notification states
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  // Add state for API data
  const [apiData, setApiData] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);

  // Function to fetch recommendation data from API
  const fetchRecommendationData = useCallback(async () => {
    setIsTableLoading(true);
    setTableError(null);
    
    try {
      const response = await api.get('/api/add/recommendations');
      
      if (response.data.status === 'success') {
        const records = response.data.records || [];
        console.log('Fetched recommendation records:', records);
        
        // Format the records for table display
        const formattedRecords = records.map(record => ({
          id: record._id,
          year: record.Year,
          solarCost: record["Solar Cost (PHP/W)"],
          meralcoRate: record["MERALCO Rate (PHP/kWh)"]
        }));
        
        setApiData(formattedRecords);
      } else {
        setTableError(`Error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error fetching recommendation data:', err);
      setTableError(`Failed to load data: ${err.message}`);
    } finally {
      setIsTableLoading(false);
    }
  }, []);
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchRecommendationData();
  }, [fetchRecommendationData]);
  
  // Handler for year changes
  const handleAddYearChange = (year) => {
    setAddModalYear(year);
    setSelectedRecord({
      ...selectedRecord,
      Year: year
    });
  };
  
  const handleEditYearChange = (year) => {
    setEditModalYear(year);
    setSelectedRecord({
      ...selectedRecord,
      Year: year
    });
  };
  
  // Separate functions for opening add and edit modals
  const openAddModal = () => {
    // Initialize with empty record or defaults
    const defaultYear = new Date().getFullYear();
    setAddModalYear(defaultYear);
    setSelectedRecord({
      Year: defaultYear,
      "Solar Cost (PHP/W)": "",
      "MERALCO Rate (PHP/kWh)": ""
    });
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (record) => {
    setEditModalYear(record.Year);
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };
  
  // Close functions
  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);

  // Function to save recommendation data to database
  const handleSaveRecommendation = async () => {
    setIsLoading(true);
    
    try {
      // Prepare the data payload with just the required fields
      // Convert string values to numbers using parseFloat
      const payload = {
        Year: addModalYear,
        "Solar Cost (PHP/W)": parseFloat(selectedRecord["Solar Cost (PHP/W)"]) || 0,
        "MERALCO Rate (PHP/kWh)": parseFloat(selectedRecord["MERALCO Rate (PHP/kWh)"]) || 0
      };
      
      console.log('Saving recommendation with payload:', payload);
      
      // Make API request to backend
      const response = await api.post('/api/add/recommendations', payload);
      
      if (response.data.status === 'success') {
        setNotification({
          open: true,
          message: 'Recommendation created successfully!',
          type: 'success'
        });
        closeAddModal();
        // Refresh data after successful save
        fetchRecommendationData();
      } else {
        setNotification({
          open: true,
          message: `Error: ${response.data.message || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Error saving recommendation:', err);
      let errorMessage = 'Failed to save recommendation';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out - the server took too long to respond';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error - please check if the backend server is running';
      } else if (err.response) {
        errorMessage = err.response.data.message || err.message;
      }
      
      setNotification({
        open: true,
        message: `Error: ${errorMessage}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add update function for editing records
  const handleUpdateRecommendation = async () => {
    setIsLoading(true);
    
    try {
      // Prepare the data payload with just the required fields
      // Convert string values to numbers using parseFloat
      const payload = {
        Year: editModalYear,
        "Solar Cost (PHP/W)": parseFloat(selectedRecord["Solar Cost (PHP/W)"]) || 0,
        "MERALCO Rate (PHP/kWh)": parseFloat(selectedRecord["MERALCO Rate (PHP/kWh)"]) || 0
      };
      
      console.log('Updating recommendation with payload:', payload);
      
      // Make API request to backend
      const response = await api.put(`/api/add/recommendations/${selectedRecord.id}`, payload);
      
      if (response.data.status === 'success') {
        setNotification({
          open: true,
          message: 'Recommendation updated successfully!',
          type: 'success'
        });
        closeEditModal();
        // Refresh data after successful update
        fetchRecommendationData();
      } else {
        setNotification({
          open: true,
          message: `Error: ${response.data.message || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Error updating recommendation:', err);
      let errorMessage = 'Failed to update recommendation';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out - the server took too long to respond';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error - please check if the backend server is running';
      } else if (err.response) {
        errorMessage = err.response.data.message || err.message;
      }
      
      setNotification({
        open: true,
        message: `Error: ${errorMessage}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add functionality to delete a record
  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    setIsLoading(true);
    try {
      const response = await api.delete(`/api/add/recommendations/${recordId}`);
      
      if (response.data.status === 'success') {
        setNotification({
          open: true,
          message: 'Recommendation deleted successfully!',
          type: 'success'
        });
        fetchRecommendationData();
      } else {
        setNotification({
          open: true,
          message: `Error: ${response.data.message || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Error deleting recommendation:', err);
      setNotification({
        open: true,
        message: `Error: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Add handleInputChange function
  const handleInputChange = (field, e) => {
    setSelectedRecord(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Energy Recommendations</h1>
            <p className="text-gray-500">Generate and manage energy recommendations based on regional data</p>
          </div>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={openAddModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Recommendation
        </Button>
      </div>

      {/* Data Table */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recommendation History</h2>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input type="text" placeholder="Search records..." className="border rounded-md p-2 mr-2" />
              <Button variant="secondary" className="mr-2">
                Search
              </Button>
            </div>
            <div className="flex items-center">
              <Button 
                variant="secondary" 
                className="mr-2"
                onClick={fetchRecommendationData}
                disabled={isTableLoading}
              >
                {isTableLoading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button variant="primary">
                Export
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isTableLoading ? (
            <div className="flex justify-center items-center p-6">
              <CircularProgress size={40} />
            </div>
          ) : tableError ? (
            <div className="text-center p-6 text-red-500">
              {tableError}
            </div>
          ) : apiData.length === 0 ? (
            <div className="text-center p-6 text-gray-500">
              No recommendation records found. Add a new recommendation to get started.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solar Cost (PHP/W)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MERALCO Rate (PHP/kWh)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiData.map((row) => (
                  <tr key={row.id} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.solarCost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.meralcoRate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-green-600 hover:text-green-900 mr-3"
                        onClick={() => {
                          const record = {
                            ...row,
                            Year: row.year,
                            "Solar Cost (PHP/W)": row.solarCost,
                            "MERALCO Rate (PHP/kWh)": row.meralcoRate
                          };
                          openEditModal(record);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteRecord(row.id)}
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{apiData.length}</span> of <span className="font-medium">{apiData.length}</span> records
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

      {/* Add Modal - Simplified with just Year and Input Parameters */}
      <Dialog open={isAddModalOpen} onClose={closeAddModal} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span className="text-lg font-medium">Add New Recommendation</span>
          <IconButton onClick={closeAddModal} size="small">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="p-4 space-y-6">
            {/* Replace Year picker with SingleYearPicker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <SingleYearPicker
                initialYear={addModalYear}
                onYearChange={handleAddYearChange}
              />
            </div>
            
            {/* Input Parameters */}
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Input Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Solar Cost (PHP/W)"
                  value={selectedRecord["Solar Cost (PHP/W)"]}
                  placeholder="Enter value"
                  onChange={(e) => handleInputChange("Solar Cost (PHP/W)", e)}
                />
                <NumberBox
                  label="MERALCO Rate (PHP/kWh)"
                  value={selectedRecord["MERALCO Rate (PHP/kWh)"]}
                  placeholder="Enter value"
                  onChange={(e) => handleInputChange("MERALCO Rate (PHP/kWh)", e)}
                />
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            variant="secondary"
            onClick={closeAddModal}
            className="mr-2"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveRecommendation}
            disabled={isLoading || !selectedRecord["Solar Cost (PHP/W)"] || !selectedRecord["MERALCO Rate (PHP/kWh)"]}
          >
            {isLoading ? (
              <div className="flex items-center">
                <CircularProgress size={16} color="inherit" className="mr-2" />
                Saving...
              </div>
            ) : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal - Simplified to match Add Modal */}
      <Dialog open={isEditModalOpen} onClose={closeEditModal} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span className="text-lg font-medium">Edit Recommendation</span>
          <IconButton onClick={closeEditModal} size="small">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="p-4 space-y-6">
            {/* Year picker (disabled for edit mode) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <SingleYearPicker
                initialYear={editModalYear}
                onYearChange={handleEditYearChange}
                disabled={true} // Disable year picker for editing existing records
              />
            </div>
            
            {/* Input Parameters */}
            <div className="border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-4">Input Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberBox
                  label="Solar Cost (PHP/W)"
                  value={selectedRecord["Solar Cost (PHP/W)"]}
                  placeholder="Enter value"
                  onChange={(e) => handleInputChange("Solar Cost (PHP/W)", e)}
                />
                <NumberBox
                  label="MERALCO Rate (PHP/kWh)"
                  value={selectedRecord["MERALCO Rate (PHP/kWh)"]}
                  placeholder="Enter value"
                  onChange={(e) => handleInputChange("MERALCO Rate (PHP/kWh)", e)}
                />
              </div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            variant="secondary"
            onClick={closeEditModal}
            className="mr-2"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateRecommendation}
            disabled={isLoading || !selectedRecord["Solar Cost (PHP/W)"] || !selectedRecord["MERALCO Rate (PHP/kWh)"]}
          >
            {isLoading ? (
              <div className="flex items-center">
                <CircularProgress size={16} color="inherit" className="mr-2" />
                Updating...
              </div>
            ) : 'Update'}
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

export default RecommendationAdminPrototype;