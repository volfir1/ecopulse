// useSolarAdmin.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@features/modules/api';
import { useSnackbar } from 'notistack'; // Ensure correct import

export const useSolarAdmin = () => {
  const { enqueueSnackbar } = useSnackbar(); // Ensure correct usage
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generationValue, setGenerationValue] = useState({
    totalRenewable: '',
    geothermal: '',
    hydro: '',
    biomass: '',
    solar: '',
    wind: '',
    nonRenewable: '',
    totalPower: '',
    population: '',
    gdp: ''
  });
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
    setGenerationValue({
      totalRenewable: '',
      geothermal: '',
      hydro: '',
      biomass: '',
      solar: '',
      wind: '',
      nonRenewable: '',
      totalPower: '',
      population: '',
      gdp: ''
    });
    setIsModalOpen(true);
  }, []);

  // Open modal for editing existing data
  const handleOpenEditModal = useCallback((row) => {
    setIsEditing(true);
    setEditId(row.id);
    setSelectedYear(row.year);
    setGenerationValue({
      solar: row.generation.solar.toString(),
      geothermal: row.generation.geothermal.toString(),
      hydro: row.generation.hydro.toString(),
      biomass: row.generation.biomass.toString(),
      wind: row.generation.wind.toString(),
      nonRenewable: row.generation.nonRenewable.toString(),
      totalRenewable: row.generation.totalRenewable.toString(),
      population: row.generation.population.toString(),
      gdp: row.generation.gdp.toString()
    });
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
  const handleGenerationChange = useCallback((event, type) => {
    setGenerationValue(prev => ({
      ...prev,
      [type]: event.target.value
    }));
  }, []);

  // Form validation
  const formValidation = useMemo(() => {
    const errors = {};

    if (!selectedYear) {
      errors.year = 'Year is required';
    }

    if (!generationValue.solar) {
      errors.solar = 'Solar generation value is required';
    }
    if (!generationValue.geothermal) {
      errors.geothermal = 'Geothermal generation value is required';
    }
    if (!generationValue.hydro) {
      errors.hydro = 'Hydropower generation value is required';
    }
    if (!generationValue.biomass) {
      errors.biomass = 'Biomass generation value is required';
    }
    if (!generationValue.wind) {
      errors.wind = 'Wind generation value is required';
    }
    if (!generationValue.nonRenewable) {
      errors.nonRenewable = 'Non-renewable energy generation value is required';
    }
    if (!generationValue.totalRenewable) {
      errors.totalRenewable = 'Total renewable generation value is required';
    }
    if (!generationValue.population) {
      errors.population = 'Population value is required';
    }
    if (!generationValue.gdp) {
      errors.gdp = 'GDP value is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [selectedYear, generationValue]);

  // Submit form data
  const handleSubmit = useCallback(async () => {
    if (!formValidation.isValid) {
      enqueueSnackbar('Please fill all fields', { variant: 'warning' });
      return;
    }

    const payload = {
      Year: selectedYear,
      'Total Renewable Energy (GWh)': parseFloat(generationValue.totalRenewable),
      'Geothermal (GWh)': parseFloat(generationValue.geothermal),
      'Hydro (GWh)': parseFloat(generationValue.hydro),
      'Biomass (GWh)': parseFloat(generationValue.biomass),
      'Solar (GWh)': parseFloat(generationValue.solar),
      'Wind (GWh)': parseFloat(generationValue.wind),
      'Non-Renewable Energy (GWh)': parseFloat(generationValue.nonRenewable),
      'Total Power Generation (GWh)': parseFloat(generationValue.totalPower),
      'Population': parseFloat(generationValue.population),
      'Gross Domestic Product (GDP)': parseFloat(generationValue.gdp)
    };

    setLoading(true);
    try {
      if (isEditing) {
        // Update existing record
        await api.put(`/api/create/solar/${editId}`, payload);
        enqueueSnackbar('Solar generation data updated successfully', { variant: 'success' });
      } else {
        // Add new record
        await api.post('/api/create/', payload);
        enqueueSnackbar('Solar generation data added successfully', { variant: 'success' });
      }

      // Insert actual data into MongoDB
      await api.post('/api/create/', payload);
      enqueueSnackbar('Actual data inserted successfully', { variant: 'success' });

      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1); // Trigger refetch
    } catch (error) {
      console.error('Error saving data:', error);
      enqueueSnackbar(`Failed to ${isEditing ? 'update' : 'add'} solar generation data`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedYear, generationValue, isEditing, editId, enqueueSnackbar, formValidation]);

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