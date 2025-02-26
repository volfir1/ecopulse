import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { Filter } from 'lucide-react';
import { ENERGY_TYPES } from './scripts/energyType';

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

export default FilterMenu;