import type { Metadata } from "next";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsyPaymentStatementAnalyzer from "@/components/EtsyPaymentStatementAnalyzer";

const canonical = "/es/analizador-extracto-etsy";

export const metadata: Metadata = {
  title: "Analizador de extractos de Etsy en CSV | Gratis",
  description:
    "Resume el CSV del extracto mensual de Etsy por tipo de actividad y moneda. Consulta importes, tarifas e impuestos y neto sin subir el archivo.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: "/etsy-payment-statement-analyzer", "es-ES": canonical },
  },
  openGraph: {
    title: "Analizador gratis del extracto mensual de Etsy",
    description:
      "Agrupa las líneas del extracto de Etsy por tipo de actividad y moneda. El CSV se procesa en tu navegador.",
    url: canonical,
    type: "website",
  },
};

const faq = [
  {
    question: "¿Qué archivo CSV debo elegir?",
    answer:
      "Usa el CSV de Extractos mensuales de Etsy, en Administrador de la tienda → Finanzas → Extractos mensuales. No es el mismo archivo que el CSV de artículos pedidos, que contiene los productos vendidos.",
  },
  {
    question: "¿Qué muestra el analizador de extractos de Etsy?",
    answer:
      "Agrupa las filas por el tipo de actividad y la moneda que aparecen en el archivo y suma por separado los valores con signo de las columnas Importe, Tarifas e impuestos y Neto, cuando están disponibles.",
  },
  {
    question: "¿Calcula el beneficio exacto por producto o pedido?",
    answer:
      "No. Resume la actividad de la cuenta de pagos, pero no asigna cada tarifa, reembolso o ajuste a un producto o pedido ni resta tus costes de fabricación.",
  },
  {
    question: "¿El total neto coincide con el depósito bancario?",
    answer:
      "No siempre. Etsy explica que los depósitos dependen de los fondos disponibles y de tu calendario de depósitos. El beneficio neto de la cuenta de pagos y el ingreso en el banco son importes distintos.",
  },
  {
    question: "¿Se sube mi extracto mensual?",
    answer:
      "No. El navegador lee el archivo localmente. El resumen y el CSV descargado contienen totales agrupados, no las filas originales, referencias de pedidos ni datos de compradores.",
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

export default function EtsyPaymentStatementAnalyzerEsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        locale="es"
        eyebrow="Resumen gratis de extractos de Etsy · Archivo privado"
        title="Analiza tu extracto mensual de Etsy en CSV"
        intro="Agrupa por tipo de actividad y moneda los importes, tarifas e impuestos y valores netos del extracto mensual. El archivo se procesa en tu navegador, sin iniciar sesión ni subirlo a un servidor."
      >
        <EtsyPaymentStatementAnalyzer locale="es" />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Qué muestra el resumen del extracto</h2>
          <p className="mt-3 text-base leading-7">
            El informe agrupa las filas que comparten tipo de actividad y moneda, y suma por separado cada columna con importes. Las ventas, reembolsos, tarifas, marketing, envíos y depósitos quedan en categorías distintas; así no se mezcla una transferencia bancaria con los ingresos o el beneficio del negocio. Puedes descargar el resumen como CSV.
          </p>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Es un resumen del extracto, no una conciliación ni el beneficio por producto</h2>
          <p className="mt-3 text-base leading-7 text-stone-700">
            Etsy indica que el extracto mensual reúne la actividad de la cuenta de pagos durante ese mes. Esta herramienta suma los valores incluidos en el CSV, pero no asigna cada tarifa a un producto, no calcula tus costes ni determina qué fondos están disponibles para depósito. Consulta la <a href="https://help.etsy.com/hc/es/articles/115015747228-Como-gestionar-tu-cuenta-de-pagos" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">guía de Etsy sobre la cuenta de pagos ↗</a> antes de interpretar los importes. No es asesoramiento contable ni fiscal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Extracto mensual de Etsy frente al CSV de artículos pedidos</h2>
          <p className="mt-3 text-base leading-7">
            Usa el extracto mensual para resumir ventas, tarifas, reembolsos y depósitos de la cuenta de pagos. Usa el CSV de artículos pedidos para agrupar los productos vendidos por título o SKU. El <a href="/etsy-sales-csv-analyzer" className="font-semibold text-emerald-900 underline underline-offset-4">analizador de ventas y beneficio estimado por SKU</a> usa este segundo archivo y tus propios costes y supuestos de tarifas; es un cálculo distinto y no concilia el extracto.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Etsy explica cómo descargar los datos en su guía de <a href="https://help.etsy.com/hc/es/articles/360000343328-C%C3%B3mo-descargar-una-hoja-de-c%C3%A1lculo-con-tus-transacciones-de-ventas" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">hojas de cálculo de transacciones ↗</a>.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Preguntas frecuentes</h2>
          <div className="mt-4 divide-y divide-stone-200">
            {faq.map((item) => (
              <details key={item.question} className="py-4 first:pt-0 last:pb-0">
                <summary className="cursor-pointer font-semibold text-stone-900">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-sm leading-6 text-stone-600">
          ¿Prefieres usar la herramienta en inglés? <a href="/etsy-payment-statement-analyzer" lang="en" hrefLang="en" className="font-semibold text-emerald-900 underline underline-offset-4">Open the English Etsy statement analyzer →</a>
        </p>
      </EtsyPageShell>
    </>
  );
}
