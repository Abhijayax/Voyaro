'use client';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapContent({ day, spots }) {
  if (!day?.schedule?.length) return <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>No spots for this day</div>;

  const coords = day.schedule.map(s => {
    const spot = spots?.find(sp => sp.name === s.activity);
    return spot ? [spot.lat, spot.lng] : null;
  }).filter(Boolean);

  if (!coords.length) return <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>Map unavailable</div>;

  return (
    <MapContainer center={coords[0]} zoom={13} scrollWheelZoom={false} style={{ height: '350px', width: '100%', borderRadius: '8px', marginTop: '15px', marginBottom: '15px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      <Polyline positions={coords} color="#3498db" weight={3} opacity={0.7} />
      {coords.map((c, i) => <Marker key={i} position={c} icon={L.icon({ iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMEMxMC40NzcgMCA2IDQuNDc3IDYgMTBDNiAxNi4zNzYgMTYgNDggMTYgNDhDMTYgNDggMjYgMTYuMzc2IDI2IDEwQzI2IDQuNDc3IDIxLjUyMyAwIDE2IDBaIiBmaWxsPSIjMzQ5OGRiIi8+PC9zdmc+', iconSize: [32, 48], iconAnchor: [16, 48] })}>
        <L.Popup>{day.schedule[i]?.activity} ({day.schedule[i]?.time})</L.Popup>
      </Marker>)}
    </MapContainer>
  );
}
