import React from 'react';
import { Chip } from '@mui/material';
import { MapPin } from 'lucide-react';
import { calculateRenewablePercentage, formatNumber } from './peerUtils';

// Button component
const Button = ({ children, className, variant, onClick, disabled }) => (
  <button 
    className={`px-4 py-2 rounded-md font-medium ${
      variant === 'primary' 
        ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300' 
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100'
    } ${className} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

/**
 * Region card component for displaying region data
 * 
 * @param {Object} props - Component props
 * @param {String} props.region - Region name
 * @param {Object} props.data - Region data
 * @param {Function} props.onEdit - Edit handler
 * @returns {JSX.Element}
 */
export const RegionCard = ({ region, data, onEdit }) => {
  const hasRenewable = (parseFloat(data?.renewableGeneration || 0) > 0);
  const renewablePercentage = calculateRenewablePercentage(data);
  
  return (
    <div className={`border p-4 rounded-md mb-4 transition-all hover:shadow-md ${
      renewablePercentage > 50 ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <MapPin size={16} className="mr-2" />
            {region}
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-gray-600">Total Generation:</div>
            <div className="font-semibold">{formatNumber(data?.totalPowerGeneration || 0)} GWh</div>
            
            <div className="text-gray-600">Renewable Energy:</div>
            <div className="font-semibold text-green-600">{formatNumber(data?.renewableGeneration || 0)} GWh</div>
            
            <div className="text-gray-600">Non-Renewable:</div>
            <div className="font-semibold text-gray-700">{formatNumber(data?.nonRenewableGeneration || 0)} GWh</div>
          </div>
        </div>
        <div>
          <Chip
            label={`${renewablePercentage.toFixed(1)}% Renewable`}
            size="small"
            color={renewablePercentage > 50 ? "success" : "warning"}
            className="text-xs"
          />
          <Button variant="secondary" className="mt-2 text-xs px-2 py-1" onClick={() => onEdit(region)}>
            Edit Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegionCard;