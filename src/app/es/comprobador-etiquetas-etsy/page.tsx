import type { Metadata } from "next";
import Link from "next/link";
import EtsyTagChecker from "@/components/EtsyTagChecker";

const canonical = "/es/comprobador-etiquetas-etsy";
const pageTitle = "Comprobador de etiquetas Etsy gratis: 13 etiquetas y 20 caracteres";
const pageDescription =
  "Cuenta y revisa etiquetas de Etsy: máximo 13 por anuncio, 20 caracteres por etiqueta, duplicados y caracteres no admitidos. El texto no sale de tu navegador.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: "/etsy-tag-checker", "es-ES": canonical },
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
    question: "¿Cuántas etiquetas permite Etsy por anuncio?",
    answer:
      "Etsy permite hasta 13 etiquetas por anuncio. El comprobador cuenta las etiquetas que pegas y marca las que quedan por encima del límite.",
  },
  {
    question: "¿Cuántos caracteres puede tener una etiqueta de Etsy?",
    answer:
      "Cada etiqueta puede tener hasta 20 caracteres, incluidos los espacios. El comprobador cuenta cada etiqueta y marca las que superan ese máximo.",
  },
  {
    question: "¿Qué caracteres puedo usar en las etiquetas?",
    answer:
      "La ayuda de Etsy indica que se permiten letras, números y espacios. También admite apóstrofos y guiones dentro de una palabra o frase, pero no al principio de la etiqueta.",
  },
  {
    question: "¿El comprobador recomienda palabras clave o predice visitas?",
    answer:
      "No. Comprueba el formato, el límite, los duplicados y algunos caracteres. No mide búsquedas, competencia, visitas ni ventas. Etsy recomienda elegir frases precisas y relevantes para cada artículo.",
  },
  {
    question: "¿Se envían mis etiquetas a un servidor?",
    answer:
      "No. El recuento y las comprobaciones se realizan en tu navegador. No hace falta iniciar sesión ni subir un archivo.",
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

export default function ComprobadorEtiquetasEtsyPage() {
  return (
    <main lang="es" className="min-h-screen bg-[#f7f6f0] text-stone-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <Link href="/es/comprobador-etiquetas-etsy" className="flex items-center gap-3" aria-label="Listing Checkup, inicio">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-base font-bold text-emerald-100">LC</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Listing Checkup</span>
              <span className="block text-xs text-stone-500">Herramientas independientes para Etsy</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-600" aria-label="Navegación principal">
            <Link href="/es/comprobador-csv-etsy" className="underline underline-offset-4 hover:text-stone-950">Auditoría CSV de la tienda</Link>
            <Link href="/es/comprobador-titulos-etsy" className="underline underline-offset-4 hover:text-stone-950">Comprobador de títulos</Link>
            <Link href="/etsy-tag-checker" lang="en" hrefLang="en" className="hover:text-stone-950">English</Link>
          </nav>
        </header>

        <article className="py-12 sm:py-16">
          <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-950">
            Gratis · Privado · Sin iniciar sesión
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Comprueba las etiquetas de tu anuncio de Etsy.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
            Cuenta tus etiquetas, revisa el máximo de 13 por anuncio y encuentra etiquetas repetidas, demasiado largas o con caracteres que Etsy quizá no acepte. La comprobación se realiza en tu navegador.
          </p>
          <div className="mt-9">
            <EtsyTagChecker locale="es" />
          </div>

          <div className="mt-10 space-y-8 text-stone-700">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Qué revisa este comprobador de etiquetas Etsy</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
                <li>Cuenta las etiquetas y marca las que superan el límite de 13.</li>
                <li>Cuenta caracteres, incluidos espacios, y marca las etiquetas de más de 20.</li>
                <li>Detecta etiquetas duplicadas aunque cambien las mayúsculas o los espacios.</li>
                <li>Avisa de signos de puntuación que no coinciden con las reglas publicadas por Etsy.</li>
              </ul>
              <p className="mt-3 text-base leading-7">
                Un aviso de formato no determina si una frase describe bien tu artículo ni si las personas la buscan. Comprueba que cada etiqueta sea precisa y pertinente antes de guardarla.
              </p>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-stone-950">Reglas de Etsy para etiquetas</h2>
              <p className="mt-2 text-base leading-7">
                Etsy permite un máximo de 13 etiquetas por anuncio y hasta 20 caracteres en cada una. Las etiquetas pueden incluir espacios, letras y números; se permiten apóstrofos y guiones dentro de una palabra o frase, pero no al principio.
              </p>
              <a href="https://help.etsy.com/hc/es/articles/360000336307-C%C3%B3mo-usar-las-etiquetas-para-aparecer-en-las-b%C3%BAsquedas" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">
                Leer la guía oficial de Etsy sobre etiquetas ↗
              </a>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Una comprobación de formato no es una herramienta de palabras clave</h2>
              <p className="mt-3 text-base leading-7">
                Este comprobador no consulta Etsy ni mide volumen de búsqueda, competencia, impresiones, clics o ventas. Etsy recomienda elegir etiquetas precisas y pertinentes y utilizar una variedad de frases descriptivas. Consulta las estadísticas de tu tienda para revisar cómo funcionan tus anuncios.
              </p>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-stone-950">Comprueba un anuncio o toda la tienda</h2>
              <p className="mt-2 text-sm leading-6">
                Usa esta página para revisar etiquetas de un anuncio y el <Link href="/es/comprobador-titulos-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">comprobador de títulos</Link> para revisar su longitud y legibilidad. Para detectar patrones en varios productos, abre la <Link href="/es/comprobador-csv-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">auditoría de anuncios desde un CSV de Etsy</Link>.
              </p>
            </section>
          </div>
        </article>

        <section className="border-t border-stone-200 pt-8" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-stone-950">Preguntas frecuentes sobre las etiquetas de Etsy</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-xl border border-stone-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-stone-950">{item.question}</summary>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-6 text-xs leading-5 text-stone-500">
          <p>Herramienta independiente, sin afiliación ni respaldo de Etsy. Confirma las reglas vigentes en la ayuda de Etsy.</p>
          <Link href="/es/privacidad" className="font-semibold text-emerald-900 underline underline-offset-4">Privacidad</Link>
        </footer>
      </div>
    </main>
  );
}
