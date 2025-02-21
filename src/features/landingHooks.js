// landingHooks.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define camera look-at positions
const lookAtPositions = [
  [0, 2, 5],    // Default view
  [5, 1, 0],    // Right side view
  [-5, 1, 0],   // Left side view
  [-10, 2, 7],  // Back left view
  [-5, 2, 10],  // Back view
  [5, 2, 10],   // Back right view
  [10, 2, 5],   // Right view
];

// Hook for managing camera target positions
export const useCameraTarget = () => {
  const [targetIndex, setTargetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetIndex((prev) => (prev + 1) % lookAtPositions.length);
    }, 12000); // Change position every 12 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    targetIndex,
    currentTarget: lookAtPositions[targetIndex]
  };
};

// Hook for managing energy type selection
export const useEnergySelection = () => {
    const [selectedEnergy, setSelectedEnergy] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
  
    const handleEnergySelect = (energyType) => {
      setSelectedEnergy(energyType);
      setIsAnimating(true);
    };
  
    const resetSelection = () => {
      setSelectedEnergy(null);
      setIsAnimating(false);
    };
  
    return {
      selectedEnergy,
      isAnimating,
      setIsAnimating,  // Make sure to export this
      handleEnergySelect,
      resetSelection
    };
  };

// Hook for navigation
export const usePageNavigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return handleNavigation;
};

// Hook for managing animations
export const useModelAnimation = () => {
  const [animationState, setAnimationState] = useState({
    isPlaying: false,
    currentFrame: 0,
    duration: 1000 // Animation duration in milliseconds
  });

  const startAnimation = () => {
    setAnimationState(prev => ({
      ...prev,
      isPlaying: true,
      currentFrame: 0
    }));
  };

  const stopAnimation = () => {
    setAnimationState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  useEffect(() => {
    let animationFrame;
    
    if (animationState.isPlaying) {
      const animate = () => {
        setAnimationState(prev => {
          if (prev.currentFrame >= prev.duration) {
            return { ...prev, isPlaying: false };
          }
          return { ...prev, currentFrame: prev.currentFrame + 1 };
        });
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [animationState.isPlaying]);

  return {
    animationState,
    startAnimation,
    stopAnimation
  };
};