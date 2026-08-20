"use client";

import HeroKivoImage from "@/components/ui/HeroKivoImage";
import { useState } from "react";
import Image from "next/image";

import {
  BadgeCheck,
  Bell,
  ChevronRight,
  Download,
  FileText,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";

import { CustomSelect } from "@/components/ui/CustomSelect";
import { DATOS_CAPTURADOS,
  WHATSAPP_KIVO
} from "@/lib/kivo/datos";

type IconoPerfil = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

function TarjetaPerfil({
  titulo,
  icono: Icono,
  children,
  accion,
  onAccion,
}: {
  titulo: string;
  icono: IconoPerfil;
  children: React.ReactNode;
  accion?: string;
  onAccion?: () => void;
}) {
  return (
    <section className="rounded-[24px] border border-[#E5EEF3] bg-white">
      <div className="flex items-start gap-4 p-5 sm:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-blue text-primary-dark">
          <Icono className="h-5 w-5" strokeWidth={2.2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-extrabold tracking-tight text-ink">
                {titulo}
              </h2>
            </div>

            {accion ? (
              <button
                type="button"
                onClick={onAccion}
                className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-[13px] font-extrabold text-primary-dark transition-colors hover:bg-surface-blue"
              >
                {accion}
                <ChevronRight className="h-4 w-4" strokeWidth={2.3} />
              </button>
            ) : null}
          </div>

          <div className="mt-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Campo({
  label,
  valor,
  icono: Icono,
}: {
  label: string;
  valor: string;
  icono?: IconoPerfil;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      {Icono ? (
        <Icono
          className="mt-0.5 h-4 w-4 shrink-0 text-cerulean"
          strokeWidth={2}
        />
      ) : null}

      <div className="min-w-0">
        <p className="text-[11px] font-bold text-muted">{label}</p>
        <p className="mt-0.5 break-words text-[13.5px] font-bold leading-5 text-ink">
          {valor}
        </p>
      </div>
    </div>
  );
}

export default function PerfilView() {
  const [usuarioDemo, setUsuarioDemo] = useState<"hugo" | "maria">("hugo");

  const usuarioCompleto = usuarioDemo === "hugo";

  const nombreUsuario = usuarioCompleto
    ? "Hugo Soliz Vedia"
    : "María Fernanda López";

  const inicialesUsuario = usuarioCompleto ? "HS" : "MF";
  const ciUsuario = usuarioCompleto ? "1234567" : "6845123";
  const porcentajePerfil = usuarioCompleto ? 100 : 62;
  const [modalEdicion, setModalEdicion] = useState<
    "perfil" | "personales" | "contacto" | "preferencias" | null
  >(null);

  const [nombreMock, setNombreMock] = useState("María Fernanda López");
  const [ciudadMock, setCiudadMock] = useState("La Paz");
  const [celularMock, setCelularMock] = useState("71234567");
  const [correoMock, setCorreoMock] = useState("usuario@correo.com");
  const [direccionMock, setDireccionMock] = useState(
    "Av. 6 de Agosto, La Paz",
  );
  const [fechaNacimientoMock, setFechaNacimientoMock] =
    useState("15/05/1990");
  const [estadoCivilMock, setEstadoCivilMock] = useState("Soltero");
  const [notificacionesMock, setNotificacionesMock] = useState(true);
  const [canalMock, setCanalMock] = useState("WhatsApp");

  const [modalPassword, setModalPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmacion, setPasswordConfirmacion] = useState("");
  const [passwordActualizada, setPasswordActualizada] = useState(false);
  const bloques = Object.entries(DATOS_CAPTURADOS);

  const personales = bloques[0]?.[1] ?? [];
  const contacto = bloques[1]?.[1] ?? [];
  const documentos = bloques[2]?.[1] ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* USUARIOS MOCK · SOLO DEMO */}
      <div className="flex">
        <div className="inline-flex items-center gap-1 rounded-[12px] border border-[#E5EEF3] bg-white p-1">
          <button
            type="button"
            onClick={() => setUsuarioDemo("hugo")}
            className={`w-[68px] rounded-[9px] px-2 py-1.5 text-center transition-colors ${
              usuarioDemo === "hugo"
                ? "bg-black text-white"
                : "text-[#7A8B96] hover:bg-[#F7FAFC]"
            }`}
          >
            <span className="text-[10px] font-extrabold">
              Hugo
            </span>
          </button>

          <button
            type="button"
            onClick={() => setUsuarioDemo("maria")}
            className={`w-[68px] rounded-[9px] px-2 py-1.5 text-center transition-colors ${
              usuarioDemo === "maria"
                ? "bg-[#FE9806] text-white"
                : "text-[#7A8B96] hover:bg-[#FFF8F1]"
            }`}
          >
            <span className="text-[10px] font-extrabold">
              María
            </span>
          </button>

        </div>
      </div>

      {/* CABECERA */}
      <section className="overflow-hidden rounded-[26px] border border-[#E9F0F6] bg-white">
        <div className="relative overflow-hidden px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
          <HeroKivoImage />

          <div className="relative z-10 mt-8 flex max-w-[760px] items-center gap-5">
            <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-black text-[22px] font-extrabold text-white">
              {inicialesUsuario}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#03AEFE]">
                Mi perfil
              </p>

              <h1 className="mt-2 truncate text-2xl font-extrabold tracking-tight text-ink sm:text-[30px] sm:leading-[1.15]">
                {nombreUsuario}
              </h1>

              <p className="mt-2 text-sm font-medium text-[#6A7F94]">
                CI {ciUsuario} · {ciudadMock}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10.5px] font-extrabold text-white">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    usuarioCompleto
                      ? "bg-[#5FDAF8]"
                      : "bg-[#FE9806]"
                  }`}
                />

                {usuarioCompleto
                  ? "Tu perfil está completo"
                  : "Perfil 62% completo"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {!usuarioCompleto ? (
        <>
          {/* PERFIL INCOMPLETO */}
          <section className="overflow-hidden rounded-[24px] border border-[#FFD8B2] bg-[#FFF8F1]">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FE9806] text-white">
                      <UserRound className="h-5 w-5" strokeWidth={2.2} />
                    </div>

                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#B85B00]">
                        Acción pendiente
                      </p>

                      <h2 className="mt-0.5 text-[17px] font-extrabold tracking-tight text-ink">
                        Completa tu perfil
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-body">
                    Necesitamos algunos datos adicionales para mantener tu información actualizada.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#B85B00]">
                      Dirección pendiente
                    </span>

                    <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#B85B00]">
                      Estado civil pendiente
                    </span>

                    <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#B85B00]">
                      Preferencias sin configurar
                    </span>
                  </div>
                </div>

                <div className="w-full shrink-0 lg:w-[220px]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-muted">
                      Perfil completado
                    </span>

                    <span className="text-[13px] font-extrabold text-ink">
                      62%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full w-[62%] rounded-full bg-[#FE9806]" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalEdicion("personales")}
                    className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink px-4 text-[13px] font-extrabold text-white transition-colors hover:bg-[#17181C]"
                  >
                    Completar datos
                    <ChevronRight className="h-4 w-4" strokeWidth={2.3} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {/* ACTUALIZACION DE DATOS */}
      <section className="rounded-[24px] border border-[#DCE7EC] bg-[#F7FAFC] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-blue text-primary-dark">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-[16px] font-extrabold tracking-tight text-ink">
                ¿Necesitas actualizar tus datos?
              </h2>

              <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-muted">
                Por tu seguridad, los datos registrados no pueden modificarse
                directamente desde tu perfil. Para solicitar una actualización,
                comunícate con Atención al Cliente y presenta los documentos de
                respaldo correspondientes.
              </p>
            </div>
          </div>

          <a
            href={WHATSAPP_KIVO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink px-5 text-[13px] font-extrabold text-white transition-colors hover:bg-[#17181C]"
          >
            Contactar Atención al Cliente
            <ChevronRight className="h-4 w-4" strokeWidth={2.3} />
          </a>
        </div>
      </section>

      {/* DATOS PERSONALES */}
      <TarjetaPerfil
        titulo="Datos personales"
        icono={UserRound}
      >
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {personales.map((campo) => (
            <Campo
              key={campo.etiqueta}
              label={campo.etiqueta}
              valor={campo.valor}
            />
          ))}
        </div>
      </TarjetaPerfil>

      {/* CONTACTO */}
      <TarjetaPerfil
        titulo="Información de contacto"
        icono={Phone}
      >
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {contacto.map((campo, index) => (
            <Campo
              key={campo.etiqueta}
              label={campo.etiqueta}
              valor={campo.valor}
              icono={
                index === 0
                  ? Phone
                  : index === 1
                    ? Mail
                    : MapPin
              }
            />
          ))}
        </div>
      </TarjetaPerfil>

      {/* DOCUMENTOS */}
      <TarjetaPerfil
        titulo="Mis documentos"
        icono={FileText}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              titulo: "Carnet — frontal",
              imagen: "/carnet.png",
              alt: "Carnet de identidad parte frontal",
            },
            {
              titulo: "Carnet — posterior",
              imagen: "/carnetes.png",
              alt: "Carnet de identidad parte posterior",
            },
            {
              titulo: "Selfie con carnet",
              imagen: "/selfie.png",
              alt: "Selfie sosteniendo el carnet de identidad",
            },
          ].map((documento) => (
            <article
              key={documento.titulo}
              className="overflow-hidden rounded-[20px] border border-[#E5EEF3] bg-white"
            >
              <div className="relative aspect-[4/3] bg-[#F7FAFC]">
                <Image
                  src={documento.imagen}
                  alt={documento.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain p-3"
                />
              </div>

              <div className="border-t border-[#E5EEF3] px-4 py-3">
                <p className="text-[13.5px] font-extrabold text-ink">
                  {documento.titulo}
                </p>
              </div>
            </article>
          ))}
        </div>
      </TarjetaPerfil>

      {/* SEGURIDAD */}
      <TarjetaPerfil
        titulo="Seguridad y acceso"
        icono={ShieldCheck}
        accion="Administrar"
      >
        <button
          type="button"
          onClick={() => setModalPassword(true)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl bg-[#F7FAFC] p-4 text-left sm:max-w-md"
        >
          <div className="flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 shrink-0 text-cerulean" />

            <div>
              <p className="text-[13px] font-extrabold text-ink">
                Cambiar contraseña
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Actualiza tu contraseña de acceso
              </p>
            </div>
          </div>

          <ChevronRight
            className="h-4 w-4 shrink-0 text-muted"
            strokeWidth={2.2}
          />
        </button>
      </TarjetaPerfil>

      {/* PREFERENCIAS */}
      <TarjetaPerfil
        titulo="Preferencias"
        icono={SlidersHorizontal}
        accion="Configurar"
        onAccion={() => setModalEdicion("preferencias")}
      >
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <Campo
            label="Notificaciones"
            valor={notificacionesMock ? "Activadas" : "Desactivadas"}
            icono={Bell}
          />

          <Campo
            label="Canal preferido"
            valor={canalMock}
            icono={MessageCircle}
          />

        </div>
      </TarjetaPerfil>

      {modalEdicion ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[500px] rounded-[26px] border border-[#E5EEF3] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
                  Mi perfil
                </p>

                <h2 className="mt-1 text-[21px] font-extrabold tracking-tight text-ink">
                  {modalEdicion === "perfil"
                    ? "Editar perfil"
                    : modalEdicion === "personales"
                      ? "Editar datos personales"
                      : modalEdicion === "contacto"
                        ? "Actualizar información de contacto"
                        : "Configurar preferencias"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalEdicion(null)}
                aria-label="Cerrar"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-[#F5F7FA] text-muted transition-colors hover:bg-surface-blue hover:text-primary-dark"
              >
                <X className="h-4 w-4" strokeWidth={2.3} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {modalEdicion === "perfil" ? (
                <>
                  <label className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Nombre completo
                    </span>

                    <input
                      type="text"
                      value={nombreMock}
                      onChange={(e) => setNombreMock(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Carnet de identidad
                    </span>

                    <input
                      type="text"
                      value="1234567"
                      disabled
                      className="mt-2 h-12 w-full cursor-not-allowed rounded-xl border border-[#E5EEF3] bg-[#F5F7FA] px-4 text-sm text-muted"
                    />

                    <span className="mt-1.5 block text-[11px] text-muted">
                      El carnet es un dato de identidad y no puede modificarse desde aquí.
                    </span>
                  </label>

                  <label className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Ciudad
                    </span>

                    <select
                      value={ciudadMock}
                      onChange={(e) => setCiudadMock(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                    >
                      <option>La Paz</option>
                      <option>El Alto</option>
                    </select>
                  </label>
                </>
              ) : null}

              {modalEdicion === "personales" ? (
                <>
                  <label className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Fecha de nacimiento
                    </span>

                    <input
                      type="text"
                      value={fechaNacimientoMock}
                      onChange={(e) =>
                        setFechaNacimientoMock(e.target.value)
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Estado civil
                    </span>

                    <select
                      value={estadoCivilMock}
                      onChange={(e) => setEstadoCivilMock(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                    >
                      <option>Soltero</option>
                      <option>Casado</option>
                      <option>Divorciado</option>
                      <option>Viudo</option>
                      <option>Conviviente</option>
                    </select>
                  </label>

                  <div className="rounded-xl bg-surface-blue px-4 py-3">
                    <p className="text-xs leading-5 text-body">
                      Tu nombre y carnet se mantienen bloqueados porque forman parte de tu identidad verificada.
                    </p>
                  </div>
                </>
              ) : null}

              {modalEdicion === "contacto" ? (
                <>
                  <label className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Celular
                    </span>

                    <input
                      type="tel"
                      value={celularMock}
                      onChange={(e) => setCelularMock(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Correo electrónico
                    </span>

                    <input
                      type="email"
                      value={correoMock}
                      onChange={(e) => setCorreoMock(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Dirección
                    </span>

                    <input
                      type="text"
                      value={direccionMock}
                      onChange={(e) => setDireccionMock(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                    />
                  </label>
                </>
              ) : null}

              {modalEdicion === "preferencias" ? (
                <>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F7FAFC] p-4">
                    <div>
                      <p className="text-[13px] font-extrabold text-ink">
                        Notificaciones
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        Recibe novedades sobre tu préstamo.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setNotificacionesMock(!notificacionesMock)
                      }
                      className={`relative h-7 w-12 rounded-full transition-colors ${
                        notificacionesMock
                          ? "bg-primary"
                          : "bg-[#DCE6EC]"
                      }`}
                      aria-pressed={notificacionesMock}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                          notificacionesMock
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="block">
                    <span className="text-[12px] font-bold text-ink">
                      Canal preferido
                    </span>

                    <div className="mt-2">
                      <CustomSelect
                        value={canalMock}
                        onChange={setCanalMock}
                        ariaLabel="Canal preferido"
                        options={[
                          {
                            value: "WhatsApp",
                            label: "WhatsApp",
                          },
                          {
                            value: "Correo electrónico",
                            label: "Correo electrónico",
                          },
                          {
                            value: "SMS",
                            label: "SMS",
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <p className="text-xs leading-5 text-muted">
                    Usaremos este canal como primera opción para comunicarte novedades importantes.
                  </p>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalEdicion(null)}
                className="min-h-11 cursor-pointer rounded-xl px-5 text-sm font-bold text-muted transition-colors hover:bg-[#F5F7FA]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => setModalEdicion(null)}
                className="min-h-11 cursor-pointer rounded-xl bg-primary px-5 text-sm font-extrabold text-white transition-colors hover:bg-primary-dark"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {modalPassword ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cambiar-password-title"
        >
          <div className="w-full max-w-[460px] rounded-[26px] border border-[#E5EEF3] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-primary">
                  Seguridad
                </p>

                <h2
                  id="cambiar-password-title"
                  className="mt-1 text-[21px] font-extrabold tracking-tight text-ink"
                >
                  Cambiar contraseña
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Ingresa tu contraseña actual y crea una nueva contraseña.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModalPassword(false);
                  setPasswordActualizada(false);
                }}
                aria-label="Cerrar"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-[#F5F7FA] text-muted transition-colors hover:bg-surface-blue hover:text-primary-dark"
              >
                <X className="h-4 w-4" strokeWidth={2.3} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="text-[12px] font-bold text-ink">
                  Contraseña actual
                </span>

                <input
                  type="password"
                  value={passwordActual}
                  onChange={(event) =>
                    setPasswordActual(event.target.value)
                  }
                  placeholder="Ingresa tu contraseña actual"
                  className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="text-[12px] font-bold text-ink">
                  Nueva contraseña
                </span>

                <input
                  type="password"
                  value={passwordNueva}
                  onChange={(event) =>
                    setPasswordNueva(event.target.value)
                  }
                  placeholder="Mínimo 6 caracteres"
                  className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="text-[12px] font-bold text-ink">
                  Confirmar nueva contraseña
                </span>

                <input
                  type="password"
                  value={passwordConfirmacion}
                  onChange={(event) =>
                    setPasswordConfirmacion(event.target.value)
                  }
                  placeholder="Repite la nueva contraseña"
                  className="mt-2 h-12 w-full rounded-xl border border-[#DCE6EC] bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-primary"
                />
              </label>
            </div>

            {passwordNueva &&
            passwordConfirmacion &&
            passwordNueva !== passwordConfirmacion ? (
              <p className="mt-3 text-xs font-bold text-red-600">
                Las contraseñas no coinciden.
              </p>
            ) : null}

            {passwordActualizada ? (
              <div className="mt-4 rounded-xl bg-surface-blue px-4 py-3">
                <p className="text-sm font-extrabold text-primary-dark">
                  Contraseña actualizada correctamente.
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setModalPassword(false);
                  setPasswordActualizada(false);
                }}
                className="min-h-11 cursor-pointer rounded-xl px-5 text-sm font-bold text-muted transition-colors hover:bg-[#F5F7FA]"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={
                  !passwordActual ||
                  passwordNueva.length < 6 ||
                  passwordNueva !== passwordConfirmacion
                }
                onClick={() => {
                  setPasswordActualizada(true);

                  setTimeout(() => {
                    setModalPassword(false);
                    setPasswordActualizada(false);
                    setPasswordActual("");
                    setPasswordNueva("");
                    setPasswordConfirmacion("");
                  }, 1000);
                }}
                className="min-h-11 cursor-pointer rounded-xl bg-primary px-5 text-sm font-extrabold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Actualizar contraseña
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
