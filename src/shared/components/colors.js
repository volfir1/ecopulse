import { createTheme } from "@mui/material/styles";

export const Palette = {
  primary: {
    main: '#2c3e50',
    light: '#3a5169',
    dark: '#1f2b38',
  },
  secondary: {
    main: '#3498db',
    light: '#5faee3',
    dark: '#217dbb',
  },
  success: '#27ae60',
  warning: '#f1c40f',
  error: '#e74c3c',
  background: '#f8f9fa',
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
  },
  hovers:{
      green: '#66bb6a',
  }
};

export const elements = {
  solar: '#FFFF00',
  wind: '#38BDF8',
  geothermal: '#FF7F7F',
  hydropower: '#1C556F',
  biomass: '#166545'
};




// Create base theme
const theme = createTheme({
    palette: {
      primary: Palette.primary,
      secondary: Palette.secondary,
      background: {
        default: Palette.background,
      },
      text: Palette.text,
      success: {
        main: Palette.success,
      },
      warning: {
        main: Palette.warning,
      },
      error: {
        main: Palette.error,
      },
      hovers: Palette.hovers,
      elements: elements,
      
    }
  });
  

  
  
  export default theme;

// Create extended theme

