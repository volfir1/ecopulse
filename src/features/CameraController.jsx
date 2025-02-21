// CameraController.jsx
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { cameraViews } from './cameraConfig';
import * as THREE from 'three';
const CameraController = ({ selectedEnergy, isAnimating, onAnimationComplete }) => {
  const targetPosition = new Vector3();
  const currentLookAt = new Vector3();
  
  useFrame(({ camera, clock }) => {
    if (selectedEnergy && isAnimating) {
      const view = cameraViews[selectedEnergy];
      
      // Smooth camera position transition
      camera.position.lerp(view.position, 0.02); // Reduced lerp factor for smoother motion
      
      // Smooth look-at transition
      currentLookAt.lerp(view.lookAt, 0.02);
      camera.lookAt(currentLookAt);
      
      // Smooth zoom transition
      if (camera.zoom !== view.zoom) {
        camera.zoom = THREE.MathUtils.lerp(camera.zoom, view.zoom, 0.02);
        camera.updateProjectionMatrix();
      }
      
      // Check if camera has reached target position
      if (camera.position.distanceTo(view.position) < 0.1) {
        onAnimationComplete?.();
      }
    } else if (!selectedEnergy) {
      // Default orbital animation
      const t = clock.getElapsedTime();
      const radius = 25; // Increased radius for better overview
      camera.position.x = radius * Math.cos(t * 0.1); // Slower rotation
      camera.position.z = radius * Math.sin(t * 0.1);
      camera.position.y = 10 + Math.sin(t * 0.05) * 2; // Gentle vertical movement
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

export default CameraController;