import AppShell from "@/components/shell/AppShell";

export default function DocumentosPage() {
 return (
 <AppShell subtitulo="Documentos y requisitos de tu solicitud">
 <section className="rounded-2xl border border-[#E9F0F6] bg-white p-5 sm:p-7">
 <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
 Documentos
 </p>

 <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
 Tus documentos
 </h2>

 <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6A7F94]">
 Revisa los documentos enviados, los requisitos pendientes y las
 observaciones realizadas por Kivo.
 </p>

 <div className="mt-6 rounded-2xl border border-dashed border-[#D7E2EC] bg-[#F8FBFD] p-8 text-center">
 <p className="text-sm font-bold text-ink">
 Tus documentos aparecerán aquí
 </p>

 <p className="mt-1 text-sm text-[#6A7F94]">
 Luego agregaremos estados como cargado, observado, aprobado y
 pendiente.
 </p>
 </div>
 </section>
 </AppShell>
 );
}
