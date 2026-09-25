import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsyTitleChecker from "@/components/EtsyTitleChecker";

const canonical = "/es/comprobador-titulos-etsy";
const englishRoute = "/etsy-title-checker";

export const metadata: Metadata = {
  title: "Comprobador de títulos Etsy gratis | Caracteres y claridad",
  description:
    "Comprueba el límite de 140 caracteres, cuenta palabras y revisa repeticiones en un título de Etsy. Análisis privado en tu navegador, sin promesas de posicionamiento.",
  robots: { index: false, follow: true },
  alternates: {
    canonical,
    languages: { en: englishRoute, "es-ES": canonical },
  },
  openGraph: {
    title: "Comprobador gratis de títulos de Etsy",
    description:
      "Cuenta caracteres y palabras y revisa posibles repeticiones según las recomendaciones actuales de Etsy.",
    url: canonical,
    locale: "es_ES",
    type: "website",
  },
};

const faq = [
  {
    question: "¿Cuántos caracteres permite Etsy en un título?",
    answer:
      "La ayuda de Etsy indica que un título puede tener hasta 140 caracteres. Este contador sirve como apoyo al editar; comprueba el título final en Etsy antes de guardarlo.",
  },
  {
    question: "¿Etsy recomienda usar los 140 caracteres?",
    answer:
      "Las recomendaciones actuales de Etsy se centran en títulos claros y fáciles de leer. Sugiere considerar menos de 15 palabras cuando basten para describir los rasgos importantes; el comprobador lo muestra como una sugerencia de legibilidad, no como una regla de posicionamiento.",
  },
  {
    question: "¿Este comprobador mejora el posicionamiento en Etsy?",
    answer:
      "No. Cuenta caracteres y palabras y destaca algunos patrones para que los revises. No consulta búsquedas, competencia, estadísticas del anuncio ni posiciones.",
  },
  {
    question: "¿Se sube o se guarda mi título?",
    answer:
      "No. El título se analiza en tu navegador y no se sube a esta web. Solo permanece en la página mientras utilizas el comprobador.",
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

export default function ComprobadorTitulosEtsyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        locale="es"
        eyebrow="Comprobador de títulos Etsy · Actualizado el 25 de septiembre de 2026"
        title="Comprueba la longitud y claridad de un título de Etsy"
        intro="Pega un título para contar caracteres y palabras y revisar términos repetidos o expresiones que Etsy recomienda dejar fuera. Son comprobaciones de edición, no una puntuación SEO ni una búsqueda de palabras clave."
      >
        <EtsyTitleChecker locale="es" />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Límite de caracteres y recomendaciones para títulos</h2>
          <p className="mt-3 text-base leading-7">
            La ayuda de Etsy indica que un título puede tener hasta 140 caracteres. Sus recomendaciones más recientes buscan títulos claros y fáciles de leer: nombrar el producto, destacar sus rasgos principales, evitar repeticiones innecesarias y considerar menos de 15 palabras. Esto último es una sugerencia de legibilidad, no una garantía de aparecer mejor en las búsquedas.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-emerald-900">
            <a href="https://help.etsy.com/hc/es/articles/115015628707-C%C3%B3mo-crear-un-anuncio" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4">Ayuda de Etsy: límite del título ↗</a>
            <a href="https://www.etsy.com/seller-handbook/article/1399426136697" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4">Etsy Seller Handbook: recomendaciones actuales ↗</a>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Qué puede y qué no puede comprobar esta herramienta</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
            <li>Cuenta caracteres y palabras y destaca palabras repetidas para que las revises.</li>
            <li>Puede señalar algunos ejemplos de palabras subjetivas o menciones de regalos, ofertas y envíos citadas en la guía de Etsy.</li>
            <li>No puede confirmar que el producto o sus características estén descritos correctamente ni saber qué busca la gente.</li>
            <li>No accede a tu tienda, no modifica anuncios y no predice posiciones, visitas ni ventas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Escribe para que el comprador entienda el producto</h2>
          <p className="mt-3 text-base leading-7">
            Etsy recomienda nombrar el artículo e incluir sus rasgos más importantes, como el color, el material o el tamaño. Interpreta cada aviso según el producto: repetir una palabra puede ser necesario y no existe una fórmula automática que garantice visibilidad. Etsy también tiene en cuenta otros elementos del anuncio, como etiquetas, atributos, descripción, fotos y reseñas.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Comprueba también las etiquetas o todo el catálogo</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6">
            <Link href="/es/comprobador-etiquetas-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">Revisar longitud y duplicados en etiquetas</Link>
            <Link href="/es/comprobador-csv-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">Auditar títulos y etiquetas desde el CSV de anuncios</Link>
            <Link href="/etsy-listing-csv-guide" className="font-semibold text-emerald-900 underline underline-offset-4">Descargar el CSV de anuncios activos</Link>
            <Link href={englishRoute} lang="en" hrefLang="en" className="font-semibold text-emerald-900 underline underline-offset-4">English version</Link>
          </div>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-stone-950">Preguntas sobre títulos de Etsy</h2>
          <div className="mt-4 grid gap-3">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-stone-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-stone-950 marker:hidden">{item.question}<span aria-hidden="true" className="float-right text-emerald-800 transition group-open:rotate-45">＋</span></summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </EtsyPageShell>
    </>
  );
}
