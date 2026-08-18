"use client";

import { useState } from "react";

import AppShell from "@/components/shell/AppShell";
import TableroView from "@/components/dashboard/TableroView";
import { VISTAS_SOLICITUD, type EstadoSolicitud } from "@/lib/kivo/datos";

export default function DashboardPage() {
 // Cuando exista el backend, este estado llega desde Kivo Office (o del store).
 const [estado, setEstado] = useState<EstadoSolicitud>("revision");

 return (
 <AppShell subtitulo={VISTAS_SOLICITUD[estado].subtituloTopbar}>
 <TableroView estado={estado} onCambiarEstado={setEstado} />
 </AppShell>
 );
}