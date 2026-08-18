"use client";

import { useEffect } from "react";
import {
  STATUS,
  useJoyride,
  type EventData,
  type Step,
} from "react-joyride";

const TOUR_KEY = "kivo-dashboard-tour-v1";

const STEPS: Step[] = [
  {
    target: "[data-tour='loan-selector']",
    title: "Tu préstamo",
    content:
      "Cambia entre tu solicitud y tu préstamo activo para consultar la información de cada etapa.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: "[data-tour='loan-card']",
    title: "Información principal",
    content:
      "Aquí encontrarás el monto, saldo, próxima cuota y las acciones principales de tu préstamo.",
    placement: "right",
  },
  {
    target: "[data-tour='notifications']",
    title: "Tus notificaciones",
    content:
      "Aquí encontrarás los avisos más importantes relacionados con tu solicitud y tu préstamo.",
    placement: "left",
  },
  {
    target: "[data-tour='tracking']",
    title: "Estado y seguimiento",
    content:
      "Consulta en qué etapa se encuentra tu solicitud y revisa su avance.",
    placement: "top",
  },
  {
    target: "[data-tour='documents']",
    title: "Tus requisitos",
    content:
      "Revisa tus documentos cargados y cualquier requisito pendiente.",
    placement: "top",
  },
  {
    target: "[data-tour='personalize']",
    title: "Personaliza tu tablero",
    content:
      "Puedes mover las tarjetas y ordenarlas como te resulte más cómodo.",
    placement: "bottom",
  },
];

export default function DashboardTour() {
  const {
    controls,
    Tour,
  } = useJoyride({
    steps: STEPS,
    continuous: true,
    options: {
      primaryColor: "#03AEFE",
      textColor: "#071A25",
      backgroundColor: "#FFFFFF",
      overlayColor: "rgba(7, 26, 37, 0.58)",
      arrowColor: "#FFFFFF",
      zIndex: 10000,
      showProgress: true,
      targetWaitTimeout: 3000,
      buttons: [
        "back",
        "close",
        "primary",
        "skip",
      ],
    },
    locale: {
      back: "Atrás",
      close: "Cerrar",
      last: "Finalizar",
      next: "Siguiente",
      open: "Abrir",
      skip: "Omitir",
    },
    styles: {
      tooltip: {
        borderRadius: 18,
        padding: 20,
        boxShadow: "none",
      },
      tooltipTitle: {
        fontSize: 17,
        fontWeight: 800,
      },
      tooltipContent: {
        fontSize: 13,
        lineHeight: 1.6,
      },
      buttonPrimary: {
        backgroundColor: "#000000",
        color: "#FFFFFF",
        borderRadius: 10,
        boxShadow: "none",
        fontWeight: 800,
        padding: "10px 14px",
      },
      buttonBack: {
        color: "#071A25",
        fontWeight: 700,
      },
      buttonSkip: {
        color: "#6B7484",
        fontWeight: 700,
      },
    },
    onEvent: (data: EventData) => {
      const finished =
        data.status === STATUS.FINISHED ||
        data.status === STATUS.SKIPPED;

      if (finished) {
        window.localStorage.setItem(
          TOUR_KEY,
          "true"
        );
      }
    },
  });

  useEffect(() => {
    const completed =
      window.localStorage.getItem(TOUR_KEY);

    if (completed) return;

    const timer = window.setTimeout(() => {
      controls.start();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [controls]);

  useEffect(() => {
    const startTour = () => {
      controls.reset(true);
    };

    window.addEventListener(
      "kivo:start-dashboard-tour",
      startTour
    );

    return () => {
      window.removeEventListener(
        "kivo:start-dashboard-tour",
        startTour
      );
    };
  }, [controls]);

  return Tour;
}
