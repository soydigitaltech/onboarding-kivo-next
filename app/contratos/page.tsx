"use client";

import AppShell from "@/components/shell/AppShell";
import ContratosView from "@/components/contratos/ContratosView";

export default function ContratosPage() {
  return (
    <AppShell subtitulo="Contratos y documentos de tu préstamo">
      <ContratosView />
    </AppShell>
  );
}
