import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
    markers: Shelter[];
    style?: React.CSSProperties;
    center?: [number, number] | null;
    zoom?: number;
};

export interface Shelter {
    lat: number;
    long: number;
    name: string | null;
    capacity: string | null;
    city: string | null;
    type: string | null;
    callback: () => void;
};

/**
 * Default Map Settings
 */
const DefaultSettings = {
    style: {
      height: '100%',
      width: '100%',
    },
    center: {
      lat: 14.566439, 
      lng: 120.9902773,
    },
    zoom: 13,
};

const Map: React.FC<MapProps> = ({ markers, style, center, zoom }) => {
    

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GCP_API_KEY as string}>
            <GoogleMap
                mapContainerStyle={style ?? DefaultSettings.style}
                center={center ? { lat: center[0], lng: center[1] } : DefaultSettings.center}
                zoom={zoom ?? (center ? 15: DefaultSettings.zoom)}
            >
                {markers && markers.map((shelter: Shelter, index: number) => (
                    <Marker
                        key={index}
                        position={{ lat: shelter.lat, lng: shelter.long }}
                        onClick={shelter.callback}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    )
};

export default Map;