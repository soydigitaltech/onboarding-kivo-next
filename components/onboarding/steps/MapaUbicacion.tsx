"use client";

import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L, { type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

/** Centro por defecto: La Paz, Bolivia. */
const LA_PAZ_CENTER: [number, number] = [-16.5, -68.15];

/**
 * Pin dibujado con SVG inline (sin depender de los PNG de Leaflet,
 * que suelen romperse con bundlers). Color Azul Brillante de Kivo.
 */
const kivoPinIcon = L.divIcon({
  className: "",
  html: `<div style="
      width: 34px; height: 34px; border-radius: 9999px;
      background: #03AEFE; display: flex; align-items: center;
      justify-content: center; border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(3,174,254,0.45);
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
        <circle cx="12" cy="12" r="6" />
      </svg>
    </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

export interface Coordenadas {
  lat: number;
  lng: number;
}

interface MapaUbicacionProps {
  value: Coordenadas | null;
  onChange: (coords: Coordenadas) => void;
}

/** Escucha clics en el mapa para mover el pin ahí. */
function ClickHandler({
  onChange,
}: {
  onChange: (coords: Coordenadas) => void;
}) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapaUbicacion({ value, onChange }: MapaUbicacionProps) {
  const posicion: [number, number] = value
    ? [value.lat, value.lng]
    : LA_PAZ_CENTER;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border-2 border-border">
      <MapContainer
        center={posicion}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "200px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={posicion}
          draggable
          icon={kivoPinIcon}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target as L.Marker;
              const pos = marker.getLatLng();
              onChange({ lat: pos.lat, lng: pos.lng });
            },
          }}
        />
        <ClickHandler onChange={onChange} />
      </MapContainer>
    </div>
  );
}