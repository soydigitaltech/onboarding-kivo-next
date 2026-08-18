"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LA_PAZ_CENTER: [number, number] = [-16.5, -68.15];

export interface Coordenadas {
  lat: number;
  lng: number;
}

interface MapaUbicacionProps {
  value: Coordenadas | null;
  onChange: (coords: Coordenadas) => void;
}

export default function MapaUbicacion({
  value,
  onChange,
}: MapaUbicacionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cargandoMapa, setCargandoMapa] = useState(true);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;

    function iniciarMapa() {
      if (!containerRef.current || mapRef.current) {
        return;
      }

      if (cancelled || !containerRef.current) {
        return;
      }

      const posicion: [number, number] = value
        ? [value.lat, value.lng]
        : LA_PAZ_CENTER;

      const map = L.map(containerRef.current, {
        center: posicion,
        zoom: 14,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });

      mapRef.current = map;

      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
        },
      );

      tileLayer.on("load", () => {
        setCargandoMapa(false);
      });

      tileLayer.addTo(map);

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

      const marker = L.marker(posicion, {
        draggable: true,
        icon: kivoPinIcon,
      }).addTo(map);

      markerRef.current = marker;

      map.on("click", (event) => {
        const coords = {
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        };

        marker.setLatLng(event.latlng);
        onChangeRef.current(coords);
      });

      marker.on("dragend", () => {
        const posicionMarker = marker.getLatLng();

        onChangeRef.current({
          lat: posicionMarker.lat,
          lng: posicionMarker.lng,
        });
      });

      /*
       * Leaflet necesita conocer el tamaño real del contenedor
       * una vez montado.
       */
      window.setTimeout(() => {
        if (!cancelled) {
          map.invalidateSize();
        }
      }, 0);
    }

    iniciarMapa();

    return () => {
      cancelled = true;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      markerRef.current = null;
    };

    // El mapa se crea una sola vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Si el padre cambia las coordenadas, actualizamos el pin
   * sin reconstruir todo el mapa.
   */
  useEffect(() => {
    if (!value || !mapRef.current || !markerRef.current) {
      return;
    }

    const posicion: [number, number] = [
      value.lat,
      value.lng,
    ];

    markerRef.current.setLatLng(posicion);
    mapRef.current.panTo(posicion);
  }, [value]);

  return (
    <div className="relative h-[200px] w-full overflow-hidden bg-surface-blue">
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Selecciona tu ubicación en el mapa"
      />

      {cargandoMapa ? (
        <div className="absolute inset-0 z-[500] grid place-items-center bg-surface-blue">
          <div className="flex flex-col items-center text-center">
            <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />

            <p className="mt-3 text-xs font-extrabold text-primary-dark">
              Cargando mapa…
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
