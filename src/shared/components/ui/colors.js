import { createTheme } from "@mui/material/styles";

// Elements for specific use cases
export const elements = {
  solar: '#F4D03F',
  wind: '#38BDF8',
  geothermal: '#FF7F7F',
  hydropower: '#1C556F',
  biomass: '#166545'
};

// Main color palette
export const Palette = {
  primary: {
    main: '#166534',
    light: '#22863a',
    dark: '#14532d',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#1a5f7a',
    light: '#2a7c9c',
    dark: '#134857',
    contrastText: '#ffffff'
  },
  background: {
    default: '#f0fdf4',
    paper: '#ffffff',
    subtle: '#f8fafc'
  },
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    disabled: '#94a3b8',
    hint: '#64748b'
  },
  success: {
    main: '#15803d',
    light: '#86efac',
    dark: '#14532d'
  },
  warning: {
    main: '#854d0e',
    light: '#fde68a',
    dark: '#713f12'
  },
  error: {
    main: '#991b1b',
    light: '#fecaca',
    dark: '#7f1d1d'
  },
  hovers: {
    primary: '#15803d',
    secondary: '#216b8d',
    success: '#16a34a',
    warning: '#9a3412',
    error: '#b91c1c'
  }
};

// Create base theme
const theme = createTheme({
  palette: {
    primary: Palette.primary,
    secondary: Palette.secondary,
    background: Palette.background,
    text: Palette.text,
    success: Palette.success,
    warning: Palette.warning,
    error: Palette.error,
    hovers: Palette.hovers,
    elements: elements,
  }
});

export default theme;
// Create extended theme

