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

export type MotivoNoElegible =
  | "EDAD_FUERA_RANGO"
  | "CIUDAD_SIN_COBERTURA";

export interface ElegibilidadInicial {
  estado: "ELEGIBLE" | "NO_ELEGIBLE";
  motivo: MotivoNoElegible | null;
  evaluadaEn: string;
}

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
  /**
   * Cuota KIVO total mensual (CK).
   * Se conserva cuotaMensual por compatibilidad.
   */
  cuotaMensual: number;
  cuotaKivo: number;

  /** Cuota base francesa (R). */
  cuotaBase: number;

  capitalPrimeraCuota: number;
  interesPrimeraCuota: number;
  seguroDesgravamenMensual: number;
  gastosAdministrativosMensuales: number;

  totalPagar: number;
  interesTotal: number;
  seguroTotal: number;
  gastosAdministrativosTotal: number;

  /**
   * PDE = (CK + TD) / IN
   * Expresado como porcentaje.
   */
  porcentajeEndeudamiento: number;

  /**
   * MA = DIF / IN
   * Expresado como porcentaje.
   */
  margenAhorroPorcentaje: number;

  tasaMensualPorcentaje: number;

  confirmadaEn: string;
}


export interface DatosComplementarios {
  /** Empresa donde trabaja o nombre de su negocio. */
  nombreEmpresaNegocio: string;

  /** Rubro de la empresa o actividad económica. */
  rubro:
    | "Comercio"
    | "Servicios"
    | "Industria"
    | "Agropecuaria"
    | "Construcción"
    | "Transporte"
    | "Tecnología"
    | "Finanzas"
    | "Turismo"
    | "Salud y Educación"
    | "OTRO";

  /** Cargo, profesión, oficio o actividad principal. */
  cargoActividad: string;

  /** Antigüedad laboral o en la actividad económica, expresada en meses. */
  antiguedadActividad: number;

  /** Indica si el trabajador independiente declara contar con NIT. */
  tieneNit?: "SI" | "NO";

  /** Indica si cuenta con licencia de funcionamiento o patente. */
  tieneLicenciaFuncionamiento?: "SI" | "NO";

  /** Dirección de la empresa, negocio o lugar de trabajo. */
  direccionLaboral: string;

  /** Afiliación declarada a AFP para perfiles donde corresponde. */
  tieneAfp?: "SI" | "NO";

  /** Disponibilidad declarada de boletas de pago. */
  tieneBoletasPago?: "SI" | "NO";

  /** Ubicación seleccionada en el mapa para empresa, trabajo o negocio. */
  ubicacionLaboral: {
    lat: number;
    lng: number;
  };

  vivienda: "PROPIA" | "FAMILIAR" | "ALQUILER" | "ANTICRETICO";

  /** Parentesco cuando declara vivienda familiar. */
  parentescoViviendaFamiliar?:
    | "PADRES"
    | "HIJOS"
    | "HERMANOS"
    | "ABUELOS"
    | "OTROS";

  /** Detalle requerido cuando selecciona Otros. */
  detalleParentescoViviendaFamiliar?: string;

  /**
   * Se solicita para vivienda alquilada o en anticrético
   * y corresponde a un garante con vivienda propia.
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

  destinoPrestamo: "CAPITAL_TRABAJO" | "USO_PERSONAL";

  /** Descripción proporcionada por el cliente sobre el uso del préstamo. */
  detalleDestinoPrestamo: string;
}


/** Metadatos de un archivo cargado (el binario no se persiste). */
export interface DocumentoMeta {
  nombre: string;
  tamanoBytes: number;
  tipo: string;
  subidoEn: string;
}

export interface DatosDocumentos {
  ciAnverso: DocumentoMeta | null;
  ciReverso: DocumentoMeta | null;
  selfie: DocumentoMeta | null;
  autorizacionBic: DocumentoMeta | null;
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
  elegibilidadInicial: ElegibilidadInicial | null;
  datosFinancieros: DatosFinancieros | null;
  simulacion: SimulacionConfirmada | null;
  datosComplementarios: DatosComplementarios | null;
  datosDocumentos: DatosDocumentos | null;
  solicitudEnviada: SolicitudEnviada | null;
  cuenta: Cuenta | null;

  setCuenta: (cuenta: Cuenta) => void;
  setDatosPersonales: (datos: DatosPersonales) => void;
  setElegibilidadInicial: (datos: ElegibilidadInicial | null) => void;
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
      elegibilidadInicial: null,
      datosFinancieros: null,
      simulacion: null,
      datosComplementarios: null,
      datosDocumentos: null,
      solicitudEnviada: null,
      cuenta: null,

      setCuenta: (cuenta) => set({ cuenta }),

      setDatosPersonales: (datos) => set({ datosPersonales: datos }),

      setElegibilidadInicial: (datos) =>
        set({ elegibilidadInicial: datos }),

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
          elegibilidadInicial: null,
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
      version: 2,

      migrate: (persistedState) => {
        const state = persistedState as {
          currentStep?: string;
          completed?: Record<string, boolean>;
          datosDocumentos?: Record<string, unknown> | null;
          solicitudMayor?: unknown;
        };

        if (state.currentStep === "referencias") {
          state.currentStep = "carga-documentos";
        }

        if (state.completed) {
          const {
            referencias: _referencias,
            ...completedSinReferencias
          } = state.completed;

          state.completed = {
            ...initialCompleted,
            ...completedSinReferencias,
          };
        }

        if (state.datosDocumentos) {
          const documentos = state.datosDocumentos;

          state.datosDocumentos = {
            ciAnverso: documentos.ciAnverso ?? null,
            ciReverso: documentos.ciReverso ?? null,
            selfie: documentos.selfie ?? null,
            autorizacionBic:
              documentos.autorizacionBic ?? null,
          };
        }

        delete state.solicitudMayor;

        return state;
      },
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