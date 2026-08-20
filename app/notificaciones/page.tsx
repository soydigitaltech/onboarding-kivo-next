"use client";

import AppShell from "@/components/shell/AppShell";
import NotificacionesView from "@/components/notificaciones/NotificacionesView";

export default function NotificacionesPage() {
  return (
    <AppShell subtitulo="Novedades de tu solicitud">
      <NotificacionesView />
    </AppShell>
  );
}
