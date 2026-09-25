import type { Metadata } from "next";
import DeploymentErrorHelper from "@/components/DeploymentErrorHelper";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/es/arreglar-error-despliegue";
const english = "/deploy-vibe-coded-app";

export const metadata: Metadata = {
  title: "Arreglar errores al desplegar una app creada con IA",
  description:
    "Diagnostica fallos de compilación en apps hechas con Lovable, Bolt, Cursor o Claude Code. Analiza el registro en tu navegador y descubre qué revisar.",
  alternates: {
    canonical,
    languages: { en: english, es: canonical },
  },
  openGraph: {
    title: "¿Tu app creada con IA no se despliega?",
    description: "Comprueba el registro de compilación y encuentra los siguientes pasos.",
    url: canonical,
    locale: "es_ES",
    type: "article",
  },
};

const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export default function SpanishDeploymentHelpPage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Guía de despliegue · 25 de septiembre de 2026"
      title="¿Tu app creada con IA no se despliega?"
      intro="Pega el registro del despliegue para detectar algunos errores habituales y saber qué comprobar primero. Sirve para proyectos de Lovable, Bolt, Cursor, Claude Code y otras herramientas que generan código."
    >
      <section id="diagnostics" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Analiza el registro del error</h2>
        <p className="mt-3 text-base leading-7">La herramienta compara el texto con patrones de errores comunes y muestra comprobaciones concretas. No envía el registro a un servicio de IA ni modifica tu proyecto.</p>
        <div className="mt-5"><DeploymentErrorHelper locale="es" /></div>
      </section>

      <section id="unrecognized" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Errores habituales al publicar una app</h2>
        <div className="mt-4 space-y-4">
          <article id="missing-build-script" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">“Missing script: build”</h3>
            <p className="mt-2 text-sm leading-6">El alojamiento está ejecutando un comando que no existe en la sección scripts de package.json. Comprueba cuál es el comando de compilación del proyecto y configúralo en el panel o añade el script correcto.</p>
          </article>
          <article id="module-not-found" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">“Module not found” o “Could not resolve”</h3>
            <p className="mt-2 text-sm leading-6">Revisa que el archivo exista en el repositorio, que las mayúsculas de la ruta coincidan y que el paquete esté declarado en las dependencias. La compilación del servidor puede distinguir entre letras mayúsculas y minúsculas aunque tu equipo no lo haga.</p>
          </article>
          <article id="environment-variable" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">“Missing environment variable”</h3>
            <p className="mt-2 text-sm leading-6">Añade la variable indicada en el panel del proveedor para el entorno que falla (vista previa o producción) y vuelve a desplegar. No subas contraseñas ni claves privadas al repositorio, y elimina sus valores antes de compartir registros.</p>
          </article>
          <article id="node-version" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Versión de Node.js incompatible</h3>
            <p className="mt-2 text-sm leading-6">El registro puede indicar que una dependencia necesita otra versión de Node.js. Comprueba el requisito del paquete, selecciona una versión compatible en el panel de alojamiento y usa una versión equivalente en local.</p>
          </article>
          <article id="lockfile" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">package.json y el archivo de bloqueo no coinciden</h3>
            <p className="mt-2 text-sm leading-6">Si cambiaste dependencias, actualiza el archivo de bloqueo con el mismo gestor de paquetes del proyecto y súbelo junto con package.json. Configura en el proveedor el comando de instalación correspondiente.</p>
          </article>
          <article id="output-directory" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">No se encuentra la carpeta de publicación</h3>
            <p className="mt-2 text-sm leading-6">Comprueba dónde genera los archivos tu framework y usa esa carpeta en la configuración del alojamiento. No todos los proyectos generan una carpeta dist; las apps con renderizado en servidor necesitan una configuración compatible con su framework.</p>
          </article>
          <article id="browser-api-on-server" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">“window is not defined” o “document is not defined”</h3>
            <p className="mt-2 text-sm leading-6">El código usa una función del navegador durante la compilación del servidor. Busca el primer archivo indicado y mueve ese código al componente o flujo que se ejecuta en el navegador.</p>
          </article>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Antes de volver a desplegar</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>Busca el primer error específico; el mensaje final “command exited with code 1” suele ser genérico.</li>
          <li>Ejecuta en local el comando de compilación de producción y corrige el primer fallo que aparezca.</li>
          <li>Comprueba la carpeta raíz, el comando de compilación, la versión de Node.js y las variables del entorno.</li>
          <li>Publica de nuevo y revisa el registro del nuevo intento.</li>
        </ol>
        <p className="mt-4 text-base leading-7">La <a className={linkClass} href="https://vercel.com/docs/deployments/troubleshoot-a-build" target="_blank" rel="noopener noreferrer">guía oficial de Vercel para solucionar errores de compilación</a> recomienda localizar la causa concreta en el registro y reproducir la compilación en local.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Cuando la app compile, elige dónde publicarla</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Vercel</h3>
            <p className="mt-2 text-sm leading-6">Encaja de forma directa con proyectos Next.js. El plan Hobby es para uso personal y no comercial; comprueba los términos si la app va a generar ingresos.</p>
            <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://vercel.com/pricing" target="_blank" rel="noopener noreferrer">Ver planes y condiciones</a>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Hostinger</h3>
            <p className="mt-2 text-sm leading-6">Ofrece alojamiento administrado para apps Node.js en planes elegibles Business Web y Cloud. Confirma requisitos, precio de renovación y compatibilidad antes de migrar.</p>
            <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/" target="_blank" rel="noopener noreferrer">Ver requisitos de Node.js</a>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">DigitalOcean App Platform</h3>
            <p className="mt-2 text-sm leading-6">Puede alojar apps con servicios adicionales. Calcula juntos los contenedores, bases de datos y transferencia de datos que necesite el proyecto.</p>
            <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://www.digitalocean.com/pricing/app-platform" target="_blank" rel="noopener noreferrer">Consultar precios actuales</a>
          </article>
        </div>
        <p className="mt-4 text-sm leading-6">Para comparar una ruta según el framework, las necesidades de servidor y el uso comercial, abre el <a className={linkClass} href="/#finder">buscador de alojamiento (en inglés)</a>.</p>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Esta herramienta ofrece una primera orientación y no garantiza identificar todos los fallos. Los enlaces son informativos y no son enlaces de afiliado. Información de proveedores revisada el 25 de septiembre de 2026.</p>
    </SitePageShell>
  );
}
