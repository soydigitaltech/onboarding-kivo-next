"use client";

import {
  KivoAffixedInput,
  KivoButton,
  KivoInput,
  KivoSelect,
  KivoTextarea,
  kivoAffixedInputClassName,
} from "@/components/ui/kivo";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BriefcaseBusiness, ShoppingBag } from "lucide-react";

import {
 HOUSING_TYPES,
 MARITAL_STATUSES,
 informacionComplementariaSchema,
 type InformacionComplementariaValues,
} from "@/lib/schemas/informacion-complementaria";
import { useOnboardingStore } from "@/store/onboarding";
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
const EMPTY_VALUES: InformacionComplementariaValues = {
 nombreEmpresaNegocio: "",
 rubro: "",
 cargoActividad: "",
 antiguedadActividad: undefined as unknown as number,
 direccionLaboral: "",
 negocioFormalizado: undefined,
 tipoLocalNegocio: undefined,
 tieneVehiculo: undefined as unknown as InformacionComplementariaValues["tieneVehiculo"],
 vivienda: undefined as unknown as InformacionComplementariaValues["vivienda"],
 estadoCivil:
 undefined as unknown as InformacionComplementariaValues["estadoCivil"],
 destinoPrestamo:
 undefined as unknown as InformacionComplementariaValues["destinoPrestamo"],
 detalleDestinoPrestamo: "",
 tieneGarante: undefined,
 nombreConyuge: "",
 celularConyuge: "",
};

type Paso =
 | "nombreEmpresaNegocio"
 | "rubro"
 | "cargoActividad"
 | "antiguedadActividad"
 | "direccionLaboral"
 | "datosNegocio"
 | "vehiculo"
 | "vivienda"
 | "estadoCivil"
 | "destinoPrestamo";

const PASOS: Paso[] = [
 "nombreEmpresaNegocio",
 "rubro",
 "cargoActividad",
 "antiguedadActividad",
 "direccionLaboral",
 "datosNegocio",
 "vehiculo",
 "vivienda",
 "estadoCivil",
 "destinoPrestamo",
];

function pasoCompleto(
 paso: Paso,
 values: Partial<InformacionComplementariaValues>,
 esAsalariado: boolean,
): boolean {
 switch (paso) {
 case "nombreEmpresaNegocio":
 return (values.nombreEmpresaNegocio ?? "").trim().length >= 2;

 case "rubro": {
 const rubro = (values.rubro ?? "").trim();

 return (
   rubro.length >= 2 &&
   /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(rubro)
 );
 }

 case "cargoActividad":
 return (values.cargoActividad ?? "").trim().length >= 2;

 case "antiguedadActividad":
 return (values.antiguedadActividad ?? 0) >= 12;

 case "direccionLaboral":
 return (values.direccionLaboral ?? "").trim().length >= 5;

 case "datosNegocio":
 if (esAsalariado) return true;

 return (
   values.negocioFormalizado !== undefined &&
   values.tipoLocalNegocio !== undefined
 );

 case "vehiculo":
 return values.tieneVehiculo !== undefined;

 case "vivienda": {
 const viviendaSeleccionada = values.vivienda !== undefined;

 if (!viviendaSeleccionada) return false;

 const requiereGarante =
 values.vivienda === "ALQUILER" ||
 values.vivienda === "ANTICRETICO";

 if (!requiereGarante) return true;

 return values.tieneGarante !== undefined;
 }

 case "estadoCivil": {
 if (values.estadoCivil === undefined) return false;

 const requiereConyuge =
 values.estadoCivil === "CASADO" ||
 values.estadoCivil === "CONYUGE";

 if (!requiereConyuge) return true;

 const nombreCompleto =
 (values.nombreConyuge ?? "").trim().length >= 2;

 const celularCompleto =
 /^[67]\d{7}$/.test(
 (values.celularConyuge ?? "").trim(),
 );

 return nombreCompleto && celularCompleto;
 }

 case "destinoPrestamo":
 return (
 values.destinoPrestamo !== undefined &&
 (values.detalleDestinoPrestamo ?? "").trim().length >= 10
 );
 }
}

export function InformacionComplementariaForm() {
 const [ubicacionLaboralMock, setUbicacionLaboralMock] =
 useState<Coordenadas>({
 lat: -16.5000,
 lng: -68.1500,
 });

 const guardados = useOnboardingStore(
 (state) => state.datosComplementarios,
 );

 const datosFinancieros = useOnboardingStore(
 (state) => state.datosFinancieros,
 );

 const setDatosComplementarios = useOnboardingStore(
 (state) => state.setDatosComplementarios,
 );

 const completeAndAdvance = useOnboardingStore(
 (state) => state.completeAndAdvance,
 );

 const {
 control,
 register,
 handleSubmit,
 watch,
 formState: { errors },
 } = useForm<InformacionComplementariaValues>({
 resolver: zodResolver(informacionComplementariaSchema),
 mode: "onChange",
 defaultValues: guardados ?? EMPTY_VALUES,
 });

 const values = watch();

 const esAsalariado =
 datosFinancieros?.perfilLaboral === "ASALARIADO";

 const primerIncompleto = PASOS.findIndex(
 (paso) => !pasoCompleto(paso, values, esAsalariado),
 );

 const limite =
 primerIncompleto === -1 ? PASOS.length : primerIncompleto;

 const bloqueado = (paso: Paso): boolean => {
 return PASOS.indexOf(paso) > limite;
 };

 const lockCls = (paso: Paso): string => {
 return bloqueado(paso)
 ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
 : "transition-opacity duration-300";
 };

 const lockTab = (paso: Paso): number | undefined => {
 return bloqueado(paso) ? -1 : undefined;
 };

 const todoCompleto = primerIncompleto === -1;

 const puedeElegirCapitalTrabajo =
 !esAsalariado || datosFinancieros?.tieneSegundoIngreso === true;

 const onSubmit = (
 formValues: InformacionComplementariaValues,
 ) => {
 setDatosComplementarios({
  ...formValues,
  ubicacionLaboral: {
   lat: ubicacionLaboralMock.lat,
   lng: ubicacionLaboralMock.lng,
  },
 });

 completeAndAdvance("informacion-complementaria");
 };

 return (
 <form onSubmit={handleSubmit(onSubmit)} noValidate>
 <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
 Cuéntanos un poco más sobre tu actividad, tu vivienda y para qué
 necesitas el préstamo.
 </p>

 {/* Empresa / negocio */}
 <div className="grid gap-5 sm:grid-cols-2">
 <div
 className={`sm:col-span-2 ${lockCls(
 "nombreEmpresaNegocio",
 )}`}
 >
 <KivoInput
 id="nombreEmpresaNegocio"
 label={esAsalariado ? "Nombre de la empresa" : "Nombre del negocio"}
 type="text"
 placeholder={
   esAsalariado
     ? "Ej. Banco Nacional de Bolivia"
     : "Ej. Comercial San Martín"
 }
 error={errors.nombreEmpresaNegocio?.message}
 tabIndex={lockTab("nombreEmpresaNegocio")}
 {...register("nombreEmpresaNegocio")}
/>
 </div>

 {/* Rubro */}
 <div className={lockCls("rubro")}>
 <KivoInput
 id="rubro"
 label="Rubro"
 type="text"
 inputMode="text"
 placeholder={
   esAsalariado
     ? "Ej. Servicios financieros"
     : "Ej. Comercio de alimentos"
 }
 error={errors.rubro?.message}
 tabIndex={lockTab("rubro")}
 {...register("rubro")}
/>
 </div>

 {/* Cargo / actividad */}
 <div className={lockCls("cargoActividad")}>
 <KivoInput
 id="cargoActividad"
 label={esAsalariado ? "Cargo" : "Ocupación"}
 type="text"
 placeholder={
   esAsalariado
     ? "Ej. Analista comercial"
     : "Ej. Comerciante, electricista, transportista"
 }
 error={errors.cargoActividad?.message}
 tabIndex={lockTab("cargoActividad")}
 {...register("cargoActividad")}
/>
 </div>

 {/* Antigüedad laboral / actividad */}
 <div className={lockCls("antiguedadActividad")}>
 <div>
 <label
   htmlFor="antiguedadActividad"
   className="mb-1.5 block text-sm font-bold text-ink"
 >
   {esAsalariado
     ? "Antigüedad laboral"
     : "Antigüedad en la actividad"}
 </label>

 <KivoAffixedInput
   suffix="Meses"
   error={Boolean(errors.antiguedadActividad)}
 >
   <input
     id="antiguedadActividad"
     type="text"
     inputMode="numeric"
     pattern="[0-9]*"
     placeholder="Ej. 34"
     className={kivoAffixedInputClassName}
     tabIndex={lockTab("antiguedadActividad")}
     {...register("antiguedadActividad", {
       setValueAs: (value) => {
         const limpio = String(value ?? "").replace(/\D/g, "");
         return limpio === "" ? undefined : Number(limpio);
       },
     })}
   />
 </KivoAffixedInput>

 {errors.antiguedadActividad ? (
   <p
     role="alert"
     className="mt-1.5 text-xs font-semibold text-error"
   >
     {errors.antiguedadActividad.message}
   </p>
 ) : null}
</div>
 </div>

 {/* Dirección laboral */}
 <div
 className={`sm:col-span-2 ${lockCls(
 "direccionLaboral",
 )}`}
 >
 <KivoInput
 id="direccionLaboral"
 label="Dirección exacta laboral"
 type="text"
 placeholder={
   esAsalariado
     ? "Ej. Zona Sopocachi, Av. Arce N.º 1234, Edificio ABC"
     : "Ej. Zona Villa Fátima, Av. Las Américas N.º 345"
 }
 error={errors.direccionLaboral?.message}
 tabIndex={lockTab("direccionLaboral")}
 {...register("direccionLaboral")}
/>

 {/* MAPA LABORAL - MOCK */}
 <div className="mt-4">
 <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <p className="text-sm font-bold text-ink">
 Ubicación exacta en el mapa
 </p>

 <p className="mt-1 text-xs leading-5 text-muted">
 Marca la ubicación de tu{" "}
 {esAsalariado ? "lugar de trabajo" : "negocio"} o mueve
 el pin hasta la dirección correcta.
 </p>
 </div>

 <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary">
 Mapa de referencia
 </span>
 </div>

 <div className="hidden overflow-hidden rounded-[22px] bg-surface-blue sm:block">
 <MapaUbicacion
 value={ubicacionLaboralMock}
 onChange={setUbicacionLaboralMock}
 />
 </div>

 <div className="mt-3 hidden flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-muted sm:flex">
 <span>
 Latitud{" "}
 <strong className="font-bold text-ink">
 {ubicacionLaboralMock.lat.toFixed(6)}
 </strong>
 </span>

 <span>
 Longitud{" "}
 <strong className="font-bold text-ink">
 {ubicacionLaboralMock.lng.toFixed(6)}
 </strong>
 </span>
 </div>
 </div>
 </div>


 {/* Datos adicionales del negocio - solo independientes */}
 {!esAsalariado ? (
 <div
   className={`sm:col-span-2 ${lockCls("datosNegocio")}`}
 >
   <div className="border-t border-border-soft pt-6">
     <p className="text-sm font-extrabold text-ink">
       Sobre tu negocio
     </p>

     <p className="mt-1 text-xs leading-5 text-muted">
       Esta información nos ayuda a solicitar únicamente los
       respaldos que realmente corresponden a tu actividad.
     </p>

     <div className="mt-5 grid gap-5 sm:grid-cols-2">
       <fieldset>
         <legend className="text-sm font-bold text-ink">
           ¿Tu negocio está formalizado?
         </legend>

         <div className="mt-3 flex flex-wrap gap-3">
           <label
             className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
               values.negocioFormalizado === "SI"
                 ? "bg-primary text-white"
                 : "bg-surface-blue text-primary-dark"
             }`}
           >
             <input
               type="radio"
               value="SI"
               className="sr-only"
               {...register("negocioFormalizado")}
             />
             Sí
           </label>

           <label
             className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
               values.negocioFormalizado === "NO"
                 ? "bg-primary text-white"
                 : "bg-surface-blue text-primary-dark"
             }`}
           >
             <input
               type="radio"
               value="NO"
               className="sr-only"
               {...register("negocioFormalizado")}
             />
             No
           </label>
         </div>
       </fieldset>

       <Controller
         control={control}
         name="tipoLocalNegocio"
         render={({ field }) => (
           <KivoSelect
             id="tipoLocalNegocio"
             label="¿Dónde funciona principalmente tu negocio?"
             value={field.value ?? ""}
             options={[
               { value: "PROPIO", label: "Local propio" },
               { value: "ALQUILER", label: "Local alquilado" },
               { value: "ANTICRETICO", label: "Local en anticrético" },
               { value: "DOMICILIO", label: "Desde mi domicilio" },
               { value: "OTRO", label: "Otro" },
             ]}
             placeholder="Selecciona una opción"
             onChange={field.onChange}
             onBlur={field.onBlur}
           />
         )}
       />
     </div>
   </div>
 </div>
 ) : null}


 {/* Vehículo */}
 <div className={`sm:col-span-2 ${lockCls("vehiculo")}`}>
 <fieldset>
 <legend className="text-sm font-bold text-ink">
 ¿Tienes vehículo a tu nombre?
 </legend>

 <p className="mt-1 text-xs leading-5 text-muted">
 Si cuentas con un vehículo propio, podremos solicitarte un respaldo
 adicional durante la carga de documentos.
 </p>

 <div className="mt-3 flex flex-wrap gap-3">
 <label
 className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
 values.tieneVehiculo === "SI"
 ? "bg-primary text-white"
 : "bg-surface-blue text-primary-dark"
 }`}
 >
 <input
 type="radio"
 value="SI"
 className="sr-only"
 {...register("tieneVehiculo")}
 />
 Sí
 </label>

 <label
 className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
 values.tieneVehiculo === "NO"
 ? "bg-primary text-white"
 : "bg-surface-blue text-primary-dark"
 }`}
 >
 <input
 type="radio"
 value="NO"
 className="sr-only"
 {...register("tieneVehiculo")}
 />
 No
 </label>
 </div>

 {errors.tieneVehiculo ? (
 <p className="mt-2 text-xs font-semibold text-error">
 {errors.tieneVehiculo.message}
 </p>
 ) : null}
 </fieldset>
 </div>

 {/* Vivienda */}
 <div className={lockCls("vivienda")}>
 <Controller
 control={control}
 name="vivienda"
 render={({ field }) => (
   <KivoSelect
     id="vivienda"
     label="Tipo de vivienda"
     value={field.value ?? ""}
     options={HOUSING_TYPES}
     placeholder="Selecciona una opción"
     error={errors.vivienda?.message}
     tabIndex={lockTab("vivienda")}
     onChange={field.onChange}
     onBlur={field.onBlur}
   />
 )}
/>
 </div>

 {/* Estado civil */}
 <div className={lockCls("estadoCivil")}>
 <Controller
 control={control}
 name="estadoCivil"
 render={({ field }) => (
   <KivoSelect
     id="estadoCivil"
     label="Estado civil"
     value={field.value ?? ""}
     options={MARITAL_STATUSES}
     placeholder="Selecciona una opción"
     error={errors.estadoCivil?.message}
     tabIndex={lockTab("estadoCivil")}
     onChange={field.onChange}
     onBlur={field.onBlur}
   />
 )}
/>
 </div>

 {/* Garante - solo alquiler / anticrético */}
 {(values.vivienda === "ALQUILER" ||
 values.vivienda === "ANTICRETICO") ? (
 <div className="sm:col-span-2">
 <fieldset>
 <legend className="text-sm font-bold text-ink">
 ¿Cuentas con garante?
 </legend>

 <p className="mt-1 text-xs leading-5 text-muted">
 Indícanos si cuentas con una persona que pueda respaldar
 tu solicitud.
 </p>

 <div className="mt-3 flex flex-wrap gap-3">
 <label
 className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
 values.tieneGarante === "SI"
 ? "bg-primary text-white"
 : "bg-surface-blue text-primary-dark"
 }`}
 >
 <input
 type="radio"
 value="SI"
 className="sr-only"
 {...register("tieneGarante")}
 />
 Sí
 </label>

 <label
 className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
 values.tieneGarante === "NO"
 ? "bg-primary text-white"
 : "bg-surface-blue text-primary-dark"
 }`}
 >
 <input
 type="radio"
 value="NO"
 className="sr-only"
 {...register("tieneGarante")}
 />
 No
 </label>
 </div>

 {errors.tieneGarante ? (
 <p className="mt-2 text-xs font-semibold text-error">
 {errors.tieneGarante.message}
 </p>
 ) : null}
 </fieldset>
 </div>
 ) : null}

 {/* Cónyuge - Casado / Unión libre */}
 {(values.estadoCivil === "CASADO" ||
 values.estadoCivil === "CONYUGE") ? (
 <>
 <div className="sm:col-span-2">
 <div className="rounded-[20px] bg-[#E9F7FF] px-5 py-4">
 <p className="text-sm font-extrabold text-primary-dark">
 {values.estadoCivil === "CASADO"
 ? "Datos de tu esposo(a)"
 : "Datos de tu cónyuge"}
 </p>

 <p className="mt-1 text-xs leading-5 text-muted">
 Necesitamos algunos datos básicos para completar la
 información de tu solicitud.
 </p>
 </div>
 </div>

 <div>
 <KivoInput
 id="nombreConyuge"
 label={
   values.estadoCivil === "CASADO"
     ? "Nombre completo de tu esposo(a)"
     : "Nombre completo de tu pareja"
 }
 type="text"
 placeholder="Ej. María Elena Vargas"
 error={errors.nombreConyuge?.message}
 {...register("nombreConyuge")}
/>
 </div>

 <div>
 <KivoInput
 id="celularConyuge"
 label={
   values.estadoCivil === "CASADO"
     ? "Número de celular de tu esposo(a)"
     : "Número de celular de tu pareja"
 }
 type="tel"
 inputMode="numeric"
 maxLength={8}
 placeholder="Ej. 70000000"
 error={errors.celularConyuge?.message}
 {...register("celularConyuge")}
/>
 </div>
 </>
 ) : null}
 </div>

 {/* Destino del préstamo */}
 <fieldset
 className={`mt-6 border-t border-border-soft pt-6 ${lockCls(
 "destinoPrestamo",
 )}`}
 >
 <legend className="text-sm font-bold text-ink">
 ¿Para qué necesitas el préstamo?
 </legend>

 <p className="mt-1 text-xs leading-5 text-muted">
 {esAsalariado
 ? "Indícanos para qué utilizarás el préstamo."
 : "Selecciona la opción que mejor describe cómo utilizarás el dinero."}
 </p>

 <div
 className={`mt-3 grid gap-3 ${
 puedeElegirCapitalTrabajo
 ? "sm:grid-cols-2"
 : "sm:max-w-md"
 }`}
 >
 {puedeElegirCapitalTrabajo ? (
 <label
 className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
 values.destinoPrestamo === "CAPITAL_TRABAJO"
 ? "border-primary bg-surface-blue"
 : "border-border bg-white hover:border-primary/40"
 }`}
 >
 <input
 type="radio"
 value="CAPITAL_TRABAJO"
 className="sr-only"
 tabIndex={lockTab("destinoPrestamo")}
 {...register("destinoPrestamo")}
 />

 <div className="flex items-start gap-3">
 <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
 <BriefcaseBusiness className="h-5 w-5" />
 </span>

 <div>
 <p className="text-sm font-extrabold text-ink">
 Capital de trabajo
 </p>

 <p className="mt-1 text-xs leading-5 text-muted">
 Para mercadería, insumos, herramientas u otros gastos
 relacionados con tu actividad.
 </p>
 </div>
 </div>
 </label>
 ) : null}

 <label
 className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
 values.destinoPrestamo === "USO_PERSONAL"
 ? "border-primary bg-surface-blue"
 : "border-border bg-white hover:border-primary/40"
 }`}
 >
 <input
 type="radio"
 value="USO_PERSONAL"
 className="sr-only"
 tabIndex={lockTab("destinoPrestamo")}
 {...register("destinoPrestamo")}
 />

 <div className="flex items-start gap-3">
 <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
 <ShoppingBag className="h-5 w-5" />
 </span>

 <div>
 <p className="text-sm font-extrabold text-ink">
 Uso personal
 </p>

 <p className="mt-1 text-xs leading-5 text-muted">
 Para cubrir una necesidad o gasto personal.
 </p>
 </div>
 </div>
 </label>
 </div>

 {errors.destinoPrestamo ? (
 <p
 className="mt-2 text-xs font-semibold text-error"
 role="alert"
 >
 {errors.destinoPrestamo.message}
 </p>
 ) : null}

 {values.destinoPrestamo ? (
 <div className="mt-5">
 <KivoTextarea
 id="detalleDestinoPrestamo"
 label="Cuéntanos para qué necesitas el préstamo"
 rows={4}
 placeholder={
   values.destinoPrestamo === "CAPITAL_TRABAJO"
     ? "Ej. Comprar mercadería para aumentar el stock de mi tienda."
     : "Ej. Realizar mejoras en mi vivienda y cubrir algunos gastos familiares."
 }
 error={errors.detalleDestinoPrestamo?.message}
 {...register("detalleDestinoPrestamo")}
/>

 <p className="mt-2 text-xs leading-5 text-muted">
 Describe cómo utilizarás el dinero.
 </p>
 </div>
 ) : null}
 </fieldset>

 <div className="mt-6">
 <KivoButton
 type="submit"
 disabled={!todoCompleto}
 fullWidth
 className="sm:w-auto"
 iconRight={
   <ArrowRight
     className="h-[18px] w-[18px]"
     strokeWidth={2.5}
   />
 }
>
 Siguiente paso
</KivoButton>
 </div>
 </form>
 );
}
