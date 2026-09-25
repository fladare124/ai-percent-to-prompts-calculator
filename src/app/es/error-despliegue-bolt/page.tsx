import type { Metadata } from "next";
import Link from "next/link";
import DeploymentErrorHelper from "@/components/DeploymentErrorHelper";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/es/error-despliegue-bolt";
const english = "/bolt-deployment-failed";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Bolt.new no publica la app: errores de despliegue",
  description:
    "Separa los fallos de vista previa, publicación en Bolt y compilación externa. Analiza el registro y comprueba qué revisar antes de volver a desplegar.",
  alternates: {
    canonical,
    languages: { en: english, es: canonical },
  },
  openGraph: {
    title: "¿Bolt.new no publica tu app?",
    description: "Averigua si falla la vista previa, Bolt o la compilación en otro alojamiento.",
    url: canonical,
    locale: "es_ES",
    type: "article",
  },
};

export default function BoltDeploymentFailedSpanishPage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Guía de despliegue de Bolt.new · revisada el 25 de septiembre de 2026"
      title="¿Bolt.new no publica tu app? Comprueba en qué paso falla"
      intro="Una vista previa en blanco, un fallo al publicar desde Bolt y una compilación fallida en otro alojamiento son problemas distintos. Identifica primero dónde ocurre el error y sigue las comprobaciones adecuadas antes de cambiar de proveedor."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Paso 1</p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">La vista previa aparece en blanco</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Puede fallar el navegador o WebContainer antes de que la app llegue al alojamiento. Prueba con un navegador basado en Chromium y comprueba si una extensión o VPN está bloqueando Bolt.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Paso 2</p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">Falla la publicación de Bolt</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Lee el error que aparece al pulsar Publicar. Si funciona la dirección generada <code>.bolt.host</code> pero falla tu dominio, comprueba el estado del dominio y los registros DNS antes de volver a compilar.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Paso 3</p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">Falla la compilación en otro proveedor</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Usa el registro de compilación de ese alojamiento. El primer error concreto suele señalar una dependencia, configuración o variable que falta.</p>
        </article>
      </section>

      <section id="diagnostics" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Analiza el registro de otro alojamiento</h2>
        <p className="mt-3 text-base leading-7">Pega un registro sin secretos para buscar errores de compilación habituales. El análisis se ejecuta en tu navegador; no se conecta a Bolt ni a tu proveedor, y no sube ni guarda el texto.</p>
        <div className="mt-5"><DeploymentErrorHelper locale="es" /></div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">¿Dónde estás intentando publicar?</h2>
        <div className="mt-4 space-y-4">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-zinc-950">Publicación dentro de Bolt</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">El alojamiento integrado de Bolt publica el proyecto en una dirección <code>.bolt.host</code>. Su centro de ayuda indica que todos los usuarios pueden publicar ahí; los dominios propios están disponibles para usuarios de pago. Si funciona la dirección generada pero falla tu dominio, comprueba su estado y los registros DNS antes de volver a compilar.</p>
            <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://support.bolt.new/building/intro-bolt" target="_blank" rel="noopener noreferrer">Detalles oficiales de hosting y dominios de Bolt</a>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-zinc-950">Publicación en Vercel, Netlify u otro proveedor</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">Trata el despliegue externo como un proyecto aparte. Comprueba que el proveedor usa el repositorio y la carpeta correctos, ejecuta el comando de compilación de la app y tiene las variables de entorno necesarias. Vercel permite desplegar un frontend Vite, pero el servidor y los datos conectados requieren una configuración compatible.</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a className={linkClass} href="https://vercel.com/docs/frameworks/frontend/vite" target="_blank" rel="noopener noreferrer">Guía de Vite para Vercel</a>
              <Link className={linkClass} href="/hostinger-nodejs-app">Requisitos de Node.js de Hostinger</Link>
              <Link className={linkClass} href="/digitalocean-app-platform">Costes de DigitalOcean App Platform</Link>
            </div>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-zinc-950">La web carga, pero falla el inicio de sesión o los datos</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">Puede ser un problema de configuración o de un servicio de producción, no necesariamente de la compilación del frontend. Comprueba la base de datos, las URL de retorno de autenticación y las variables del entorno. Cambiar de alojamiento no migra automáticamente la base de datos de Bolt. Bolt advierte que sustituir la conexión puede causar pérdida de datos: haz una copia y sigue primero las instrucciones de migración.</p>
            <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://support.bolt.new/cloud/database/advanced" target="_blank" rel="noopener noreferrer">Guía de Bolt sobre conexiones y migración de bases de datos</a>
          </article>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">¿Conviene sacar una app de Bolt?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Mantén Bolt si…</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700">
              <li>la app se publica bien y los servicios integrados cubren lo que necesitas;</li>
              <li>quieres gestionar alojamiento, dominio y base de datos desde Bolt;</li>
              <li>el dominio y las condiciones del plan sirven para tu proyecto.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Compara otros alojamientos si…</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700">
              <li>necesitas un entorno, proveedor o flujo de publicación específico;</li>
              <li>la app ya usa servicios externos que quieres gestionar junto al alojamiento;</li>
              <li>has revisado el código, la base de datos, los secretos, las condiciones y el coste total.</li>
            </ul>
          </article>
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-700">Antes de cambiar, sincroniza o guarda una copia del proyecto y publica una versión de prueba. Comprueba las páginas, el inicio de sesión, el guardado de datos y el dominio antes de enviar a tus visitantes al nuevo alojamiento.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Más ayuda para publicar tu app</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><Link className={linkClass} href="/#finder">Obtener una recomendación inicial de hosting</Link></li>
          <li><Link className={linkClass} href="/es/arreglar-error-despliegue">Diagnosticar otro error de compilación</Link></li>
          <li><Link className={linkClass} href="/es/donde-alojar-app-lovable">Comparar hosting para una app de Lovable</Link></li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-950">Fuentes oficiales</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          <li><a className={linkClass} href="https://support.bolt.new/faqs/troubleshooting/webcontainer" target="_blank" rel="noopener noreferrer">Ayuda de Bolt para errores de vista previa y WebContainer</a></li>
          <li><a className={linkClass} href="https://support.bolt.new/building/using-bolt/project-settings" target="_blank" rel="noopener noreferrer">Configuración de alojamiento del proyecto en Bolt</a></li>
          <li><a className={linkClass} href="https://www.hostinger.com/support/host-your-lovable-bolt-or-any-other-vibe-coded-website-on-hostinger/" target="_blank" rel="noopener noreferrer">Guía de Hostinger para apps de Bolt y otros constructores de IA</a></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Información revisada con la documentación pública el 25 de septiembre de 2026. Percent to Prompts es independiente y no recibe actualmente comisiones de los proveedores mencionados.</p>
      <p className="text-sm leading-6">Lee también la <Link className={linkClass} href={english} lang="en">guía en inglés</Link>.</p>
    </SitePageShell>
  );
}
