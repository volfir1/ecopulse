// src/components/common/Button/CustomButton.jsx
import React from 'react';
import { Button } from '@mui/material';
import { elements, Palette } from '@shared/components/ui/colors';

// Button variants based on our color system
const buttonStyles = {
  // Primary Buttons
  primary: {
    backgroundColor: Palette.primary.main,
    color: Palette.primary.contrastText,
    '&:hover': {
      backgroundColor: Palette.hovers.primary,
    }
  },
  primaryOutlined: {
    color: Palette.primary.main,
    borderColor: Palette.primary.main,
    '&:hover': {
      borderColor: Palette.hovers.primary,
      backgroundColor: `${Palette.primary.main}10`,
    }
  },

  // Secondary Buttons
  secondary: {
    backgroundColor: Palette.secondary.main,
    color: Palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: Palette.hovers.secondary,
    }
  },
  secondaryOutlined: {
    color: Palette.secondary.main,
    borderColor: Palette.secondary.main,
    '&:hover': {
      borderColor: Palette.hovers.secondary,
      backgroundColor: `${Palette.secondary.main}10`,
    }
  },

  // Energy Type Specific Buttons
  solar: {
    backgroundColor: elements.solar,
    color: '#000000',
    '&:hover': {
      backgroundColor: elements.solar,
      filter: 'brightness(0.9)',
    }
  },
  wind: {
    backgroundColor: elements.wind,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: elements.wind,
      filter: 'brightness(0.9)',
    }
  },
  geothermal: {
    backgroundColor: elements.geothermal,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: elements.geothermal,
      filter: 'brightness(0.9)',
    }
  },
  hydropower: {
    backgroundColor: elements.hydropower,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: elements.hydropower,
      filter: 'brightness(0.9)',
    }
  },
  biomass: {
    backgroundColor: elements.biomass,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: elements.biomass,
      filter: 'brightness(0.9)',
    }
  },

  // State Buttons
  success: {
    backgroundColor: Palette.success.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: Palette.hovers.success,
    }
  },
  warning: {
    backgroundColor: Palette.warning.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: Palette.hovers.warning,
    }
  },
  error: {
    backgroundColor: Palette.error.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: Palette.hovers.error,
    }
  }
};

// Size variations
const sizeStyles = {
  small: {
    padding: '6px 16px',
    fontSize: '0.875rem',
  },
  medium: {
    padding: '8px 20px',
    fontSize: '1rem',
  },
  large: {
    padding: '10px 24px',
    fontSize: '1.125rem',
  }
};

const CustomButton = ({
  variant = 'primary',
  size = 'medium',
  outlined = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  startIcon,
  endIcon,
  className,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = outlined ? `${variant}Outlined` : variant;
    return {
      ...buttonStyles[baseStyle],
      ...sizeStyles[size],
      borderRadius: 8,
      textTransform: 'none',
      fontWeight: 500,
      ...(outlined && {
        border: '2px solid',
        '&:hover': {
          border: '2px solid',
        }
      })
    };
  };

  return (
    <Button
      variant={outlined ? 'outlined' : 'contained'}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      className={className}
      sx={getButtonStyle()}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;