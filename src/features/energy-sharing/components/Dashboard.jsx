import React, { useState, useMemo, useEffect } from 'react';
import { Paper } from '@mui/material';
import { LocateIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Import components
import MapView from './Mapview';
import CityCard from './CityCard';
import FilterMenu from './FilterMenu';
import { SingleYearPicker } from '@shared/index'; // Import from shared index

// Import constants and data
import { dummyNearbyLocations } from './scripts/data';
import { initializeLeafletIcons } from './scripts/mapHelper';

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
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [hoveredCity, setHoveredCity] = useState(null);

  // Year change handler
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Filter functionality
  const toggleFilter = (type) => {
    if (type === 'CLEAR_ALL') {
      setSelectedFilters([]);
      return;
    }
    setSelectedFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Filtered locations
  const filteredLocations = useMemo(() => {
    if (selectedFilters.length === 0) return dummyNearbyLocations;
    return dummyNearbyLocations.filter(location => 
      selectedFilters.includes(location.energyType)
    );
  }, [selectedFilters]);

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
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
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
              {filteredLocations.map((location) => (
                <div 
                  key={location.id}
                  onMouseEnter={() => setHoveredCity(location.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <CityCard
                    location={location}
                    isExpanded={expandedCity === location.id}
                    isHovered={hoveredCity === location.id}
                    onToggle={() => setExpandedCity(
                      expandedCity === location.id ? null : location.id
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
              locations={filteredLocations}
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