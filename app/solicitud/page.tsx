"use client";

import AppShell from "@/components/shell/AppShell";
import SolicitudPrestamoView from "@/components/solicitud/SolicitudPrestamoView";

export default function SolicitudPage() {
  return (
    <AppShell subtitulo="Inicia una solicitud con Kivo">
      <SolicitudPrestamoView />
    </AppShell>
  );
}
