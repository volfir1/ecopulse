// modelConfig.js
export const interactiveAreas = [
    {
      position: [2, 1, 0],
      type: "Solar",
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: "#FFD700" // Gold color for solar
    },
    {
      position: [-2, 1, 0],
      type: "Wind",
      scale: [1, 1, 1],
      rotation: [0, Math.PI / 4, 0],
      color: "#87CEEB" // Sky blue for wind
    },
    {
      position: [0, 2, 2],
      type: "Hydropower",
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: "#4169E1" // Royal blue for hydro
    },
    {
      position: [-1.5, 0.5, 1],
      type: "Geothermal",
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: "#8B4513" // Saddle brown for geothermal
    },
    {
      position: [1.5, 0.5, -1],
      type: "Biomass",
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: "#228B22" // Forest green for biomass
    }
  ];