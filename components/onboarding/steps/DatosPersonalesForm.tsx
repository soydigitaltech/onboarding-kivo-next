"use client";

import { useState, type FormEvent } from "react";

import {
  useOnboardingStore,
  type DatosPersonales,
} from "@/store/onboarding";

const CIUDADES = [
  { value: "la-paz", label: "La Paz", cubierta: true },
  { value: "el-alto", label: "El Alto", cubierta: true },
  { value: "cochabamba", label: "Cochabamba", cubierta: false },
  { value: "santa-cruz", label: "Santa Cruz de la Sierra", cubierta: false },
  { value: "sucre", label: "Sucre", cubierta: false },
  { value: "oruro", label: "Oruro", cubierta: false },
  { value: "potosi", label: "Potosí", cubierta: false },
  { value: "tarija", label: "Tarija", cubierta: false },
  { value: "trinidad", label: "Trinidad", cubierta: false },
  { value: "cobija", label: "Cobija", cubierta: false },
] as const;

const MINIMUM_AGE = 18;

type FormValues = DatosPersonales;

type FieldErrors = Partial<Record<keyof FormValues, string>>;

function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const parsed = new Date(birthDate);
  if (Number.isNaN(parsed.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > parsed.getMonth() ||
    (today.getMonth() === parsed.getMonth() &&
      today.getDate() >= parsed.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export function DatosPersonalesForm() {
  const datosPersonales = useOnboardingStore((s) => s.datosPersonales);
  const setDatosPersonales = useOnboardingStore((s) => s.setDatosPersonales);
  const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

  const [values, setValues] = useState<FormValues>(
    datosPersonales ?? {
      nombres: "",
      apellidos: "",
      ci: "",
      fechaNacimiento: "",
      celular: "",
      ciudad: "",
    },
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [cityNotCovered, setCityNotCovered] = useState(false);

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (field === "ciudad") {
      const ciudad = CIUDADES.find((c) => c.value === value);
      setCityNotCovered(Boolean(ciudad) && !ciudad!.cubierta);
    }
  }

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (!values.nombres.trim()) {
      nextErrors.nombres = "Ingresa tus nombres.";
    }

    if (!values.apellidos.trim()) {
      nextErrors.apellidos = "Ingresa tus apellidos.";
    }

    if (!/^\d{5,10}$/.test(values.ci.trim())) {
      nextErrors.ci = "Ingresa un número de CI válido.";
    }

    const age = calculateAge(values.fechaNacimiento);
    if (!values.fechaNacimiento) {
      nextErrors.fechaNacimiento = "Selecciona tu fecha de nacimiento.";
    } else if (age === null || age < MINIMUM_AGE) {
      nextErrors.fechaNacimiento = `Debes tener al menos ${MINIMUM_AGE} años.`;
    }

    if (!/^\d{8}$/.test(values.celular.trim())) {
      nextErrors.celular = "Ingresa un número de celular válido (8 dígitos).";
    }

    if (!values.ciudad) {
      nextErrors.ciudad = "Selecciona tu ciudad.";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cityNotCovered) {
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setDatosPersonales(values);
    completeAndAdvance("datos-personales");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombres" error={errors.nombres} htmlFor="nombres">
          <input
            id="nombres"
            type="text"
            value={values.nombres}
            onChange={(e) => updateField("nombres", e.target.value)}
            placeholder="Ej. María Fernanda"
            className={inputClass(Boolean(errors.nombres))}
          />
        </Field>

        <Field label="Apellidos" error={errors.apellidos} htmlFor="apellidos">
          <input
            id="apellidos"
            type="text"
            value={values.apellidos}
            onChange={(e) => updateField("apellidos", e.target.value)}
            placeholder="Ej. López Rojas"
            className={inputClass(Boolean(errors.apellidos))}
          />
        </Field>

        <Field label="Cédula de identidad" error={errors.ci} htmlFor="ci">
          <input
            id="ci"
            type="text"
            inputMode="numeric"
            value={values.ci}
            onChange={(e) =>
              updateField("ci", e.target.value.replace(/\D/g, ""))
            }
            placeholder="Ej. 12345678"
            maxLength={10}
            className={inputClass(Boolean(errors.ci))}
          />
        </Field>

        <Field
          label="Fecha de nacimiento"
          error={errors.fechaNacimiento}
          htmlFor="fechaNacimiento"
        >
          <input
            id="fechaNacimiento"
            type="date"
            value={values.fechaNacimiento}
            onChange={(e) => updateField("fechaNacimiento", e.target.value)}
            className={inputClass(Boolean(errors.fechaNacimiento))}
          />
        </Field>

        <Field label="Número de celular" error={errors.celular} htmlFor="celular">
          <div
            className={[
              "flex items-center rounded-xl border-2 bg-white transition focus-within:ring-4",
              errors.celular
                ? "border-error focus-within:border-error focus-within:ring-error/15"
                : "border-[#d8deea] focus-within:border-[#075eeb] focus-within:ring-[#075eeb]/15",
            ].join(" ")}
          >
            <span className="border-r border-[#d8deea] px-4 text-sm font-bold text-[#122044]">
              +591
            </span>
            <input
              id="celular"
              type="tel"
              inputMode="numeric"
              value={values.celular}
              onChange={(e) =>
                updateField("celular", e.target.value.replace(/\D/g, ""))
              }
              placeholder="70000000"
              maxLength={8}
              className="h-12 w-full min-w-0 flex-1 rounded-r-xl bg-transparent px-4 text-base text-[#122044] outline-none placeholder:text-[#8a94a8]"
            />
          </div>
        </Field>

        <Field label="Ciudad de residencia" error={errors.ciudad} htmlFor="ciudad">
          <select
            id="ciudad"
            value={values.ciudad}
            onChange={(e) => updateField("ciudad", e.target.value)}
            className={inputClass(Boolean(errors.ciudad))}
          >
            <option value="">Selecciona tu ciudad</option>
            {CIUDADES.map((ciudad) => (
              <option key={ciudad.value} value={ciudad.value}>
                {ciudad.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {cityNotCovered ? (
        <p className="rounded-xl border border-[#f3d9ad] bg-[#fffaf0] px-4 py-3 text-xs leading-5 text-[#8a5a00]">
          Por el momento no tenemos cobertura en tu ciudad. Estamos
          trabajando para llegar pronto — ¡gracias por tu interés!
        </p>
      ) : null}

      <button
        type="submit"
        disabled={cityNotCovered}
        className="mt-1 flex min-h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-[#0754d9] via-[#0667f0] to-[#0754d9] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(7,94,235,0.20)] transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#075eeb]/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continuar
      </button>
    </form>
  );
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

function inputClass(hasError: boolean) {
  return [
    "h-12 w-full rounded-xl border-2 bg-white px-4 text-base text-[#122044] outline-none transition placeholder:text-[#8a94a8] focus:ring-4",
    hasError
      ? "border-error focus:border-error focus:ring-error/15"
      : "border-[#d8deea] focus:border-[#075eeb] focus:ring-[#075eeb]/15",
  ].join(" ");
}