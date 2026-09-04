"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useOnboardingStore, type DatosDocumentos } from "@/store/onboarding";
import {
  DocumentoSlot,
  documentoEstaSubido,
  type DocConfig,
} from "./DocumentoSlot";

// TODO: confirmar con Kivo la URL definitiva del PDF de autorización BIC.
const DOCUMENTOS_BASE: DocConfig[] = [
  {
    key: "ciAnverso",
    titulo: "Carnet de identidad — parte frontal",
    descripcion:
      "Sube una foto clara de la parte donde aparecen tu fotografía y tus datos personales.",
    ejemploUrl: "/carnet.png",
    ejemploAlt: "Ejemplo de la parte frontal del carnet de identidad",
    recomendaciones: [
      "Fotografía el carnet completo.",
      "Evita reflejos y sombras.",
      "Todos los datos deben poder leerse.",
    ],
    accept: ".jpg,.jpeg,.png",
  },
  {
    key: "ciReverso",
    titulo: "Carnet de identidad — parte posterior",
    descripcion:
      "Sube una foto clara de la parte posterior de tu carnet de identidad.",
    ejemploUrl: "/carnetes.png",
    ejemploAlt: "Ejemplo de la parte posterior del carnet de identidad",
    recomendaciones: [
      "No cortes los bordes del carnet.",
      "Evita cubrir los datos con los dedos.",
      "La imagen debe estar enfocada.",
    ],
    accept: ".jpg,.jpeg,.png",
  },
  {
    key: "selfie",
    titulo: "Fotografía / selfie",
    descripcion:
      "Tómate una selfie sosteniendo tu carnet. Tu rostro y el documento deben verse claramente.",
    ejemploUrl: "/selfie.png",
    ejemploAlt: "Ejemplo de una selfie sosteniendo el carnet",
    recomendaciones: [
      "Mira directamente a la cámara.",
      "No uses gorra, lentes oscuros ni barbijo.",
      "Sostén el carnet sin cubrir tu rostro.",
      "Busca un lugar con buena iluminación.",
    ],
    accept: ".jpg,.jpeg,.png",
  },
  {
    key: "autorizacionBic",
    titulo: "Autorización para consulta y uso de información",
    descripcion:
      "Con este documento autorizas a Kivo a consultar la información necesaria para evaluar tu solicitud.",
    destacado: true,
    pasos: [
      "Descarga el documento",
      "Fírmalo con tu puño y letra",
      "Sube una foto o el PDF firmado",
    ],
    ejemploUrl: "/documents/examples/autorizacion-firmada.webp",
    ejemploAlt: "Ejemplo de autorización firmada",
    recomendaciones: [
      "La firma debe verse claramente.",
      "El documento debe estar completo.",
      "No subas el documento sin firmar.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
    descargaUrl: "/AUTORIZACIOEXPRESA.pdf",
  },
];

const DOCUMENTOS_VIVIENDA: Record<
  "PROPIA" | "FAMILIAR" | "ALQUILER" | "ANTICRETICO",
  DocConfig
> = {
  PROPIA: {
    key: "viviendaPropia",
    titulo: "Documento de tu vivienda",
    descripcion:
      "Sube un documento que permita respaldar que la vivienda donde resides es propia.",
    ayuda:
      "Puedes presentar Folio Real, escritura pública, plano de lote, consulta rápida o impuesto pagado, según corresponda.",
    recomendaciones: [
      "El nombre del propietario debe poder identificarse.",
      "El documento debe estar completo y legible.",
      "Evita fotografías borrosas o con partes cortadas.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },

  ALQUILER: {
    key: "viviendaAlquiler",
    titulo: "Contrato de alquiler de tu vivienda",
    descripcion:
      "Sube el contrato que respalda el alquiler de la vivienda donde resides actualmente.",
    recomendaciones: [
      "El contrato debe estar completo.",
      "Los nombres y datos principales deben poder leerse.",
      "Incluye todas las páginas necesarias.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },

  ANTICRETICO: {
    key: "viviendaAnticretico",
    titulo: "Contrato de anticrético de tu vivienda",
    descripcion:
      "Sube el contrato que respalda el anticrético de la vivienda donde resides actualmente.",
    recomendaciones: [
      "El contrato debe estar completo.",
      "Los nombres y datos principales deben poder leerse.",
      "Incluye todas las páginas necesarias.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },

  FAMILIAR: {
    key: "viviendaFamiliar",
    titulo: "Respaldo del domicilio familiar",
    descripcion:
      "Sube un documento que permita respaldar la vivienda familiar donde resides.",
    ayuda:
      "Kivo considera como vivienda familiar la de padres, hijos, hermanos o abuelos.",
    recomendaciones: [
      "El documento debe permitir identificar al propietario.",
      "Debe estar completo y legible.",
      "Más adelante podremos complementar este requisito con la relación familiar declarada.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
};


const DOCUMENTOS_ASALARIADO: DocConfig[] = [
  {
    key: "asalariadoExtractoSueldo",
    titulo: "Extracto bancario de tu sueldo",
    descripcion:
      "Sube un extracto bancario donde podamos identificar el abono de tu sueldo.",
    recomendaciones: [
      "El documento debe mostrar claramente los movimientos.",
      "Tu nombre o los datos de la cuenta deben poder identificarse.",
      "Evita fotografías borrosas o incompletas.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "asalariadoBoletasPago",
    titulo: "Boletas de pago de los últimos 3 meses",
    descripcion:
      "Sube tus boletas de pago correspondientes a los últimos tres meses.",
    ayuda:
      "Si tienes varias boletas, puedes reunirlas en un solo archivo PDF.",
    recomendaciones: [
      "Verifica que las fechas sean visibles.",
      "Los montos y datos principales deben poder leerse.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
];


const DOCUMENTO_GESTORA: DocConfig = {
  key: "asalariadoGestora",
  titulo: "Extracto actualizado de la Gestora",
  descripcion:
    "Sube un extracto actualizado de la Gestora como respaldo de tu actividad laboral.",
  ayuda:
    "Si no cuentas con este documento, puedes presentar un certificado laboral.",
  recomendaciones: [
    "El documento debe estar actualizado.",
    "Tu información debe poder identificarse claramente.",
  ],
  accept: ".pdf,.jpg,.jpeg,.png",
};

const DOCUMENTO_CERTIFICADO_LABORAL: DocConfig = {
  key: "asalariadoCertificadoLaboral",
  titulo: "Certificado laboral",
  descripcion:
    "Puedes presentar este documento si no cuentas con un extracto actualizado de la Gestora.",
  ayuda:
    "El certificado debe indicar tu salario líquido y la fecha de ingreso.",
  recomendaciones: [
    "Revisa que el documento sea legible.",
    "Debe incluir la información laboral necesaria para la evaluación.",
  ],
  accept: ".pdf,.jpg,.jpeg,.png",
};

const DOCUMENTOS_INDEPENDIENTE: DocConfig[] = [
  {
    key: "independienteExtractosIngresos",
    titulo: "Extractos bancarios de tus ingresos",
    descripcion:
      "Sube los extractos bancarios donde podamos identificar los ingresos de tu actividad.",
    ayuda:
      "Puedes incluir cuentas donde recibas pagos o cobros por QR.",
    recomendaciones: [
      "Los movimientos deben poder leerse claramente.",
      "Incluye las cuentas que utilizas habitualmente para recibir ingresos.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "independienteRespaldosNegocio",
    titulo: "Respaldos de tu negocio",
    descripcion:
      "Sube documentos que permitan respaldar los ingresos, gastos o inventario de tu actividad.",
    ayuda:
      "Puedes presentar facturas, recibos, registros de ventas, cuadernos de control, inventarios u otros respaldos.",
    recomendaciones: [
      "Prioriza documentos recientes.",
      "La información debe permitir entender el movimiento de tu actividad.",
      "Evita fotografías borrosas o incompletas.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
];


const DOCUMENTO_NEGOCIO_FORMALIZACION: DocConfig = {
  key: "negocioFormalizacion",
  titulo: "Documento de formalización de tu negocio",
  descripcion:
    "Sube un documento vigente que permita respaldar la formalización de tu actividad o negocio.",
  ayuda:
    "Puedes presentar NIT, registro de SEPREC, licencia, patente municipal u otro documento aceptado por Kivo.",
  recomendaciones: [
    "El nombre del negocio o titular debe poder identificarse.",
    "El documento debe estar completo y legible.",
    "Prioriza documentación vigente.",
  ],
  accept: ".pdf,.jpg,.jpeg,.png",
};

const DOCUMENTOS_LOCAL_NEGOCIO: Partial<
  Record<
    "PROPIO" | "ALQUILER" | "ANTICRETICO" | "DOMICILIO" | "OTRO",
    DocConfig
  >
> = {
  PROPIO: {
    key: "negocioLocalPropio",
    titulo: "Respaldo del local de tu negocio",
    descripcion:
      "Sube un documento que permita respaldar que el lugar donde funciona tu negocio es propio.",
    ayuda:
      "Puedes presentar un documento de propiedad u otro respaldo aceptado por Kivo.",
    recomendaciones: [
      "El propietario debe poder identificarse.",
      "El documento debe estar completo y legible.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },

  ALQUILER: {
    key: "negocioLocalAlquiler",
    titulo: "Contrato de alquiler de tu negocio",
    descripcion:
      "Sube el contrato de alquiler del lugar donde funciona actualmente tu negocio.",
    recomendaciones: [
      "El contrato debe estar completo.",
      "Los nombres y la dirección deben poder identificarse.",
      "Incluye todas las páginas necesarias.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },

  ANTICRETICO: {
    key: "negocioLocalAnticretico",
    titulo: "Contrato de anticrético de tu negocio",
    descripcion:
      "Sube el contrato de anticrético del lugar donde funciona actualmente tu negocio.",
    recomendaciones: [
      "El contrato debe estar completo.",
      "Los nombres y la dirección deben poder identificarse.",
      "Incluye todas las páginas necesarias.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
};


const DOCUMENTOS_PRESTAMOS: DocConfig[] = [
  {
    key: "planPagosPrestamos",
    titulo: "Plan de pagos de tus préstamos",
    descripcion:
      "Sube el plan de pagos actualizado de los préstamos que tienes vigentes.",
    ayuda:
      "Si tienes más de un préstamo, incluye el respaldo correspondiente de cada entidad.",
    recomendaciones: [
      "Verifica que se identifique la entidad financiera.",
      "Las cuotas y fechas deben poder leerse.",
      "Incluye todas las páginas necesarias.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "extractosPrestamos",
    titulo: "Extractos o comprobantes de tus préstamos",
    descripcion:
      "Sube los extractos o comprobantes que respalden tus préstamos vigentes.",
    ayuda:
      "Kivo podrá definir posteriormente el periodo exacto de movimientos requerido.",
    recomendaciones: [
      "Los datos del préstamo deben poder identificarse.",
      "Los documentos deben estar completos y legibles.",
    ],
    accept: ".pdf,.jpg,.jpeg,.png",
  },
];


const DOCUMENTO_SEGUNDO_INGRESO: DocConfig = {
  key: "segundoIngresoRespaldo",
  titulo: "Respaldo de tu segunda fuente de ingresos",
  descripcion:
    "Sube un documento que permita respaldar la segunda fuente de ingresos que declaraste.",
  ayuda:
    "Puedes presentar extractos bancarios, comprobantes de transferencias, cobros por QR u otros respaldos aceptados por Kivo.",
  recomendaciones: [
    "Los movimientos deben poder identificarse claramente.",
    "Prioriza documentos recientes.",
    "Evita imágenes borrosas o incompletas.",
  ],
  accept: ".pdf,.jpg,.jpeg,.png",
};


const DOCUMENTO_COMPROBANTE_DOMICILIO: DocConfig = {
  key: "comprobanteDomicilio",
  titulo: "Comprobante de domicilio actualizado",
  descripcion:
    "Sube un comprobante reciente correspondiente al domicilio que registraste.",
  ayuda:
    "Puedes presentar una factura de servicio autorizada por Kivo. Confirmaremos posteriormente los tipos de comprobante aceptados.",
  recomendaciones: [
    "La dirección debe poder identificarse claramente.",
    "El documento debe estar actualizado y legible.",
    "Evita fotografías borrosas o incompletas.",
  ],
  accept: ".pdf,.jpg,.jpeg,.png",
};


const DOCUMENTO_VEHICULO: DocConfig = {
  key: "documentoVehiculo",
  titulo: "Documento de tu vehículo",
  descripcion:
    "Sube un documento que permita respaldar el vehículo que declaraste a tu nombre.",
  ayuda:
    "Puedes presentar RUAT o documento de compra y venta, según corresponda.",
  recomendaciones: [
    "Los datos del propietario deben poder identificarse.",
    "El documento debe estar completo y legible.",
    "Evita fotografías borrosas o cortadas.",
  ],
  accept: ".pdf,.jpg,.jpeg,.png",
};

type DocKey = DocConfig["key"];

type SeccionDocumentoId =
  | "identidad"
  | "ingresos"
  | "prestamos"
  | "domicilio";

const SECCIONES_DOCUMENTOS: Array<{
  id: SeccionDocumentoId;
  titulo: string;
  descripcion: string;
}> = [
  {
    id: "identidad",
    titulo: "Identidad y autorización",
    descripcion:
      "Documentos básicos para validar tu identidad y autorizar la evaluación de tu solicitud.",
  },
  {
    id: "ingresos",
    titulo: "Ingresos y actividad",
    descripcion:
      "Respaldos relacionados con tu trabajo, negocio y fuentes de ingresos.",
  },
  {
    id: "prestamos",
    titulo: "Préstamos vigentes",
    descripcion:
      "Información necesaria para validar las obligaciones financieras que declaraste.",
  },
  {
    id: "domicilio",
    titulo: "Domicilio y patrimonio",
    descripcion:
      "Documentos relacionados con tu vivienda, domicilio y bienes declarados.",
  },
];

const SECCION_POR_DOCUMENTO: Partial<
  Record<DocKey, SeccionDocumentoId>
> = {
  autorizacionBic: "identidad",
  ciAnverso: "identidad",
  ciReverso: "identidad",
  selfie: "identidad",

  asalariadoExtractoSueldo: "ingresos",
  asalariadoBoletasPago: "ingresos",
  asalariadoGestora: "ingresos",
  asalariadoCertificadoLaboral: "ingresos",

  independienteExtractosIngresos: "ingresos",
  independienteRespaldosNegocio: "ingresos",

  negocioFormalizacion: "ingresos",
  negocioLocalPropio: "ingresos",
  negocioLocalAlquiler: "ingresos",
  negocioLocalAnticretico: "ingresos",

  segundoIngresoRespaldo: "ingresos",

  planPagosPrestamos: "prestamos",
  extractosPrestamos: "prestamos",

  comprobanteDomicilio: "domicilio",
  viviendaPropia: "domicilio",
  viviendaAlquiler: "domicilio",
  viviendaAnticretico: "domicilio",
  viviendaFamiliar: "domicilio",
  documentoVehiculo: "domicilio",
};

const TODAS_LAS_CLAVES: DocKey[] = [
  "autorizacionBic",
  "ciAnverso",
  "ciReverso",
  "selfie",
  "viviendaPropia",
  "viviendaAlquiler",
  "viviendaAnticretico",
  "viviendaFamiliar",

  "asalariadoExtractoSueldo",
  "asalariadoBoletasPago",
  "asalariadoGestora",
  "asalariadoCertificadoLaboral",

  "independienteExtractosIngresos",
  "independienteRespaldosNegocio",

  "negocioFormalizacion",
  "negocioLocalPropio",
  "negocioLocalAlquiler",
  "negocioLocalAnticretico",

  "planPagosPrestamos",
  "extractosPrestamos",

  "segundoIngresoRespaldo",

  "comprobanteDomicilio",
  "documentoVehiculo",
];

function estadoArchivosInicial(): Record<DocKey, File | null> {
  return Object.fromEntries(
    TODAS_LAS_CLAVES.map((key) => [key, null]),
  ) as Record<DocKey, File | null>;
}

function estadoRemovidosInicial(): Record<DocKey, boolean> {
  return Object.fromEntries(
    TODAS_LAS_CLAVES.map((key) => [key, false]),
  ) as Record<DocKey, boolean>;
}

function datosDocumentosVacios(): DatosDocumentos {
  return {
    autorizacionBic: null,
    ciAnverso: null,
    ciReverso: null,
    selfie: null,
    viviendaPropia: null,
    viviendaAlquiler: null,
    viviendaAnticretico: null,
    viviendaFamiliar: null,

    asalariadoExtractoSueldo: null,
    asalariadoBoletasPago: null,
    asalariadoGestora: null,
    asalariadoCertificadoLaboral: null,

    independienteExtractosIngresos: null,
    independienteRespaldosNegocio: null,

    negocioFormalizacion: null,
    negocioLocalPropio: null,
    negocioLocalAlquiler: null,
    negocioLocalAnticretico: null,

    planPagosPrestamos: null,
    extractosPrestamos: null,

    segundoIngresoRespaldo: null,

    comprobanteDomicilio: null,
    documentoVehiculo: null,
  };
}

export function DocumentosForm() {
  const guardados = useOnboardingStore((s) => s.datosDocumentos);
  const datosComplementarios = useOnboardingStore(
    (s) => s.datosComplementarios,
  );

  const datosFinancieros = useOnboardingStore(
    (s) => s.datosFinancieros,
  );

  const setDatosDocumentos = useOnboardingStore(
    (s) => s.setDatosDocumentos,
  );

  const completeAndAdvance = useOnboardingStore(
    (s) => s.completeAndAdvance,
  );

  const editStep = useOnboardingStore((s) => s.editStep);

  const vivienda = datosComplementarios?.vivienda;

  const documentoVivienda = vivienda
    ? DOCUMENTOS_VIVIENDA[vivienda]
    : null;

  const documentosPerfil =
    datosFinancieros?.perfilLaboral === "ASALARIADO"
      ? DOCUMENTOS_ASALARIADO
      : datosFinancieros?.perfilLaboral === "INDEPENDIENTE"
        ? DOCUMENTOS_INDEPENDIENTE
        : [];

  const esIndependiente =
    datosFinancieros?.perfilLaboral === "INDEPENDIENTE";

  const documentosFormalizacionNegocio =
    esIndependiente &&
    datosComplementarios?.negocioFormalizado === "SI"
      ? [DOCUMENTO_NEGOCIO_FORMALIZACION]
      : [];

  const documentoLocalNegocio =
    esIndependiente && datosComplementarios?.tipoLocalNegocio
      ? DOCUMENTOS_LOCAL_NEGOCIO[
          datosComplementarios.tipoLocalNegocio
        ] ?? null
      : null;

  const documentosPrestamos =
    (datosFinancieros?.numeroDeudas ?? 0) > 0
      ? DOCUMENTOS_PRESTAMOS
      : [];

  const documentosSegundoIngreso =
    datosFinancieros?.tieneSegundoIngreso
      ? [DOCUMENTO_SEGUNDO_INGRESO]
      : [];

  const documentosVehiculo =
    datosComplementarios?.tieneVehiculo === "SI"
      ? [DOCUMENTO_VEHICULO]
      : [];

  const documentosConfig: DocConfig[] = [
    ...DOCUMENTOS_BASE,
    ...documentosPerfil,
    ...(datosFinancieros?.perfilLaboral === "ASALARIADO"
      ? [DOCUMENTO_GESTORA, DOCUMENTO_CERTIFICADO_LABORAL]
      : []),
    ...documentosFormalizacionNegocio,
    ...(documentoLocalNegocio ? [documentoLocalNegocio] : []),
    ...documentosPrestamos,
    ...documentosSegundoIngreso,
    ...documentosVehiculo,
    DOCUMENTO_COMPROBANTE_DOMICILIO,
    ...(documentoVivienda ? [documentoVivienda] : []),
  ];

  const [archivos, setArchivos] =
    useState<Record<DocKey, File | null>>(estadoArchivosInicial);

  const [removidos, setRemovidos] =
    useState<Record<DocKey, boolean>>(estadoRemovidosInicial);

  const estaSubido = (key: DocKey) =>
    documentoEstaSubido(
      archivos[key],
      guardados?.[key],
      removidos[key],
    );

  const esAsalariado =
    datosFinancieros?.perfilLaboral === "ASALARIADO";

  const gestoraSubida =
    estaSubido("asalariadoGestora");

  const certificadoLaboralSubido =
    estaSubido("asalariadoCertificadoLaboral");

  const tieneRespaldoLaboralAlternativo =
    !esAsalariado ||
    gestoraSubida ||
    certificadoLaboralSubido;

  const estadoSubidos = documentosConfig.map((cfg) => {
    if (
      esAsalariado &&
      (cfg.key === "asalariadoGestora" ||
        cfg.key === "asalariadoCertificadoLaboral")
    ) {
      return tieneRespaldoLaboralAlternativo;
    }

    return estaSubido(cfg.key);
  });

  const primerIncompleto = estadoSubidos.findIndex((v) => !v);

  const limite =
    primerIncompleto === -1
      ? documentosConfig.length
      : primerIncompleto;

  const todoCompleto = primerIncompleto === -1;

  const documentosCompletos = estadoSubidos.filter(Boolean).length;
  const totalDocumentos = documentosConfig.length;

  const porcentajeDocumentos =
    totalDocumentos > 0
      ? Math.round((documentosCompletos / totalDocumentos) * 100)
      : 0;

  const seccionesVisibles = SECCIONES_DOCUMENTOS
    .map((seccion) => ({
      ...seccion,
      documentos: documentosConfig.filter(
        (cfg) => SECCION_POR_DOCUMENTO[cfg.key] === seccion.id,
      ),
    }))
    .filter((seccion) => seccion.documentos.length > 0);

  const onSelect = (key: DocKey, file: File) => {
    setArchivos((prev) => ({
      ...prev,
      [key]: file,
    }));

    setRemovidos((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const onRemove = (key: DocKey) => {
    setArchivos((prev) => ({
      ...prev,
      [key]: null,
    }));

    setRemovidos((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const onContinuar = () => {
    if (!todoCompleto) return;

    const datos = datosDocumentosVacios();

    for (const cfg of documentosConfig) {
      const archivo = archivos[cfg.key];

      if (archivo) {
        datos[cfg.key] = {
          nombre: archivo.name,
          tamanoBytes: archivo.size,
          tipo: archivo.type || "desconocido",
          subidoEn: new Date().toISOString(),
        };
      } else if (!removidos[cfg.key] && guardados?.[cfg.key]) {
        datos[cfg.key] = guardados[cfg.key];
      } else {
        datos[cfg.key] = null;
      }
    }

    setDatosDocumentos(datos);
    completeAndAdvance("carga-documentos");
  };

  return (
    <div>
      <div className="mb-7">
        <p className="max-w-2xl text-sm leading-6 text-body">
          Hemos preparado los documentos que necesitamos según la
          información que registraste durante tu solicitud.
        </p>

        <div className="mt-4 rounded-[20px] bg-surface-blue px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-primary-dark">
                {documentosCompletos} de {totalDocumentos} documentos listos
              </p>

              <p className="mt-1 text-xs leading-5 text-muted">
                Solo te mostramos lo que corresponde a tu solicitud.
              </p>
            </div>

            <span className="text-sm font-extrabold text-primary">
              {porcentajeDocumentos}%
            </span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${porcentajeDocumentos}%`,
              }}
            />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-muted">
            Los requisitos pueden variar según tu actividad, vivienda,
            préstamos, ingresos adicionales y bienes declarados.
          </p>
        </div>
      </div>

      <div className="space-y-9">
        {seccionesVisibles.map((seccion, sectionIndex) => (
          <section key={seccion.id}>
            <div
              className={
                sectionIndex === 0
                  ? "mb-4"
                  : "mb-4 border-t border-border-soft pt-8"
              }
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white">
                  {sectionIndex + 1}
                </span>

                <div>
                  <h3 className="text-base font-extrabold text-ink">
                    {seccion.titulo}
                  </h3>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-muted">
                    {seccion.descripcion}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {seccion.documentos.map((cfg, documentoIndex) => {
                const index = documentosConfig.findIndex(
                  (documento) => documento.key === cfg.key,
                );

                const esAlternativaLaboral =
                  cfg.key === "asalariadoGestora" ||
                  cfg.key === "asalariadoCertificadoLaboral";

                const mostrarCabeceraAlternativa =
                  cfg.key === "asalariadoGestora" &&
                  esAsalariado;

                const alternativaYaCumplida =
                  gestoraSubida ||
                  certificadoLaboralSubido;

                return (
                  <div key={cfg.key}>
                    {mostrarCabeceraAlternativa ? (
                      <div className="mb-4 rounded-[20px] bg-surface-blue px-5 py-4">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-extrabold text-primary-dark">
                              Respaldo laboral
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted">
                              Elige una de las siguientes opciones para
                              respaldar tu relación laboral.
                            </p>
                          </div>

                          {alternativaYaCumplida ? (
                            <span className="mt-2 inline-flex w-fit rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-primary sm:mt-0">
                              Requisito completo
                            </span>
                          ) : (
                            <span className="mt-2 inline-flex w-fit rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-muted sm:mt-0">
                              Elige una opción
                            </span>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {cfg.key === "asalariadoCertificadoLaboral" &&
                    esAsalariado ? (
                      <div className="my-3 flex items-center gap-3">
                        <div className="h-px flex-1 bg-border-soft" />
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted">
                          o
                        </span>
                        <div className="h-px flex-1 bg-border-soft" />
                      </div>
                    ) : null}

                    <DocumentoSlot
                      config={cfg}
                      file={archivos[cfg.key]}
                      metaGuardada={guardados?.[cfg.key]}
                      removidoLocal={removidos[cfg.key]}
                      locked={
                        esAlternativaLaboral
                          ? false
                          : index > limite &&
                            !(
                              cfg.key === "autorizacionBic" &&
                              documentosConfig[limite]?.key === "selfie"
                            )
                      }
                      onSelect={(file) => onSelect(cfg.key, file)}
                      onRemove={() => onRemove(cfg.key)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => editStep("referencias")}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <button
          type="button"
          onClick={onContinuar}
          disabled={!todoCompleto}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-accent px-6 text-[15px] font-bold text-white transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continuar con mi solicitud
          <ArrowRight
            className="h-4.5 w-4.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}
