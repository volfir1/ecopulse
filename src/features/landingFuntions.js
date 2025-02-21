// landingFunctions.js
import { CloudSun, Wind, Flower, Droplets } from "lucide-react";
import { elements } from "@shared/components/ui/colors";

// Energy types data
export const energyTypes = [
  {
    type: "Solar",
    icon: <CloudSun size={32} />,
    color: elements.solar,
    description: "Harnessing the sun's power for sustainable energy"
  },
  {
    type: "Wind",
    icon: <Wind size={32} />,
    color: elements.wind,
    description: "Converting wind power into clean electricity"
  },
  {
    type: "Geothermal",
    icon: <Flower size={32} />,
    color: elements.geothermal,
    description: "Utilizing Earth's heat for renewable energy"
  },
  {
    type: "Hydropower",
    icon: <Droplets size={32} />,
    color: elements.hydropower,
    description: "Generating power from flowing water"
  },
  {
    type: "Biomass",
    icon: <Flower size={32} />,
    color: elements.biomass,
    description: "Converting organic matter into sustainable energy"
  }
];

// Camera positions configuration for each energy type
export const cameraPositions = {
  Solar: { 
    position: [20, 10, 20], 
    target: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0]
  },
  Wind: { 
    position: [-20, 5, 20], 
    target: [0, 0, 0],
    rotation: [0, -Math.PI / 4, 0]
  },
  Geothermal: { 
    position: [0, 20, 20], 
    target: [0, 0, 0],
    rotation: [Math.PI / 6, 0, 0]
  },
  Hydropower: { 
    position: [20, 5, -20], 
    target: [0, 0, 0],
    rotation: [0, Math.PI / 2, 0]
  },
  Biomass: { 
    position: [-20, 10, -20], 
    target: [0, 0, 0],
    rotation: [0, -Math.PI / 2, 0]
  },
  default: { 
    position: [20, 2, -100], 
    target: [0, 2, 5],
    rotation: [0, 0, 0]
  }
};

// Hook to manage camera animations
export const useModelAnimation = (selectedEnergy) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRotation, setCurrentRotation] = useState([0, 0, 0]);

  useEffect(() => {
    if (selectedEnergy) {
      setIsAnimating(true);
    }
  }, [selectedEnergy]);

  return {
    isAnimating,
    setIsAnimating,
    currentRotation,
    setCurrentRotation
  };
};

export const createCameraController = ({ 
  selectedEnergy, 
  isAnimating, 
  setIsAnimating, 
  onAnimationComplete 
}) => {
  return function CameraController() {
    useFrame(({ camera, clock }) => {
      const targetPosition = cameraPositions[selectedEnergy || 'default'];
      
      if (isAnimating) {
        const lerpFactor = 0.05;
        camera.position.x += (targetPosition.position[0] - camera.position.x) * lerpFactor;
        camera.position.y += (targetPosition.position[1] - camera.position.y) * lerpFactor;
        camera.position.z += (targetPosition.position[2] - camera.position.z) * lerpFactor;
        
        camera.lookAt(...targetPosition.target);
        
        const tolerance = 0.1;
        if (
          Math.abs(camera.position.x - targetPosition.position[0]) < tolerance &&
          Math.abs(camera.position.y - targetPosition.position[1]) < tolerance &&
          Math.abs(camera.position.z - targetPosition.position[2]) < tolerance
        ) {
          setIsAnimating(false);
          onAnimationComplete?.();
        }
      } else if (!selectedEnergy) {
        const t = clock.getElapsedTime();
        const radius = 30;
        camera.position.x = radius * Math.cos(t * 0.2);
        camera.position.z = radius * Math.sin(t * 0.2);
        camera.lookAt(...cameraPositions.default.target);
      }
    });

    return null;
  };
};

export const modelInteractionHandlers = {
  handleEnergySelect: (energyType, setSelectedEnergy) => {
    setSelectedEnergy(energyType);
  },
  
  handleAnimationComplete: (setSelectedEnergy) => {
    console.log('Animation completed');
  },
  
  handleResetView: (setSelectedEnergy, setIsAnimating) => {
    setSelectedEnergy(null);
    setIsAnimating(true);
  }
};

export const calculateModelTransforms = (currentRotation, targetRotation, lerpFactor = 0.1) => {
  return {
    x: currentRotation[0] + (targetRotation[0] - currentRotation[0]) * lerpFactor,
    y: currentRotation[1] + (targetRotation[1] - currentRotation[1]) * lerpFactor,
    z: currentRotation[2] + (targetRotation[2] - currentRotation[2]) * lerpFactor
  };
};