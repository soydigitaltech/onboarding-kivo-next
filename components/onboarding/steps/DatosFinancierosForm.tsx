"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
 ArrowRight,
 BadgeDollarSign,
 HandCoins,
 Plus,
 Store,
 Trash2,
 UserRoundCheck,
 Wallet,
} from "lucide-react";
import { NumericFormat } from "react-number-format";

import {
 MAX_DEUDAS,
 datosFinancierosSchema,
 formatBs,
 type DatosFinancierosValues,
} from "@/lib/schemas/datos-financieros";
import { calcularCapacidadPago } from "@/lib/simulacion";
import { useOnboardingStore } from "@/store/onboarding";
import {
 BusinessNotice,
 DangerNotice,
 Field,
 PrefixedInputShell,
 RadioPill,
 inputClassName,
 prefixedInputClassName,
} from "@/components/ui/fields";

const dineroInputProps = {
 thousandSeparator: ".",
 decimalSeparator: ",",
 allowNegative: false,
 decimalScale: 0,
 inputMode: "numeric",
} as const;

type Paso =
 | "perfilLaboral"
 | "ingresoNeto"
 | "deudas"
 | "deudaAtrasada"
 | "extractos";

const PASOS: Paso[] = [
 "perfilLaboral",
 "ingresoNeto",
 "deudas",
 "deudaAtrasada",
 "extractos",
];

export function DatosFinancierosForm() {
 const [tieneSegundoIngreso, setTieneSegundoIngreso] = useState(false);
 const [segundoIngresoOrigen, setSegundoIngresoOrigen] = useState("");
 const [segundoIngresoMonto, setSegundoIngresoMonto] = useState<
 number | undefined
 >(undefined);

 const [
 aceptaRespaldoSegundoIngreso,
 setAceptaRespaldoSegundoIngreso,
 ] = useState(false);

 const guardados = useOnboardingStore((s) => s.datosFinancieros);

 useEffect(() => {
 if (!guardados) return;

 setTieneSegundoIngreso(guardados.tieneSegundoIngreso);
 setSegundoIngresoOrigen(guardados.segundoIngresoOrigen ?? "");
 setSegundoIngresoMonto(guardados.segundoIngresoMonto);
 setAceptaRespaldoSegundoIngreso(
 guardados.segundoIngresoRespaldado,
 );
 }, [guardados]);
 const datosPersonales = useOnboardingStore((s) => s.datosPersonales);
 const setDatosFinancieros = useOnboardingStore(
 (s) => s.setDatosFinancieros,
 );

 const completeAndAdvance = useOnboardingStore(
 (s) => s.completeAndAdvance,
 );

 const {
 register,
 control,
 handleSubmit,
 watch,
 setValue,
 formState: { errors },
 } = useForm<DatosFinancierosValues>({
 resolver: zodResolver(datosFinancierosSchema),
 mode: "onTouched",

 defaultValues: guardados
 ? {
 perfilLaboral: guardados.perfilLaboral,
 ingresoNeto: guardados.ingresoNeto,

 deudas: guardados.deudas.map((deuda) => ({
 entidadFinanciera: deuda.entidadFinanciera,
 cuotaMensual: deuda.cuotaMensual,
 })),

 masDeTresDeudas:
 guardados.excepcionMasDeTres !== null
 ? true
 : guardados.deudas.length >= MAX_DEUDAS
 ? false
 : undefined,
 excepcionTipo: guardados.excepcionMasDeTres?.tipo,
 deudaCuatro: guardados.excepcionMasDeTres?.deudaCuatro,
 deudaCompra: guardados.excepcionMasDeTres?.deudaCompra,

 deudaMoraOVencida: guardados.sinDeudaMoraOVencida
 ? "NO"
 : "SI",

 extractos: guardados.extractos,
 }
 : {
 perfilLaboral: datosPersonales?.perfilLaboral,
 deudas: [],
 masDeTresDeudas: undefined,
 excepcionTipo: undefined,
 deudaCuatro: undefined,
 deudaCompra: undefined,
 deudaMoraOVencida: undefined,
 extractos: undefined,
 },
 });

 const { fields, append, remove } = useFieldArray({
 control,
 name: "deudas",
 });

 const values = watch();

 const deudas = values.deudas ?? [];

 const totalCuotas = deudas.reduce<number>(
 (suma, deuda) => suma + (deuda?.cuotaMensual ?? 0),
 0,
 );

 const enLimiteDeudas = fields.length >= MAX_DEUDAS;

 /*
  * La cuarta deuda es una excepción.
  * Si se elimina alguna de las tres deudas principales,
  * limpiamos automáticamente la excepción.
  */
 useEffect(() => {
 if (fields.length < MAX_DEUDAS && values.excepcionTipo !== undefined) {
 setValue("masDeTresDeudas", undefined);
 setValue("excepcionTipo", undefined);
 setValue("deudaCuatro", undefined);
 setValue("deudaCompra", undefined);
 }
 }, [fields.length, values.excepcionTipo, setValue]);

 const deudaCuatroValida =
 values.excepcionTipo !== "ULTIMA_CUOTA" ||
 ((values.deudaCuatro?.entidadFinanciera ?? "").trim().length >= 2 &&
 (values.deudaCuatro?.cuotaMensual ?? 0) > 0 &&
 (values.deudaCuatro?.capitalPendiente ?? 0) > 0);

 const deudaCompraValida =
 values.excepcionTipo !== "COMPRA_DEUDA" ||
 ((values.deudaCompra?.entidadFinanciera ?? "").trim().length >= 2 &&
 (values.deudaCompra?.cuotaMensual ?? 0) > 0 &&
 (values.deudaCompra?.capitalPendiente ?? 0) > 0);

 const tieneDeudaAtrasada = values.deudaMoraOVencida === "SI";
 const sinExtractos = values.extractos === "NO";

 const ingresoAdicionalConsiderado =
 values.perfilLaboral === "ASALARIADO" &&
 tieneSegundoIngreso
 ? segundoIngresoMonto ?? 0
 : 0;

 const ingresoTotalConsiderado =
 (values.ingresoNeto ?? 0) + ingresoAdicionalConsiderado;

 const capacidad =
 ingresoTotalConsiderado > 0
 ? calcularCapacidadPago({
 ingresoNeto: ingresoTotalConsiderado,
 totalDeudas: totalCuotas,
 })
 : null;

 const sinCapacidad =
 capacidad !== null && capacidad.cuotaMaxima <= 0;

 function pasoCompleto(paso: Paso): boolean {
 switch (paso) {
 case "perfilLaboral":
 return values.perfilLaboral !== undefined;

 case "ingresoNeto":
 return (values.ingresoNeto ?? 0) > 0;

 case "deudas": {
 const deudasPrincipalesValidas = deudas.every((deuda) => {
 return (
 (deuda?.entidadFinanciera ?? "").trim().length >= 2 &&
 (deuda?.cuotaMensual ?? 0) > 0
 );
 });

 const respondioSobreCuartaDeuda =
 !enLimiteDeudas || values.masDeTresDeudas !== undefined;

 const seleccionoCasoEspecial =
 values.masDeTresDeudas !== true ||
 values.excepcionTipo !== undefined;

 return (
 deudasPrincipalesValidas &&
 respondioSobreCuartaDeuda &&
 seleccionoCasoEspecial &&
 deudaCuatroValida &&
 deudaCompraValida
 );
 }

 case "deudaAtrasada":
 return values.deudaMoraOVencida !== undefined;

 case "extractos":
 return values.extractos !== undefined;
 }
 }

 const primerIncompleto = PASOS.findIndex(
 (paso) => !pasoCompleto(paso),
 );

 const limite =
 primerIncompleto === -1 ? PASOS.length : primerIncompleto;

 const bloqueado = (paso: Paso) => {
 return PASOS.indexOf(paso) > limite;
 };

 const lockCls = (paso: Paso) =>
 bloqueado(paso)
 ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
 : "transition-opacity duration-300";

 const lockTab = (paso: Paso) =>
 bloqueado(paso) ? -1 : undefined;

 const todoCompleto = primerIncompleto === -1;

 const segundoIngresoCompleto =
 values.perfilLaboral !== "ASALARIADO" ||
 !tieneSegundoIngreso ||
 (
 segundoIngresoOrigen.trim().length >= 2 &&
 (segundoIngresoMonto ?? 0) > 0 &&
 aceptaRespaldoSegundoIngreso
 );

 const agregarDeuda = () => {
 if (fields.length >= MAX_DEUDAS) return;

 append({
 entidadFinanciera: "",
 cuotaMensual: undefined as unknown as number,
 });
 };

 const limpiarExcepcion = () => {
 setValue("masDeTresDeudas", false);
 setValue("excepcionTipo", undefined);
 setValue("deudaCuatro", undefined);
 setValue("deudaCompra", undefined);
 };

 const excepcionElegida = values.excepcionTipo !== undefined;

 const onSubmit = (formValues: DatosFinancierosValues) => {
 if (formValues.deudaMoraOVencida === "SI") return;

 const deudasNormalizadas = formValues.deudas.map((deuda) => ({
 entidadFinanciera: deuda.entidadFinanciera.trim(),
 cuotaMensual: deuda.cuotaMensual,
 }));

 setDatosFinancieros({
 perfilLaboral: formValues.perfilLaboral,
 ingresoNeto: formValues.ingresoNeto,

 /*
 * Compatibilidad temporal con el cálculo actual del Paso 3.
 * Estos campos ya no se preguntan en "Tus finanzas".
 */
 tieneSegundoIngreso:
 formValues.perfilLaboral === "ASALARIADO"
 ? tieneSegundoIngreso
 : false,

 segundoIngresoOrigen:
 formValues.perfilLaboral === "ASALARIADO" &&
 tieneSegundoIngreso
 ? segundoIngresoOrigen.trim() || undefined
 : undefined,

 segundoIngresoMonto:
 formValues.perfilLaboral === "ASALARIADO" &&
 tieneSegundoIngreso
 ? segundoIngresoMonto
 : undefined,

 segundoIngresoRespaldado:
 formValues.perfilLaboral === "ASALARIADO" &&
 tieneSegundoIngreso &&
 aceptaRespaldoSegundoIngreso,

 numeroDeudas: deudasNormalizadas.length,
 deudas: deudasNormalizadas,

 totalCuotasMensuales: deudasNormalizadas.reduce(
 (suma, deuda) => suma + deuda.cuotaMensual,
 0,
 ),

 sinDeudaMoraOVencida:
 formValues.deudaMoraOVencida === "NO",

 extractos: formValues.extractos,

 excepcionMasDeTres:
 formValues.excepcionTipo
 ? {
 tipo: formValues.excepcionTipo,

 deudaCuatro:
 formValues.excepcionTipo === "ULTIMA_CUOTA" &&
 formValues.deudaCuatro
 ? {
 entidadFinanciera:
 formValues.deudaCuatro.entidadFinanciera.trim(),
 cuotaMensual:
 formValues.deudaCuatro.cuotaMensual,
 capitalPendiente:
 formValues.deudaCuatro.capitalPendiente,
 }
 : undefined,

 deudaCompra:
 formValues.excepcionTipo === "COMPRA_DEUDA" &&
 formValues.deudaCompra
 ? {
 entidadFinanciera:
 formValues.deudaCompra.entidadFinanciera.trim(),
 cuotaMensual:
 formValues.deudaCompra.cuotaMensual,
 capitalPendiente:
 formValues.deudaCompra.capitalPendiente,
 }
 : undefined,
 }
 : null,
 });

 completeAndAdvance("datos-financieros");
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)} noValidate>
 <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
 Cuéntanos sobre tus ingresos y compromisos actuales para conocer
 mejor tu situación financiera.
 </p>

 {/* 1. Tipo de actividad */}
 <fieldset className={lockCls("perfilLaboral")}>
 <legend className="text-sm font-bold text-ink">
 Tipo de actividad
 </legend>

 <div className="mt-3 grid gap-3 sm:grid-cols-2">
 <label
 className={`relative min-h-[140px] cursor-pointer rounded-[24px] border-2 p-5 transition-all ${
 values.perfilLaboral === "ASALARIADO"
 ? "border-primary bg-surface-blue "
 : "border-border bg-white hover:border-primary/40"
 }`}
 >
 <input
 type="radio"
 value="ASALARIADO"
 className="sr-only"
 tabIndex={lockTab("perfilLaboral")}
 {...register("perfilLaboral")}
 />

 <div className="flex h-full items-start gap-4">
 <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
 <UserRoundCheck className="h-7 w-7" />
 </span>

 <div>
 <p className="text-lg font-extrabold text-ink">
 Asalariado
 </p>

 <p className="mt-1.5 text-sm leading-6 text-muted">
 Recibes un sueldo de una empresa o institución.
 </p>
 </div>
 </div>
 </label>

 <label
 className={`relative min-h-[140px] cursor-pointer rounded-[24px] border-2 p-5 transition-all ${
 values.perfilLaboral === "INDEPENDIENTE"
 ? "border-primary bg-surface-blue "
 : "border-border bg-white hover:border-primary/40"
 }`}
 >
 <input
 type="radio"
 value="INDEPENDIENTE"
 className="sr-only"
 tabIndex={lockTab("perfilLaboral")}
 {...register("perfilLaboral")}
 />

 <div className="flex h-full items-start gap-4">
 <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
 <Store className="h-7 w-7" />
 </span>

 <div>
 <p className="text-lg font-extrabold text-ink">
 Independiente
 </p>

 <p className="mt-1.5 text-sm leading-6 text-muted">
 Generas ingresos por tu negocio, profesión u oficio.
 </p>
 </div>
 </div>
 </label>
 </div>

 {errors.perfilLaboral ? (
 <p className="mt-2 text-xs font-semibold text-error">
 {errors.perfilLaboral.message}
 </p>
 ) : null}
 </fieldset>

 {/* 2. Ingresos mensuales */}
 <div
 className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
 "ingresoNeto",
 )}`}
 >
 <Field
 label="Ingresos mensuales"
 htmlFor="ingresoNeto"
 error={errors.ingresoNeto?.message}
 >
 <Controller
 name="ingresoNeto"
 control={control}
 render={({ field }) => (
 <PrefixedInputShell prefix="Bs">
 <NumericFormat
 id="ingresoNeto"
 getInputRef={field.ref}
 value={field.value ?? ""}
 onValueChange={(value) => {
 field.onChange(value.floatValue);
 }}
 onBlur={field.onBlur}
 placeholder="Ej. 4.500"
 className={prefixedInputClassName}
 tabIndex={lockTab("ingresoNeto")}
 {...dineroInputProps}
 />
 </PrefixedInputShell>
 )}
 />
 </Field>

 <p className="mt-2 flex items-center gap-2 text-xs leading-5 text-muted">
 <BadgeDollarSign className="h-4 w-4 shrink-0 text-primary" />

 {values.perfilLaboral === "INDEPENDIENTE"
 ? "Ingresa el monto que te queda aproximadamente cada mes después de los gastos de tu actividad."
 : "Ingresa el monto aproximado que recibes cada mes después de descuentos."}
 </p>
 </div>

 {/* INGRESO ADICIONAL - SOLO ASALARIADO */}
 {values.perfilLaboral === "ASALARIADO" ? (
 <div className="mt-6 border-t border-border-soft pt-6">
 <fieldset>
 <legend className="text-sm font-bold text-ink">
 ¿Recibes algún ingreso adicional además de tu sueldo?
 </legend>

 <p className="mt-1 text-xs leading-5 text-muted">
 Por ejemplo, alquileres, ventas, comisiones u otro trabajo.
 </p>

 <div className="mt-3 flex flex-wrap gap-3">
 <button
 type="button"
 onClick={() => setTieneSegundoIngreso(true)}
 className={`min-h-11 cursor-pointer rounded-xl px-5 text-sm font-bold transition ${
 tieneSegundoIngreso
 ? "bg-primary text-white"
 : "bg-surface-blue text-primary-dark"
 }`}
 >
 Sí
 </button>

 <button
 type="button"
 onClick={() => {
 setTieneSegundoIngreso(false);
 setSegundoIngresoOrigen("");
 setSegundoIngresoMonto(undefined);
 setAceptaRespaldoSegundoIngreso(false);
 }}
 className={`min-h-11 cursor-pointer rounded-xl px-5 text-sm font-bold transition ${
 !tieneSegundoIngreso
 ? "bg-primary text-white"
 : "bg-surface-blue text-primary-dark"
 }`}
 >
 No
 </button>
 </div>
 </fieldset>

 <AnimatePresence initial={false}>
 {tieneSegundoIngreso ? (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 className="overflow-hidden"
 >
 <div className="mt-5 grid gap-5 sm:grid-cols-2">
 <Field
 label="¿De dónde proviene este ingreso?"
 htmlFor="segundoIngresoOrigen"
 >
 <input
 id="segundoIngresoOrigen"
 type="text"
 value={segundoIngresoOrigen}
 onChange={(event) =>
 setSegundoIngresoOrigen(event.target.value)
 }
 placeholder="Ej. alquiler, ventas o comisiones"
 className={inputClassName}
 />
 </Field>

 <Field
 label="¿Cuánto recibes aproximadamente al mes?"
 htmlFor="segundoIngresoMonto"
 >
 <PrefixedInputShell prefix="Bs">
 <NumericFormat
 id="segundoIngresoMonto"
 value={segundoIngresoMonto ?? ""}
 onValueChange={(value) =>
 setSegundoIngresoMonto(value.floatValue)
 }
 placeholder="Ej. 1.500"
 className={prefixedInputClassName}
 {...dineroInputProps}
 />
 </PrefixedInputShell>
 </Field>
 </div>

 <div className="mt-5 rounded-[22px] border border-[#F6D8A8] bg-[#FFF9F0] p-5">
 <div className="flex items-start gap-4">
 <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#FE9806] text-white">
 <BadgeDollarSign className="h-5 w-5" />
 </div>

 <div className="min-w-0">
 <p className="text-[15px] font-extrabold leading-5 text-[#071A25]">
 Importante: debes respaldar los ingresos de tu segunda actividad
 </p>

 <p className="mt-2 text-xs leading-5 text-[#5F7180]">
 Si declaras ingresos adicionales provenientes de una segunda actividad,{" "}
 <strong className="font-extrabold text-[#E08600]">
 deberás respaldar el 100% de ese ingreso con extractos bancarios
 </strong>{" "}
 para que Kivo pueda considerarlo dentro de tu capacidad de pago.
 </p>
 </div>
 </div>
 </div>

 <label
 className={`mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-[18px] border px-5 py-4 transition-colors ${
 aceptaRespaldoSegundoIngreso
 ? "border-primary bg-surface-blue"
 : "border-border-soft bg-white hover:border-primary/40"
 }`}
 >
 <div className="flex min-w-0 items-center gap-3">
 <input
 type="checkbox"
 checked={aceptaRespaldoSegundoIngreso}
 onChange={(event) =>
 setAceptaRespaldoSegundoIngreso(event.target.checked)
 }
 className="h-5 w-5 shrink-0 cursor-pointer accent-[#03AEFE]"
 />

 <span className="text-xs font-bold leading-5 text-[#071A25]">
 Entiendo y acepto esta condición.
 </span>
 </div>

 <span
 className={`shrink-0 text-[11px] font-extrabold ${
 aceptaRespaldoSegundoIngreso
 ? "text-primary"
 : "text-muted"
 }`}
 >
 {aceptaRespaldoSegundoIngreso ? "Aceptado" : "Confirmar"}
 </span>
 </label>


 </motion.div>
 ) : null}
 </AnimatePresence>
 </div>
 ) : null}

 {/* 3. Deudas actuales */}
 <div
 className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
 "deudas",
 )}`}
 >
 <p className="text-sm font-bold text-ink">
 Deudas actuales
 </p>

 <p className="mt-1 text-xs leading-5 text-muted">
 Si tienes préstamos o deudas vigentes, agrégalos con su cuota
 mensual. Si no tienes deudas, puedes continuar.
 </p>

 <AnimatePresence initial={false}>
 {fields.map((item, index) => (
 <motion.div
 key={item.id}
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="mt-4 rounded-2xl border border-border-soft bg-white p-4 sm:p-5">
 <div className="flex items-center justify-between gap-3">
 <p className="text-sm font-extrabold text-ink">
 Deuda {index + 1}
 </p>

 <button
 type="button"
 onClick={() => remove(index)}
 aria-label={`Quitar deuda ${index + 1}`}
 className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-error/40 hover:text-error"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 </div>

 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <Field
 label="Entidad financiera"
 htmlFor={`deuda-entidad-${index}`}
 error={
 errors.deudas?.[index]?.entidadFinanciera?.message
 }
 >
 <input
 id={`deuda-entidad-${index}`}
 type="text"
 placeholder="Ej. Banco Unión"
 className={inputClassName}
 {...register(
 `deudas.${index}.entidadFinanciera` as const,
 )}
 />
 </Field>

 <Field
 label="Cuota mensual"
 htmlFor={`deuda-cuota-${index}`}
 error={
 errors.deudas?.[index]?.cuotaMensual?.message
 }
 >
 <Controller
 name={`deudas.${index}.cuotaMensual` as const}
 control={control}
 render={({ field }) => (
 <PrefixedInputShell prefix="Bs">
 <NumericFormat
 id={`deuda-cuota-${index}`}
 getInputRef={field.ref}
 value={field.value ?? ""}
 onValueChange={(value) => {
 field.onChange(value.floatValue);
 }}
 onBlur={field.onBlur}
 placeholder="Ej. 800"
 className={prefixedInputClassName}
 {...dineroInputProps}
 />
 </PrefixedInputShell>
 )}
 />
 </Field>
 </div>
 </div>
 </motion.div>
 ))}
 </AnimatePresence>

 {fields.length < MAX_DEUDAS ? (
 <button
 type="button"
 onClick={agregarDeuda}
 className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-dashed border-border px-4 text-sm font-bold text-body transition-colors hover:border-primary hover:text-primary"
 >
 <Plus className="h-4 w-4" />
 {fields.length === 0
 ? "Agregar deuda"
 : "Agregar otra deuda"}
 </button>
 ) : null}

 {enLimiteDeudas ? (
 <div className="mt-5 rounded-2xl border border-warning-border bg-warning-bg p-4 sm:p-5">
 <div className="flex items-start gap-3">
 <HandCoins className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

 <div>
 <p className="text-sm font-bold text-ink-soft">
 Ya registraste 3 deudas
 </p>

 <p className="mt-1 text-xs leading-5 text-body">
 Antes de continuar, necesitamos saber si tienes una deuda adicional.
 </p>
 </div>
 </div>

 <fieldset className="mt-4">
 <legend className="text-sm font-extrabold text-ink">
 ¿Tienes una cuarta deuda?
 </legend>

 <div className="mt-3 grid max-w-xs grid-cols-2 gap-3">
 <button
 type="button"
 onClick={() => {
 setValue("masDeTresDeudas", true, {
 shouldValidate: true,
 shouldDirty: true,
 });
 }}
 className={`min-h-11 rounded-xl px-5 text-sm font-bold transition-colors ${
 values.masDeTresDeudas === true
 ? "bg-primary text-white"
 : "bg-white text-primary-dark hover:bg-surface-blue"
 }`}
 >
 Sí
 </button>

 <button
 type="button"
 onClick={() => {
 setValue("masDeTresDeudas", false, {
 shouldValidate: true,
 shouldDirty: true,
 });
 setValue("excepcionTipo", undefined);
 setValue("deudaCuatro", undefined);
 setValue("deudaCompra", undefined);
 }}
 className={`min-h-11 rounded-xl px-5 text-sm font-bold transition-colors ${
 values.masDeTresDeudas === false
 ? "bg-primary text-white"
 : "bg-white text-primary-dark hover:bg-surface-blue"
 }`}
 >
 No
 </button>
 </div>

 {values.masDeTresDeudas === undefined ? (
 <p className="mt-2 text-xs font-semibold text-warning">
 Selecciona Sí o No para continuar.
 </p>
 ) : null}
 </fieldset>

 <AnimatePresence initial={false}>
 {values.masDeTresDeudas === true ? (
 <motion.div
 key="casos-cuarta-deuda"
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="mt-5 border-t border-warning-border pt-5">
 <p className="text-sm font-bold text-ink">
 ¿Cuál de estas situaciones aplica a tu cuarta deuda?
 </p>

 <p className="mt-1 text-xs leading-5 text-body">
 Para continuar con una cuarta deuda, debe cumplir una de estas condiciones.
 </p>

 <div className="mt-4 grid gap-3 sm:grid-cols-2">
 <RadioPill
 label="Una de mis deudas está en su última cuota"
 inputProps={{
 value: "ULTIMA_CUOTA",
 ...register("excepcionTipo"),
 }}
 />

 <RadioPill
 label="Quiero que Kivo compre una de mis deudas"
 inputProps={{
 value: "COMPRA_DEUDA",
 ...register("excepcionTipo"),
 }}
 />
 </div>

 <AnimatePresence initial={false} mode="wait">
 {values.excepcionTipo === "ULTIMA_CUOTA" ? (
 <motion.div
 key="deuda-cuatro"
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="mt-4 rounded-2xl border border-warning-border bg-white p-4 sm:p-5">
 <p className="text-sm font-extrabold text-ink">
 Deuda 4
 </p>

 <p className="mt-1 text-xs leading-5 text-body">
 Registra la deuda que se encuentra en su última cuota. En este caso, el capital pendiente es obligatorio.
 </p>

 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <Field
 label="Entidad financiera"
 htmlFor="deuda-cuatro-entidad"
 error={errors.deudaCuatro?.entidadFinanciera?.message}
 >
 <input
 id="deuda-cuatro-entidad"
 type="text"
 placeholder="Ej. Banco Unión"
 className={inputClassName}
 {...register("deudaCuatro.entidadFinanciera")}
 />
 </Field>

 <Field
 label="Cuota mensual"
 htmlFor="deuda-cuatro-cuota"
 error={errors.deudaCuatro?.cuotaMensual?.message}
 >
 <Controller
 name="deudaCuatro.cuotaMensual"
 control={control}
 render={({ field }) => (
 <PrefixedInputShell prefix="Bs">
 <NumericFormat
 id="deuda-cuatro-cuota"
 getInputRef={field.ref}
 value={field.value ?? ""}
 onValueChange={(value) =>
 field.onChange(value.floatValue)
 }
 onBlur={field.onBlur}
 placeholder="Ej. 800"
 className={prefixedInputClassName}
 {...dineroInputProps}
 />
 </PrefixedInputShell>
 )}
 />
 </Field>

 <div className="sm:col-span-2">
 <Field
 label="Capital pendiente"
 htmlFor="deuda-cuatro-capital"
 error={errors.deudaCuatro?.capitalPendiente?.message}
 >
 <Controller
 name="deudaCuatro.capitalPendiente"
 control={control}
 render={({ field }) => (
 <PrefixedInputShell prefix="Bs">
 <NumericFormat
 id="deuda-cuatro-capital"
 getInputRef={field.ref}
 value={field.value ?? ""}
 onValueChange={(value) =>
 field.onChange(value.floatValue)
 }
 onBlur={field.onBlur}
 placeholder="Ej. 12.000"
 className={prefixedInputClassName}
 {...dineroInputProps}
 />
 </PrefixedInputShell>
 )}
 />
 </Field>
 </div>
 </div>
 </div>
 </motion.div>
 ) : null}

 {values.excepcionTipo === "COMPRA_DEUDA" ? (
 <motion.div
 key="deuda-compra"
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="mt-4 rounded-2xl border border-warning-border bg-white p-4 sm:p-5">
 <p className="text-sm font-extrabold text-ink">
 Deuda que Kivo evaluará comprar
 </p>

 <p className="mt-1 text-xs leading-5 text-body">
 Registra los datos de la deuda que quieres incluir en la evaluación de compra.
 </p>

 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <Field
 label="Entidad financiera"
 htmlFor="deuda-compra-entidad"
 error={errors.deudaCompra?.entidadFinanciera?.message}
 >
 <input
 id="deuda-compra-entidad"
 type="text"
 placeholder="Ej. Banco Unión"
 className={inputClassName}
 {...register("deudaCompra.entidadFinanciera")}
 />
 </Field>

 <Field
 label="Cuota mensual"
 htmlFor="deuda-compra-cuota"
 error={errors.deudaCompra?.cuotaMensual?.message}
 >
 <Controller
 name="deudaCompra.cuotaMensual"
 control={control}
 render={({ field }) => (
 <PrefixedInputShell prefix="Bs">
 <NumericFormat
 id="deuda-compra-cuota"
 getInputRef={field.ref}
 value={field.value ?? ""}
 onValueChange={(value) =>
 field.onChange(value.floatValue)
 }
 onBlur={field.onBlur}
 placeholder="Ej. 800"
 className={prefixedInputClassName}
 {...dineroInputProps}
 />
 </PrefixedInputShell>
 )}
 />
 </Field>

 <div className="sm:col-span-2">
 <Field
 label="Capital pendiente"
 htmlFor="deuda-compra-capital"
 error={errors.deudaCompra?.capitalPendiente?.message}
 >
 <Controller
 name="deudaCompra.capitalPendiente"
 control={control}
 render={({ field }) => (
 <PrefixedInputShell prefix="Bs">
 <NumericFormat
 id="deuda-compra-capital"
 getInputRef={field.ref}
 value={field.value ?? ""}
 onValueChange={(value) =>
 field.onChange(value.floatValue)
 }
 onBlur={field.onBlur}
 placeholder="Ej. 12.000"
 className={prefixedInputClassName}
 {...dineroInputProps}
 />
 </PrefixedInputShell>
 )}
 />
 </Field>
 </div>
 </div>
 </div>
 </motion.div>
 ) : null}
 </AnimatePresence>
 </div>
 </motion.div>
 ) : null}
 </AnimatePresence>

 {values.masDeTresDeudas === false ? (
 <div className="mt-4 rounded-xl bg-surface-blue px-4 py-3">
 <p className="text-[13px] font-bold leading-5 text-primary-dark">
 No tienes una cuarta deuda. Puedes continuar normalmente.
 </p>
 </div>
 ) : null}
 </div>
 ) : null}

 {totalCuotas > 0 ? (
 <p className="mt-4 flex w-fit items-center gap-2 rounded-full bg-surface-blue px-3.5 py-1.5 text-[13px] font-bold text-primary-dark">
 <Wallet className="h-4 w-4 text-cerulean" />
 Cuotas mensuales actuales: {formatBs(totalCuotas)}
 </p>
 ) : null}

 <AnimatePresence>
 {sinCapacidad ? (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="pt-4">
 <DangerNotice title="Por ahora no podemos continuar">
 Según tus ingresos y compromisos actuales, no queda
 suficiente capacidad para asumir una nueva cuota.
 </DangerNotice>
 </div>
 </motion.div>
 ) : null}
 </AnimatePresence>
 </div>

 {/* 4. Deudas atrasadas */}
 <fieldset
 className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
 "deudaAtrasada",
 )}`}
 >
 <legend className="text-sm font-bold text-ink">
 ¿Actualmente tienes alguna deuda vencida, atrasada o en mora con otra entidad financiera?
 </legend>

 <div className="mt-3 grid max-w-xs grid-cols-2 gap-3">
 <RadioPill
 label="No"
 inputProps={{
 value: "NO",
 tabIndex: lockTab("deudaAtrasada"),
 ...register("deudaMoraOVencida"),
 }}
 />

 <RadioPill
 label="Sí"
 inputProps={{
 value: "SI",
 tabIndex: lockTab("deudaAtrasada"),
 ...register("deudaMoraOVencida"),
 }}
 />
 </div>

 {errors.deudaMoraOVencida ? (
 <p className="mt-2 text-xs font-semibold text-error">
 {errors.deudaMoraOVencida.message}
 </p>
 ) : null}

 <AnimatePresence>
 {tieneDeudaAtrasada ? (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="pt-4">
 <DangerNotice title="Por ahora no podemos continuar">
 Mientras tengas deudas atrasadas, Kivo no podrá continuar
 con la evaluación de la solicitud.
 </DangerNotice>
 </div>
 </motion.div>
 ) : null}
 </AnimatePresence>
 </fieldset>

 {/* 5. Extractos bancarios */}
 <fieldset
 className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
 "extractos",
 )}`}
 >
 <legend className="text-sm font-bold text-ink">
 ¿Cuentas con movimientos bancarios que respalden tus ingresos?
 </legend>

        <div className="mt-3 rounded-[18px] bg-[#E9F7FF] px-4 py-4">
          <p className="text-sm font-extrabold leading-5 text-primary-dark">
            Tus movimientos bancarios nos ayudan a validar tus ingresos y avanzar con tu solicitud.
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            Asegúrate de que tus ingresos se vean reflejados en tu cuenta bancaria.
          </p>
        </div>

 <div className="mt-3 grid max-w-xs grid-cols-2 gap-3">
 <RadioPill
 label="Sí"
 inputProps={{
 value: "SI",
 tabIndex: lockTab("extractos"),
 ...register("extractos"),
 }}
 />

 <RadioPill
 label="No"
 inputProps={{
 value: "NO",
 tabIndex: lockTab("extractos"),
 ...register("extractos"),
 }}
 />
 </div>

 {errors.extractos ? (
 <p className="mt-2 text-xs font-semibold text-error">
 {errors.extractos.message}
 </p>
 ) : null}

 <AnimatePresence>
 {sinExtractos ? (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 className="overflow-hidden"
 >
 <div className="pt-4">
 <BusinessNotice>
 Registramos que actualmente no cuentas con extractos
 bancarios. Esta información será considerada durante la
 evaluación.
 </BusinessNotice>
 </div>
 </motion.div>
 ) : null}
 </AnimatePresence>
 </fieldset>

 <div className="mt-6">
 <button
 type="submit"
 disabled={
 !todoCompleto ||
 !segundoIngresoCompleto ||
 tieneDeudaAtrasada ||
 sinCapacidad
 }
 className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
 >
 Siguiente paso
 <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.5} />
 </button>
 </div>
 </form>
 );
}
