import type { Metadata } from "next";
import Link from "next/link";
import LovableVercelChecker from "@/components/LovableVercelChecker";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/es/publicar-lovable-en-vercel";
const english = "/lovable-to-vercel-checker";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Publicar Lovable en Vercel: comprueba la versión",
  description:
    "Comprueba si tu proyecto de Lovable cumple el requisito actual de detección automática de Vercel y sigue los pasos de GitHub a Vercel.",
  alternates: {
    canonical,
    languages: { en: english, es: canonical },
  },
  openGraph: {
    title: "Publicar una app de Lovable en Vercel",
    description: "Comprueba la versión del framework y sigue los pasos de despliegue actuales.",
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
      title="Publicar una app de Lovable en Vercel: comprueba primero la versión"
      intro={<>Vercel ya documenta el despliegue automático de proyectos de Lovable, pero exige una versión mínima del paquete del framework. Comprueba el proyecto en tu navegador y sigue los pasos de GitHub a Vercel.</>}
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
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Documentación oficial</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><a className={linkClass} href="https://vercel.com/docs/frameworks/full-stack/tanstack-start" target="_blank" rel="noopener noreferrer">Vercel: TanStack Start y versión requerida para Lovable</a></li>
          <li><a className={linkClass} href="https://docs.lovable.dev/integrations/github" target="_blank" rel="noopener noreferrer">Lovable: sincronizar un proyecto con GitHub</a></li>
          <li><a className={linkClass} href="https://vercel.com/changelog/you-can-now-deploy-lovable-apps-to-vercel" target="_blank" rel="noopener noreferrer">Vercel: anuncio del despliegue de Lovable</a></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Guía independiente. El requisito de versión se contrastó con la documentación de Vercel el 25 de septiembre de 2026. El comprobador no se conecta a Lovable, GitHub ni Vercel.</p>
    </SitePageShell>
  );
}
