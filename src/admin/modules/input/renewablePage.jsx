import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  Container,
  Grid,
  Button,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  BarChart3,
  Wind,
  Sun,
  Waves,
  Flame,
  Leaf,
  Download,
  RefreshCw
} from 'lucide-react';

// Energy types configuration
const energyTypes = [
  { id: 'all', label: 'All Energy', icon: <BarChart3 size={20} /> },
  { id: 'solar', label: 'Solar', icon: <Sun size={20} /> },
  { id: 'wind', label: 'Wind', icon: <Wind size={20} /> },
  { id: 'hydro', label: 'Hydro', icon: <Waves size={20} /> },
  { id: 'geothermal', label: 'Geothermal', icon: <Flame size={20} /> },
  { id: 'biomass', label: 'Biomass', icon: <Leaf size={20} /> }
];

// Mock data for demonstration purposes
const generateMockData = (type = null) => {
  const types = type ? [type] : ['solar', 'wind', 'hydro', 'geothermal', 'biomass'];
  const currentYear = new Date().getFullYear();
  
  return Array.from({ length: 10 }, (_, i) => {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const year = currentYear - Math.floor(Math.random() * 5);
    const isPredicted = year >= currentYear;
    
    return {
      id: i + 1,
      type: randomType,
      year,
      generation: Math.round(1000 + Math.random() * 2000),
      nonRenewableEnergy: Math.round(800 + Math.random() * 1500),
      population: (30 + Math.random() * 10).toFixed(1),
      gdp: Math.round(1000 + Math.random() * 5000),
      isPredicted,
      dateAdded: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
    };
  });
};

const RenewableEnergyPage = () => {
  // Navigation hook for routing
  const navigate = useNavigate();
  
  // State for the records
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEnergyType, setSelectedEnergyType] = useState('all');
  
  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get mock data for the selected energy type
      const data = generateMockData(selectedEnergyType === 'all' ? null : selectedEnergyType);
      setRecords(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // You would add proper error handling here
    } finally {
      setLoading(false);
    }
  }, [selectedEnergyType]);
  
  // Load data on mount and when energy type changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Filter data by energy type
  const filteredRecords = selectedEnergyType === 'all' 
    ? records 
    : records.filter(record => record.type === selectedEnergyType);
  
  // Handle energy type tab change
  const handleEnergyTypeChange = (_, newValue) => {
    setSelectedEnergyType(newValue);
  };
  
  // Navigate to add record page
  const handleNavigateToAddRecord = () => {
    navigate('/admin/modules/add', { 
      state: { 
        energyType: selectedEnergyType === 'all' ? 'solar' : selectedEnergyType 
      } 
    });
  };
  
  // Color utility function for energy types
  const getEnergyTypeColor = (type) => {
    switch(type) {
      case 'solar': return 'warning';
      case 'wind': return 'primary';
      case 'hydro': return 'info';
      case 'geothermal': return 'error';
      case 'biomass': return 'success';
      default: return 'default';
    }
  };
  
  // Icon utility function for energy types
  const getEnergyTypeIcon = (type) => {
    switch(type) {
      case 'solar': return <Sun size={16} />;
      case 'wind': return <Wind size={16} />;
      case 'hydro': return <Waves size={16} />;
      case 'geothermal': return <Flame size={16} />;
      case 'biomass': return <Leaf size={16} />;
      default: return <BarChart3 size={16} />;
    }
  };
  
  return (
    <Container maxWidth="xl" className="py-6">
      {/* Page Header */}
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Renewable Energy Data
        </Typography>
        
        <Box className="flex gap-2">
          <Button 
            variant="outlined" 
            startIcon={<RefreshCw size={18} />}
            onClick={fetchData}
            disabled={loading}
          >
            Refresh
          </Button>
          
          <Button 
            variant="outlined"
            color="primary"
            startIcon={<Download size={18} />}
          >
            Export
          </Button>
          
          <Button 
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            onClick={handleNavigateToAddRecord}
          >
            Add Record
          </Button>
        </Box>
      </Box>
      
      {/* Energy Type Tabs */}
      <Paper sx={{ marginBottom: 3 }} elevation={0} className="border">
        <Tabs
          value={selectedEnergyType}
          onChange={handleEnergyTypeChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="energy type tabs"
        >
          {energyTypes.map((type) => (
            <Tab
              key={type.id}
              value={type.id}
              icon={type.icon}
              label={type.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>
      
      {/* Records Grid */}
      <Box className="mb-6">
        {loading ? (
          // Loading state
          <Box className="py-12 flex justify-center items-center">
            <Typography>Loading...</Typography>
          </Box>
        ) : filteredRecords.length === 0 ? (
          // Empty state
          <Box className="py-12 flex flex-col justify-center items-center border border-dashed rounded-lg bg-gray-50">
            <BarChart3 size={40} className="text-gray-400 mb-2" />
            <Typography variant="h6" className="text-gray-600 mb-1">No Records Found</Typography>
            <Typography variant="body2" className="text-gray-500 mb-4">
              {selectedEnergyType === 'all' 
                ? 'There are no energy records available.' 
                : `There are no ${selectedEnergyType} energy records available.`}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Plus size={18} />}
              onClick={handleNavigateToAddRecord}
            >
              Add New Record
            </Button>
          </Box>
        ) : (
          // Data grid
          <Grid container spacing={3}>
            {filteredRecords.map((record) => (
              <Grid item xs={12} sm={6} md={4} key={record.id}>
                <Card className="h-full">
                  <Box className="p-4">
                    {/* Card Header - Simplified without actions menu */}
                    <Box className="flex items-center gap-2 mb-4">
                      <div className={`p-2 rounded-full bg-${getEnergyTypeColor(record.type)}-50`}>
                        {getEnergyTypeIcon(record.type)}
                      </div>
                      <Typography variant="h6" className="font-medium">
                        Year {record.year}
                      </Typography>
                      {record.isPredicted && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full ml-auto">
                          Projected
                        </span>
                      )}
                    </Box>
                    
                    {/* Card Content */}
                    <Box className="mb-3">
                      <Typography variant="body2" color="text.secondary" className="mb-1">
                        Energy Generation
                      </Typography>
                      <Typography variant="h5" color={getEnergyTypeColor(record.type)} className="font-bold">
                        {record.generation.toLocaleString()} GWh
                      </Typography>
                    </Box>
                    
                    {/* Supplementary Data */}
                    <Box className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Non-Renewable
                        </Typography>
                        <Typography variant="body2">
                          {record.nonRenewableEnergy.toLocaleString()} GWh
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Population
                        </Typography>
                        <Typography variant="body2">
                          {record.population}M
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          GDP
                        </Typography>
                        <Typography variant="body2">
                          ${record.gdp.toLocaleString()}B
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Date Added
                        </Typography>
                        <Typography variant="body2">
                          {new Date(record.dateAdded).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default RenewableEnergyPage;