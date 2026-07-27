/**
 * Datos del tablero personal y del módulo de cuotas.
 *
 * Hoy son datos de prueba. Cuando exista el backend de Kivo Office, cada
 * bloque de este archivo se reemplaza por su fetch — los tipos ya están
 * listos para eso y los componentes no cambian.
 */

/* ─────────── Formato ─────────── */

export function bs(monto: number): string {
  return (
    "Bs " +
    monto.toLocaleString("es-BO", {
      minimumFractionDigits: monto % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

/* ─────────── Íconos (se resuelven a lucide-react en cada vista) ─────────── */

export type IconoNombre =
  | "reloj"
  | "alerta"
  | "aprobado"
  | "usuario"
  | "documento"
  | "subir"
  | "correo"
  | "banco"
  | "firma"
  | "calendario"
  | "escudo"
  | "campana"
  | "mora"
  | "tendencia"
  | "archivoOk"
  | "fiesta";

/* ─────────── Solicitud ─────────── */

export type EstadoSolicitud = "revision" | "observada" | "aprobada";
export type PasoRuta = "enviada" | "revision" | "aprobada" | "desembolso";

export type Mensaje = {
  id: string;
  tipo: "info" | "accion" | "ok";
  icono: IconoNombre;
  titulo: string;
  texto: string;
  cuando: string;
  noLeido: boolean;
  accion?: string;
};

export type HitoHistorial = {
  titulo: string;
  detalle: string;
  pendiente?: boolean;
};

export type VistaSolicitud = {
  tono: EstadoSolicitud;
  icono: IconoNombre;
  antetitulo: string;
  titulo: string;
  texto: string;
  subtituloTopbar: string;
  meta: { icono: IconoNombre; texto: string }[];
  acciones: { label: string; tipo: "accent" | "ghost" }[];
  pasoLabel: string;
  pasosHechos: PasoRuta[];
  pasoActual: PasoRuta;
  ramalActivo: boolean;
  subtitulos: Record<"revision" | "aprobada" | "desembolso", string>;
  notaRamal: string;
  historial: HitoHistorial[];
  mensajes: Mensaje[];
};

export const SOLICITUD = {
  numero: "KV-2026-00184",
  monto: 35000,
  plazoMeses: 24,
  cuota: 1842,
  tasa: "18,5% anual",
  primerPago: "05 sep 2026",
  destino: "Capital de trabajo",
  enviadaEl: "27 jul 2026",
  analista: { nombre: "Andrea Villarroel", iniciales: "AV" },
};

export const VISTAS_SOLICITUD: Record<EstadoSolicitud, VistaSolicitud> = {
  revision: {
    tono: "revision",
    icono: "reloj",
    antetitulo: "Solicitud en curso",
    titulo: "Estamos revisando tu solicitud",
    texto:
      "Andrea revisa tus ingresos y tu capacidad de pago. Te avisamos aquí y por correo apenas haya novedad — no necesitas hacer nada más por ahora.",
    subtituloTopbar: "Tu solicitud KV-2026-00184 está en revisión",
    meta: [
      { icono: "reloj", texto: "Respuesta estimada: hoy hasta las 18:00" },
      { icono: "aprobado", texto: "Identidad verificada" },
    ],
    acciones: [{ label: "Ver qué estamos revisando", tipo: "ghost" }],
    pasoLabel: "Paso 2 de 4",
    pasosHechos: ["enviada"],
    pasoActual: "revision",
    ramalActivo: false,
    subtitulos: { revision: "Desde hoy 10:02", aprobada: "Pendiente", desembolso: "Pendiente" },
    notaRamal: "Solo si falta algo",
    historial: [
      { titulo: "Revisión de capacidad de pago", detalle: "En curso · Andrea Villarroel", pendiente: true },
      { titulo: "Solicitud asignada a análisis", detalle: "27 jul · 10:02" },
      { titulo: "Identidad verificada con Segip", detalle: "27 jul · 09:14 · automático" },
      { titulo: "Solicitud enviada", detalle: "27 jul · 09:12 · desde la web" },
    ],
    mensajes: [
      {
        id: "m1",
        tipo: "info",
        icono: "reloj",
        titulo: "Tu solicitud pasó a revisión",
        texto: "Tenemos todo lo necesario para empezar. El análisis toma hasta 24 horas hábiles.",
        cuando: "hace 2 h",
        noLeido: true,
      },
      {
        id: "m2",
        tipo: "info",
        icono: "usuario",
        titulo: "Andrea Villarroel es tu analista",
        texto: "Ella te escribirá por este mismo canal si necesita algo más.",
        cuando: "hace 2 h",
        noLeido: true,
      },
      {
        id: "m3",
        tipo: "accion",
        icono: "subir",
        titulo: "Suma tu respaldo de ingresos",
        texto: "No es obligatorio, pero con tus últimas 3 boletas el análisis avanza más rápido.",
        cuando: "hace 3 h",
        noLeido: true,
        accion: "Subir documento",
      },
      {
        id: "m4",
        tipo: "ok",
        icono: "aprobado",
        titulo: "Verificamos tu celular",
        texto: "El número +591 712 34 567 quedó confirmado.",
        cuando: "ayer",
        noLeido: false,
      },
      {
        id: "m5",
        tipo: "info",
        icono: "correo",
        titulo: "Bienvenido a Kivo",
        texto: "Tu cuenta quedó creada con el correo hugo@soydigital.tech.",
        cuando: "26 jul",
        noLeido: false,
      },
    ],
  },

  observada: {
    tono: "observada",
    icono: "alerta",
    antetitulo: "Necesitamos algo tuyo",
    titulo: "Tu solicitud tiene 1 observación",
    texto:
      "Falta el respaldo de tus ingresos de los últimos 3 meses. Súbelo y volvemos a revisar el mismo día — tu solicitud sigue viva y no pierdes lo que ya llenaste.",
    subtituloTopbar: "Tu solicitud KV-2026-00184 tiene 1 observación",
    meta: [
      { icono: "calendario", texto: "Tienes hasta el 03 ago para responder" },
      { icono: "documento", texto: "1 documento pendiente" },
    ],
    acciones: [
      { label: "Corregir ahora", tipo: "accent" },
      { label: "Ver la observación", tipo: "ghost" },
    ],
    pasoLabel: "En espera de tu respuesta",
    pasosHechos: ["enviada"],
    pasoActual: "revision",
    ramalActivo: true,
    subtitulos: { revision: "En pausa", aprobada: "Pendiente", desembolso: "Pendiente" },
    notaRamal: "Observada el 27 jul · 14:35",
    historial: [
      { titulo: "Esperando tu corrección", detalle: "Plazo: hasta el 03 ago 2026", pendiente: true },
      { titulo: "Solicitud observada", detalle: "27 jul · 14:35 · falta respaldo de ingresos" },
      { titulo: "Revisión de capacidad de pago", detalle: "27 jul · 11:40" },
      { titulo: "Solicitud enviada", detalle: "27 jul · 09:12 · desde la web" },
    ],
    mensajes: [
      {
        id: "o1",
        tipo: "accion",
        icono: "alerta",
        titulo: "Falta tu respaldo de ingresos",
        texto: "Sube tus 3 últimas boletas o el extracto bancario de los últimos 3 meses. PDF o foto legible.",
        cuando: "hace 12 min",
        noLeido: true,
        accion: "Subir documento",
      },
      {
        id: "o2",
        tipo: "info",
        icono: "calendario",
        titulo: "Tienes 7 días para responder",
        texto: "Si no recibimos el documento hasta el 03 ago, la solicitud se cierra y tendrás que iniciar una nueva.",
        cuando: "hace 12 min",
        noLeido: true,
      },
      {
        id: "o3",
        tipo: "info",
        icono: "usuario",
        titulo: "Andrea Villarroel es tu analista",
        texto: "Ella te escribirá por este mismo canal si necesita algo más.",
        cuando: "hace 5 h",
        noLeido: false,
      },
      {
        id: "o4",
        tipo: "ok",
        icono: "aprobado",
        titulo: "Verificamos tu celular",
        texto: "El número +591 712 34 567 quedó confirmado.",
        cuando: "ayer",
        noLeido: false,
      },
    ],
  },

  aprobada: {
    tono: "aprobada",
    icono: "fiesta",
    antetitulo: "Buenas noticias",
    titulo: "Tu crédito fue aprobado",
    texto:
      "Bs 35.000 a 24 meses, con cuota de Bs 1.842. Firma tu contrato en línea y el dinero llega a tu cuenta en menos de 24 horas hábiles.",
    subtituloTopbar: "Tu crédito por Bs 35.000 fue aprobado",
    meta: [
      { icono: "aprobado", texto: "Aprobado el 27 jul · 16:20" },
      { icono: "firma", texto: "Contrato listo para firmar" },
    ],
    acciones: [
      { label: "Firmar contrato", tipo: "accent" },
      { label: "Ver condiciones", tipo: "ghost" },
    ],
    pasoLabel: "Paso 3 de 4",
    pasosHechos: ["enviada", "revision"],
    pasoActual: "aprobada",
    ramalActivo: false,
    subtitulos: { revision: "27 jul · 16:20", aprobada: "Firma pendiente", desembolso: "Tras la firma" },
    notaRamal: "No hubo observaciones",
    historial: [
      { titulo: "Firma del contrato", detalle: "Pendiente de tu firma electrónica", pendiente: true },
      { titulo: "Crédito aprobado", detalle: "27 jul · 16:20 · Bs 35.000 a 24 meses" },
      { titulo: "Revisión de capacidad de pago", detalle: "27 jul · 15:05 · sin observaciones" },
      { titulo: "Solicitud enviada", detalle: "27 jul · 09:12 · desde la web" },
    ],
    mensajes: [
      {
        id: "a1",
        tipo: "ok",
        icono: "fiesta",
        titulo: "Aprobamos tu crédito",
        texto: "Bs 35.000 a 24 meses con cuota de Bs 1.842. Las condiciones finales están en tu contrato.",
        cuando: "hace 20 min",
        noLeido: true,
        accion: "Firmar contrato",
      },
      {
        id: "a2",
        tipo: "info",
        icono: "firma",
        titulo: "Tu contrato está listo",
        texto: "Léelo con calma. La firma es electrónica y tarda menos de dos minutos.",
        cuando: "hace 20 min",
        noLeido: true,
      },
      {
        id: "a3",
        tipo: "info",
        icono: "banco",
        titulo: "Confirma tu cuenta de desembolso",
        texto: "Depositaremos en tu cuenta del Banco Unión terminada en 4821.",
        cuando: "hace 18 min",
        noLeido: true,
        accion: "Confirmar cuenta",
      },
      {
        id: "a4",
        tipo: "info",
        icono: "usuario",
        titulo: "Andrea Villarroel es tu analista",
        texto: "Ella te acompaña hasta el desembolso.",
        cuando: "hace 6 h",
        noLeido: false,
      },
    ],
  },
};

/* ─────────── Perfil ─────────── */

export type BloquePerfil = { nombre: string; avance: number };

export const BLOQUES_PERFIL: BloquePerfil[] = [
  { nombre: "Datos personales", avance: 1 },
  { nombre: "Domicilio", avance: 1 },
  { nombre: "Trabajo e ingresos", avance: 0.6 },
  { nombre: "Referencias", avance: 0 },
  { nombre: "Documentos", avance: 0.5 },
];

export const PORCENTAJE_PERFIL = Math.round(
  (BLOQUES_PERFIL.reduce((total, b) => total + b.avance, 0) / BLOQUES_PERFIL.length) * 100,
);

/* ─────────── Datos capturados ─────────── */

export type Campo = {
  etiqueta: string;
  valor: string;
  verificado?: boolean;
  porVerificar?: boolean;
  falta?: boolean;
};

export const DATOS_CAPTURADOS: Record<string, Campo[]> = {
  Personales: [
    { etiqueta: "Nombre completo", valor: "Hugo Andrés Soliz Mamani", verificado: true },
    { etiqueta: "Cédula de identidad", valor: "6789456 LP", verificado: true },
    { etiqueta: "Fecha de nacimiento", valor: "14 mar 1991" },
    { etiqueta: "Celular", valor: "+591 712 34 567", verificado: true },
    { etiqueta: "Correo", valor: "hugo@soydigital.tech", porVerificar: true },
    { etiqueta: "Estado civil", valor: "Casado" },
  ],
  Domicilio: [
    { etiqueta: "Ciudad", valor: "La Paz" },
    { etiqueta: "Zona", valor: "Sopocachi" },
    { etiqueta: "Dirección", valor: "Av. Ecuador N.º 2450, piso 3" },
    { etiqueta: "Tipo de vivienda", valor: "Alquilada" },
    { etiqueta: "Años en el domicilio", valor: "4 años" },
    { etiqueta: "Ubicación en el mapa", valor: "Marcada", verificado: true },
  ],
  "Trabajo e ingresos": [
    { etiqueta: "Situación", valor: "Independiente" },
    { etiqueta: "Actividad", valor: "Servicios de diseño y desarrollo" },
    { etiqueta: "Antigüedad", valor: "6 años" },
    { etiqueta: "Ingreso mensual declarado", valor: "Bs 12.500" },
    { etiqueta: "Deudas registradas", valor: "1 · Bs 980 mensual" },
    { etiqueta: "Respaldo de ingresos", valor: "Sin cargar", falta: true },
  ],
  Referencias: [
    { etiqueta: "Referencia personal 1", valor: "Sin registrar", falta: true },
    { etiqueta: "Referencia personal 2", valor: "Sin registrar", falta: true },
    { etiqueta: "Referencia comercial", valor: "Sin registrar", falta: true },
  ],
  Documentos: [
    { etiqueta: "CI anverso", valor: "Cargado · 27 jul", verificado: true },
    { etiqueta: "CI reverso", valor: "Cargado · 27 jul", verificado: true },
    { etiqueta: "Factura de luz o agua", valor: "Sin cargar", falta: true },
    { etiqueta: "Respaldo de ingresos", valor: "Sin cargar", falta: true },
  ],
};

/* ─────────── Crédito y cuotas ─────────── */

export type EstadoCuota = "pagada" | "revision" | "mora" | "pronto" | "pendiente";

export type Cuota = {
  numero: number;
  vence: string;
  estado: EstadoCuota;
  diasAtraso?: number;
  diasRestantes?: number;
  mora?: number;
  pagadaEl?: string;
  metodo?: string;
};

export const CREDITO = {
  numero: "KV-CR-00184",
  cuota: 1842,
  totalCuotas: 24,
  moraDiaria: 2.11,
  banco: {
    entidad: "Banco Unión",
    cuenta: "10000045821",
    titular: "Gencorp S.R.L. (Kivo)",
    nit: "340982026",
  },
  oficina: {
    direccion: "Av. Arce N.º 2071, La Paz",
    horario: "Lun a vie, 08:30 – 17:30",
    sabados: "09:00 – 12:30",
  },
};

export const WHATSAPP_KIVO = "https://wa.me/59177753433";

export const CUOTAS_INICIALES: Cuota[] = [
  { numero: 1, vence: "05 mar 2026", estado: "pagada", pagadaEl: "06 mar", metodo: "QR Simple" },
  { numero: 2, vence: "05 abr 2026", estado: "pagada", pagadaEl: "05 abr", metodo: "QR Simple" },
  { numero: 3, vence: "05 may 2026", estado: "pagada", pagadaEl: "04 may", metodo: "Transferencia" },
  { numero: 4, vence: "05 jun 2026", estado: "pagada", pagadaEl: "07 jun", metodo: "QR Simple" },
  { numero: 5, vence: "05 jul 2026", estado: "mora", diasAtraso: 22, mora: 46.5 },
  { numero: 6, vence: "05 ago 2026", estado: "pronto", diasRestantes: 9 },
  { numero: 7, vence: "05 sep 2026", estado: "pendiente" },
  { numero: 8, vence: "05 oct 2026", estado: "pendiente" },
  { numero: 9, vence: "05 nov 2026", estado: "pendiente" },
  { numero: 10, vence: "05 dic 2026", estado: "pendiente" },
];

export const ETIQUETA_CUOTA: Record<EstadoCuota, { texto: string; clases: string }> = {
  pagada: { texto: "Pagada", clases: "bg-[#EAF8F0] text-[#1B8B52]" },
  revision: { texto: "En revisión", clases: "bg-[#EAF7FE] text-primary-dark" },
  mora: { texto: "En mora", clases: "bg-[#FFEFEE] text-[#C6473D]" },
  pronto: { texto: "Se aproxima", clases: "bg-[#FFF5E4] text-[#B0730B]" },
  pendiente: { texto: "Por vencer", clases: "bg-[#F2F7FB] text-[#9DAEBF]" },
};

export function totalCuota(cuota: Cuota): number {
  return CREDITO.cuota + (cuota.mora ?? 0);
}