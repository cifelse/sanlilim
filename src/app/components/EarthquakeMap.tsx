import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  magnitude: number;
  center: [number, number] | null;
}

interface Earthquake {
  datetime: number;
  depth: number;
  magnitude: number;
  location: string;
  lat: number;
  long: number;
}

const EarthquakeMap: React.FC<EarthquakeMapProps> = ({ earthquakes, magnitude, center }) => {
    const filteredEarthquakes = useMemo(() => 
        earthquakes.filter(eq => eq.magnitude === magnitude),
        [earthquakes, magnitude]
    );

    const getCircleOptions = useMemo(() => (magnitude: number) => ({
        fillColor: `#F05454`,
        fillOpacity: 0.3,
        strokeColor: `#F05454`,
        strokeWeight: 0.1,
    }), []);

    useEffect(() => {
        console.log('Filtered earthquakes:', filteredEarthquakes);
    }, [filteredEarthquakes]);

    const chosenCenter = center ? { lat: center[0], lng: center[1] } : { lat: 12.8797, lng: 121.7740 };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GCP_API_KEY as string}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={chosenCenter}
            zoom={chosenCenter.lat == 12.8797 ? 6 : 13}
          >
            {filteredEarthquakes.map((eq, index) => (
              <Circle
                key={`${eq.lat}-${eq.long}-${eq.datetime}`}
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