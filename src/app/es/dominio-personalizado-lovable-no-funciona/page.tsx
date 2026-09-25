import type { Metadata } from "next";
import Link from "next/link";
import LovableDomainStatusChecker from "@/components/LovableDomainStatusChecker";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/es/dominio-personalizado-lovable-no-funciona";
const english = "/lovable-custom-domain-not-working";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "El dominio personalizado de Lovable no funciona: DNS y SSL",
  description:
    "Diagnostica por estado un dominio de Lovable que no funciona. Revisa los registros DNS, la verificación, el certificado SSL y cuándo reintentar.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: english, es: canonical },
  },
  openGraph: {
    title: "¿No funciona el dominio personalizado de Lovable?",
    description: "Usa el estado del dominio para saber qué revisar en el DNS o el SSL.",
    url: canonical,
    locale: "es_ES",
    type: "article",
  },
};

export default function DominioPersonalizadoLovableNoFuncionaPage() {
  return (
    <SitePageShell
      locale="es"
      eyebrow="Solución de problemas de dominios de Lovable · revisada el 25 de septiembre de 2026"
      title="¿No funciona tu dominio personalizado de Lovable? Comprueba el estado antes de cambiar el DNS"
      intro="Empieza por el estado exacto que aparece en Proyecto → Configuración → Dominios. La verificación del dominio, el certificado SSL y la publicación de la app son pasos distintos; la solución depende de dónde se haya detenido la configuración."
    >
      <LovableDomainStatusChecker locale="es" />

      <section id="metodo-de-conexion" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Confirma el tipo de conexión antes de cambiar el DNS</h2>
        <p className="mt-3 text-base leading-7">Para una conexión manual estándar desde otro proveedor, Lovable muestra un registro A y otro TXT para verificar la propiedad. La guía actual usa <code>185.158.133.1</code> como ejemplo para el registro A y un nombre TXT que empieza por <code>_lovable</code>; copia el host y los valores exactos de tu proyecto, ya que pueden variar según el subdominio y el proveedor.</p>
        <p className="mt-3 text-base leading-7">Si activaste expresamente un CDN o proxy en Lovable, usa el CNAME que te proporciona. En ese modo sustituye al registro A y Lovable no requiere el TXT de verificación. No mezcles los registros de la conexión estándar y del modo proxy salvo que Lovable los muestre juntos para tu proyecto.</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>En la conexión estándar con un proveedor externo, comprueba que no haya un registro AAAA en conflicto para ese nombre.</li>
          <li>Si se verifica la propiedad pero falla el SSL, revisa si los registros CAA existentes permiten emitir el certificado que usa Lovable.</li>
          <li>Al conectar el dominio raíz con redirección a <code>www</code>, Lovable muestra ambos nombres por separado. Comprueba el estado y los registros de cada uno.</li>
        </ul>
      </section>

      <section id="verificacion-y-ssl" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Distingue la verificación DNS de la emisión del certificado</h2>
        <p className="mt-3 text-base leading-7">“Verifying” y “Unable to verify” corresponden a la verificación DNS: compara los valores completos de A y TXT con los que muestra la configuración del proyecto y confirma que editaste los registros en el proveedor DNS autoritativo. Lovable indica que los cambios pueden tardar hasta 72 horas en propagarse, aunque muchos se aplican en unas horas.</p>
        <p className="mt-3 text-base leading-7">“Setting up” significa que la propiedad ya se verificó y Lovable está emitiendo el certificado SSL. Espera a que figure “Live” antes de probar HTTPS. Si aparece “Stalled” o “Failed”, utiliza la opción Retry; la guía actual indica que no hace falta eliminar y volver a conectar el dominio para reintentar el certificado.</p>
      </section>

      <section id="activo-pero-falla" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Lovable indica Live, pero la web sigue fallando</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>Abre el nombre de dominio exacto que figura como Live. El dominio raíz, el host <code>www</code> y un subdominio pueden tener estados separados.</li>
          <li>Si un nombre redirige a otro, comprueba cuál es el dominio principal y sigue la redirección hasta la dirección final.</li>
          <li>Prueba la dirección <code>.lovable.app</code> del proyecto. Si tampoco funciona, revisa si el proyecto está publicado y si la app carga.</li>
          <li>Si solo falla una página dentro de la app, revisa sus rutas o errores de ejecución por separado del DNS que Lovable marca como Live.</li>
        </ol>
        <p className="mt-4 text-base leading-7">Si tampoco se publica el proyecto o falla una compilación de Vercel, usa el <Link className={linkClass} href="/es/publicar-lovable-en-vercel">comprobador de errores de publicación y despliegue de Lovable</Link>. Cubre la vista previa, Publish, los registros de compilación y los errores 404.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Documentación oficial</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Las instrucciones de Lovable y los registros que muestra tu propio proyecto tienen prioridad sobre los ejemplos de otras webs. Consulta su <a className={linkClass} href="https://docs.lovable.dev/features/custom-domain" target="_blank" rel="noopener noreferrer">guía actual para configurar dominios y entender sus estados</a> antes de editar el DNS.</p>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Guía independiente. El comprobador relaciona un estado con pasos habituales; no consulta el DNS, no accede a tu cuenta de Lovable ni cambia registros.</p>
      <p className="text-sm leading-6">Read this page in <Link className={linkClass} href={english} lang="en">English</Link>.</p>
    </SitePageShell>
  );
}
