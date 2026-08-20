"use client";

import AppShell from "@/components/shell/AppShell";
import FacturacionView from "@/components/facturacion/FacturacionView";

export default function FacturacionPage() {
  return (
    <AppShell subtitulo="Documentos y facturación de tu préstamo">
      <FacturacionView />
    </AppShell>
  );
}
