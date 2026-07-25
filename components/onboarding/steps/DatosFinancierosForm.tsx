"use client";

import { useMemo, useState, type FormEvent } from "react";

import {
  useOnboardingStore,
  type DatosFinancieros,
} from "@/store/onboarding";

const MAX_DEUDAS = 3;

interface FormState {
  ingresoNeto: string;
  antiguedadMeses: string;
  numeroDeudas: string;
  cuotasDeudas: string[];
  sinReporteCentral: boolean | null;
}

interface FieldErrors {
  ingresoNeto?: string;
  antiguedadMeses?: string;
  numeroDeudas?: string;
  cuotasDeudas?: string;
  sinReporteCentral?: string;
}

function toFormState(datos: DatosFinancieros | null): FormState {
  if (!datos) {
    return {
      ingresoNeto: "",
      antiguedadMeses: "",
      numeroDeudas: "0",
      cuotasDeudas: [],
      sinReporteCentral: null,
    };
  }

  return {
    ingresoNeto: String(datos.ingresoNeto),
    antiguedadMeses: String(datos.antiguedadMeses),
    numeroDeudas: String(datos.numeroDeudas),
    cuotasDeudas: datos.cuotasDeudas.map(String),
    sinReporteCentral: datos.sinReporteCentral,
  };
}

export function DatosFinancierosForm() {
  const datosFinancieros = useOnboardingStore((s) => s.datosFinancieros);
  const setDatosFinancieros = useOnboardingStore((s) => s.setDatosFinancieros);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

  const [values, setValues] = useState<FormState>(() =>
    toFormState(datosFinancieros),
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const numeroDeudas = clampDebtCount(values.numeroDeudas);

  const totalCuotasMensuales = useMemo(
    () =>
      values.cuotasDeudas
        .slice(0, numeroDeudas)
        .reduce((sum, value) => sum + (parseFloat(value) || 0), 0),
    [values.cuotasDeudas, numeroDeudas],
  );

  function updateNumeroDeudas(raw: string) {
    const digitsOnly = raw.replace(/\D/g, "");
    const count = clampDebtCount(digitsOnly);

    setValues((prev) => {
      const nextCuotas = Array.from(
        { length: count },
        (_, i) => prev.cuotasDeudas[i] ?? "",
      );
      return { ...prev, numeroDeudas: digitsOnly, cuotasDeudas: nextCuotas };
    });
    setErrors((prev) => ({ ...prev, numeroDeudas: undefined, cuotasDeudas: undefined }));
  }

  function updateCuota(index: number, raw: string) {
    const cleaned = raw.replace(/[^\d.]/g, "");
    setValues((prev) => {
      const next = [...prev.cuotasDeudas];
      next[index] = cleaned;
      return { ...prev, cuotasDeudas: next };
    });
    setErrors((prev) => ({ ...prev, cuotasDeudas: undefined }));
  }

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};

    const ingreso = parseFloat(values.ingresoNeto);
    if (!values.ingresoNeto || Number.isNaN(ingreso) || ingreso <= 0) {
      nextErrors.ingresoNeto = "Ingresa tu ingreso neto mensual.";
    }

    const antiguedad = parseInt(values.antiguedadMeses, 10);
    if (!values.antiguedadMeses || Number.isNaN(antiguedad) || antiguedad < 0) {
      nextErrors.antiguedadMeses = "Ingresa tu antigüedad laboral en meses.";
    }

    if (
      values.numeroDeudas === "" ||
      Number.isNaN(Number(values.numeroDeudas)) ||
      Number(values.numeroDeudas) < 0 ||
      Number(values.numeroDeudas) > MAX_DEUDAS
    ) {
      nextErrors.numeroDeudas = `Puedes registrar entre 0 y ${MAX_DEUDAS} deudas.`;
    }

    if (numeroDeudas > 0) {
      const someInvalid = values.cuotasDeudas
        .slice(0, numeroDeudas)
        .some((value) => !value || parseFloat(value) <= 0);

      if (someInvalid) {
        nextErrors.cuotasDeudas = "Ingresa la cuota mensual de cada deuda.";
      }
    }

    if (values.sinReporteCentral === null) {
      nextErrors.sinReporteCentral =
        "Indica si tienes un reporte negativo en la Central de Riesgos.";
    }

    return nextErrors;
  }

  const hasNegativeReport = values.sinReporteCentral === false;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasNegativeReport) {
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const datos: DatosFinancieros = {
      ingresoNeto: parseFloat(values.ingresoNeto),
      antiguedadMeses: parseInt(values.antiguedadMeses, 10),
      numeroDeudas,
      cuotasDeudas: values.cuotasDeudas
        .slice(0, numeroDeudas)
        .map((value) => parseFloat(value) || 0),
      totalCuotasMensuales,
      sinReporteCentral: true,
    };

    setDatosFinancieros(datos);
    completeAndAdvance("datos-financieros");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ingreso neto mensual" error={errors.ingresoNeto} htmlFor="ingresoNeto">
          <MoneyInput
            id="ingresoNeto"
            value={values.ingresoNeto}
            onChange={(v) => {
              setValues((prev) => ({ ...prev, ingresoNeto: v }));
              setErrors((prev) => ({ ...prev, ingresoNeto: undefined }));
            }}
            placeholder="Ej. 5000"
            hasError={Boolean(errors.ingresoNeto)}
          />
        </Field>

        <Field
          label="Antigüedad laboral"
          error={errors.antiguedadMeses}
          htmlFor="antiguedadMeses"
        >
          <div className={fieldWrapperClass(Boolean(errors.antiguedadMeses))}>
            <input
              id="antiguedadMeses"
              type="text"
              inputMode="numeric"
              value={values.antiguedadMeses}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setValues((prev) => ({ ...prev, antiguedadMeses: digits }));
                setErrors((prev) => ({ ...prev, antiguedadMeses: undefined }));
              }}
              placeholder="Ej. 24"
              className="h-12 min-w-0 flex-1 rounded-l-xl bg-transparent px-4 text-base text-[#122044] outline-none placeholder:text-[#8a94a8]"
            />
            <span className="border-l border-[#d8deea] px-4 text-sm font-medium text-[#53617d]">
              meses
            </span>
          </div>
        </Field>

        <Field
          label="Cantidad de deudas"
          error={errors.numeroDeudas}
          htmlFor="numeroDeudas"
        >
          <input
            id="numeroDeudas"
            type="text"
            inputMode="numeric"
            value={values.numeroDeudas}
            onChange={(e) => updateNumeroDeudas(e.target.value)}
            placeholder="Ej. 1"
            maxLength={1}
            className={inputClass(Boolean(errors.numeroDeudas))}
          />
          <p className="mt-1 text-xs text-muted">
            Máximo {MAX_DEUDAS} deudas vigentes en entidades financieras.
          </p>
        </Field>
      </div>

      {numeroDeudas > 0 ? (
        <div className="rounded-2xl border border-[#dce5f2] bg-[#f8faff] p-3">
          <p className="mb-2 text-sm font-bold text-[#0b1739]">
            Cuota mensual de cada deuda
          </p>

          <div className="grid gap-2">
            {Array.from({ length: numeroDeudas }, (_, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf3ff] text-xs font-bold text-[#075eeb]">
                  {index + 1}
                </span>
                <MoneyInput
                  id={`cuotaDeuda-${index}`}
                  value={values.cuotasDeudas[index] ?? ""}
                  onChange={(v) => updateCuota(index, v)}
                  placeholder="Ej. 350"
                  hasError={Boolean(errors.cuotasDeudas)}
                />
              </div>
            ))}
          </div>

          {errors.cuotasDeudas ? (
            <p className="mt-1.5 text-xs font-semibold text-error">
              {errors.cuotasDeudas}
            </p>
          ) : null}

          <div className="mt-3 flex items-center justify-between border-t border-[#dce5f2] pt-3">
            <span className="text-xs font-semibold text-muted">
              Cuota mensual total
            </span>
            <span className="text-base font-bold text-[#0b1739]">
              {formatBs(totalCuotasMensuales)}
            </span>
          </div>
        </div>
      ) : null}

      <fieldset className="rounded-2xl border border-[#dce5f2] p-3">
        <legend className="px-1 text-sm font-bold text-[#0b1739]">
          ¿Actualmente tienes un reporte negativo en la Central de Riesgos?
        </legend>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <label
            className={radioLabelClass(values.sinReporteCentral === true)}
          >
            <input
              type="radio"
              name="sinReporteCentral"
              className="sr-only"
              checked={values.sinReporteCentral === true}
              onChange={() => {
                setValues((prev) => ({ ...prev, sinReporteCentral: true }));
                setErrors((prev) => ({ ...prev, sinReporteCentral: undefined }));
              }}
            />
            No
          </label>

          <label
            className={radioLabelClass(values.sinReporteCentral === false, true)}
          >
            <input
              type="radio"
              name="sinReporteCentral"
              className="sr-only"
              checked={values.sinReporteCentral === false}
              onChange={() => {
                setValues((prev) => ({ ...prev, sinReporteCentral: false }));
                setErrors((prev) => ({ ...prev, sinReporteCentral: undefined }));
              }}
            />
            Sí
          </label>
        </div>

        {errors.sinReporteCentral ? (
          <p className="mt-2 text-xs font-semibold text-error">
            {errors.sinReporteCentral}
          </p>
        ) : null}
      </fieldset>

      {hasNegativeReport ? (
        <p className="rounded-xl border border-error/25 bg-error/5 px-4 py-3 text-xs leading-5 text-error">
          Por ahora no podemos continuar con tu solicitud. Un reporte
          negativo en la Central de Riesgos no nos permite avanzar en este
          momento.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={hasNegativeReport}
        className="mt-1 flex min-h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-[#0754d9] via-[#0667f0] to-[#0754d9] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(7,94,235,0.20)] transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#075eeb]/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continuar
      </button>
    </form>
  );
}

function clampDebtCount(raw: string): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(Math.trunc(parsed), MAX_DEUDAS);
}

function formatBs(value: number): string {
  return `Bs ${value.toLocaleString("es-BO", { maximumFractionDigits: 2 })}`;
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-[#0b1739]">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-error">{error}</p>
      ) : null}
    </div>
  );
}

function MoneyInput({
  id,
  value,
  onChange,
  placeholder,
  hasError,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hasError: boolean;
}) {
  return (
    <div className={fieldWrapperClass(hasError)}>
      <span className="border-r border-[#d8deea] px-4 text-sm font-bold text-[#122044]">
        Bs
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder={placeholder}
        className="h-12 min-w-0 flex-1 rounded-r-xl bg-transparent px-4 text-base text-[#122044] outline-none placeholder:text-[#8a94a8]"
      />
    </div>
  );
}

function fieldWrapperClass(hasError: boolean) {
  return [
    "flex items-center rounded-xl border-2 bg-white transition focus-within:ring-4",
    hasError
      ? "border-error focus-within:border-error focus-within:ring-error/15"
      : "border-[#d8deea] focus-within:border-[#075eeb] focus-within:ring-[#075eeb]/15",
  ].join(" ");
}

function inputClass(hasError: boolean) {
  return [
    "h-12 w-full rounded-xl border-2 bg-white px-4 text-base text-[#122044] outline-none transition placeholder:text-[#8a94a8] focus:ring-4",
    hasError
      ? "border-error focus:border-error focus:ring-error/15"
      : "border-[#d8deea] focus:border-[#075eeb] focus:ring-[#075eeb]/15",
  ].join(" ");
}

function radioLabelClass(checked: boolean, isNegative = false) {
  return [
    "flex min-h-[46px] cursor-pointer items-center justify-center rounded-xl border-2 bg-white text-sm font-bold transition",
    checked && !isNegative && "border-[#075eeb] bg-[#eaf3ff] text-[#075eeb] ring-4 ring-[#075eeb]/10",
    checked && isNegative && "border-error bg-error/5 text-error ring-4 ring-error/10",
    !checked && "border-[#d8deea] text-[#122044] hover:border-[#075eeb]",
  ]
    .filter(Boolean)
    .join(" ");
}