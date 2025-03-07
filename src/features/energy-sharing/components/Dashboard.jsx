import React, { useState, useMemo, useEffect } from 'react';
import { Paper } from '@mui/material';
import { LocateIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import api from '@features/modules/api';
import axios from 'axios';

// Import components
import MapView from './Mapview';
import CityCard from './CityCard';
import FilterMenu from './FilterMenu';
import { SingleYearPicker } from '@shared/index'; // Ensure this import is correct

// Import constants and data
import { initializeLeafletIcons } from './scripts/mapHelper';

// Manually defined coordinates for each location
const locationCoordinates = {
  "Bohol": { lat: 9.8500, lng: 124.1435 },
  "Cebu": { lat: 10.3157, lng: 123.8854 },
  "Negros": { lat: 9.9820, lng: 122.8358 },
  "Panay": { lat: 11.1790, lng: 122.5662 },
  "Leyte-Samar": { lat: 10.7500, lng: 124.8333 }
  // Add more locations and their coordinates here
};

// Main Component
const EnergySharing = () => {
  // Initialize Leaflet icons
  useEffect(() => {
    initializeLeafletIcons();
  }, []);

  // State management
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedLocation] = useState('Taguig City');
  const [expandedCity, setExpandedCity] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [locations, setLocations] = useState([]);

  // Year change handler
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Fetch data from API based on selected year
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/peertopeer/', {
          params: {
            year: selectedYear
          }
        });
        console.log('API Response:', response.data);
        // Add coordinates to each location
        const locationsWithCoordinates = response.data.predictions.map(location => ({
          ...location,
          coordinates: locationCoordinates[location.Place] || { lat: 0, lng: 0 } // Default to (0, 0) if not found
        }));
        setLocations(locationsWithCoordinates);
      } catch (error) {
        if (error.response) {
          console.error('Error fetching data:', error.response.data);
        } else if (error.request) {
          console.error('Error fetching data: No response received', error.request);
        } else {
          console.error('Error fetching data:', error.message);
        }
        setLocations([]);
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
          coordinates: location.coordinates // Ensure coordinates are included
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
      coordinates: totals[place].coordinates // Ensure coordinates are included
    }));
  }, [locations]);

  console.log('Locations with Totals:', locationsWithTotals);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Peer-to-Peer Energy Sharing</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <LocateIcon className="text-gray-600" size={20} />
            <span className="text-gray-600 ml-2">{selectedLocation}</span>
          </div>
          <FilterMenu 
            selectedFilters={[]}
            onToggleFilter={() => {}}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Paper className="p-4">
            {/* Using the SingleYearPicker from shared imports */}
            <div className="mb-4">
              <SingleYearPicker
                initialYear={selectedYear}
                onYearChange={handleYearChange}
              />
            </div>

            <div className="space-y-4">
              {locationsWithTotals.map((location, index) => (
                <div 
                  key={index}
                  onMouseEnter={() => setHoveredCity(location.Place)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <CityCard
                    location={location}
                    isExpanded={expandedCity === location.Place}
                    isHovered={hoveredCity === location.Place}
                    onToggle={() => setExpandedCity(
                      expandedCity === location.Place ? null : location.Place
                    )}
                  />
                </div>
              ))}
            </div>
          </Paper>
        </div>

        <div className="md:col-span-2">
          <Paper className="p-4 h-[600px]">
            <MapView 
              locationsWithTotals={locationsWithTotals}
              hoveredCity={hoveredCity}
              onMarkerHover={setHoveredCity}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default EnergySharing;