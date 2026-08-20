"use client";

import AppShell from "@/components/shell/AppShell";
import SegurosView from "@/components/seguros/SegurosView";

export default function SegurosPage() {
  return (
    <AppShell subtitulo="Seguro asociado a tu préstamo">
      <SegurosView />
    </AppShell>
  );
}
