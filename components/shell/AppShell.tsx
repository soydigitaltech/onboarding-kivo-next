"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  FileText,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Route as RouteIcon,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Avatar from "boring-avatars";

import { WHATSAPP_KIVO } from "@/lib/kivo/datos";

type ItemNav = {
  label: string;
  href: string;
  icono: LucideIcon;
  pill?: string;
  pillTono?: "naranja" | "azul";
};

const GRUPOS: { titulo: string; items: ItemNav[] }[] = [
  {
    titulo: "Principal",
    items: [
      { label: "Tablero", href: "/dashboard", icono: LayoutDashboard },
      { label: "Mi perfil", href: "/perfil", icono: UserRound, pill: "62%", pillTono: "azul" },
    ],
  },
  {
    titulo: "Mi solicitud",
    items: [
      { label: "Estado y seguimiento", href: "/seguimiento", icono: RouteIcon },
      { label: "Documentos", href: "/documentos", icono: FileText, pill: "2" },
      { label: "Mensajes", href: "/mensajes", icono: MessageSquare, pill: "3" },
    ],
  },
  {
    titulo: "Mi préstamo",
    items: [
      { label: "Cuotas y pagos", href: "/cuotas", icono: CalendarClock, pill: "1" },
      { label: "Mis comprobantes", href: "/comprobantes", icono: Receipt },
      //{ label: "Simulador", href: "/onboarding", icono: Calculator },//
    ],
  },
];

export default function AppShell({
  children,
  subtitulo,
}: {
  children: ReactNode;
  subtitulo: string;
}) {
  const [mini, setMini] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();

  const anchoMenu = mini ? "lg:w-20" : "lg:w-[250px]";

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    window.location.href = "https://www.kivocash.com/";
  };

  return (
    <div className="min-h-screen bg-[#F5F9FC]">
      {/* Modal de cierre de sesión */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-[#E9F0F6]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EAF7FE] flex items-center justify-center">
                <UserRound className="h-8 w-8 text-primary" strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-extrabold text-ink mb-2">¿Cerrar sesión?</h3>
              <p className="text-[#6A7F94] mb-6">
                Estás a punto de cerrar tu sesión en Kivo. ¿Estás seguro de que quieres salir?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-[#E9F0F6] px-4 py-3 text-sm font-extrabold text-[#43596F] transition hover:bg-[#F5F9FC]"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-extrabold text-white transition hover:brightness-105 shadow-[0_12px_24px_-14px_rgba(254,152,6,0.4)]"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* velo del cajón en móvil */}
      {drawer && (
        <button
          aria-label="Cerrar menú"
          onClick={() => setDrawer(false)}
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
        />
      )}

      {/* ───── Menú mejorado ───── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col overflow-y-auto bg-white border-r border-[#E9F0F6] px-3.5 pb-8 pt-5 transition-transform duration-200 lg:translate-x-0 ${anchoMenu} ${
          drawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative">
          <button
            onClick={() => setMini((v) => !v)}
            aria-label={mini ? "Mostrar menú" : "Ocultar menú"}
            className={`hidden h-7 w-7 place-items-center rounded-[9px] bg-[#F5F9FC] text-[#6A7F94] transition hover:bg-[#EAF7FE] hover:text-primary-dark lg:grid ${
              mini ? "mx-auto mb-3" : "absolute right-1 top-1"
            }`}
          >
            {mini ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <div className={`flex min-h-14 items-center gap-3 pb-5 ${mini ? "lg:justify-center lg:px-0" : "px-2"}`}>
          {/* Logo más grande - sin texto Kivo */}
          <img src="/kivo-tablero.svg" alt="Kivo" className="h-8 w-auto" />
        </div>

        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo}>
            <p
              className={`px-3 pb-1.5 pt-3.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-[#9DAEBF] ${
                mini ? "lg:opacity-0" : ""
              }`}
            >
              {grupo.titulo}
            </p>

            {grupo.items.map((item) => {
              const base = item.href.split("#")[0];
              const activo = !item.href.includes("#") && pathname === base;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setDrawer(false)}
                  className={`group mb-0.5 flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[14.5px] font-semibold transition ${
                    activo
                      ? "bg-primary text-white shadow-sm"
                      : "text-[#43596F] hover:bg-[#EAF7FE] hover:text-primary-dark"
                  } ${mini ? "lg:justify-center lg:px-0" : ""}`}
                >
                  <item.icono className="h-[18px] w-[18px] shrink-0" strokeWidth={1.9} />
                  <span className={mini ? "lg:hidden" : ""}>{item.label}</span>

                  {item.pill && (
                    <span
                      className={`ml-auto rounded-full px-2 py-px text-[11px] font-extrabold ${
                        activo
                          ? "bg-white/20 text-white"
                          : item.pillTono === "azul"
                            ? "bg-[#EAF7FE] text-primary-dark"
                            : "bg-[#FFF5E4] text-[#B0730B]"
                      } ${mini ? "lg:hidden" : ""}`}
                    >
                      {item.pill}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        <div className={`mt-auto pt-5 ${mini ? "lg:hidden" : ""}`}>
          <div className="rounded-[20px] border border-[#E9F0F6] bg-[#F5F9FC] p-3.5 text-[12.5px] text-[#6A7F94]">
            <b className="mb-1 block text-[13.5px] text-primary-dark">¿Necesitas ayuda?</b>
            Escríbenos por WhatsApp al +591 777 53433, de lunes a sábado.
            <a
              href={WHATSAPP_KIVO}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-2 rounded-[11px] bg-accent px-3 py-2 text-[13px] font-extrabold text-white shadow-[0_12px_24px_-14px_rgba(254,152,6,1)] transition hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </aside>

      {/* ───── Contenido ───── */}
      <div className={`transition-[padding] duration-200 ${mini ? "lg:pl-20" : "lg:pl-[250px]"}`}>
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#E9F0F6] bg-white px-4 py-3 sm:px-7">
          <button
            onClick={() => setDrawer(true)}
            aria-label="Abrir menú"
            className="grid h-9 w-9 place-items-center rounded-[13px] border border-[#E9F0F6] text-[#4E657C] lg:hidden"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>

          {/* Avatar de Boring Avatars - Colores Kivo */}
          <div className="h-9 w-9 rounded-[13px] overflow-hidden">
            <Avatar
              size={36}
              name="Jale y Se Real"
              variant="beam"
              colors={["#FE9806", "#1B5BB6", "#44A3DA", "#5FDAF8", "#03AEFE"]}
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-extrabold tracking-tight">
               ¡Hola, cliente Kivo!
            </h1>
            <p className="truncate text-[13px] text-[#6A7F94]">{subtitulo}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Solo botón de cerrar sesión */}
            <button
              onClick={handleLogout}
              className="text-[13px] font-bold text-[#6A7F94] transition hover:text-accent"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1340px] px-4 pb-20 pt-6 sm:px-7">{children}</main>
      </div>
    </div>
  );
}