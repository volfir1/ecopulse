// InteractiveModel.jsx
import React, { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import AlterModel from "../assets/Alter"; // Add this import

const InteractiveModel = ({ selectedEnergy, onEnergySelect }) => {
  const modelRef = useRef();
  const [hoveredArea, setHoveredArea] = useState(null);

  // Updated positions to match actual 3D model locations
  const interactiveAreas = [
    {
      position: [4, 0, 0],      // Solar panels position (left side)
      type: "Solar",
      scale: [0.5, 0.5, 0.5],
      color: "#FFD700"
    },
    {
      position: [0, 3, 0],       // Wind turbine position (center, tall)
      type: "Wind",
      scale: [0.5, 0.5, 0.5],
      color: "#87CEEB"
    },
    {
      position: [-5, 0, 0],       // Hydropower position (right side)
      type: "Hydropower",
      scale: [0.5, 0.5, 0.5],
      color: "#4169E1"
    },
    {
      position: [-2, 0, 3],      // Geothermal position
      type: "Geothermal",
      scale: [0.5, 0.5, 0.5],
      color: "#8B4513"
    },
    {
      position: [3, 0, -3],      // Biomass position
      type: "Biomass",
      scale: [0.5, 0.5, 0.5],
      color: "#228B22"
    }
  ];

  return (
    <group ref={modelRef}>
      <AlterModel />
      {interactiveAreas.map((area, index) => (
        <group 
          key={index}
          position={area.position}
        >
          {/* Clickable sphere */}
          <mesh
            scale={area.scale}
            onClick={(e) => {
              e.stopPropagation();
              onEnergySelect(area.type);
            }}
            onPointerOver={() => setHoveredArea(area.type)}
            onPointerOut={() => setHoveredArea(null)}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
              color={area.color}
              transparent
              opacity={hoveredArea === area.type || selectedEnergy === area.type ? 0.8 : 0.4}
            />
          </mesh>

          {/* Label */}
          <Html
            position={[0, 1.5, 0]}
            center
            style={{
              display: hoveredArea === area.type || selectedEnergy === area.type ? 'block' : 'none'
            }}
          >
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              transform: 'scale(0.5)',
              transformOrigin: 'center center'
            }}>
              {area.type}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

export default InteractiveModel;