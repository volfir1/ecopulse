import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createCustomIcon } from './scripts/mapHelper';
import { ENERGY_TYPES } from './scripts/energyType';

const MapView = ({ locations, hoveredCity, onMarkerHover }) => {
    const center = [14.5119, 121.0198];

    return (
        <MapContainer
            center={center}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location) => (
                <Marker
                    key={location.id}
                    position={[location.coordinates.lat, location.coordinates.lng]}
                    icon={createCustomIcon(location.energyType)}
                    eventHandlers={{
                        mouseover: () => onMarkerHover(location.id),
                        mouseout: () => onMarkerHover(null),
                    }}
                >
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold">{location.city}</h3>
                            <p>Energy Type: {ENERGY_TYPES[location.energyType].label}</p>
                            <p>Capacity: {location.capacity}</p>
                            <p>Predicted Generation: {location.predictedGeneration}</p>
                            <p>Predicted Consumption: {location.predictedConsumption}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;