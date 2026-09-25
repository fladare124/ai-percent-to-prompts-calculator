import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Privacidad del comprobador CSV de Etsy",
  description: "Cómo se analizan los archivos CSV de Etsy en tu navegador y qué datos generales recogen las analíticas del sitio.",
  alternates: {
    canonical: "/es/privacidad",
    languages: { en: "/privacy", "es-ES": "/es/privacidad" },
  },
};

export default function SpanishPrivacyPage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Privacidad · 25 de septiembre de 2026"
      title="El CSV de tu tienda se analiza en tu navegador."
      intro="El comprobador de anuncios de Etsy lee en tu dispositivo el archivo que eliges. No necesitas iniciar sesión en Etsy ni subir el archivo a esta web."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Archivos CSV y resultados</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>El archivo CSV se lee y analiza en la pestaña del navegador. No se sube ni se guarda en el servidor del sitio.</li>
          <li>Los títulos, descripciones, etiquetas, materiales, SKU, URL de imágenes, nombres de archivo, valores del formulario de comisiones y resultados no se envían a las analíticas.</li>
          <li>El informe se genera en el dispositivo y se descarga directamente desde el navegador.</li>
          <li>La instrucción para revisar un anuncio aparece y se copia solo si eliges esa acción. Si la pegas en un servicio de IA, se aplicará la política de privacidad de ese proveedor.</li>
          <li>No pedimos conectar una cuenta de Etsy, introducir una contraseña, ni enviar tu nombre o correo electrónico.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Calculadora de comisiones</h2>
        <p className="mt-3 text-base leading-7">Los datos que introduces en la calculadora de comisiones se procesan en tu navegador. No enviamos a las analíticas los importes, valores introducidos ni resultados calculados.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Analíticas y alojamiento</h2>
        <p className="mt-3 text-base leading-7">El sitio está alojado en Vercel y utiliza Vercel Web Analytics y Speed Insights para medir visitas a páginas y rendimiento. Estos servicios pueden procesar una URL de página, procedencia, fecha, información general del dispositivo o navegador, región y medidas de rendimiento. El sitio no envía el contenido del CSV, títulos, etiquetas, precios ni resultados a las analíticas.</p>
        <p className="mt-3 text-base leading-7">Consulta la <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">documentación de privacidad de Vercel Analytics</a> y la <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://vercel.com/docs/speed-insights" target="_blank" rel="noopener noreferrer">documentación de Speed Insights</a>.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Enlaces externos</h2>
        <p className="mt-3 text-base leading-7">Los enlaces a Etsy, eRank y otros servicios abren sus propias webs, sujetas a sus avisos de privacidad. No enviamos allí el archivo CSV, los resultados de la revisión ni los datos que introduzcas en la calculadora.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Cambios en este aviso</h2>
        <p className="mt-3 text-base leading-7">Si la herramienta empieza a enviar o guardar datos del CSV u otra información que ahora se procesa localmente, actualizaremos este aviso antes de incorporar ese comportamiento. Revisado el 25 de septiembre de 2026.</p>
      </section>
    </SitePageShell>
  );
}
