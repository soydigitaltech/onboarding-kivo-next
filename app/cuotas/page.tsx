"use client";

import AppShell from "@/components/shell/AppShell";
import CuotasView from "@/components/cuotas/CuotasView";

export default function CuotasPage() {
  return (
    <AppShell subtitulo="Préstamo KV-CR-00184 · 1 cuota en mora">
      <CuotasView />
    </AppShell>
  );
}