import type { DatosPersonales } from "@/store/onboarding";

interface DatosPersonalesResumenProps {
  datos: DatosPersonales;
}

const CIUDAD_LABELS: Record<string, string> = {
  "la-paz": "La Paz",
  "el-alto": "El Alto",
  cochabamba: "Cochabamba",
  "santa-cruz": "Santa Cruz de la Sierra",
  sucre: "Sucre",
  oruro: "Oruro",
  potosi: "Potosí",
  tarija: "Tarija",
  trinidad: "Trinidad",
  cobija: "Cobija",
};

export function DatosPersonalesResumen({ datos }: DatosPersonalesResumenProps) {
  const items = [
    { label: "Nombre completo", value: `${datos.nombres} ${datos.apellidos}` },
    { label: "Cédula de identidad", value: datos.ci },
    {
      label: "Fecha de nacimiento",
      value: formatDate(datos.fechaNacimiento),
    },
    { label: "Celular", value: `+591 ${datos.celular}` },
    {
      label: "Ciudad",
      value: CIUDAD_LABELS[datos.ciudad] ?? datos.ciudad,
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

function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}