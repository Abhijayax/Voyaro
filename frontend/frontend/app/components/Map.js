'use client';
import dynamic from 'next/dynamic';

const MapContent = dynamic(() => import('./MapContent'), { ssr: false });

export default function Map({ day, spots }) {
  return <MapContent day={day} spots={spots} />;
}
