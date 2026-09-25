import type { Metadata } from "next";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsyPaymentStatementAnalyzer from "@/components/EtsyPaymentStatementAnalyzer";

const canonical = "/es/analizador-extracto-etsy";

export const metadata: Metadata = {
  title: "Analizador anual y mensual de extractos Etsy CSV | Gratis",
  description:
    "Combina hasta 12 CSV de extractos mensuales de Etsy en totales anuales por actividad y moneda. Sin subir los archivos ni iniciar sesión.",
  robots: { index: false, follow: true },
  alternates: {
    canonical,
    languages: { en: "/etsy-payment-statement-analyzer", "es-ES": canonical },
  },
  openGraph: {
    title: "Analizador gratis de extractos mensuales y anuales de Etsy",
    description:
      "Combina CSV de extractos de Etsy por tipo de actividad y moneda. Los archivos se procesan en tu navegador.",
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
      "Combina hasta 12 archivos, agrupa las filas por tipo de actividad y moneda, y suma por separado los valores con signo de Importe, Tarifas e impuestos y Neto, cuando están disponibles.",
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
      "No. El navegador lee los archivos localmente. El resumen y el CSV descargado contienen totales agrupados, no las filas originales, referencias de pedidos ni datos de compradores.",
  },
  {
    question: "¿Puedo combinar extractos para revisar todo el año?",
    answer:
      "Sí. Selecciona un CSV de Extractos mensuales por cada mes que quieras incluir, hasta 12 archivos. El resumen mantiene separadas las monedas y no calcula la renta imponible ni sustituye la contabilidad.",
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
        title="Combina extractos mensuales de Etsy en un resumen anual"
        intro="Selecciona hasta 12 CSV de Extractos mensuales para combinar importes, tarifas e impuestos y valores netos por tipo de actividad y moneda. Revisa varios meses o un año sin exponer las filas originales."
      >
        <EtsyPaymentStatementAnalyzer locale="es" />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Qué muestra el resumen del extracto</h2>
          <p className="mt-3 text-base leading-7">
            El informe agrupa las filas de todos los extractos seleccionados por tipo de actividad y moneda, y suma por separado cada columna con importes. Elige un archivo por mes para consultar el año completo. Las ventas, reembolsos, tarifas, marketing, envíos y depósitos quedan en categorías distintas; puedes descargar los totales combinados como CSV.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">¿No sabes qué CSV abrir o cómo leer cada columna?</h2>
          <p className="mt-3 text-base leading-7">
            Consulta la <a href="/es/guia-extracto-mensual-etsy-csv" className="font-semibold text-emerald-900 underline underline-offset-4">guía para descargar y entender el extracto mensual de Etsy</a>. Explica la diferencia entre extractos, artículos pedidos y anuncios activos, y por qué el neto no siempre coincide con tu depósito.
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
