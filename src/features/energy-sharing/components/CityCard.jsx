import React from 'react';
import { Paper, IconButton, Chip, Button } from '@mui/material';
import { LocateIcon, ArrowDown, ArrowUp } from 'lucide-react';
import { ENERGY_TYPES } from './scripts/energyType';

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
          <div>Expected Annual Capacity: {location.capacity}</div>
          <div>Distance: {location.distance}</div>
          {isExpanded && (
            <>
              <div>Predicted Generation: {location.predictedGeneration}</div>
              <div>Predicted Consumption: {location.predictedConsumption}</div>
              
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

export default CityCard;