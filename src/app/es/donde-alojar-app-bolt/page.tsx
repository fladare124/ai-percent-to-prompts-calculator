import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/es/donde-alojar-app-bolt";
const english = "/where-to-host-bolt-app";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Dónde alojar una app de Bolt.new: Bolt Cloud y alternativas",
  description:
    "Compara Bolt Cloud, Hostinger, Vercel y DigitalOcean para una app de Bolt.new según framework, servicios, flujo con GitHub y coste total.",
  alternates: {
    canonical,
    languages: { en: english, es: canonical },
  },
  openGraph: {
    title: "¿Dónde alojar una app de Bolt.new?",
    description: "Decide si mantener Bolt Cloud o mover la app según su arquitectura y servicios.",
    url: canonical,
    locale: "es_ES",
    type: "article",
  },
};

export default function DondeAlojarAppBoltPage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Comparativa de hosting para Bolt.new · revisada el 25 de septiembre de 2026"
      title="¿Dónde conviene alojar una app de Bolt.new?"
      intro="Bolt ya incluye una opción para publicar, así que otro alojamiento solo compensa si encaja mejor con la app o con tu forma de trabajar. Compara Bolt Cloud, Hostinger, Vercel y DigitalOcean según el framework, los servicios y el trabajo necesario para migrar."
    >
      <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Recomendación rápida</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Mantén una app que funciona en Bolt Cloud si su hosting, base de datos y opciones de dominio cubren tus necesidades. Compara otro proveedor si necesitas un runtime o flujo de despliegue concreto, o ya gestionas los servicios de la app en otro lugar. Cambiar el frontend no mueve la base de datos ni la autenticación.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-5 py-4 text-xl font-semibold text-zinc-950">Compara las opciones de alojamiento</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Opción</th>
                <th className="px-5 py-3 font-semibold">Cuándo encaja</th>
                <th className="px-5 py-3 font-semibold">Qué comprobar</th>
                <th className="px-5 py-3 font-semibold">Información oficial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Bolt Cloud</th>
                <td className="px-5 py-4 align-top text-zinc-600">Quieres publicar desde el mismo espacio de trabajo y usar los servicios de la app conectados a Bolt.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Bolt indica que cualquier usuario puede publicar en una dirección <code>.bolt.host</code>; los dominios propios están disponibles en planes de pago. Comprueba los límites y condiciones actuales.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://support.bolt.new/get-started/intro-bolt" target="_blank" rel="noopener noreferrer">Hosting y dominios de Bolt</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Hosting Node.js de Hostinger</th>
                <td className="px-5 py-4 align-top text-zinc-600">Tienes el proyecto en GitHub y quieres desplegar Node.js desde un panel administrado.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Las apps Node.js requieren un plan Business Web o Cloud compatible. Confirma el framework, la compilación, la base de datos, los límites de tráfico y el precio de renovación.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://www.hostinger.com/web-apps-hosting/bolt-hosting" target="_blank" rel="noopener noreferrer">Opciones para Bolt</a><br /><a className={linkClass} href="https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/" target="_blank" rel="noopener noreferrer">Requisitos de Node.js</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Vercel</th>
                <td className="px-5 py-4 align-top text-zinc-600">El proyecto exportado es un frontend Vite u otro framework compatible, y te sirve desplegarlo desde Git.</td>
                <td className="px-5 py-4 align-top text-zinc-600">La guía de Vercel cubre el despliegue de Vite; no migra por sí sola la base de datos, la autenticación ni los secretos de Bolt. Comprueba aparte los requisitos del servidor.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://vercel.com/docs/frameworks/frontend/vite" target="_blank" rel="noopener noreferrer">Vite en Vercel</a><br /><a className={linkClass} href="https://vercel.com/pricing" target="_blank" rel="noopener noreferrer">Planes de Vercel</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">DigitalOcean App Platform</th>
                <td className="px-5 py-4 align-top text-zinc-600">La app necesita servicios web, procesos en segundo plano, contenedores o una base de datos administrada.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Calcula la factura completa sumando cada componente, base de datos, transferencia de datos y almacenamiento.</td>
                <td className="px-5 py-4 align-top"><Link className={linkClass} href="/digitalocean-app-platform">Guía de costes</Link><br /><a className={linkClass} href="https://www.digitalocean.com/pricing/app-platform" target="_blank" rel="noopener noreferrer">Precios oficiales</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Comprueba la app antes de pagar otro hosting</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-6 text-base leading-7">
          <li><strong>Identifica el tipo de proyecto:</strong> revisa el framework y los scripts de <code>package.json</code>. Un frontend estático y un servidor Node.js necesitan alojamientos distintos.</li>
          <li><strong>Enumera los servicios:</strong> apunta dónde funcionan la base de datos, la autenticación, el almacenamiento de archivos, el correo y las tareas programadas.</li>
          <li><strong>Comprueba el plan y el coste total:</strong> incluye servidor, datos, almacenamiento, tráfico, dominio y precio de renovación.</li>
          <li><strong>Haz una prueba antes del cambio:</strong> despliega una copia y comprueba el inicio de sesión, los datos guardados, los formularios y el dominio antes de enviar visitantes.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Migra la base de datos por separado</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Cambiar de hosting solo mueve el código si lo despliegas allí; no copia los registros de producción ni cambia por sí solo la autenticación. Bolt advierte que sustituir una conexión de base de datos puede causar pérdida de datos. Haz una copia de seguridad y sigue los pasos de migración antes de cambiar una app activa.</p>
        <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://support.bolt.new/cloud/database/advanced" target="_blank" rel="noopener noreferrer">Guía de Bolt sobre conexiones de bases de datos</a>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Más ayuda para publicar tu app</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><Link className={linkClass} href="/#finder">Obtener una recomendación inicial de hosting</Link></li>
          <li><Link className={linkClass} href="/es/error-despliegue-bolt">Solucionar un error al publicar en Bolt</Link></li>
          <li><Link className={linkClass} href="/hostinger-nodejs-app">Consultar la configuración Node.js de Hostinger</Link></li>
          <li><Link className={linkClass} href="/digitalocean-app-platform">Estimar un despliegue en App Platform</Link></li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-950">Fuentes oficiales</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          <li><a className={linkClass} href="https://support.bolt.new/building/using-bolt/project-settings" target="_blank" rel="noopener noreferrer">Configuración de hosting del proyecto en Bolt</a></li>
          <li><a className={linkClass} href="https://www.hostinger.com/support/host-your-lovable-bolt-or-any-other-vibe-coded-website-on-hostinger/" target="_blank" rel="noopener noreferrer">Guía de Hostinger para alojar proyectos de Bolt</a></li>
          <li><a className={linkClass} href="https://vercel.com/docs/frameworks/frontend/vite" target="_blank" rel="noopener noreferrer">Guía de despliegue Vite de Vercel</a></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Información revisada con la documentación pública el 25 de septiembre de 2026. Percent to Prompts es independiente y no recibe actualmente comisiones de los proveedores mencionados.</p>
      <p className="text-sm leading-6">Lee también la <Link className={linkClass} href={english} lang="en">guía en inglés</Link>.</p>
    </SitePageShell>
  );
}
