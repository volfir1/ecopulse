import React, { useState, useMemo } from 'react';
import {
  Select,
  MenuItem,
  TextField,
  Paper,
  IconButton,
  Chip,
  Button,
  Menu
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LocateIcon, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Energy type configuration with colors
const ENERGY_TYPES = {
  SOLAR: { label: 'Solar', color: 'bg-yellow-400', textColor: 'text-yellow-700', markerColor: '#FFD700' },
  WIND: { label: 'Wind', color: 'bg-blue-400', textColor: 'text-blue-700', markerColor: '#4169E1' },
  HYDROPOWER: { label: 'Hydropower', color: 'bg-green-400', textColor: 'text-green-700', markerColor: '#32CD32' },
  BIOMASS: { label: 'Biomass', color: 'bg-purple-400', textColor: 'text-purple-700', markerColor: '#9370DB' }
};

const dummyNearbyLocations = [
  {
    id: 1,
    city: "Paranaque City",
    energyType: "SOLAR",
    capacity: "20,000 kW",
    distance: "2.4 km from Taguig",
    bestStarting: "4:57",
    status: "Ready for sharing",
    coordinates: { lat: 14.4791, lng: 121.0198 }
  },
  {
    id: 2,
    city: "Pateros City",
    energyType: "WIND",
    capacity: "15,000 kW",
    distance: "1.8 km from Taguig",
    bestStarting: "5:30",
    status: "Ready for sharing",
    coordinates: { lat: 14.5419, lng: 121.0677 }
  },
  {
    id: 3,
    city: "Pasay City",
    energyType: "SOLAR",
    capacity: "25,000 kW",
    distance: "3.2 km from Taguig",
    bestStarting: "4:45",
    status: "Ready for sharing",
    coordinates: { lat: 14.5378, lng: 121.0014 }
  }
];

// Custom Marker creation for different energy types
const createCustomIcon = (energyType) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${ENERGY_TYPES[energyType].markerColor};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Map Component
const MapView = ({ locations, hoveredCity, onMarkerHover }) => {
  const center = [14.5119, 121.0198];

  return (
    <MapContainer 
      center={center} 
      zoom={12} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.coordinates.lat, location.coordinates.lng]}
          icon={createCustomIcon(location.energyType)}
          eventHandlers={{
            mouseover: () => onMarkerHover(location.id),
            mouseout: () => onMarkerHover(null),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{location.city}</h3>
              <p>Energy Type: {ENERGY_TYPES[location.energyType].label}</p>
              <p>Capacity: {location.capacity}</p>
              <p>Status: {location.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// City Card Component
const CityCard = ({ location, isExpanded, onToggle, isHovered }) => (
  <Paper 
    className={`p-4 transition-shadow ${
      isHovered ? 'shadow-lg' : 'hover:shadow-md'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <LocateIcon size={16} className="text-gray-500" />
          <span className="font-medium">{location.city}</span>
          <Chip 
            label={ENERGY_TYPES[location.energyType].label}
            size="small"
            className={`${ENERGY_TYPES[location.energyType].textColor}`}
          />
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Expected Annual Sharing Capacity: {location.capacity}</div>
          <div>Distance: {location.distance}</div>
          {isExpanded && (
            <>
              <div>Best Starting Hours: {location.bestStarting}</div>
              <div>Connection Status: {location.status}</div>
              <Button 
                variant="contained" 
                color="primary"
                className="mt-2"
                fullWidth
              >
                Request Connection
              </Button>
            </>
          )}
        </div>
      </div>
      <IconButton size="small" onClick={onToggle}>
        {isExpanded ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
      </IconButton>
    </div>
  </Paper>
);

// Filter Menu Component
const FilterMenu = ({ selectedFilters, onToggleFilter }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        startIcon={<Filter size={20} />}
        variant="outlined"
        size="small"
        className="ml-2"
      >
        {selectedFilters.length ? `${selectedFilters.length} Selected` : 'Filter Energy Type'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.entries(ENERGY_TYPES).map(([type, data]) => (
          <MenuItem
            key={type}
            onClick={() => {
              onToggleFilter(type);
              handleClose();
            }}
            selected={selectedFilters.includes(type)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${data.color}`} />
              <span>{data.label}</span>
            </div>
          </MenuItem>
        ))}
        {selectedFilters.length > 0 && (
          <MenuItem
            onClick={() => {
              onToggleFilter('CLEAR_ALL');
              handleClose();
            }}
            className="border-t"
          >
            <span className="text-red-600">Clear All Filters</span>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

// Main Component
const EnergySharing = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedLocation] = useState('Taguig City');
  const [expandedCity, setExpandedCity] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [hoveredCity, setHoveredCity] = useState(null);

  const filteredLocations = useMemo(() => {
    if (selectedFilters.length === 0) return dummyNearbyLocations;
    return dummyNearbyLocations.filter(location => 
      selectedFilters.includes(location.energyType)
    );
  }, [selectedFilters]);

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
            <TextField
              select
              fullWidth
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
              variant="outlined"
              size="small"
              className="mb-4"
            >
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2026">2026</MenuItem>
            </TextField>

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