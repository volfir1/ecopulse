import React, { useState, useMemo, useEffect } from 'react';
import { Paper, Box, Typography, Card, CardContent, Chip, Grid, Divider, IconButton, Tooltip } from '@mui/material';
import { LocateIcon, Info, RefreshCw, BarChart2, MapPin, Zap, ZapOff } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Import components
import MapView from './Mapview';
import { SingleYearPicker } from '@shared/index';

// Import constants and data
import { initializeLeafletIcons } from './scripts/mapHelper';

// Location coordinates
const locationCoordinates = {
  "Bohol": { lat: 9.8500, lng: 124.1435 },
  "Cebu": { lat: 10.3157, lng: 123.8854 },
  "Negros": { lat: 9.9820, lng: 122.8358 },
  "Panay": { lat: 11.1790, lng: 122.5662 },
  "Leyte-Samar": { lat: 10.7500, lng: 124.8333 }
};

// Redesigned CityCard component
const EnhancedCityCard = ({ location, isExpanded, isHovered, onToggle }) => {
  const surplus = location.totalPredictedGeneration - location.totalConsumption;
  const hasSurplus = surplus > 0;
  
  return (
    <Card 
      elevation={isHovered ? 3 : 1}
      sx={{
        mb: 2,
        transition: 'all 0.3s ease',
        borderLeft: hasSurplus ? '4px solid #4caf50' : '4px solid #f44336',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        cursor: 'pointer',
        overflow: 'visible',
        position: 'relative'
      }}
      onClick={onToggle}
    >
      {isHovered && (
        <Box sx={{ 
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          bgcolor: hasSurplus ? '#4caf50' : '#f44336',
          color: 'white',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          {hasSurplus ? <Zap size={18} /> : <ZapOff size={18} />}
        </Box>
      )}
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
            <MapPin size={18} style={{ marginRight: 8 }} />
            {location.Place}
          </Typography>
          <Chip 
            label={hasSurplus ? "Surplus" : "Deficit"} 
            size="small"
            sx={{ 
              bgcolor: hasSurplus ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              color: hasSurplus ? '#4caf50' : '#f44336',
              fontWeight: 600
            }}
          />
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={7}>
              <Typography variant="body2" color="text.secondary">Generation:</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" fontWeight={600}>
                {Math.round(location.totalPredictedGeneration)} GWh
              </Typography>
            </Grid>
            
            <Grid item xs={7}>
              <Typography variant="body2" color="text.secondary">Consumption:</Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" fontWeight={600}>
                {Math.round(location.totalConsumption)} GWh
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={7}>
              <Typography variant="body2" color={hasSurplus ? "success.main" : "error.main"}>
                {hasSurplus ? "Surplus:" : "Deficit:"}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" fontWeight={600} color={hasSurplus ? "success.main" : "error.main"}>
                {Math.abs(Math.round(surplus))} GWh
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        {isExpanded && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Energy Mix</Typography>
            
            <Grid container spacing={1}>
              {location.solar > 0 && (
                <>
                  <Grid item xs={7}>
                    <Typography variant="body2" color="text.secondary">Solar:</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">{Math.round(location.solar)} GWh</Typography>
                  </Grid>
                </>
              )}
              
              {location.wind > 0 && (
                <>
                  <Grid item xs={7}>
                    <Typography variant="body2" color="text.secondary">Wind:</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">{Math.round(location.wind)} GWh</Typography>
                  </Grid>
                </>
              )}
              
              {location.hydropower > 0 && (
                <>
                  <Grid item xs={7}>
                    <Typography variant="body2" color="text.secondary">Hydropower:</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">{Math.round(location.hydropower)} GWh</Typography>
                  </Grid>
                </>
              )}
              
              {location.geothermal > 0 && (
                <>
                  <Grid item xs={7}>
                    <Typography variant="body2" color="text.secondary">Geothermal:</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">{Math.round(location.geothermal)} GWh</Typography>
                  </Grid>
                </>
              )}
              
              {location.biomass > 0 && (
                <>
                  <Grid item xs={7}>
                    <Typography variant="body2" color="text.secondary">Biomass:</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">{Math.round(location.biomass)} GWh</Typography>
                  </Grid>
                </>
              )}
              
              {location.totalNonRenewable > 0 && (
                <>
                  <Grid item xs={7}>
                    <Typography variant="body2" color="text.secondary">Non-Renewable:</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="body2">{Math.round(location.totalNonRenewable)} GWh</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Summary Card Component
const SummaryCard = ({ locationsWithTotals }) => {
  const totalGeneration = locationsWithTotals.reduce((acc, location) => acc + location.totalPredictedGeneration, 0);
  const totalConsumption = locationsWithTotals.reduce((acc, location) => acc + location.totalConsumption, 0);
  const totalRenewable = locationsWithTotals.reduce((acc, location) => acc + location.totalRenewable, 0);
  
  const renewablePercentage = totalGeneration > 0 ? (totalRenewable / totalGeneration) * 100 : 0;
  
  const surplusLocations = locationsWithTotals.filter(loc => loc.totalPredictedGeneration > loc.totalConsumption);
  const deficitLocations = locationsWithTotals.filter(loc => loc.totalPredictedGeneration <= loc.totalConsumption);
  
  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <BarChart2 size={20} style={{ marginRight: 8 }} />
          Regional Energy Summary
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h4" fontWeight={600} color="primary.main">
                {Math.round(totalGeneration).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Generation (GWh)</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h4" fontWeight={600} color="secondary.main">
                {Math.round(totalConsumption).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Consumption (GWh)</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {renewablePercentage.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">Renewable Energy</Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>
              {surplusLocations.length}
            </Box> regions with surplus
          </Typography>
          
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'error.main', fontWeight: 600 }}>
              {deficitLocations.length}
            </Box> regions with deficit
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Component
const EnergySharing = () => {
  // Initialize Leaflet icons
  useEffect(() => {
    initializeLeafletIcons();
  }, []);

  // State management
  const [selectedYear, setSelectedYear] = useState(2025);
  const [expandedCity, setExpandedCity] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Year change handler
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Fetch data from API based on selected year
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/peertopeer/', {
          params: {
            year: selectedYear
          }
        });
        
        // Add coordinates to each location
        const locationsWithCoordinates = response.data.predictions.map(location => ({
          ...location,
          coordinates: locationCoordinates[location.Place] || { lat: 0, lng: 0 }
        }));
        
        setLocations(locationsWithCoordinates);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Calculate total predicted generation and consumption for each location
  const locationsWithTotals = useMemo(() => {
    const totals = {};

    locations.forEach(location => {
      const place = location.Place;
      const energyType = location['Energy Type'];
      const predictedValue = location['Predicted Value'];

      if (!totals[place]) {
        totals[place] = {
          totalPredictedGeneration: 0,
          totalConsumption: 0,
          totalRenewable: 0,
          totalNonRenewable: 0,
          solar: 0,
          wind: 0,
          hydropower: 0,
          geothermal: 0,
          biomass: 0,
          coordinates: location.coordinates
        };
      }

      if (energyType === 'Total Power Generation (GWh)') {
        totals[place].totalPredictedGeneration += predictedValue;
      }

      if (energyType.includes('Estimated Consumption (GWh)')) {
        totals[place].totalConsumption += predictedValue;
      }

      if (energyType === 'Solar (GWh)') {
        totals[place].solar += predictedValue;
      }

      if (energyType === 'Wind (GWh)') {
        totals[place].wind += predictedValue;
      }

      if (energyType === 'Hydro (GWh)') {
        totals[place].hydropower += predictedValue;
      }

      if (energyType === 'Geothermal (GWh)') {
        totals[place].geothermal += predictedValue;
      }

      if (energyType === 'Biomass (GWh)') {
        totals[place].biomass += predictedValue;
      }
    });

    // Compute total renewable and non-renewable values
    Object.keys(totals).forEach(place => {
      totals[place].totalRenewable = totals[place].solar + totals[place].wind + totals[place].hydropower + totals[place].geothermal + totals[place].biomass;
      totals[place].totalNonRenewable = totals[place].totalPredictedGeneration - totals[place].totalRenewable;
    });

    return Object.keys(totals).map(place => ({
      Place: place,
      totalPredictedGeneration: totals[place].totalPredictedGeneration,
      totalConsumption: totals[place].totalConsumption,
      totalRenewable: totals[place].totalRenewable,
      totalNonRenewable: totals[place].totalNonRenewable,
      solar: totals[place].solar,
      wind: totals[place].wind,
      hydropower: totals[place].hydropower,
      geothermal: totals[place].geothermal,
      biomass: totals[place].biomass,
      coordinates: totals[place].coordinates
    }));
  }, [locations]);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight={600} color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
            <Zap size={28} style={{ marginRight: 12 }} />
            Peer-to-Peer Energy Sharing
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <SingleYearPicker
                initialYear={selectedYear}
                onYearChange={handleYearChange}
              />
            </Box>
            
            <IconButton 
              color="primary" 
              sx={{ 
                bgcolor: '#2e7d32',
                color: 'white',
                width: '40px',
                height: '40px',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 800);
              }}
            >
              <RefreshCw size={20} />
            </IconButton>
          </Box>
        </Box>
        
        {locationsWithTotals.length > 0 && (
          <SummaryCard locationsWithTotals={locationsWithTotals} />
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  maxHeight: 'calc(100vh - 200px)',
                  overflow: 'auto'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Region Analysis
                  </Typography>
                  
                  <Tooltip title="Shows energy production and consumption for each region">
                    <IconButton size="small">
                      <Info size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {isLoading ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography>Loading data...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    {locationsWithTotals.map((location, index) => (
                      <div 
                        key={index}
                        onMouseEnter={() => setHoveredCity(location.Place)}
                        onMouseLeave={() => setHoveredCity(null)}
                      >
                        <EnhancedCityCard
                          location={location}
                          isExpanded={expandedCity === location.Place}
                          isHovered={hoveredCity === location.Place}
                          onToggle={() => setExpandedCity(
                            expandedCity === location.Place ? null : location.Place
                          )}
                        />
                      </div>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                height: 'calc(100vh - 200px)',
                minHeight: '600px',
                position: 'relative'
              }}
            >
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                left: 16, 
                zIndex: 1000, 
                bgcolor: 'rgba(255,255,255,0.85)',
                p: 1.5,
                borderRadius: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="body2" fontWeight={600}>
                  Interactive Energy Map
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click on markers to see details
                </Typography>
              </Box>
              
              <MapView 
                locationsWithTotals={locationsWithTotals}
                hoveredCity={hoveredCity}
                onMarkerHover={setHoveredCity}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EnergySharing;