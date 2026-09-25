import type { Metadata } from "next";
import Link from "next/link";
import EtsyCsvAuditor from "@/components/EtsyCsvAuditor";

const canonical = "/es/comprobador-csv-etsy";
const pageTitle = "Comprobador de anuncios de Etsy en CSV gratis | Títulos y etiquetas";
const pageDescription =
  "Revisa títulos, etiquetas y datos de tus anuncios activos de Etsy desde un CSV. El archivo se analiza en tu navegador: no hace falta iniciar sesión ni subirlo.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: "/", "es-ES": canonical },
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonical,
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/opengraph-image"],
  },
};

const faq = [
  {
    question: "¿Qué revisa el comprobador de anuncios de Etsy?",
    answer:
      "Señala títulos muy largos o con palabras repetidas, expresiones promocionales, el número y la longitud de las etiquetas, etiquetas duplicadas y campos vacíos cuando están presentes en el CSV. También encuentra títulos y SKU repetidos. Son avisos para revisar, no una puntuación de posicionamiento.",
  },
  {
    question: "¿Se sube mi CSV o la información de mi tienda?",
    answer:
      "No. El navegador lee el archivo y realiza la revisión en tu dispositivo. No necesitas iniciar sesión en Etsy y el texto de tus anuncios, etiquetas, precios ni el contenido del CSV se envían al servidor de esta web.",
  },
  {
    question: "¿Cómo descargo el CSV de mis anuncios activos?",
    answer:
      "En Etsy, abre el Gestor de la tienda, ve a Configuración y Opciones, entra en Descargar datos y descarga el CSV de anuncios. Etsy puede cambiar los nombres de los menús; consulta su ayuda oficial si los pasos no coinciden.",
  },
  {
    question: "¿El comprobador predice ventas o el puesto en las búsquedas?",
    answer:
      "No. Comprueba formato y patrones del catálogo, pero no consulta estadísticas de la tienda, volumen de búsqueda, competencia ni resultados de Etsy. Revisa cada sugerencia y las instrucciones actuales de Etsy antes de editar un anuncio.",
  },
  {
    question: "¿Es una herramienta oficial de Etsy?",
    answer:
      "No. Es una herramienta independiente y no está afiliada a Etsy ni respaldada por la plataforma.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Comprobador de anuncios de Etsy en CSV",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  description: pageDescription,
};

export default function ComprobadorCsvEtsyPage() {
  return (
    <main lang="es" className="min-h-screen bg-[#f7f6f0] text-stone-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <Link href="/es/comprobador-csv-etsy" className="flex items-center gap-3" aria-label="Listing Checkup, inicio">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-base font-bold text-emerald-100">LC</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Listing Checkup</span>
              <span className="block text-xs text-stone-500">Herramientas independientes para Etsy</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-stone-600" aria-label="Navegación principal">
            <a href="#comprobador" className="transition hover:text-stone-950">Comprobador CSV</a>
            <Link href="/es/comprobador-etiquetas-etsy" className="transition hover:text-stone-950">Comprobar etiquetas</Link>
            <a href="#como-exportar" className="transition hover:text-stone-950">Cómo descargar el CSV</a>
            <a href="#preguntas" className="transition hover:text-stone-950">Preguntas frecuentes</a>
            <Link href="/" lang="en" hrefLang="en" className="transition hover:text-stone-950">English</Link>
          </nav>
        </header>

        <section className="max-w-4xl py-12 sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-950">
            Gratis · Sin iniciar sesión · El CSV no se sube
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
            Comprueba tus anuncios de Etsy desde un CSV.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
            Revisa títulos, etiquetas y datos de tus anuncios activos de una vez. El comprobador funciona en tu navegador y reconoce los encabezados de las exportaciones en español e inglés.
          </p>
          <a href="#comprobador" className="mt-7 inline-flex rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900">
            Revisar mi CSV de Etsy
          </a>
          <p className="mt-5 max-w-3xl text-xs leading-5 text-stone-500">
            Es una lista de comprobación, no una puntuación SEO ni una predicción de ventas. Revisa cada aviso antes de cambiar un anuncio publicado.
          </p>
        </section>

        <div id="comprobador" className="scroll-mt-6">
          <EtsyCsvAuditor locale="es" />
        </div>

        <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">¿Solo necesitas revisar las etiquetas de un anuncio?</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Usa el <Link href="/es/comprobador-etiquetas-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">comprobador de etiquetas de Etsy</Link> para contar hasta 13, revisar el límite de 20 caracteres y detectar duplicados.</p>
        </section>

        <section id="como-exportar" className="mt-14 grid gap-8 border-t border-stone-200 pt-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Guía rápida</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Cómo descargar el CSV de anuncios de Etsy</h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Etsy permite descargar los datos de tus anuncios activos como archivo CSV. No compartas el archivo: selecciónalo aquí y se analizará en este navegador.
            </p>
            <a href="https://help.etsy.com/hc/es/articles/360000343508-C%C3%B3mo-descargar-la-informaci%C3%B3n-de-tus-anuncios" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">
              Ver las instrucciones oficiales de Etsy ↗
            </a>
          </div>
          <ol className="grid gap-3 sm:grid-cols-3">
            <li className="rounded-2xl border border-stone-200 bg-white p-5">
              <span className="text-xs font-bold tracking-[0.12em] text-emerald-800">01</span>
              <h3 className="mt-3 font-semibold">Abre el Gestor de la tienda</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">En Etsy, entra en Configuración y después en Opciones.</p>
            </li>
            <li className="rounded-2xl border border-stone-200 bg-white p-5">
              <span className="text-xs font-bold tracking-[0.12em] text-emerald-800">02</span>
              <h3 className="mt-3 font-semibold">Descarga los datos</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Abre Descargar datos y elige el CSV de anuncios activos.</p>
            </li>
            <li className="rounded-2xl border border-stone-200 bg-white p-5">
              <span className="text-xs font-bold tracking-[0.12em] text-emerald-800">03</span>
              <h3 className="mt-3 font-semibold">Selecciona el archivo</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Cárgalo en el comprobador de arriba para revisar el catálogo.</p>
            </li>
          </ol>
        </section>

        <section className="mt-14 grid gap-4 border-t border-stone-200 pt-12 md:grid-cols-3" aria-label="Alcance del comprobador">
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="font-semibold">Títulos y etiquetas</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Señala títulos largos, repeticiones, etiquetas duplicadas o que superan los 20 caracteres y espacios de etiqueta sin usar.</p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="font-semibold">Datos del anuncio</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Si aparecen esas columnas en el archivo, avisa de descripciones, precios, cantidades, divisas o imágenes vacías.</p>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="font-semibold">Patrones del catálogo</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Encuentra títulos duplicados, SKU reutilizados y etiquetas presentes en varios anuncios para que puedas comprobar su relevancia.</p>
          </article>
        </section>

        <section className="mt-14 rounded-2xl border border-stone-200 bg-[#eeede4] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Alcance y privacidad</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Revisa sugerencias; no son datos de posicionamiento.</h2>
          <div className="mt-4 grid gap-5 text-sm leading-6 text-stone-700 md:grid-cols-2">
            <p>Esta herramienta no consulta búsquedas, estadísticas de tu tienda, competencia ni resultados de Etsy. Detecta patrones de formato y campos vacíos; no puede confirmar si una etiqueta atrae visitas ni si una edición mejorará las ventas.</p>
            <p>El archivo y el texto de los anuncios se procesan en tu navegador y no se envían al servidor. Las analíticas del sitio miden visitas a páginas, pero no reciben el contenido del CSV, los títulos, las etiquetas ni los precios.</p>
          </div>
          <p className="mt-4 text-xs leading-5 text-stone-600">
            Listing Checkup es independiente y no está afiliado a Etsy ni respaldado por Etsy. Comprueba las <a href="https://help.etsy.com/hc/es/articles/360000336307-C%C3%B3mo-usar-las-etiquetas-para-aparecer-en-las-b%C3%BAsquedas" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">recomendaciones actuales de Etsy sobre etiquetas</a> antes de editar tus anuncios.
          </p>
        </section>

        <section id="preguntas" className="mt-14 border-t border-stone-200 pt-12" aria-labelledby="faq-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Preguntas frecuentes</p>
            <h2 id="faq-heading" className="mt-3 text-3xl font-semibold tracking-tight">Sobre el comprobador CSV de anuncios de Etsy</h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-stone-200 bg-white p-5">
                <summary className="cursor-pointer list-none pr-6 font-semibold text-stone-950 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                  {item.question}<span aria-hidden="true" className="float-right text-emerald-800 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-14 flex flex-col gap-4 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Listing Checkup · Herramientas independientes para vendedores de Etsy</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Enlaces del pie de página">
            <Link href="/es/privacidad" className="underline underline-offset-4 hover:text-stone-900">Privacidad</Link>
            <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-stone-900">Aviso de afiliación</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
