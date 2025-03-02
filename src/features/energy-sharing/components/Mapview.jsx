import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createCustomIcon } from './scripts/mapHelper';

const MapView = ({ locationsWithTotals, hoveredCity, onMarkerHover }) => {
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
            {locationsWithTotals.map((location, index) => (
                location.coordinates && (
                    <Marker
                        key={index}
                        position={[location.coordinates.lat, location.coordinates.lng]}
                        icon={createCustomIcon(location.energyType)}
                        eventHandlers={{
                            mouseover: () => onMarkerHover(location.Place),
                            mouseout: () => onMarkerHover(null),
                        }}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold">{location.Place}</h3>
                                <p>Total Predicted Generation: {location.totalPredictedGeneration}</p>
                                <p>Total Predicted Consumption: {location.totalConsumption}</p>
                                <p>Total Renewable: {location.totalRenewable}</p>
                                <p>Total Non-Renewable: {location.totalNonRenewable}</p>
                                <p>Solar: {location.solar}</p>
                                <p>Wind: {location.wind}</p>
                                <p>Hydropower: {location.hydropower}</p>
                                <p>Geothermal: {location.geothermal}</p>
                                <p>Biomass: {location.biomass}</p>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
};

export default MapView;