// cameraConfig.js
import { Vector3 } from 'three';

export const cameraViews = {
  Solar: {
    position: new Vector3(-5, 5, 10), // Position to view solar panels in the center
    lookAt: new Vector3(-2, 0, 0),    // Looking at the solar panel array
    zoom: 1.5
  },
  Wind: {
    position: new Vector3(5, 8, 15),   // Position to view wind turbine
    lookAt: new Vector3(5, 2, 0),      // Looking at the wind turbine
    zoom: 1.2
  },
  Hydropower: {
    position: new Vector3(15, 5, 0),    // Position to view hydropower dam
    lookAt: new Vector3(10, 0, 0),      // Looking at the dam structure
    zoom: 1.3
  },
  Geothermal: {
    position: new Vector3(-10, 5, -5),  // Position to view geothermal facility
    lookAt: new Vector3(-8, 0, -5),     // Looking at the geothermal plant
    zoom: 1.4
  },
  Biomass: {
    position: new Vector3(10, 5, -10),  // Position to view biomass section
    lookAt: new Vector3(8, 0, -8),      // Looking at the biomass area
    zoom: 1.2
  },
  default: {
    position: new Vector3(20, 10, 20),  // Overview position
    lookAt: new Vector3(0, 0, 0),       // Center of the scene
    zoom: 1
  }
};