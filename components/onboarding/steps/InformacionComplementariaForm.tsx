"use client";

import {
  KivoAffixedInput,
  KivoButton,
  KivoInput,
  KivoSelect,
  KivoTextarea,
  kivoAffixedInputClassName,
} from "@/components/ui/kivo";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BriefcaseBusiness, ShoppingBag } from "lucide-react";

import {
 FAMILY_HOUSING_RELATIONSHIPS,
 HOUSING_TYPES,
 RUBROS,
 informacionComplementariaSchema,
 type InformacionComplementariaValues,
} from "@/lib/schemas/informacion-complementaria";
import { calcularEdad } from "@/lib/schemas/datos-personales";
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
 rubro:
 undefined as unknown as InformacionComplementariaValues["rubro"],
 detalleRubro: "",
 cargoActividad: "",
 antiguedadActividad: undefined as unknown as number,
 tieneNit: undefined,
 tieneLicenciaFuncionamiento: undefined,
 direccionLaboral: "",
 tieneAfp: undefined,
 tieneBoletasPago: undefined,
 vivienda:
 undefined as unknown as InformacionComplementariaValues["vivienda"],
 parentescoViviendaFamiliar: undefined,
 detalleParentescoViviendaFamiliar: "",
 destinoPrestamo:
 undefined as unknown as InformacionComplementariaValues["destinoPrestamo"],
 detalleDestinoPrestamo: "",
 tieneGarante: undefined,
 esposoEsGarante: undefined,
 nombreGarante: "",
};

type Paso =
 | "nombreEmpresaNegocio"
 | "rubro"
 | "cargoActividad"
 | "antiguedadActividad"
 | "direccionLaboral"
 | "afp"
 | "boletasPago"
 | "vivienda"
 | "destinoPrestamo";

const PASOS: Paso[] = [
 "nombreEmpresaNegocio",
 "rubro",
 "cargoActividad",
 "antiguedadActividad",
 "direccionLaboral",
 "afp",
 "boletasPago",
 "vivienda",
 "destinoPrestamo",
];

function pasoCompleto(
 paso: Paso,
 values: Partial<InformacionComplementariaValues>,
 esAsalariado: boolean,
 antiguedadMinima: number,
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
 return (values.antiguedadActividad ?? 0) >= antiguedadMinima;

 case "direccionLaboral":
 return (values.direccionLaboral ?? "").trim().length >= 5;

 case "afp":
 if (!esAsalariado) return true;
 return values.tieneAfp !== undefined;

 case "boletasPago":
 if (!esAsalariado) return true;
 return values.tieneBoletasPago === "SI";

 case "vivienda": {
 const viviendaSeleccionada = values.vivienda !== undefined;

 if (!viviendaSeleccionada) return false;

 if (values.vivienda === "FAMILIAR") {
   if (!values.parentescoViviendaFamiliar) return false;

   if (
     values.parentescoViviendaFamiliar === "OTROS" &&
     (values.detalleParentescoViviendaFamiliar ?? "")
       .trim()
       .length < 2
   ) {
     return false;
   }
 }

 const requiereGarante =
   values.vivienda === "ALQUILER" ||
   values.vivienda === "ANTICRETICO";

 if (!requiereGarante) return true;

 return (
  values.tieneGarante === "SI" &&
  (values.nombreGarante ?? "").trim().length >= 3
 );
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

 const datosPersonales = useOnboardingStore(
 (state) => state.datosPersonales,
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
 setValue,
 formState: { errors },
 } = useForm<InformacionComplementariaValues>({
 resolver: zodResolver(informacionComplementariaSchema),
 mode: "onChange",
 defaultValues: {
  ...EMPTY_VALUES,
  ...(guardados ?? {}),
 },
 });

 const values = watch();

 const esAsalariado =
 datosFinancieros?.perfilLaboral === "ASALARIADO";

 const esCasadaConApellido =
  datosPersonales?.sexo === "MUJER" &&
  datosPersonales?.esCasada === "SI" &&
  Boolean(datosPersonales?.apellidoMatrimonio?.trim());

 const edad = datosPersonales
 ? calcularEdad(datosPersonales.fechaNacimiento)
 : null;

 const requiere24Meses =
 edad !== null &&
 edad >= 18 &&
 edad <= 25;

 const antiguedadMinima =
 requiere24Meses ? 24 : 12;

 const noTieneBoletas =
 esAsalariado &&
 values.tieneBoletasPago === "NO";

 useEffect(() => {
  if (
   esCasadaConApellido &&
   (values.esposoEsGarante === "SI" ||
    values.esposoEsGarante === "NO") &&
   values.tieneGarante !== "SI"
  ) {
   setValue("tieneGarante", "SI", {
    shouldValidate: true,
    shouldDirty: true,
   });
  }
 }, [
  esCasadaConApellido,
  values.esposoEsGarante,
  values.tieneGarante,
  setValue,
 ]);

 const primerIncompleto = PASOS.findIndex(
 (paso) =>
 !pasoCompleto(
   paso,
   values,
   esAsalariado,
   antiguedadMinima,
 ),
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

  async function actualizarUbicacionLaboral(
    coords: Coordenadas,
  ) {
    setUbicacionLaboralMock(coords);

    try {
      const params = new URLSearchParams({
        lat: String(coords.lat),
        lng: String(coords.lng),
      });

      const response = await fetch(
        `/api/geocoding/reverse?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo obtener la dirección laboral.",
        );
      }

      const data = await response.json();

      if (
        typeof data.direccion === "string" &&
        data.direccion.trim()
      ) {
        setValue(
          "direccionLaboral",
          data.direccion
            .trim()
            .toLocaleUpperCase("es-BO"),
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          },
        );
      }
    } catch (error) {
      console.error(
        "Error obteniendo dirección laboral:",
        error,
      );
    }
  }


 const onSubmit = (
 formValues: InformacionComplementariaValues,
 ) => {
 const requiereGarante =
  formValues.vivienda === "ALQUILER" ||
  formValues.vivienda === "ANTICRETICO";

 setDatosComplementarios({
  ...formValues,
  tieneGarante:
   requiereGarante && esCasadaConApellido
    ? "SI"
    : formValues.tieneGarante,

  esposoEsGarante:
   requiereGarante && esCasadaConApellido
    ? formValues.esposoEsGarante
    : undefined,

  nombreGarante:
   requiereGarante &&
   (
    formValues.tieneGarante === "SI" ||
    esCasadaConApellido
   )
    ? formValues.nombreGarante?.trim()
    : undefined,

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
  <Controller
   control={control}
   name="rubro"
   render={({ field }) => (
    <KivoSelect
     id="rubro"
     label="Rubro"
     value={field.value ?? ""}
     options={RUBROS}
     placeholder="Selecciona un rubro"
     error={errors.rubro?.message}
     tabIndex={lockTab("rubro")}
     onChange={field.onChange}
     onBlur={field.onBlur}
    />
   )}
  />

  {values.rubro === "OTRO" ? (
   <div className="mt-4">
    <KivoInput
     id="detalleRubro"
     label="Especifica el rubro"
     type="text"
     placeholder="Ej. Servicios técnicos"
     error={errors.detalleRubro?.message}
     {...register("detalleRubro")}
    />
   </div>
  ) : null}
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

 <p className="sm:col-span-2 -mt-2 text-xs leading-5 text-muted">
 {esAsalariado
   ? `Para tu perfil se requieren al menos ${antiguedadMinima} meses de antigüedad laboral.`
   : `Para tu perfil se requieren al menos ${antiguedadMinima} meses de antigüedad en la actividad.`}
</p>

{/* NIT y licencia - solo Independiente */}
{!esAsalariado ? (
 <>
  <div className="sm:col-span-2">
   <fieldset>
    <legend className="text-sm font-bold text-ink">
     ¿Cuentas con NIT?
    </legend>

    <p className="mt-1 text-xs leading-5 text-muted">
     Indica si actualmente cuentas con Número de Identificación Tributaria.
    </p>

    <div className="mt-3 flex flex-wrap gap-3">
     <label
      className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
       values.tieneNit === "SI"
        ? "bg-primary text-white"
        : "bg-surface-blue text-primary-dark"
      }`}
     >
      <input
       type="radio"
       value="SI"
       className="sr-only"
       {...register("tieneNit")}
      />
      Sí
     </label>

     <label
      className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
       values.tieneNit === "NO"
        ? "bg-primary text-white"
        : "bg-surface-blue text-primary-dark"
      }`}
     >
      <input
       type="radio"
       value="NO"
       className="sr-only"
       {...register("tieneNit")}
      />
      No
     </label>
    </div>
   </fieldset>
  </div>

  <div className="sm:col-span-2">
   <fieldset>
    <legend className="text-sm font-bold text-ink">
     ¿Cuentas con licencia de funcionamiento o patente?
    </legend>

    <p className="mt-1 text-xs leading-5 text-muted">
     Indica si tu actividad o negocio cuenta actualmente con alguno de estos registros.
    </p>

    <div className="mt-3 flex flex-wrap gap-3">
     <label
      className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
       values.tieneLicenciaFuncionamiento === "SI"
        ? "bg-primary text-white"
        : "bg-surface-blue text-primary-dark"
      }`}
     >
      <input
       type="radio"
       value="SI"
       className="sr-only"
       {...register("tieneLicenciaFuncionamiento")}
      />
      Sí
     </label>

     <label
      className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
       values.tieneLicenciaFuncionamiento === "NO"
        ? "bg-primary text-white"
        : "bg-surface-blue text-primary-dark"
      }`}
     >
      <input
       type="radio"
       value="NO"
       className="sr-only"
       {...register("tieneLicenciaFuncionamiento")}
      />
      No
     </label>
    </div>
   </fieldset>
  </div>
 </>
) : null}

{/* UBICACIÓN LABORAL */}
 <div
  className={`sm:col-span-2 ${lockCls(
   "direccionLaboral",
  )}`}
 >
  <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
   <div>
    <p className="text-sm font-bold text-ink">
     Ubicación laboral exacta
    </p>

    <p className="mt-1 text-xs leading-5 text-muted">
     Marca la ubicación de tu{" "}
     {esAsalariado
      ? "lugar de trabajo"
      : "negocio"}{" "}
     o mueve el pin hasta la ubicación correcta.
    </p>
   </div>

   <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary">
    Mapa de referencia
   </span>
  </div>

  <div className="overflow-hidden rounded-[22px] bg-surface-blue">
   <MapaUbicacion
    value={ubicacionLaboralMock}
    onChange={actualizarUbicacionLaboral}
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

  <div className="mt-5">
   <KivoInput
    id="direccionLaboral"
    label="Dirección exacta laboral"
    type="text"
    placeholder={
     esAsalariado
      ? "EJ. ZONA SOPOCACHI, AV. ARCE N.º 1234, EDIFICIO ABC"
      : "EJ. ZONA VILLA FÁTIMA, AV. LAS AMÉRICAS N.º 345"
    }
    error={errors.direccionLaboral?.message}
    tabIndex={lockTab("direccionLaboral")}
    {...register("direccionLaboral")}
   />

   <p className="mt-1.5 text-xs leading-5 text-muted">
    Puedes corregir la dirección si el mapa no identifica exactamente el número o edificio.
   </p>
  </div>
 </div>


{/* AFP / boletas - solo asalariados */}
{esAsalariado ? (
 <>
  <div className={`sm:col-span-2 ${lockCls("afp")}`}>
   <fieldset>
    <legend className="text-sm font-bold text-ink">
     ¿Estás afiliado(a) a una AFP?
    </legend>

    <p className="mt-1 text-xs leading-5 text-muted">
     Indica si actualmente cuentas con afiliación a una AFP.
    </p>

    <div className="mt-3 flex flex-wrap gap-3">
     <label
      className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
       values.tieneAfp === "SI"
        ? "bg-primary text-white"
        : "bg-surface-blue text-primary-dark"
      }`}
     >
      <input
       type="radio"
       value="SI"
       className="sr-only"
       tabIndex={lockTab("afp")}
       {...register("tieneAfp")}
      />
      Sí
     </label>

     <label
      className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
       values.tieneAfp === "NO"
        ? "bg-primary text-white"
        : "bg-surface-blue text-primary-dark"
      }`}
     >
      <input
       type="radio"
       value="NO"
       className="sr-only"
       tabIndex={lockTab("afp")}
       {...register("tieneAfp")}
      />
      No
     </label>
    </div>
   </fieldset>
  </div>

  <div className={`sm:col-span-2 ${lockCls("boletasPago")}`}>
   <fieldset>
    <legend className="text-sm font-bold text-ink">
     ¿Cuentas con boletas de pago?
    </legend>

    <p className="mt-1 text-xs leading-5 text-muted">
     Para continuar con la solicitud necesitamos que puedas presentar
     tus boletas de pago.
    </p>

    <div className="mt-3 flex flex-wrap gap-3">
     <label
      className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
       values.tieneBoletasPago === "SI"
        ? "bg-primary text-white"
        : "bg-surface-blue text-primary-dark"
      }`}
     >
      <input
       type="radio"
       value="SI"
       className="sr-only"
       tabIndex={lockTab("boletasPago")}
       {...register("tieneBoletasPago")}
      />
      Sí
     </label>

     <label
      className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
       values.tieneBoletasPago === "NO"
        ? "bg-primary text-white"
        : "bg-surface-blue text-primary-dark"
      }`}
     >
      <input
       type="radio"
       value="NO"
       className="sr-only"
       tabIndex={lockTab("boletasPago")}
       {...register("tieneBoletasPago")}
      />
      No
     </label>
    </div>

    {noTieneBoletas ? (
     <div className="mt-4 rounded-[18px] bg-surface px-4 py-3">
      <p className="text-sm font-bold text-error">
       Por ahora no podremos continuar con tu solicitud.
      </p>

      <p className="mt-1 text-xs leading-5 text-error">
       Para este tipo de actividad necesitamos que cuentes con
       boletas de pago.
      </p>
     </div>
    ) : null}
   </fieldset>
  </div>
 </>
) : null}


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

 {values.vivienda === "FAMILIAR" ? (
 <div className={`sm:col-span-2 ${lockCls("vivienda")}`}>
  <Controller
   control={control}
   name="parentescoViviendaFamiliar"
   render={({ field }) => (
    <KivoSelect
     id="parentescoViviendaFamiliar"
     label="¿De quién es la vivienda familiar?"
     value={field.value ?? ""}
     options={FAMILY_HOUSING_RELATIONSHIPS}
     placeholder="Selecciona el parentesco"
     error={errors.parentescoViviendaFamiliar?.message}
     onChange={field.onChange}
     onBlur={field.onBlur}
    />
   )}
  />

  {values.parentescoViviendaFamiliar === "OTROS" ? (
   <div className="mt-4">
    <KivoInput
     id="detalleParentescoViviendaFamiliar"
     label="Indica el parentesco o relación"
     type="text"
     placeholder="Ej. Tío, primo u otro familiar"
     error={errors.detalleParentescoViviendaFamiliar?.message}
     {...register("detalleParentescoViviendaFamiliar")}
    />
   </div>
  ) : null}
 </div>
) : null}
 {/* Garante - solo alquiler / anticrético */}
 {(values.vivienda === "ALQUILER" ||
 values.vivienda === "ANTICRETICO") ? (
 <div className="sm:col-span-2">
  <fieldset>
   {esCasadaConApellido ? (
    <>
     <legend className="text-sm font-bold text-ink">
      ¿Tu esposo será tu garante con vivienda propia?
     </legend>

     <p className="mt-1 text-xs leading-5 text-muted">
      Como ya nos indicaste que estás casada, solo necesitamos saber
      si tu esposo será quien respalde tu solicitud.
     </p>

     <div className="mt-3 flex flex-wrap gap-3">
      <label
       className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
        values.esposoEsGarante === "SI"
         ? "bg-primary text-white"
         : "bg-surface-blue text-primary-dark"
       }`}
      >
       <input
        type="radio"
        value="SI"
        className="sr-only"
        {...register("esposoEsGarante", {
         onChange: () => {
          setValue("tieneGarante", "SI", {
           shouldValidate: true,
           shouldDirty: true,
          });
         },
        })}
       />
       Sí
      </label>

      <label
       className={`cursor-pointer rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
        values.esposoEsGarante === "NO"
         ? "bg-primary text-white"
         : "bg-surface-blue text-primary-dark"
       }`}
      >
       <input
        type="radio"
        value="NO"
        className="sr-only"
        {...register("esposoEsGarante", {
         onChange: () => {
          setValue("tieneGarante", "SI", {
           shouldValidate: true,
           shouldDirty: true,
          });
         },
        })}
       />
       No
      </label>
     </div>

     {values.esposoEsGarante === "SI" ? (
      <div className="mt-4">
       <KivoInput
        id="nombreGarante"
        label="Nombre completo de tu esposo"
        type="text"
        placeholder="Ej. Juan Pérez Mendoza"
        error={errors.nombreGarante?.message}
        {...register("nombreGarante")}
       />
      </div>
     ) : null}

     {values.esposoEsGarante === "NO" ? (
      <div className="mt-4">
       <KivoInput
        id="nombreGarante"
        label="Nombre completo del garante"
        type="text"
        placeholder="Ej. Carlos Mendoza López"
        error={errors.nombreGarante?.message}
        {...register("nombreGarante")}
       />

       <p className="mt-1.5 text-xs leading-5 text-muted">
        Esta persona debe contar con vivienda propia.
       </p>
      </div>
     ) : null}
    </>
   ) : (
    <>
     <legend className="text-sm font-bold text-ink">
      ¿Cuentas con un garante con vivienda propia?
     </legend>

     <p className="mt-1 text-xs leading-5 text-muted">
      Para continuar necesitamos que tu garante cuente con vivienda propia.
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

     {values.tieneGarante === "SI" ? (
      <div className="mt-4">
       <KivoInput
        id="nombreGarante"
        label="Nombre completo del garante"
        type="text"
        placeholder="Ej. Juan Pérez Mendoza"
        error={errors.nombreGarante?.message}
        {...register("nombreGarante")}
       />
      </div>
     ) : null}

     {values.tieneGarante === "NO" ? (
      <div className="mt-4 rounded-[18px] bg-surface px-4 py-3">
       <p className="text-sm font-bold text-error">
        Por ahora no podremos continuar con tu solicitud.
       </p>

       <p className="mt-1 text-xs leading-5 text-error">
        Para vivienda en alquiler o anticrético se requiere
        un garante con vivienda propia.
       </p>
      </div>
     ) : null}

     {errors.tieneGarante ? (
      <p className="mt-2 text-xs font-semibold text-error">
       {errors.tieneGarante.message}
      </p>
     ) : null}
    </>
   )}
  </fieldset>
 </div>
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
