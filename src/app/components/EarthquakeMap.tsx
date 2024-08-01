import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Circle, InfoWindow } from '@react-google-maps/api';

interface Earthquake {
  datetime: number;
  depth: number;
  magnitude: number;
  location: string;
  lat: number;
  long: number;
}

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  magnitude: number;
  center: [number, number] | null;
}

const EarthquakeMap: React.FC<EarthquakeMapProps> = ({ earthquakes, magnitude, center }) => {
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredEarthquakes = earthquakes.filter(eq => eq.magnitude === magnitude);

  const getCircleOptions = (magnitude: number) => ({
    fillColor: '#F05454',
    fillOpacity: 0.3,
    strokeColor: '#F05454',
    strokeWeight: 0.1,
  });

  useEffect(() => {
    // Update the refresh key whenever earthquakes or magnitude changes
    setRefreshKey(prevKey => prevKey + 1);
  }, [earthquakes, magnitude]);

  const chosenCenter = center ? { lat: center[0], lng: center[1] } : { lat: 12.8797, lng: 121.7740 };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GCP_API_KEY as string}>
      <GoogleMap
        key={refreshKey}  // This forces re-render
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={chosenCenter}
        zoom={chosenCenter.lat === 12.8797 ? 6 : 13}
      >
        {filteredEarthquakes.map((eq, index) => (
          <Circle
            key={index}
            center={{ lat: eq.lat, lng: eq.long }}
            radius={eq.magnitude * 5000}
            options={getCircleOptions(eq.magnitude)}
            onClick={() => setSelectedEarthquake(eq)}
          />
        ))}

        {selectedEarthquake && (
          <InfoWindow
            position={{ lat: selectedEarthquake.lat, lng: selectedEarthquake.long }}
            onCloseClick={() => setSelectedEarthquake(null)}
          >
            <div>
              <h1 className="text-lg" >Earthquake Details</h1>
              <p><strong>Magnitude:</strong> {selectedEarthquake.magnitude}</p>
              <p><strong>Location:</strong> {selectedEarthquake.location}</p>
              <p><strong>Datetime:</strong> {new Date(selectedEarthquake.datetime).toLocaleString()}</p>
              <p><strong>Depth:</strong> {selectedEarthquake.depth} km</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default EarthquakeMap;