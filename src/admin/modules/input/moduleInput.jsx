import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Container,
  Paper,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  Divider
} from '@mui/material';
import { ChevronLeft, Save } from 'lucide-react';
import { SingleYearPicker } from '@shared/index';

const SimplifiedEnergyForm = () => {
  // Navigation hook
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    solar: '',
    wind: '',
    hydro: '',
    geothermal: '',
    biomass: '',
    nonRenewableEnergy: '',
    population: '',
    gdp: '',
    isPredicted: false
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Handle year change
  const handleYearChange = useCallback((year) => {
    setFormData(prev => ({ ...prev, year }));
    
    // Set isPredicted automatically if year is in the future
    const currentYear = new Date().getFullYear();
    if (year > currentYear && !formData.isPredicted) {
      setFormData(prev => ({ ...prev, isPredicted: true }));
    }
  }, [formData.isPredicted]);
  
  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // If checkbox, use checked value; otherwise, use regular value
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: inputValue }));
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);
  
  // Load sample data
  const loadSampleData = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      solar: '1567.52',
      wind: '1346.78',
      hydro: '2105.63',
      geothermal: '945.31',
      biomass: '872.44',
      nonRenewableEnergy: '3200.75',
      population: '42.3',
      gdp: '1850'
    }));
  }, []);
  
  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    // Ensure at least one energy value is provided
    const hasEnergyValue = formData.solar || formData.wind || formData.hydro || 
                          formData.geothermal || formData.biomass;
                          
    if (!hasEnergyValue) {
      newErrors.general = 'At least one energy value is required';
    }
    
    // Validate number fields
    const numericFields = ['solar', 'wind', 'hydro', 'geothermal', 'biomass', 
                          'nonRenewableEnergy', 'population', 'gdp'];
                          
    numericFields.forEach(field => {
      if (formData[field] && isNaN(parseFloat(formData[field]))) {
        newErrors[field] = 'Must be a valid number';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format the data for submission
      const submissionData = {
        year: formData.year,
        solar: formData.solar ? parseFloat(formData.solar) : null,
        wind: formData.wind ? parseFloat(formData.wind) : null,
        hydro: formData.hydro ? parseFloat(formData.hydro) : null,
        geothermal: formData.geothermal ? parseFloat(formData.geothermal) : null,
        biomass: formData.biomass ? parseFloat(formData.biomass) : null,
        nonRenewableEnergy: formData.nonRenewableEnergy ? parseFloat(formData.nonRenewableEnergy) : null,
        population: formData.population ? parseFloat(formData.population) : null,
        gdp: formData.gdp ? parseFloat(formData.gdp) : null,
        isPredicted: formData.isPredicted,
        dateAdded: new Date().toISOString()
      };
      
      // Here you would typically save the data to your API
      console.log('Saving record:', submissionData);
      
      // Navigate back to main page after successful save
      navigate('/');
    }
  }, [formData, navigate, validateForm]);
  
  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/');
  }, [navigate]);
  
  return (
    <Container maxWidth="lg" className="py-6">
      {/* Page Header */}
      <Box className="flex items-center justify-between mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Add Energy Record
        </Typography>
        <Button 
          variant="outlined" 
          onClick={loadSampleData}
          size="small"
        >
          Load Sample Data
        </Button>
      </Box>
      
      {/* Form */}
      <Paper elevation={0} className="border p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Year Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="mb-3 font-medium">
                Year
              </Typography>
              <Box className="mb-4">
                <SingleYearPicker
                  initialYear={formData.year}
                  onYearChange={handleYearChange}
                />
                {errors.year && (
                  <Typography variant="caption" color="error" className="mt-1 block">
                    {errors.year}
                  </Typography>
                )}
              </Box>
              
              {/* Projected Data Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    name="isPredicted"
                    checked={formData.isPredicted}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Projected data"
              />
            </Grid>
            
            {/* General error */}
            {errors.general && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error">
                  {errors.general}
                </Typography>
              </Grid>
            )}
            
            {/* Renewable Energy Inputs */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" className="mb-3 font-medium">
                Renewable Energy Values
              </Typography>
              
              <Grid container spacing={3}>
                {/* Solar */}
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    name="solar"
                    label="Solar Energy"
                    value={formData.solar}
                    onChange={handleInputChange}
                    placeholder="Enter solar generation"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={!!errors.solar}
                    helperText={errors.solar}
                    InputProps={{
                      endAdornment: <Typography variant="caption" color="text.secondary">GWh</Typography>
                    }}
                  />
                </Grid>
                
                {/* Wind */}
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    name="wind"
                    label="Wind Energy"
                    value={formData.wind}
                    onChange={handleInputChange}
                    placeholder="Enter wind generation"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={!!errors.wind}
                    helperText={errors.wind}
                    InputProps={{
                      endAdornment: <Typography variant="caption" color="text.secondary">GWh</Typography>
                    }}
                  />
                </Grid>
                
                {/* Hydro */}
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    name="hydro"
                    label="Hydroelectric Energy"
                    value={formData.hydro}
                    onChange={handleInputChange}
                    placeholder="Enter hydro generation"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={!!errors.hydro}
                    helperText={errors.hydro}
                    InputProps={{
                      endAdornment: <Typography variant="caption" color="text.secondary">GWh</Typography>
                    }}
                  />
                </Grid>
                
                {/* Geothermal */}
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    name="geothermal"
                    label="Geothermal Energy"
                    value={formData.geothermal}
                    onChange={handleInputChange}
                    placeholder="Enter geothermal generation"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={!!errors.geothermal}
                    helperText={errors.geothermal}
                    InputProps={{
                      endAdornment: <Typography variant="caption" color="text.secondary">GWh</Typography>
                    }}
                  />
                </Grid>
                
                {/* Biomass */}
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    name="biomass"
                    label="Biomass Energy"
                    value={formData.biomass}
                    onChange={handleInputChange}
                    placeholder="Enter biomass generation"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={!!errors.biomass}
                    helperText={errors.biomass}
                    InputProps={{
                      endAdornment: <Typography variant="caption" color="text.secondary">GWh</Typography>
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Additional Data Section */}
            <Grid item xs={12}>
              <Divider className="my-4" />
              <Typography variant="subtitle1" className="mb-3 font-medium">
                Additional Data
              </Typography>
              
              <Grid container spacing={3}>
                {/* Non-Renewable Energy */}
                <Grid item xs={12} md={4}>
                  <TextField
                    name="nonRenewableEnergy"
                    label="Non-Renewable Energy"
                    value={formData.nonRenewableEnergy}
                    onChange={handleInputChange}
                    placeholder="Enter value"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={!!errors.nonRenewableEnergy}
                    helperText={errors.nonRenewableEnergy}
                    InputProps={{
                      endAdornment: <Typography variant="caption" color="text.secondary">GWh</Typography>
                    }}
                  />
                </Grid>
                
                {/* Population */}
                <Grid item xs={12} md={4}>
                  <TextField
                    name="population"
                    label="Population"
                    value={formData.population}
                    onChange={handleInputChange}
                    placeholder="Enter value"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={!!errors.population}
                    helperText={errors.population}
                    InputProps={{
                      endAdornment: <Typography variant="caption" color="text.secondary">M</Typography>
                    }}
                  />
                </Grid>
                
                {/* GDP */}
                <Grid item xs={12} md={4}>
                  <TextField
                    name="gdp"
                    label="Gross Domestic Product"
                    value={formData.gdp}
                    onChange={handleInputChange}
                    placeholder="Enter GDP value"
                    fullWidth
                    variant="outlined"
                    type="number"
                    error={!!errors.gdp}
                    helperText={errors.gdp}
                    InputProps={{
                      endAdornment: <Typography variant="caption" color="text.secondary">USD</Typography>
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Form Actions */}
          <Box className="mt-8 flex justify-end gap-3">
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              startIcon={<ChevronLeft size={18} />}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained" 
              color="primary"
              startIcon={<Save size={18} />}
            >
              Save Record
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SimplifiedEnergyForm;