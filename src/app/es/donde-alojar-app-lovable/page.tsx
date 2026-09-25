import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/es/donde-alojar-app-lovable";
const english = "/where-to-host-lovable-app";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Dónde alojar una app de Lovable: Vercel vs Hostinger",
  description:
    "Compara Vercel, Hostinger y DigitalOcean para una app de Lovable según el framework, el uso comercial, los servicios y el coste.",
  alternates: {
    canonical,
    languages: { en: english, es: canonical },
  },
  openGraph: {
    title: "¿Dónde alojar una app de Lovable?",
    description: "Elige según el framework, los servicios y el uso del proyecto, no solo el precio inicial.",
    url: canonical,
    locale: "es_ES",
    type: "article",
  },
};

export default function DondeAlojarAppLovablePage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Comparativa de hosting · revisada el 25 de septiembre de 2026"
      title="¿Dónde conviene alojar una app de Lovable?"
      intro="La mejor opción depende del framework que haya generado Lovable, de si el proyecto es personal o comercial y de dónde funcionan la base de datos y los servicios auxiliares. Compara las rutas antes de mover el código."
    >
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-5 py-4 text-xl font-semibold text-zinc-950">Compara las opciones principales</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Proveedor</th>
                <th className="px-5 py-3 font-semibold">Cuándo encaja</th>
                <th className="px-5 py-3 font-semibold">Qué comprobar</th>
                <th className="px-5 py-3 font-semibold">Información oficial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Vercel</th>
                <td className="px-5 py-4 align-top text-zinc-600">Quieres usar la ruta documentada de GitHub para un proyecto actual de Lovable/TanStack Start o ya trabajas con Next.js.</td>
                <td className="px-5 py-4 align-top text-zinc-600">La detección automática de Lovable requiere <code>@lovable.dev/vite-tanstack-config</code> versión 2.6.2 o posterior. Hobby es para uso personal y no comercial.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://vercel.com/docs/frameworks/full-stack/tanstack-start" target="_blank" rel="noopener noreferrer">Configuración de TanStack Start</a><br /><a className={linkClass} href="https://vercel.com/pricing" target="_blank" rel="noopener noreferrer">Planes y precios</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Hostinger</th>
                <td className="px-5 py-4 align-top text-zinc-600">Buscas publicar una app Node.js desde GitHub con un panel de hosting administrado.</td>
                <td className="px-5 py-4 align-top text-zinc-600">La guía de Hostinger requiere un plan Business Web o Cloud apto para Node.js. Comprueba que sea compatible con tu framework, su precio de renovación y las necesidades de la app.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://www.hostinger.com/support/host-your-lovable-bolt-or-any-other-vibe-coded-website-on-hostinger/" target="_blank" rel="noopener noreferrer">Guía para Lovable y apps de IA</a><br /><a className={linkClass} href="https://www.hostinger.com/web-apps-hosting" target="_blank" rel="noopener noreferrer">Planes de apps web</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">DigitalOcean App Platform</th>
                <td className="px-5 py-4 align-top text-zinc-600">La app necesita una web, un servicio, un proceso en segundo plano, un contenedor o una base de datos.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Calcula cada componente y la transferencia de datos. El precio inicial de un contenedor no representa el coste total de una app completa.</td>
                <td className="px-5 py-4 align-top"><Link className={linkClass} href="/digitalocean-app-platform">Guía de costes</Link><br /><a className={linkClass} href="https://www.digitalocean.com/pricing/app-platform" target="_blank" rel="noopener noreferrer">Precios oficiales</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Una decisión rápida</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-6 text-base leading-7">
          <li><strong>Proyecto actual de Lovable con TanStack Start:</strong> comprueba la versión del paquete del framework y sigue la ruta documentada de Vercel. Abre el <Link className={linkClass} href="/es/publicar-lovable-en-vercel">comprobador de versión y errores 404 de Lovable/Vercel</Link>.</li>
          <li><strong>App Node.js exportada y prefieres hosting administrado:</strong> revisa si te encaja el plan Business Web o Cloud de Hostinger y comprueba sus requisitos frente al repositorio.</li>
          <li><strong>Necesitas varios servicios o un proceso en segundo plano:</strong> calcula el coste de DigitalOcean App Platform sumando sus componentes.</li>
          <li><strong>Proyecto comercial:</strong> revisa las condiciones de uso del proveedor. Vercel limita Hobby al uso personal no comercial.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Cambiar el hosting no migra toda la app</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Antes de cambiar, apunta dónde funcionan la autenticación, la base de datos, los archivos, el correo y las tareas programadas. Mover la web o el servidor Node.js no migra automáticamente esos servicios. Mantén la app actual disponible hasta que la nueva supere una comprobación en producción.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Guías para publicar tu proyecto</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><Link className={linkClass} href="/es/publicar-lovable-en-vercel">Solucionar errores de framework o rutas entre Lovable y Vercel</Link></li>
          <li><Link className={linkClass} href="/hostinger-nodejs-app">Consultar los requisitos de Node.js de Hostinger</Link></li>
          <li><Link className={linkClass} href="/digitalocean-app-platform">Calcular el coste de DigitalOcean App Platform</Link></li>
          <li><Link className={linkClass} href="/es/arreglar-error-despliegue">Diagnosticar una compilación fallida</Link></li>
          <li><Link className={linkClass} href="/es/error-despliegue-bolt">Solucionar un error al publicar una app de Bolt</Link></li>
          <li><Link className={linkClass} href="/es/donde-alojar-app-bolt">Comparar alojamiento para apps de Bolt.new</Link></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Información revisada con la documentación pública de los proveedores el 25 de septiembre de 2026. No estamos afiliados a estos proveedores; los enlaces llevan a sus páginas oficiales.</p>
      <p className="text-sm leading-6">Comparativa independiente, no una prueba de despliegue. Confirma los requisitos y el coste total con el proveedor antes de cambiar.</p>
      <p className="text-sm leading-6">Lee también la guía en <Link className={linkClass} href={english} lang="en">inglés</Link>.</p>
    </SitePageShell>
  );
}
