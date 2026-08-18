"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CalendarDays } from "lucide-react";
import { NumericFormat } from "react-number-format";

import {
 CIUDADES,
 EDAD_MAXIMA,
 EDAD_MINIMA,
 NOMBRE_COMPLETO_REGEX,
 calcularEdad,
 ciudadTieneCobertura,
 datosPersonalesSchema,
 type DatosPersonalesValues,
} from "@/lib/schemas/datos-personales";
import { useOnboardingStore } from "@/store/onboarding";
import { CustomSelect } from "@/components/ui/CustomSelect";
import type { Coordenadas } from "@/components/onboarding/steps/MapaUbicacion";

const MapaUbicacion = dynamic(
 () => import("@/components/onboarding/steps/MapaUbicacion"),
 {
 ssr: false,
 loading: () => (
 <div className="grid h-[200px] w-full place-items-center rounded-[22px] bg-surface-blue">
 <p className="text-xs font-bold text-primary-dark">
 Cargando mapa…
 </p>
 </div>
 ),
 },
);
import {
 Field,
 PrefixedInputShell,
 inputClassName,
 prefixedInputClassName,
 selectClassName,
} from "@/components/ui/fields";

const EMPTY_VALUES: DatosPersonalesValues = {
 nombreCompleto: "",
 ci: "",
 fechaNacimiento: "",
 celular: "",
 ciudad: "",
 direccion: "",
 numeroDependientes: 0,
};

type Campo =
 | "nombreCompleto"
 | "ci"
 | "fechaNacimiento"
 | "celular"
 | "ciudad"
 | "direccion"
 | "numeroDependientes";

const FIELD_ORDER: Campo[] = [
 "nombreCompleto",
 "ci",
 "fechaNacimiento",
 "celular",
 "ciudad",
 "direccion",
 "numeroDependientes",
];

function campoCompleto(
 campo: Campo,
 values: Partial<DatosPersonalesValues>,
): boolean {
 switch (campo) {
 case "nombreCompleto":
 return NOMBRE_COMPLETO_REGEX.test(values.nombreCompleto ?? "");

 case "ci":
 return /^\d{5,10}$/.test((values.ci ?? "").trim());

 case "fechaNacimiento": {
 const edad = calcularEdad(values.fechaNacimiento ?? "");
 return edad >= EDAD_MINIMA && edad <= EDAD_MAXIMA;
 }

 case "celular":
 return /^[67]\d{7}$/.test((values.celular ?? "").trim());

 case "ciudad":
 return (values.ciudad ?? "") !== "";

 case "direccion":
 return (values.direccion ?? "").trim().length >= 5;

 case "numeroDependientes":
 return (
 values.numeroDependientes !== undefined &&
 Number.isInteger(values.numeroDependientes) &&
 values.numeroDependientes >= 0
 );
 }
}

export function DatosPersonalesForm() {
 const [ubicacionMock, setUbicacionMock] = useState<Coordenadas>({
 lat: -16.5000,
 lng: -68.1500,
 });

 const datosGuardados = useOnboardingStore((s) => s.datosPersonales);
 const setDatosPersonales = useOnboardingStore((s) => s.setDatosPersonales);
 const completeAndAdvance = useOnboardingStore((s) => s.completeAndAdvance);

 const {
 register,
 control,
 handleSubmit,
 watch,
 formState: { errors },
 } = useForm<DatosPersonalesValues>({
 resolver: zodResolver(datosPersonalesSchema),
 mode: "onTouched",
 defaultValues: datosGuardados ?? EMPTY_VALUES,
 });

 const values = watch();

 const primerIncompleto = FIELD_ORDER.findIndex(
 (campo) => !campoCompleto(campo, values),
 );

 const limite =
 primerIncompleto === -1 ? FIELD_ORDER.length : primerIncompleto;

 const bloqueado = (campo: Campo) => FIELD_ORDER.indexOf(campo) > limite;

 const lockCls = (campo: Campo) =>
 bloqueado(campo)
 ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
 : "transition-opacity duration-300";

 const lockTab = (campo: Campo) => (bloqueado(campo) ? -1 : undefined);

 const todoCompleto = primerIncompleto === -1;

 const edad = calcularEdad(values.fechaNacimiento ?? "");

 const sinCobertura =
 values.ciudad !== "" && !ciudadTieneCobertura(values.ciudad);

 const onSubmit = (formValues: DatosPersonalesValues) => {
 if (!ciudadTieneCobertura(formValues.ciudad)) return;

 setDatosPersonales(formValues);
 completeAndAdvance("datos-personales");
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)} noValidate>
 <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
 Empecemos con algunos datos sobre ti. Esta información nos ayudará a
 iniciar tu solicitud.
 </p>

 <div className="grid gap-5 sm:grid-cols-2">
 <div className={`sm:col-span-2 ${lockCls("nombreCompleto")}`}>
 <Field
 label="Nombre completo"
 htmlFor="nombreCompleto"
 error={errors.nombreCompleto?.message}
 >
 <input
 id="nombreCompleto"
 type="text"
 autoComplete="name"
 placeholder="Ej. Sara Valentina Gonzales Mamani"
 className={inputClassName}
 tabIndex={lockTab("nombreCompleto")}
 {...register("nombreCompleto")}
 />
 </Field>
 </div>

 <div className={lockCls("ci")}>
 <Field
 label="Carnet de identidad"
 htmlFor="ci"
 error={errors.ci?.message}
 >
 <input
 id="ci"
 type="text"
 inputMode="numeric"
 placeholder="Ej. 6084527"
 className={inputClassName}
 tabIndex={lockTab("ci")}
 {...register("ci")}
 />
 </Field>
 </div>

 <div className={lockCls("fechaNacimiento")}>
 <Field
 label="Fecha de nacimiento"
 htmlFor="fechaNacimiento"
 error={errors.fechaNacimiento?.message}
 >
 <input
 id="fechaNacimiento"
 type="date"
 autoComplete="bday"
 className={`${inputClassName} appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none`}
 tabIndex={lockTab("fechaNacimiento")}
 {...register("fechaNacimiento")}
 />
 </Field>

 {edad >= EDAD_MINIMA && edad <= EDAD_MAXIMA ? (
 <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface-blue px-3 py-1 text-xs font-bold text-primary-dark">
 <CalendarDays className="h-3.5 w-3.5" />
 Tienes {edad} años
 </p>
 ) : null}
 </div>

 <div className={lockCls("celular")}>
 <Field
 label="Número de celular"
 htmlFor="celular"
 error={errors.celular?.message}
 >
 <PrefixedInputShell prefix="+591">
 <input
 id="celular"
 type="tel"
 inputMode="numeric"
 maxLength={8}
 placeholder="70000000"
 className={prefixedInputClassName}
 tabIndex={lockTab("celular")}
 {...register("celular")}
 />
 </PrefixedInputShell>
 </Field>
 </div>

 <div className={lockCls("ciudad")}>
 <Field
 label="Ciudad"
 htmlFor="ciudad"
 error={errors.ciudad?.message}
 >
 <Controller
 name="ciudad"
 control={control}
 render={({ field }) => (
 <CustomSelect
 id="ciudad"
 value={field.value ?? ""}
 options={CIUDADES}
 placeholder="Selecciona tu ciudad"
 tabIndex={lockTab("ciudad")}
 onChange={field.onChange}
 onBlur={field.onBlur}
 />
 )}
 />

 {sinCobertura ? (
 <div className="mt-3 flex items-start gap-3 rounded-[18px] bg-[#FFF6E8] px-4 py-4">
   <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#FE9806]" />

   <div>
     <p className="text-xs font-extrabold text-[#A85E00]">
       Aún no tenemos cobertura en tu ciudad
     </p>

     <p className="mt-1 text-xs leading-5 text-[#6B7484]">
       Por ahora Kivo atiende solicitudes únicamente en{" "}
       <strong className="font-extrabold text-[#071A25]">
         La Paz y El Alto
       </strong>
       .
     </p>

     <p className="mt-2 text-xs leading-5 text-[#6B7484]">
       Tus datos fueron guardados y te avisaremos cuando tengamos cobertura en tu ciudad.
     </p>

     <p className="mt-2 text-xs font-bold leading-5 text-[#071A25]">
       No tendrás que volver a completar esta información.
     </p>
   </div>
 </div>
 ) : null}
 </Field>
 </div>

 <div className={`sm:col-span-2 ${lockCls("direccion")}`}>
 <Field
 label="Dirección de domicilio"
 htmlFor="direccion"
 error={errors.direccion?.message}
 >
 <input
 id="direccion"
 type="text"
 autoComplete="street-address"
 placeholder="Ej. Zona Sopocachi, calle Aspiazu N.º 123"
 className={inputClassName}
 tabIndex={lockTab("direccion")}
 {...register("direccion")}
 />
 </Field>
 </div>

 {/* MAPA DE UBICACIÓN - MOCK */}
 <div className={`sm:col-span-2 ${lockCls("direccion")}`}>
 <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <p className="text-sm font-bold text-ink">
 Ubicación de tu domicilio
 </p>

 <p className="mt-1 text-xs leading-5 text-body">
 Marca tu ubicación en el mapa o mueve el pin hasta tu domicilio.
 </p>
 </div>

 <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary">
 Mapa de referencia
 </span>
 </div>

 <div className="hidden overflow-hidden rounded-[22px] bg-surface-blue sm:block">
 <MapaUbicacion
 value={ubicacionMock}
 onChange={setUbicacionMock}
 />
 </div>

 <div className="mt-3 hidden flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-muted sm:flex">
 <span>
 Latitud{" "}
 <strong className="font-bold text-ink">
 {ubicacionMock.lat.toFixed(6)}
 </strong>
 </span>

 <span>
 Longitud{" "}
 <strong className="font-bold text-ink">
 {ubicacionMock.lng.toFixed(6)}
 </strong>
 </span>
 </div>
 </div>

 <div className={lockCls("numeroDependientes")}>
 <Field
 label="Número de dependientes"
 htmlFor="numeroDependientes"
 error={errors.numeroDependientes?.message}
 >
 <Controller
 name="numeroDependientes"
 control={control}
 render={({ field }) => (
 <PrefixedInputShell prefix="N.º">
 <NumericFormat
 id="numeroDependientes"
 getInputRef={field.ref}
 value={field.value ?? ""}
 onValueChange={(value) => {
 field.onChange(value.floatValue);
 }}
 onBlur={field.onBlur}
 allowNegative={false}
 decimalScale={0}
 placeholder="Ej. 2"
 className={prefixedInputClassName}
 tabIndex={lockTab("numeroDependientes")}
 />
 </PrefixedInputShell>
 )}
 />
 </Field>
 </div>
 </div>


 <div className="mt-6">
 <button
 type="submit"
 disabled={!todoCompleto || sinCobertura}
 className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
 >
 Siguiente paso
 <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
 </button>
 </div>
 </form>
 );
}
