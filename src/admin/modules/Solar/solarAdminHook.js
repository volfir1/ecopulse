// useSolarAdmin.js
import { useState, useEffect, useCallback } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from '@shared/index';

export const useSolarAdmin = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generationValue, setGenerationValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoize fetch function to prevent recreation
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // For development, handle possible API errors gracefully
      try {
        const response = await api.get('/api/predictions/solar/');
        const formattedData = response.data.predictions.map((item, index) => ({
          id: index + 1,
          year: item.Year,
          generation: parseFloat(item['Predicted Production']),
          dateAdded: new Date().toISOString(),
        }));
        setData(formattedData);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // For development, use sample data when API fails
        setData([]); // Will use generateSampleData in component
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to fetch solar generation data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Fetch data on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // Memoize all handler functions to prevent recreation on each render
  
  // Open modal for adding new data
  const handleOpenAddModal = useCallback(() => {
    setIsEditing(false);
    setSelectedYear(new Date().getFullYear());
    setGenerationValue('');
    setIsModalOpen(true);
  }, []);

  // Open modal for editing existing data
  const handleOpenEditModal = useCallback((row) => {
    setIsEditing(true);
    setEditId(row.id);
    setSelectedYear(row.year);
    setGenerationValue(row.generation.toString());
    setIsModalOpen(true);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Handle year change in the form - works with SingleYearPicker
  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
  }, []);

  // Handle generation value change
  const handleGenerationChange = useCallback((event) => {
    setGenerationValue(event.target.value);
  }, []);

  // Submit form data
  const handleSubmit = useCallback(async () => {
    if (!selectedYear || !generationValue) {
      enqueueSnackbar('Please fill all fields', { variant: 'warning' });
      return;
    }

    const payload = {
      Year: selectedYear,
      'Predicted Production': parseFloat(generationValue)
    };

    setLoading(true);
    try {
      if (isEditing) {
        // Update existing record
        await api.put(`/api/predictions/solar/${editId}`, payload);
        enqueueSnackbar('Solar generation data updated successfully', { variant: 'success' });
      } else {
        // Add new record
        await api.post('/api/predictions/solar/', payload);
        enqueueSnackbar('Solar generation data added successfully', { variant: 'success' });
      }
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error saving data:', error);
      enqueueSnackbar(`Failed to ${isEditing ? 'update' : 'add'} solar generation data`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedYear, generationValue, isEditing, editId, enqueueSnackbar]);

  // Delete record
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/api/predictions/solar/${id}`);
      enqueueSnackbar('Solar generation data deleted successfully', { variant: 'success' });
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error deleting data:', error);
      enqueueSnackbar('Failed to delete solar generation data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Export data to CSV
  const handleExportData = useCallback((data) => {
    if (!data || data.length === 0) {
      enqueueSnackbar('No data to export', { variant: 'info' });
      return;
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
    link.setAttribute('download', 'Solar_Generation_Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [enqueueSnackbar]);

  return {
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
  };
};

export default useSolarAdmin;