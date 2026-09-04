import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Orden canónico de los pasos del onboarding.
 * Agregar un paso nuevo = agregarlo aquí y crear su sección.
 */
export const STEP_ORDER = [
  "datos-personales",
  "datos-financieros",
  "simulacion",
  "informacion-complementaria",
  "referencias",
  "carga-documentos",
  "resumen",
] as const;

export type StepId = (typeof STEP_ORDER)[number];

export type StepStatus = "locked" | "active" | "done";

/** Cuenta verificada por OTP. */
export interface Cuenta {
  email: string;
  verificadaEn: string;
}

export interface DatosPersonales {
  nombreCompleto: string;
  ci: string;
  fechaNacimiento: string;
  celular: string;
  ciudad: string;

  /** Dirección actual de domicilio del solicitante. */
  direccion: string;

  /** Ubicación seleccionada en el mapa para el domicilio. */
  ubicacionDomicilio: {
    lat: number;
    lng: number;
  };

  /** Personas que dependen económicamente del solicitante. */
  numeroDependientes: number;

  /**
   * Compatibilidad temporal mientras estos campos
   * se redistribuyen en los siguientes pasos.
   */
  perfilLaboral?: "ASALARIADO" | "INDEPENDIENTE";
  rubroLaboral?: string;
  direccionTrabajo?: string;
}

export interface DeudaFinanciera {
  entidadFinanciera: string;
  cuotaMensual: number;
}

export interface DeudaEspecial {
  entidadFinanciera: string;
  cuotaMensual: number;
  capitalPendiente: number;
}

export interface DatosFinancieros {
  /** Tipo de actividad declarada por el solicitante. */
  perfilLaboral: "ASALARIADO" | "INDEPENDIENTE";

  /** Ingreso mensual después de descuentos o costos operativos. */
  ingresoNeto: number;

  /** Indica si declara una fuente adicional de ingresos. */
  tieneSegundoIngreso: boolean;

  /** Origen declarado de la segunda fuente de ingresos. */
  segundoIngresoOrigen?: string;

  /** Monto neto mensual de la segunda fuente de ingresos. */
  segundoIngresoMonto?: number;

  /**
   * La segunda fuente solo se considera si puede respaldarse al 100%
   * mediante extractos bancarios.
   */
  segundoIngresoRespaldado: boolean;

  numeroDeudas: number;
  deudas: DeudaFinanciera[];
  totalCuotasMensuales: number;

  /** Declaró no tener deuda en mora ni vencida. */
  sinDeudaMoraOVencida: boolean;

  /** Indica si dispone de extractos bancarios. */
  extractos: "SI" | "NO";

  /**
   * Excepción para solicitudes con más de tres deudas.
   */
  excepcionMasDeTres: {
    tipo: "ULTIMA_CUOTA" | "COMPRA_DEUDA";

    /**
     * Cuarta deuda que está en su última cuota.
     */
    deudaCuatro?: DeudaEspecial;

    /**
     * Deuda que Kivo evaluará comprar.
     */
    deudaCompra?: DeudaEspecial;
  } | null;
}

export interface SimulacionConfirmada {
  monto: number;
  plazoMeses: number;
  destinoPrestamo: "CAPITAL_TRABAJO" | "USO_PERSONAL";

  cuotaMensual: number;
  cuotaBase: number;

  capitalPrimeraCuota: number;
  interesPrimeraCuota: number;
  seguroDesgravamenMensual: number;
  gastosAdministrativosMensuales: number;

  totalPagar: number;
  interesTotal: number;
  seguroTotal: number;
  gastosAdministrativosTotal: number;

  cuotaMaxima: number;
  porcentajeCapacidad: number;
  tasaMensualPorcentaje: number;

  confirmadaEn: string;
}

export interface SolicitudMayor {
  monto: number;
  plazoMeses: number;
  requiereEvaluacionEspecial: true;
  registradaEn: string;
}

export interface DatosComplementarios {
  /** Empresa donde trabaja o nombre de su negocio. */
  nombreEmpresaNegocio: string;

  /** Rubro de la empresa o actividad económica. */
  rubro: string;

  /** Cargo, profesión, oficio o actividad principal. */
  cargoActividad: string;

  /** Antigüedad laboral o en la actividad económica, expresada en meses. */
  antiguedadActividad: number;

  /** Dirección de la empresa, negocio o lugar de trabajo. */
  direccionLaboral: string;

  /** Ubicación seleccionada en el mapa para empresa, trabajo o negocio. */
  ubicacionLaboral: {
    lat: number;
    lng: number;
  };

  /** Información adicional requerida únicamente para independientes. */
  negocioFormalizado?: "SI" | "NO";

  tipoLocalNegocio?:
    | "PROPIO"
    | "ALQUILER"
    | "ANTICRETICO"
    | "DOMICILIO"
    | "OTRO";

  /** Indica si el solicitante declara un vehículo a su nombre. */
  tieneVehiculo: "SI" | "NO";

  vivienda: "PROPIA" | "FAMILIAR" | "ALQUILER" | "ANTICRETICO";

  /**
   * Actualmente se solicita cuando la vivienda es
   * alquilada o en anticrético.
   *
   * No asumir todavía que corresponde al garante financiero
   * de la operación hasta confirmar la regla con Kivo.
   */
  tieneGarante?: "SI" | "NO";

  estadoCivil:
    | "SOLTERO"
    | "CASADO"
    | "DIVORCIADO"
    | "VIUDO"
    | "CONYUGE";

  /** Datos básicos requeridos para casado(a) o unión libre. */
  nombreConyuge?: string;
  celularConyuge?: string;

  destinoPrestamo: "CAPITAL_TRABAJO" | "USO_PERSONAL";

  /** Descripción proporcionada por el cliente sobre el uso del préstamo. */
  detalleDestinoPrestamo: string;
}

export interface Referencia {
  nombreCompleto: string;
  relacion: string;
  celular: string;
}

export interface DatosReferencias {
  personal1: Referencia;
  personal2: Referencia;
  laboralComercial: Referencia;
}

/** Metadatos de un archivo cargado (el binario no se persiste). */
export interface DocumentoMeta {
  nombre: string;
  tamanoBytes: number;
  tipo: string;
  subidoEn: string;
}

export interface DatosDocumentos {
  autorizacionBic: DocumentoMeta | null;
  ciAnverso: DocumentoMeta | null;
  ciReverso: DocumentoMeta | null;
  selfie: DocumentoMeta | null;

  viviendaPropia: DocumentoMeta | null;
  viviendaAlquiler: DocumentoMeta | null;
  viviendaAnticretico: DocumentoMeta | null;
  viviendaFamiliar: DocumentoMeta | null;

  /** Respaldos para solicitantes asalariados. */
  asalariadoExtractoSueldo: DocumentoMeta | null;
  asalariadoBoletasPago: DocumentoMeta | null;
  asalariadoGestora: DocumentoMeta | null;
  asalariadoCertificadoLaboral: DocumentoMeta | null;

  /** Respaldos para solicitantes independientes. */
  independienteExtractosIngresos: DocumentoMeta | null;
  independienteRespaldosNegocio: DocumentoMeta | null;

  /** Documentación condicional del negocio del independiente. */
  negocioFormalizacion: DocumentoMeta | null;
  negocioLocalPropio: DocumentoMeta | null;
  negocioLocalAlquiler: DocumentoMeta | null;
  negocioLocalAnticretico: DocumentoMeta | null;

  /** Respaldos de préstamos vigentes. */
  planPagosPrestamos: DocumentoMeta | null;
  extractosPrestamos: DocumentoMeta | null;

  /** Respaldo de una segunda fuente de ingresos declarada. */
  segundoIngresoRespaldo: DocumentoMeta | null;

  /** Comprobante actualizado del domicilio declarado. */
  comprobanteDomicilio: DocumentoMeta | null;

  /** Respaldo de vehículo declarado. */
  documentoVehiculo: DocumentoMeta | null;
}

/** Se genera al enviar la solicitud desde el paso "Resumen". */
export interface SolicitudEnviada {
  numero: string;
  enviadoEn: string;
}

interface OnboardingState {
  currentStep: StepId;
  completed: Record<StepId, boolean>;
  datosPersonales: DatosPersonales | null;
  datosFinancieros: DatosFinancieros | null;
  simulacion: SimulacionConfirmada | null;
  solicitudMayor: SolicitudMayor | null;
  datosComplementarios: DatosComplementarios | null;
  referencias: DatosReferencias | null;
  datosDocumentos: DatosDocumentos | null;
  solicitudEnviada: SolicitudEnviada | null;
  cuenta: Cuenta | null;

  setCuenta: (cuenta: Cuenta) => void;
  setDatosPersonales: (datos: DatosPersonales) => void;
  setDatosFinancieros: (datos: DatosFinancieros) => void;
  setSimulacion: (datos: SimulacionConfirmada) => void;
  setSolicitudMayor: (datos: SolicitudMayor | null) => void;
  setDatosComplementarios: (datos: DatosComplementarios) => void;
  setReferencias: (datos: DatosReferencias) => void;
  setDatosDocumentos: (datos: DatosDocumentos) => void;
  setSolicitudEnviada: (solicitud: SolicitudEnviada) => void;
  completeAndAdvance: (step: StepId) => void;
  editStep: (step: StepId) => void;
  reset: () => void;
}

const initialCompleted: Record<StepId, boolean> = {
  "datos-personales": false,
  "datos-financieros": false,
  simulacion: false,
  "informacion-complementaria": false,
  referencias: false,
  "carga-documentos": false,
  resumen: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: "datos-personales",
      completed: { ...initialCompleted },
      datosPersonales: null,
      datosFinancieros: null,
      simulacion: null,
      solicitudMayor: null,
      datosComplementarios: null,
      referencias: null,
      datosDocumentos: null,
      solicitudEnviada: null,
      cuenta: null,

      setCuenta: (cuenta) => set({ cuenta }),

      setDatosPersonales: (datos) => set({ datosPersonales: datos }),

      setDatosFinancieros: (datos) => set({ datosFinancieros: datos }),

      setSimulacion: (datos) => set({ simulacion: datos }),

      setSolicitudMayor: (datos) => set({ solicitudMayor: datos }),

      setDatosComplementarios: (datos) =>
        set({ datosComplementarios: datos }),

      setReferencias: (datos) =>
        set({ referencias: datos }),

      setDatosDocumentos: (datos) => set({ datosDocumentos: datos }),

      setSolicitudEnviada: (solicitud) =>
        set({ solicitudEnviada: solicitud }),

      completeAndAdvance: (step) =>
        set((state) => {
          const completed = { ...state.completed, [step]: true };
          const next = STEP_ORDER.find((id) => !completed[id]);

          return {
            completed,
            currentStep: next ?? step,
          };
        }),

      editStep: (step) => set({ currentStep: step }),

      reset: () =>
        set({
          currentStep: "datos-personales",
          completed: { ...initialCompleted },
          datosPersonales: null,
          datosFinancieros: null,
          simulacion: null,
          solicitudMayor: null,
          datosComplementarios: null,
          referencias: null,
          datosDocumentos: null,
          solicitudEnviada: null,
          cuenta: null,
        }),
    }),
    {
      name: "kivo-onboarding",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Deriva el estado visual de una sección a partir del store. */
export function getStepStatus(
  step: StepId,
  currentStep: StepId,
  completed: Record<StepId, boolean>,
): StepStatus {
  if (step === currentStep) return "active";
  if (completed[step]) return "done";
  return "locked";
}