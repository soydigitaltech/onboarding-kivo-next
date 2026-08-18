import type { DatosFinancieros } from "@/store/onboarding";

interface DatosFinancierosResumenProps {
 datos: DatosFinancieros;
}

export function DatosFinancierosResumen({ datos }: DatosFinancierosResumenProps) {
 const items = [
 { label: "Ingreso neto mensual", value: formatBs(datos.ingresoNeto) },
 {
 label: "Deudas vigentes",
 value:
 datos.numeroDeudas === 0
 ? "Ninguna"
 : `${datos.numeroDeudas} (${formatBs(datos.totalCuotasMensuales)}/mes)`,
 },
 {
 label: "Deudas en mora o vencidas",
 value: datos.sinDeudaMoraOVencida
 ? "No declaró deudas en mora o vencidas"
 : "Declaró una deuda en mora o vencida",
 },
 ];

 return (
 <dl className="grid gap-3 sm:grid-cols-2">
 {items.map((item) => (
 <div key={item.label}>
 <dt className="text-xs font-semibold text-muted">{item.label}</dt>
 <dd className="mt-0.5 text-sm font-bold text-[#0b1739]">
 {item.value}
 </dd>
 </div>
 ))}
 </dl>
 );
}

function formatBs(value: number): string {
 return `Bs ${value.toLocaleString("es-BO", { maximumFractionDigits: 2 })}`;
}