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
] as const;

export type StepId = (typeof STEP_ORDER)[number];

export type StepStatus = "locked" | "active" | "done";

export interface DatosPersonales {
  nombreCompleto: string;
  ci: string;
  fechaNacimiento: string;
  celular: string;
  ciudad: string;
}

export interface DatosFinancieros {
  ingresoNeto: number;
  antiguedadMeses: number;
  numeroDeudas: number;
  cuotasDeudas: number[];
  totalCuotasMensuales: number;
  /** Declaró no tener reporte negativo en la Central de Riesgos. */
  sinReporteCentral: boolean;
}

interface OnboardingState {
  currentStep: StepId;
  completed: Record<StepId, boolean>;
  datosPersonales: DatosPersonales | null;
  datosFinancieros: DatosFinancieros | null;

  setDatosPersonales: (datos: DatosPersonales) => void;
  setDatosFinancieros: (datos: DatosFinancieros) => void;
  completeAndAdvance: (step: StepId) => void;
  editStep: (step: StepId) => void;
  reset: () => void;
}

const initialCompleted: Record<StepId, boolean> = {
  "datos-personales": false,
  "datos-financieros": false,
  simulacion: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: "datos-personales",
      completed: { ...initialCompleted },
      datosPersonales: null,
      datosFinancieros: null,

      setDatosPersonales: (datos) => set({ datosPersonales: datos }),

      setDatosFinancieros: (datos) => set({ datosFinancieros: datos }),

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
        }),
    }),
    {
      name: "kivo-onboarding",
      storage: createJSONStorage(() => sessionStorage),
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
