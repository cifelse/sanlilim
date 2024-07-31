import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  magnitude: number;
}

interface Earthquake {
  datetime: number;
  depth: number;
  magnitude: number;
  location: string;
  lat: number;
  long: number;
}

const EarthquakeMap: React.FC<EarthquakeMapProps> = ({ earthquakes, magnitude }) => {
    const filteredEarthquakes = useMemo(() => 
        earthquakes.filter(eq => eq.magnitude >= magnitude),
        [earthquakes, magnitude]
    );

    const getCircleOptions = useMemo(() => (magnitude: number) => ({
        fillColor: `#F05454`,
        fillOpacity: 0.3,
        strokeColor: `#F05454`,
        strokeWeight: 2,
    }), []);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GCP_API_KEY as string}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: 12.8797, lng: 121.7740 }} // Center of Philippines
                zoom={6}
            >
                {filteredEarthquakes.map((eq, index) => (
                <Circle
                    key={index}
                    center={{ lat: eq.lat, lng: eq.long }}
                    radius={eq.magnitude * 10000}
                    options={getCircleOptions(eq.magnitude)}
                />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

    export default EarthquakeMap;