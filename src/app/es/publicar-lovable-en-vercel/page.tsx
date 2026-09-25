import type { Metadata } from "next";
import Link from "next/link";
import LovableDomainStatusChecker from "@/components/LovableDomainStatusChecker";
import LovableVercelChecker from "@/components/LovableVercelChecker";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/es/publicar-lovable-en-vercel";
const english = "/lovable-deployment-failed";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Lovable en Vercel: corrige 404 y dominio personalizado",
  description:
    "Comprueba el tipo de proyecto si Lovable en Vercel muestra 404 y revisa el estado DNS o SSL del dominio personalizado.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: english, es: canonical },
  },
  openGraph: {
    title: "¿Lovable en Vercel muestra un error 404?",
    description: "Identifica el tipo de proyecto antes de cambiar sus rutas.",
    url: canonical,
    locale: "es_ES",
    type: "article",
  },
};

export default function PublicarLovableEnVercelPage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Despliegue de Lovable · revisado el 25 de septiembre de 2026"
      title="¿Tu app de Lovable muestra 404 en Vercel? Comprueba primero el proyecto"
      intro={<>La solución depende de si tu app usa TanStack Start (la configuración actual) o una SPA antigua de Vite. Comprueba sus archivos de paquetes antes de cambiar las rutas de Vercel.</>}
    >
      <section id="comprobador-version" className="scroll-mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Comprueba la versión del framework de Lovable</h2>
        <p className="mt-3 text-base leading-7 text-zinc-700">
          La documentación de Vercel, actualizada el 22 de septiembre de 2026, indica que la detección automática requiere <code className="rounded bg-white px-1.5 py-0.5 text-sm">@lovable.dev/vite-tanstack-config</code> en versión <strong>2.6.2 o posterior</strong>. Este requisito corresponde a la detección sin configuración manual; una versión anterior no demuestra por sí sola que la app no pueda desplegarse con otra configuración.
        </p>
        <div className="mt-5"><LovableVercelChecker locale="es" /></div>
      </section>

      <section id="desplegar" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Conecta Lovable con Vercel</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>Conecta el proyecto de Lovable con GitHub y espera a que el repositorio muestre los últimos cambios.</li>
          <li>En Vercel, importa ese repositorio de GitHub. Vercel indica que detecta automáticamente la configuración compatible de TanStack Start.</li>
          <li>Cuando termine el primer despliegue, abre la dirección de producción y prueba la página principal y una ruta interna directamente.</li>
          <li>Si falla la compilación, busca el primer error concreto. Si compila pero la web muestra un error, revisa la versión desplegada y los registros de ejecución de Vercel antes de cambiar las rutas.</li>
        </ol>
        <p className="mt-4 text-base leading-7">
          La integración de GitHub de Lovable sincroniza en ambas direcciones: los cambios de Lovable pasan al repositorio y los cambios de la rama activa vuelven a Lovable. Al conectar ese repositorio con Vercel, los nuevos commits pueden iniciar despliegues.
        </p>
      </section>

      <div className="scroll-mt-6">
        <p className="mb-4 text-base leading-7">Si funciona la dirección <code>.lovable.app</code> pero no tu dominio propio, consulta el estado que muestra Lovable antes de modificar el DNS. La verificación, la propagación y la emisión del certificado SSL son pasos separados.</p>
        <LovableDomainStatusChecker locale="es" />
      </div>

      <section id="spa-vite-404" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">SPA antigua de Vite: funciona la portada, pero recargar una ruta da 404</h2>
        <p className="mt-3 text-base leading-7">
          La guía de Vite de Vercel indica que los enlaces internos necesitan una ruta alternativa cuando el proyecto es una aplicación de una sola página controlada por el navegador. Si ese es tu caso, crea <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">vercel.json</code> en la raíz del proyecto:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm leading-6 text-cyan-100"><code>{`{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}</code></pre>
        <p className="mt-4 text-base leading-7">
          Úsalo solo si es una SPA de Vite y el navegador gestiona sus rutas internas. Vercel documenta esta regla para las SPA de Vite; los proyectos actuales de Lovable usan TanStack Start y siguen la configuración de ese framework. Si también falla la dirección principal, revisa primero la carpeta raíz, la salida de compilación y la rama desplegada en Vercel.
        </p>
      </section>

      <section id="vercel-no-detecta" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Si Vercel no detecta el framework</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>Confirma que el proyecto de Vercel usa el mismo repositorio y la misma rama que actualiza Lovable.</li>
          <li>Comprueba la dependencia en package.json y la versión resuelta en el archivo de bloqueo.</li>
          <li>Si la versión instalada es anterior a 2.6.2, actualiza la dependencia y sube tanto el manifiesto como el archivo de bloqueo.</li>
          <li>Compara cualquier configuración manual de Nitro o Vite con la documentación actual. No copies una configuración escrita para otra generación del proyecto.</li>
        </ul>
        <p className="mt-4 text-base leading-7">
          ¿Ha fallado la compilación? Usa el <Link className={linkClass} href="/es/arreglar-error-despliegue">comprobador de errores de despliegue</Link>. Para la guía en inglés, abre <Link className={linkClass} href={english} lang="en">the Lovable to Vercel version checker</Link>.
        </p>
        <p className="mt-3 text-base leading-7">¿Aún estás eligiendo proveedor? Consulta la <Link className={linkClass} href="/es/donde-alojar-app-lovable">comparativa de Vercel, Hostinger y DigitalOcean para Lovable</Link>.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Documentación oficial</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><a className={linkClass} href="https://vercel.com/docs/frameworks/full-stack/tanstack-start" target="_blank" rel="noopener noreferrer">Vercel: TanStack Start y versión requerida para Lovable</a></li>
          <li><a className={linkClass} href="https://vercel.com/docs/frameworks/frontend/vite" target="_blank" rel="noopener noreferrer">Vercel: rutas internas en una SPA de Vite</a></li>
          <li><a className={linkClass} href="https://docs.lovable.dev/integrations/github" target="_blank" rel="noopener noreferrer">Lovable: sincronizar un proyecto con GitHub</a></li>
          <li><a className={linkClass} href="https://docs.lovable.dev/features/publish" target="_blank" rel="noopener noreferrer">Lovable: publicar un proyecto</a></li>
          <li><a className={linkClass} href="https://docs.lovable.dev/features/custom-domain" target="_blank" rel="noopener noreferrer">Lovable: configurar un dominio personalizado</a></li>
          <li><a className={linkClass} href="https://vercel.com/changelog/you-can-now-deploy-lovable-apps-to-vercel" target="_blank" rel="noopener noreferrer">Vercel: anuncio del despliegue de Lovable</a></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Guía independiente. El requisito de versión se contrastó con la documentación de Vercel el 25 de septiembre de 2026. El comprobador no se conecta a Lovable, GitHub ni Vercel.</p>
    </SitePageShell>
  );
}
