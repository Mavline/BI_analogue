'use client';

import { useState, useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

// Динамический импорт компонентов карты для клиентской стороны
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export function FactoryMap({ buildings, onBuildingSelect, selectedEntity }) {
  const [isClient, setIsClient] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Fix for leaflet icon issues
    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      });
    });
  }, []);

  const handleBuildingClick = (building) => {
    onBuildingSelect(building);
  };

  if (!isClient) return null;

  return (
    <Paper sx={{ p: 2, position: 'relative', zIndex: 0 }}>
      <Typography variant="h6" gutterBottom>
        Factory Layout
      </Typography>
      <Box sx={{ 
        height: 400, 
        position: 'relative',
        '& .leaflet-container': { zIndex: 1 },
        '& .leaflet-pane': { zIndex: 1 }
      }}>
        <MapContainer
          center={[32.0331, 34.8998]} // Yehud-Monosson center
          zoom={17}
          style={{ height: '100%', width: '100%' }}
          whenCreated={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {buildings.map((building) => (
            <Marker
              key={building.id}
              position={building.coordinates}
              eventHandlers={{
                click: () => handleBuildingClick(building),
              }}
            >
              <Popup>
                <Typography variant="subtitle1">
                  {building.name}
                </Typography>
                <Typography variant="body2">
                  Work centers: {building.workCenters.length}
                </Typography>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Paper>
  );
}