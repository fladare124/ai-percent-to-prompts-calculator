import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo tratamos los registros de despliegue, las opciones del buscador de alojamiento y las analíticas del sitio.",
  alternates: {
    canonical: "/es/privacidad",
    languages: { en: "/privacy", es: "/es/privacidad" },
  },
};

export default function SpanishPrivacyPage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Aviso de privacidad · 25 de septiembre de 2026"
      title="La herramienta no necesita tus cuentas ni tu código fuente."
      intro="El análisis opcional del registro de compilación, las elecciones del buscador de alojamiento y la detección del framework se ejecutan en esta página. No pedimos acceso a repositorios, cuentas de alojamiento ni servicios de pago."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Análisis del registro de despliegue</h2>
        <p className="mt-3 text-base leading-7">Si pegas un registro en la herramienta, el navegador compara el texto con patrones de errores habituales. Este sitio no sube, guarda ni envía el registro a un servicio de IA. Borra el texto al terminar y elimina claves, contraseñas, tokens y direcciones privadas antes de pegarlo. Vercel Web Analytics y Speed Insights miden el uso y el rendimiento del sitio; la herramienta no envía el texto pegado ni el diagnóstico a las analíticas.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Opciones del buscador y package.json</h2>
        <p className="mt-3 text-base leading-7">El buscador procesa tus opciones en el navegador y no las envía ni almacena. Si pegas package.json, la página comprueba allí los nombres de dependencias y no sube ni guarda el texto. El sitio no recibe el código fuente, nombres de repositorios ni credenciales.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Analíticas y alojamiento</h2>
        <p className="mt-3 text-base leading-7">El sitio está alojado en Vercel y utiliza Vercel Web Analytics y Speed Insights para medir el uso y el rendimiento. Estos servicios pueden procesar las direcciones de las páginas, el sitio de procedencia, una región aproximada e información general del dispositivo, el navegador o el rendimiento. No enviamos a las analíticas las opciones del buscador, el texto pegado ni los diagnósticos.</p>
        <p className="mt-3 text-base leading-7">Consulta la <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">política de privacidad de Vercel Analytics</a> y la <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://vercel.com/docs/speed-insights" target="_blank" rel="noopener noreferrer">documentación de Speed Insights</a>.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Enlaces externos</h2>
        <p className="mt-3 text-base leading-7">Los enlaces de los proveedores abren sitios externos. Sus propios avisos de privacidad y condiciones se aplican cuando sales de esta web. No recibimos tus respuestas del formulario ni los datos de tus cuentas.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Cambios en este aviso</h2>
        <p className="mt-3 text-base leading-7">Si la herramienta empieza a enviar o guardar registros, elecciones, código fuente u otros datos personales, actualizaremos este aviso antes de incorporar ese comportamiento. Revisado el 25 de septiembre de 2026.</p>
      </section>
    </SitePageShell>
  );
}
