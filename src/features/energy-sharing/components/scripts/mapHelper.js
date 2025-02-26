import L from 'leaflet';
import { ENERGY_TYPES } from './energyType';

// Fix Leaflet default icon issues
export const initializeLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Custom Marker creation for different energy types
export const createCustomIcon = (energyType) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${ENERGY_TYPES[energyType].markerColor};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};