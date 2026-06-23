'use client';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapContent({ day, spots }) {
  if (!day?.schedule?.length) return <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>No spots for this day</div>;

  const coords = day.schedule.map(s => {
    const spot = spots?.find(sp =>
      s.activity.toLowerCase().includes(sp.name.toLowerCase()) ||
      sp.name.toLowerCase().includes(s.activity.toLowerCase())
    );
  
    console.log("ACTIVITY:", s.activity);
    console.log("MATCHED:", spot?.name);
  
    return spot ? [spot.lat, spot.lng] : null;
  }).filter(Boolean);

  if (!coords.length) return <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>Map unavailable</div>;

  return (
    <div className="animate-in" style={{ borderRadius: '40px', overflow: 'hidden', border: '2px solid var(--gold)', background: '#fff' }}>
      <MapContainer 
        center={coords[0]} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: '700px', width: '100%' }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution="© OpenStreetMap" 
        />
        <Polyline positions={coords} color="var(--gold)" weight={8} opacity={1} dashArray="1, 15" lineCap="round" />
        {coords.map((c, i) => (
          <Marker 
            key={i} 
            position={c} 
            icon={L.divIcon({
               className: 'custom-div-icon',
               html: `<div style="background-color: var(--gold); width: 14px; height: 14px; border-radius: 50%; border: 3px solid #000; box-shadow: 0 0 15px var(--gold);"></div>`,
               iconSize: [20, 20],
               iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div style={{ padding: '5px' }}>
                <strong style={{ display: 'block', color: '#000', fontSize: '15px' }}>{day.schedule[i]?.activity || 'Stop'}</strong>
                <span style={{ fontSize: '12px', color: '#666' }}>POINT {i + 1}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
