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

  /** Situación laboral elegida al inicio de la solicitud. */
  perfilLaboral: "ASALARIADO" | "INDEPENDIENTE";

  /** Personas que dependen económicamente del solicitante. */
  numeroDependientes: number;

  /** Día habitual en el que recibe sus ingresos. */
  diaPago: number;

  /** Medio preferido para el contacto de Kivo. */
  canalContacto: "WHATSAPP" | "LLAMADA";

  /** Rubro de la empresa o actividad económica independiente. */
  rubroLaboral: string;

  /** Dirección de la empresa, negocio o lugar habitual de trabajo. */
  direccionTrabajo: string;
}

export interface DatosFinancieros {
  ingresoNeto: number;
  antiguedadMeses: number;
  numeroDeudas: number;
  cuotasDeudas: number[];
  totalCuotasMensuales: number;
  /** Declaró no tener reporte negativo en la Central de Riesgos. */
  sinReporteCentral: boolean;
  /**
   * Si declaró más de 3 deudas, la excepción que le permite continuar:
   * ULTIMA_CUOTA (una deuda está por terminar) o COMPRA_DEUDA
   * (pide que Kivo compre una deuda; cuotaCompra guarda su cuota).
   */
  excepcionMasDeTres: {
    tipo: "ULTIMA_CUOTA" | "COMPRA_DEUDA";
    cuotaCompra?: number;
  } | null;
}

export interface SimulacionConfirmada {
  monto: number;
  plazoMeses: number;
  cuotaMensual: number;
  totalPagar: number;
  interesTotal: number;
  cuotaMaxima: number;
  tasaMensualPorcentaje: number;
  confirmadaEn: string;
}

export interface DatosComplementarios {
  vivienda: "PROPIA" | "FAMILIAR" | "ALQUILER" | "ANTICRETICO";
  estadoCivil: "SOLTERO" | "CASADO" | "DIVORCIADO" | "VIUDO" | "CONYUGE";

  conyugeNombre?: string;
  conyugeCelular?: string;

  tieneGarante?: "SI" | "NO";

  /** Dirección actual de residencia. */
  direccion: string;

  destinoPrestamo: string;

  /** Ubicación aproximada de la residencia. */
  ubicacionLat?: number;
  ubicacionLng?: number;

  extractos: "SI" | "NO";
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
  datosComplementarios: DatosComplementarios | null;
  datosDocumentos: DatosDocumentos | null;
  solicitudEnviada: SolicitudEnviada | null;
  cuenta: Cuenta | null;

  setCuenta: (cuenta: Cuenta) => void;
  setDatosPersonales: (datos: DatosPersonales) => void;
  setDatosFinancieros: (datos: DatosFinancieros) => void;
  setSimulacion: (datos: SimulacionConfirmada) => void;
  setDatosComplementarios: (datos: DatosComplementarios) => void;
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
      datosComplementarios: null,
      datosDocumentos: null,
      solicitudEnviada: null,
      cuenta: null,

      setCuenta: (cuenta) => set({ cuenta }),

      setDatosPersonales: (datos) => set({ datosPersonales: datos }),

      setDatosFinancieros: (datos) => set({ datosFinancieros: datos }),

      setSimulacion: (datos) => set({ simulacion: datos }),

      setDatosComplementarios: (datos) =>
        set({ datosComplementarios: datos }),

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
          datosComplementarios: null,
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