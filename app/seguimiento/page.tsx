import AppShell from "@/components/shell/AppShell";
import SeguimientoView from "@/components/seguimiento/SeguimientoView";

export default function SeguimientoPage() {
 return (
 <AppShell subtitulo="Estado y avance de tu solicitud">
 <SeguimientoView />
 </AppShell>
 );
}
