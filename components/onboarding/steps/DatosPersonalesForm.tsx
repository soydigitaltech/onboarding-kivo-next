"use client";

import {
  useEffect,
  useState,
} from "react";

import dynamic from "next/dynamic";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import {
  NumericFormat,
} from "react-number-format";

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

import {
  useOnboardingStore,
} from "@/store/onboarding";

import type {
  Coordenadas,
} from "@/components/onboarding/steps/MapaUbicacion";

import {
  KivoAffixedInput,
  KivoBusinessNotice,
  KivoButton,
  KivoInput,
  KivoSelect,
  kivoAffixedInputClassName,
} from "@/components/ui/kivo";


const MapaUbicacion = dynamic(
  () =>
    import(
      "@/components/onboarding/steps/MapaUbicacion"
    ),
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
      return NOMBRE_COMPLETO_REGEX.test(
        values.nombreCompleto ?? "",
      );

    case "ci":
      return /^\d{5,10}$/.test(
        (values.ci ?? "").trim(),
      );

    case "fechaNacimiento": {
      const edad = calcularEdad(
        values.fechaNacimiento ?? "",
      );

      return (
        edad >= EDAD_MINIMA &&
        edad <= EDAD_MAXIMA
      );
    }

    case "celular":
      return /^[67]\d{7}$/.test(
        (values.celular ?? "").trim(),
      );

    case "ciudad":
      return (
        (values.ciudad ?? "") !== ""
      );

    case "direccion":
      return (
        (values.direccion ?? "")
          .trim()
          .length >= 5
      );

    case "numeroDependientes":
      return (
        values.numeroDependientes !==
          undefined &&
        Number.isInteger(
          values.numeroDependientes,
        ) &&
        values.numeroDependientes >= 0
      );
  }
}


export function DatosPersonalesForm() {
  const [
    ubicacionMock,
    setUbicacionMock,
  ] = useState<Coordenadas>({
    lat: -16.5,
    lng: -68.15,
  });


  const datosGuardados =
    useOnboardingStore(
      (state) =>
        state.datosPersonales,
    );


  const setDatosPersonales =
    useOnboardingStore(
      (state) =>
        state.setDatosPersonales,
    );


  const setElegibilidadInicial =
    useOnboardingStore(
      (state) =>
        state.setElegibilidadInicial,
    );


  const completeAndAdvance =
    useOnboardingStore(
      (state) =>
        state.completeAndAdvance,
    );


  const {
    register,
    control,
    handleSubmit,
    watch,

    formState: {
      errors,
      isSubmitting,
    },
  } =
    useForm<DatosPersonalesValues>({
      resolver:
        zodResolver(
          datosPersonalesSchema,
        ),

      mode: "onTouched",

      defaultValues:
        datosGuardados ??
        EMPTY_VALUES,
    });


  const values = watch();


  const primerIncompleto =
    FIELD_ORDER.findIndex(
      (campo) =>
        !campoCompleto(
          campo,
          values,
        ),
    );


  const limite =
    primerIncompleto === -1
      ? FIELD_ORDER.length
      : primerIncompleto;


  function bloqueado(
    campo: Campo,
  ) {
    return (
      FIELD_ORDER.indexOf(campo) >
      limite
    );
  }


  function lockCls(
    campo: Campo,
  ) {
    return bloqueado(campo)
      ? "pointer-events-none select-none opacity-45 transition-opacity duration-300"
      : "transition-opacity duration-300";
  }


  function lockTab(
    campo: Campo,
  ) {
    return bloqueado(campo)
      ? -1
      : undefined;
  }


  const todoCompleto =
    primerIncompleto === -1;


  const edad =
    calcularEdad(
      values.fechaNacimiento ?? "",
    );


  const sinCobertura =
    values.ciudad !== "" &&
    !ciudadTieneCobertura(
      values.ciudad,
    );


  useEffect(() => {
    const fechaIngresada =
      Boolean(values.fechaNacimiento);

    const ciudadIngresada =
      Boolean(values.ciudad);

    if (
      fechaIngresada &&
      (edad < EDAD_MINIMA ||
        edad > EDAD_MAXIMA)
    ) {
      setElegibilidadInicial({
        estado: "NO_ELEGIBLE",
        motivo: "EDAD_FUERA_RANGO",
        evaluadaEn:
          new Date().toISOString(),
      });

      return;
    }

    if (sinCobertura) {
      setElegibilidadInicial({
        estado: "NO_ELEGIBLE",
        motivo:
          "CIUDAD_SIN_COBERTURA",
        evaluadaEn:
          new Date().toISOString(),
      });

      return;
    }

    if (
      fechaIngresada &&
      ciudadIngresada &&
      edad >= EDAD_MINIMA &&
      edad <= EDAD_MAXIMA &&
      ciudadTieneCobertura(
        values.ciudad,
      )
    ) {
      setElegibilidadInicial({
        estado: "ELEGIBLE",
        motivo: null,
        evaluadaEn:
          new Date().toISOString(),
      });
    }
  }, [
    edad,
    sinCobertura,
    values.fechaNacimiento,
    values.ciudad,
    setElegibilidadInicial,
  ]);


  function onSubmit(
    formValues:
      DatosPersonalesValues,
  ) {
    if (
      !ciudadTieneCobertura(
        formValues.ciudad,
      )
    ) {
      return;
    }

    setDatosPersonales({
      ...formValues,
      ubicacionDomicilio: {
        lat: ubicacionMock.lat,
        lng: ubicacionMock.lng,
      },
    });

    completeAndAdvance(
      "datos-personales",
    );
  }


  return (
    <form
      onSubmit={
        handleSubmit(onSubmit)
      }
      noValidate
    >
      <p className="mb-6 max-w-2xl text-sm leading-6 text-body">
        Empecemos con algunos datos
        sobre ti. Esta información nos
        ayudará a iniciar tu solicitud.
      </p>


      <div className="grid gap-5 sm:grid-cols-2">

        {/* =========================================
            NOMBRE COMPLETO
        ========================================= */}

        <div
          className={`sm:col-span-2 ${lockCls(
            "nombreCompleto",
          )}`}
        >
          <KivoInput
            id="nombreCompleto"
            label="Nombre completo"
            type="text"
            autoComplete="name"
            placeholder="Ej. Sara Valentina Gonzales Mamani"
            tabIndex={
              lockTab(
                "nombreCompleto",
              )
            }
            error={
              errors
                .nombreCompleto
                ?.message
            }
            {...register(
              "nombreCompleto",
            )}
          />
        </div>


        {/* =========================================
            CARNET
        ========================================= */}

        <div
          className={
            lockCls("ci")
          }
        >
          <KivoInput
            id="ci"
            label="Carnet de identidad"
            type="text"
            inputMode="numeric"
            placeholder="Ej. 6084527"
            tabIndex={
              lockTab("ci")
            }
            error={
              errors.ci?.message
            }
            {...register("ci")}
          />
        </div>


        {/* =========================================
            FECHA NACIMIENTO
        ========================================= */}

        <div
          className={
            lockCls(
              "fechaNacimiento",
            )
          }
        >
          <KivoInput
            id="fechaNacimiento"
            label="Fecha de nacimiento"
            type="date"
            autoComplete="bday"
            tabIndex={
              lockTab(
                "fechaNacimiento",
              )
            }
            error={
              errors
                .fechaNacimiento
                ?.message
            }
            className="
              appearance-none
              [&::-webkit-calendar-picker-indicator]:hidden
              [&::-webkit-calendar-picker-indicator]:appearance-none
            "
            {...register(
              "fechaNacimiento",
            )}
          />


          {edad >= EDAD_MINIMA &&
          edad <= EDAD_MAXIMA ? (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface-blue px-3 py-1 text-xs font-bold text-primary-dark">
              <CalendarDays className="h-3.5 w-3.5" />

              Tienes {edad} años
            </p>
          ) : null}
        </div>


        {/* =========================================
            CELULAR
        ========================================= */}

        <div
          className={
            lockCls("celular")
          }
        >
          <div className="mb-1.5 text-sm font-bold text-ink">
            Número de celular
          </div>

          <KivoAffixedInput
            prefix="+591"
            error={
              Boolean(
                errors.celular,
              )
            }
          >
            <input
              id="celular"
              type="tel"
              inputMode="numeric"
              maxLength={8}
              autoComplete="tel"
              placeholder="70000000"
              tabIndex={
                lockTab(
                  "celular",
                )
              }
              className={
                kivoAffixedInputClassName
              }
              aria-invalid={
                Boolean(
                  errors.celular,
                )
              }
              {...register(
                "celular",
              )}
            />
          </KivoAffixedInput>


          {errors.celular ? (
            <p
              role="alert"
              className="mt-1.5 text-xs font-semibold text-error"
            >
              {
                errors.celular
                  .message
              }
            </p>
          ) : null}
        </div>


        {/* =========================================
            CIUDAD
        ========================================= */}

        <div
          className={
            lockCls("ciudad")
          }
        >
          <Controller
            name="ciudad"
            control={control}
            render={({
              field,
            }) => (
              <KivoSelect
                id="ciudad"
                label="Ciudad"
                value={
                  field.value ??
                  ""
                }
                options={
                  CIUDADES
                }
                placeholder="Selecciona tu ciudad"
                tabIndex={
                  lockTab(
                    "ciudad",
                  )
                }
                onChange={
                  field.onChange
                }
                onBlur={
                  field.onBlur
                }
                error={
                  errors
                    .ciudad
                    ?.message
                }
              />
            )}
          />


          {sinCobertura ? (
            <div className="mt-3">
              <KivoBusinessNotice>
                <div>
                  <p className="font-extrabold text-warning">
                    Aún no tenemos
                    cobertura en tu
                    ciudad
                  </p>

                  <p className="mt-1">
                    Por ahora Kivo
                    atiende solicitudes
                    únicamente en{" "}
                    <strong className="font-extrabold text-ink">
                      La Paz y El Alto
                    </strong>
                    .
                  </p>

                  <p className="mt-2">
                    Tus datos fueron
                    guardados y te
                    avisaremos cuando
                    tengamos cobertura
                    en tu ciudad.
                  </p>

                  <p className="mt-2 font-bold text-ink">
                    No tendrás que
                    volver a completar
                    esta información.
                  </p>
                </div>
              </KivoBusinessNotice>
            </div>
          ) : null}
        </div>


        {/* =========================================
            DIRECCIÓN
        ========================================= */}

        <div
          className={`sm:col-span-2 ${lockCls(
            "direccion",
          )}`}
        >
          <KivoInput
            id="direccion"
            label="Dirección de domicilio"
            type="text"
            autoComplete="street-address"
            placeholder="Ej. Zona Sopocachi, calle Aspiazu N.º 123"
            tabIndex={
              lockTab(
                "direccion",
              )
            }
            error={
              errors
                .direccion
                ?.message
            }
            {...register(
              "direccion",
            )}
          />
        </div>


        {/* =========================================
            MAPA
        ========================================= */}

        <div
          className={`sm:col-span-2 ${lockCls(
            "direccion",
          )}`}
        >
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-bold text-ink">
                Ubicación de tu
                domicilio
              </p>

              <p className="mt-1 text-xs leading-5 text-body">
                Marca tu ubicación en
                el mapa o mueve el pin
                hasta tu domicilio.
              </p>
            </div>


            <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-primary">
              Mapa de referencia
            </span>
          </div>


          <div className="hidden overflow-hidden rounded-[22px] bg-surface-blue sm:block">
            <MapaUbicacion
              value={
                ubicacionMock
              }
              onChange={
                setUbicacionMock
              }
            />
          </div>


          <div className="mt-3 hidden flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-muted sm:flex">

            <span>
              Latitud{" "}
              <strong className="font-bold text-ink">
                {ubicacionMock.lat.toFixed(
                  6,
                )}
              </strong>
            </span>


            <span>
              Longitud{" "}
              <strong className="font-bold text-ink">
                {ubicacionMock.lng.toFixed(
                  6,
                )}
              </strong>
            </span>

          </div>
        </div>


        {/* =========================================
            DEPENDIENTES
        ========================================= */}

        <div
          className={
            lockCls(
              "numeroDependientes",
            )
          }
        >
          <div className="mb-1.5 text-sm font-bold text-ink">
            Número de dependientes
          </div>


          <Controller
            name="numeroDependientes"
            control={control}
            render={({
              field,
            }) => (
              <KivoAffixedInput
                prefix="N.º"
                error={
                  Boolean(
                    errors
                      .numeroDependientes,
                  )
                }
              >
                <NumericFormat
                  id="numeroDependientes"
                  getInputRef={
                    field.ref
                  }
                  value={
                    field.value ??
                    ""
                  }
                  onValueChange={(
                    numericValue,
                  ) => {
                    field.onChange(
                      numericValue.floatValue,
                    );
                  }}
                  onBlur={
                    field.onBlur
                  }
                  allowNegative={
                    false
                  }
                  decimalScale={0}
                  placeholder="Ej. 2"
                  tabIndex={
                    lockTab(
                      "numeroDependientes",
                    )
                  }
                  className={
                    kivoAffixedInputClassName
                  }
                />
              </KivoAffixedInput>
            )}
          />


          {errors.numeroDependientes ? (
            <p
              role="alert"
              className="mt-1.5 text-xs font-semibold text-error"
            >
              {
                errors
                  .numeroDependientes
                  .message
              }
            </p>
          ) : null}
        </div>

      </div>


      {/* =========================================
          ACTION
      ========================================= */}

      <div className="mt-6">
        <KivoButton
          type="submit"
          loading={isSubmitting}
          disabled={
            !todoCompleto ||
            sinCobertura
          }
          iconRight={
            <ArrowRight
              className="h-[18px] w-[18px]"
              strokeWidth={2.5}
            />
          }
          className="w-full sm:w-auto"
        >
          Siguiente paso
        </KivoButton>
      </div>
    </form>
  );
}
