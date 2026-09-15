"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import L from "leaflet";
import {
  Crosshair,
  Hand,
  Minus,
  MousePointer2,
  Plus,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

const LA_PAZ_CENTER: [number, number] = [
  -16.5,
  -68.15,
];

export interface Coordenadas {
  lat: number;
  lng: number;
}

interface MapaUbicacionProps {
  value: Coordenadas | null;
  onChange: (
    coords: Coordenadas,
  ) => void;
}

export default function MapaUbicacion({
  value,
  onChange,
}: MapaUbicacionProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mapRef =
    useRef<L.Map | null>(null);

  const markerRef =
    useRef<L.Marker | null>(null);

  const onChangeRef =
    useRef(onChange);

  const [cargandoMapa, setCargandoMapa] =
    useState(true);

  const [esTouch, setEsTouch] =
    useState(false);

  const [
    ayudaVisible,
    setAyudaVisible,
  ] = useState(true);

  const [
    ubicacionSeleccionada,
    setUbicacionSeleccionada,
  ] = useState(false);

  useEffect(() => {
    onChangeRef.current =
      onChange;
  }, [onChange]);

  useEffect(() => {
    const media =
      window.matchMedia(
        "(pointer: coarse)",
      );

    const actualizar = () => {
      setEsTouch(
        media.matches,
      );
    };

    actualizar();

    media.addEventListener?.(
      "change",
      actualizar,
    );

    return () => {
      media.removeEventListener?.(
        "change",
        actualizar,
      );
    };
  }, []);

  function marcarSeleccion() {
    setAyudaVisible(false);
    setUbicacionSeleccionada(true);

    window.setTimeout(() => {
      setUbicacionSeleccionada(false);
    }, 1600);
  }

  function zoomIn() {
    mapRef.current?.zoomIn();
  }

  function zoomOut() {
    mapRef.current?.zoomOut();
  }

  function volverAlPin() {
    if (
      !mapRef.current ||
      !markerRef.current
    ) {
      return;
    }

    const posicion =
      markerRef.current.getLatLng();

    mapRef.current.flyTo(
      posicion,
      Math.max(
        mapRef.current.getZoom(),
        16,
      ),
      {
        duration: 0.7,
      },
    );
  }

  useEffect(() => {
    let cancelled = false;

    function iniciarMapa() {
      if (
        !containerRef.current ||
        mapRef.current
      ) {
        return;
      }

      const posicion:
        [number, number] =
        value
          ? [
              value.lat,
              value.lng,
            ]
          : LA_PAZ_CENTER;

      const map = L.map(
        containerRef.current,
        {
          center: posicion,
          zoom: 15,

          // Usamos controles propios.
          zoomControl: false,

          scrollWheelZoom: true,
          touchZoom: true,
          doubleClickZoom: true,
          dragging: true,

          attributionControl: true,
        },
      );

      mapRef.current = map;

      const tileLayer =
        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              "© OpenStreetMap contributors",
          },
        );

      tileLayer.on(
        "load",
        () => {
          setCargandoMapa(false);
        },
      );

      tileLayer.addTo(map);

      const kivoPinIcon =
        L.divIcon({
          className: "",
          html: `
            <div style="
              position:relative;
              width:46px;
              height:52px;
            ">
              <div style="
                position:absolute;
                left:50%;
                bottom:3px;
                width:24px;
                height:8px;
                transform:translateX(-50%);
                border-radius:999px;
                background:rgba(234,67,53,.20);
                filter:blur(2px);
              "></div>

              <svg
                width="46"
                height="46"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="
                  position:absolute;
                  left:0;
                  top:0;
                  filter:drop-shadow(
                    0 3px 5px
                    rgba(0,0,0,.16)
                  );
                "
              >
                <path
                  d="M17 1C10.37 1 5 6.37 5 13C5 22 17 33 17 33C17 33 29 22 29 13C29 6.37 23.63 1 17 1Z"
                  fill="#EA4335"
                />

                <circle
                  cx="17"
                  cy="13"
                  r="5"
                  fill="white"
                />
              </svg>
            </div>
          `,
          iconSize: [46, 52],
          iconAnchor: [23, 49],
        });

      const marker =
        L.marker(
          posicion,
          {
            draggable: true,
            icon: kivoPinIcon,
          },
        ).addTo(map);

      markerRef.current =
        marker;

      map.on(
        "click",
        (event) => {
          const coords = {
            lat:
              event.latlng.lat,
            lng:
              event.latlng.lng,
          };

          marker.setLatLng(
            event.latlng,
          );

          marcarSeleccion();

          onChangeRef.current(
            coords,
          );
        },
      );

      marker.on(
        "dragstart",
        () => {
          setAyudaVisible(false);
        },
      );

      marker.on(
        "dragend",
        () => {
          const posicionMarker =
            marker.getLatLng();

          marcarSeleccion();

          onChangeRef.current({
            lat:
              posicionMarker.lat,
            lng:
              posicionMarker.lng,
          });
        },
      );

      window.setTimeout(
        () => {
          if (!cancelled) {
            map.invalidateSize();
          }
        },
        0,
      );
    }

    iniciarMapa();

    return () => {
      cancelled = true;

      if (mapRef.current) {
        mapRef.current.remove();

        mapRef.current = null;
      }

      markerRef.current =
        null;
    };

    // Leaflet se inicializa solo una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !value ||
      !mapRef.current ||
      !markerRef.current
    ) {
      return;
    }

    const posicion:
      [number, number] = [
        value.lat,
        value.lng,
      ];

    markerRef.current.setLatLng(
      posicion,
    );
  }, [value]);

  return (
    <div className="relative h-[260px] w-full overflow-hidden bg-surface-blue sm:h-[320px]">
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Selecciona tu ubicación en el mapa"
      />

      {/* ======================================
          CONTROLES DE ZOOM
      ====================================== */}

      {!cargandoMapa ? (
        <div className="absolute left-3 top-3 z-[650] flex flex-col overflow-hidden rounded-[14px] bg-white">
          <button
            type="button"
            onClick={zoomIn}
            className="grid h-11 w-11 place-items-center border-b border-slate-100 text-ink transition-colors hover:bg-surface-blue active:bg-surface-blue"
            aria-label="Acercar mapa"
          >
            <Plus
              className="h-5 w-5"
              strokeWidth={2.5}
            />
          </button>

          <button
            type="button"
            onClick={zoomOut}
            className="grid h-11 w-11 place-items-center border-b border-slate-100 text-ink transition-colors hover:bg-surface-blue active:bg-surface-blue"
            aria-label="Alejar mapa"
          >
            <Minus
              className="h-5 w-5"
              strokeWidth={2.5}
            />
          </button>

          <button
            type="button"
            onClick={volverAlPin}
            className="grid h-11 w-11 place-items-center text-primary transition-colors hover:bg-surface-blue active:bg-surface-blue"
            aria-label="Volver a mi ubicación seleccionada"
          >
            <Crosshair
              className="h-[19px] w-[19px]"
              strokeWidth={2.4}
            />
          </button>
        </div>
      ) : null}

      {/* ======================================
          AYUDA DE INTERACCIÓN
      ====================================== */}

      {!cargandoMapa &&
      ayudaVisible ? (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-[650] w-[calc(100%-32px)] max-w-[470px] -translate-x-1/2">
          <div className="rounded-[18px] bg-white/95 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-blue text-primary">
                {esTouch ? (
                  <Hand className="h-[18px] w-[18px] animate-bounce" />
                ) : (
                  <MousePointer2 className="h-[18px] w-[18px] animate-bounce" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink">
                  Marca tu ubicación
                </p>

                <p className="mt-0.5 text-xs leading-5 text-body">
                  {esTouch
                    ? "Mueve el pin y usa dos dedos para acercar o alejar."
                    : "Arrastra el pin, haz clic en el mapa o usa el zoom."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ======================================
          CONFIRMACIÓN
      ====================================== */}

      {!cargandoMapa &&
      ubicacionSeleccionada ? (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-[660] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-extrabold text-primary-dark">
            Ubicación seleccionada
          </div>
        </div>
      ) : null}

      {/* ======================================
          CARGANDO
      ====================================== */}

      {cargandoMapa ? (
        <div className="absolute inset-0 z-[700] grid place-items-center bg-surface-blue">
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
