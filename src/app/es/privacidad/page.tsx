import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo Prompt to Production procesa registros de despliegue, manifiestos de proyecto y analíticas de la web.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/es/privacidad",
    languages: { en: "/privacy", "es-ES": "/es/privacidad" },
  },
};

const sourceClass = "font-semibold text-cyan-800 underline underline-offset-4";

export default function SpanishPrivacyPage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Aviso de privacidad · 25 de septiembre de 2026"
      title="El registro de despliegue permanece en tu dispositivo."
      intro="Las herramientas de diagnóstico leen en tu navegador el texto o el manifiesto que eliges. Este aviso explica cómo funcionan y qué mediciones generales recoge el proveedor del sitio."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Registros de compilación y archivos del proyecto</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>El registro se analiza en el navegador. No se sube al sitio ni se envía a un servicio de IA.</li>
          <li>El texto de package.json que usas en el buscador de alojamiento se lee en el navegador y no se sube.</li>
          <li>El botón para copiar la instrucción de reparación solo copia el texto generado si lo pulsas. La instrucción no incluye el registro pegado.</li>
          <li>No pegues contraseñas, claves de API, tokens, URL privadas ni datos de clientes. Si copias una instrucción a otro servicio de IA, se aplicará la política de ese proveedor.</li>
          <li>La web no te pide conectar una cuenta de GitHub, Lovable, Bolt ni alojamiento.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Analíticas y alojamiento</h2>
        <p className="mt-3 text-base leading-7">La web se aloja en Vercel y utiliza Vercel Web Analytics y Speed Insights para medir visitas y rendimiento. Estos servicios pueden procesar URL de páginas, procedencia, fecha, información general del dispositivo o navegador, región y mediciones de rendimiento. Los datos introducidos en las herramientas y sus resultados no se envían a esas analíticas.</p>
        <p className="mt-3 text-base leading-7">Consulta la <a className={sourceClass} href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">documentación de privacidad de Vercel Analytics</a> y la <a className={sourceClass} href="https://vercel.com/docs/speed-insights" target="_blank" rel="noopener noreferrer">documentación de Speed Insights</a>.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Enlaces externos</h2>
        <p className="mt-3 text-base leading-7">Los enlaces a Lovable, Bolt, Vercel, Hostinger, DigitalOcean y otros servicios abren sus propias webs y políticas. No les enviamos el registro ni el manifiesto de tu proyecto.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Cambios</h2>
        <p className="mt-3 text-base leading-7">Si una herramienta empieza a guardar o enviar datos del proyecto, actualizaremos este aviso antes de incorporar ese comportamiento. Revisado el 25 de septiembre de 2026.</p>
      </section>
    </SitePageShell>
  );
}
