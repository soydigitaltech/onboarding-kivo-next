"use client";

import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L, { type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

/** Centro por defecto: La Paz, Bolivia. */
const LA_PAZ_CENTER: [number, number] = [-16.5, -68.15];

/**
 * Pin dibujado con SVG inline.
 * Evitamos depender de los PNG por defecto de Leaflet.
 */
const kivoPinIcon = L.divIcon({
  className: "",
  html: `
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 1C10.37 1 5 6.37 5 13C5 22 17 33 17 33C17 33 29 22 29 13C29 6.37 23.63 1 17 1Z"
        fill="#03AEFE"
      />
      <circle
        cx="17"
        cy="13"
        r="5"
        fill="white"
      />
    </svg>
  `,
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

/** Permite seleccionar una ubicación haciendo clic sobre el mapa. */
function ClickHandler({
  onChange,
}: {
  onChange: (coords: Coordenadas) => void;
}) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onChange({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

export default function MapaUbicacion({
  value,
  onChange,
}: MapaUbicacionProps) {
  const posicion: [number, number] = value
    ? [value.lat, value.lng]
    : LA_PAZ_CENTER;

  return (
    <MapContainer
      center={posicion}
      zoom={14}
      scrollWheelZoom={false}
      style={{
        height: "200px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onChange={onChange} />

      <Marker
        position={posicion}
        draggable
        icon={kivoPinIcon}
        eventHandlers={{
          dragend: (event) => {
            const marker = event.target as L.Marker;
            const pos = marker.getLatLng();

            onChange({
              lat: pos.lat,
              lng: pos.lng,
            });
          },
        }}
      />
    </MapContainer>
  );
}
