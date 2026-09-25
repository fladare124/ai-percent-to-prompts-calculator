import type { Metadata } from "next";
import Link from "next/link";
import EtsyBulkPricingAudit from "@/components/EtsyBulkPricingAudit";
import EtsyPageShell from "@/components/EtsyPageShell";

const canonical = "/es/planificador-precios-etsy-eeuu";
const englishRoute = "/etsy-bulk-pricing-audit";

export const metadata: Metadata = {
  title: "Precios de Etsy para EE. UU. | Planificador por CSV",
  description:
    "Planifica precios específicos para EE. UU. en Etsy. Añade costes y el arancel estimado por Etsy, revisa márgenes y exporta un informe privado por CSV.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: englishRoute, "es-ES": canonical },
  },
  openGraph: {
    title: "Planificador de precios de Etsy para EE. UU.",
    description:
      "Prepara un plan de precios en bloque con tus anuncios, costes y estimaciones de aranceles de Etsy.",
    url: canonical,
    type: "website",
    locale: "es_ES",
  },
};

const faq = [
  {
    question: "¿Qué archivo de Etsy necesito?",
    answer:
      "Usa el CSV de anuncios activos a la venta que puedes descargar desde el Gestor de la tienda. El archivo debe incluir título y precio; la moneda, el SKU y la cantidad ayudan a completar el informe.",
  },
  {
    question: "¿La herramienta calcula los aranceles de importación?",
    answer:
      "No. Debes copiar el importe estimado que Etsy muestra para cada producto y añadirlo a la tabla o a un CSV con SKU, Coste unitario y Arancel estimado EE. UU. Etsy indica que su estimador está dirigido a vendedores de fuera de EE. UU., que no está disponible para anuncios con variaciones de precio y que el importe final puede ser distinto.",
  },
  {
    question: "¿Qué significa que el envío sea DDP?",
    answer:
      "Delivered Duty Paid significa que el vendedor organiza y paga los cargos de importación antes de la entrega. Este planificador cuenta el arancel introducido como un coste por pedido; úsalo así solo si esperas pagarlo tú. No determina quién es responsable de los cargos.",
  },
  {
    question: "¿En qué moneda debo introducir los costes y aranceles?",
    answer:
      "Usa la moneda del CSV de anuncios en todos los importes. Si Etsy muestra el arancel en otra moneda, conviértelo antes de introducirlo. La herramienta no convierte divisas.",
  },
  {
    question: "¿El beneficio y el precio sugerido son exactos?",
    answer:
      "No. Son estimaciones para un pedido típico según las tarifas, costes y gastos de envío que introduzcas. Descuentos, impuestos del comprador, reembolsos, atribución publicitaria, conversión de divisas y otras circunstancias pueden cambiar el resultado real.",
  },
  {
    question: "¿El planificador cambia mis precios en Etsy?",
    answer:
      "No. Lee el precio del CSV como referencia y descarga un plan para que lo revises. No se conecta a tu tienda ni cambia anuncios. Comprueba en Etsy el precio específico para EE. UU. guardado antes de aplicar cualquier ajuste.",
  },
  {
    question: "¿Se suben mis archivos a esta web?",
    answer:
      "No. El CSV de anuncios y el de costes se procesan en tu navegador. No se envían al servidor de esta web.",
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

export default function EtsyUsPricePlannerSpanishPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        locale="es"
        eyebrow="Planificador de precios de Etsy para EE. UU. · CSV en bloque · Gratis"
        title="Planifica precios de Etsy para vender en Estados Unidos"
        intro="Para tiendas de Etsy fuera de EE. UU. que envían pedidos a compradores estadounidenses: añade el coste de cada producto y la estimación de arancel de Etsy, compara el margen y prepara un precio específico para EE. UU. El informe se procesa en tu navegador y no modifica tu tienda."
      >
        <EtsyBulkPricingAudit locale="es" />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Cómo preparar el plan de precios</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7">
            <li>Descarga el CSV de anuncios activos de Etsy y selecciónalo arriba. El informe usa el título, el precio, la moneda, la cantidad y, si existe, el SKU.</li>
            <li>Para cada producto que enviarás con aranceles pagados por adelantado, copia la estimación de EE. UU. que Etsy muestra en el editor del anuncio. Etsy indica que su estimación puede diferir del importe final y que no admite anuncios con variaciones de precio.</li>
            <li>Importa un CSV con las columnas <strong>SKU</strong>, <strong>Coste unitario</strong> y <strong>Arancel estimado EE. UU.</strong>, o introduce esos valores en la tabla. Usa un arancel por producto; introduce 0 cuando no esperes pagarlo.</li>
            <li>Mantén costes, aranceles, envío y tarifas en la moneda de los anuncios. Ajusta las tarifas de procesamiento a las condiciones del país de tu cuenta de pagos de Etsy.</li>
            <li>Revisa el margen estimado y el precio sugerido, descarga el CSV del plan y aplica cualquier cambio manualmente en Etsy.</li>
          </ol>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Consulta las instrucciones oficiales de Etsy para <a href="https://help.etsy.com/hc/es/articles/360000343508" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">descargar los datos de tus anuncios ↗</a>, <a href="https://help.etsy.com/hc/es/articles/40309848355735-C%C3%B3mo-utilizar-la-calculadora-de-aranceles-estimados-para-EE-UU-de-Etsy" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">usar el estimador de aranceles para EE. UU. ↗</a> y <a href="https://help.etsy.com/hc/es/articles/4403156582039-C%C3%B3mo-a%C3%B1adir-precios-nacionales-internacionales-y-espec%C3%ADficos-de-EE-UU-a-tus-anuncios" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">gestionar precios específicos para EE. UU. ↗</a>.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Qué incluye el precio sugerido</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            El precio base procede de la columna Price del CSV de anuncios; puede no ser el precio específico para EE. UU. que ya hayas guardado en Etsy. El cálculo añade el envío pagado por el comprador y resta el coste unitario, el porte de salida y el arancel que introduzcas. Después estima las tarifas fijas y porcentuales con los valores de la configuración.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            El precio sugerido resuelve el margen objetivo con los mismos supuestos. Ajusta las tarifas de transacción y procesamiento a tu cuenta: los valores iniciales solo sirven como ejemplo. Etsy permite editar precios por región en bloque desde el Gestor de la tienda; revisa cada precio final antes de publicarlo.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">La estimación de arancel debe corresponder al producto</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Etsy basa su estimador en información del producto, su país de origen y los datos del envío. Relaciona cada importe con el SKU correcto y vuelve a comprobarlo si cambia el producto o el envío. Este planificador no calcula derechos, no asigna códigos aduaneros ni estima cargos del transportista o de gestión aduanera. Si el comprador pagará los cargos de importación al recibir el paquete, no los incluyas como coste tuyo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Herramientas relacionadas para vendedores de Etsy</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href={englishRoute} hrefLang="en" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Use the English US price planner →</Link>
            <Link href="/es/planificador-reposicion-etsy" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Planificar reposición de inventario →</Link>
            <Link href="/es/comprobador-csv-etsy" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Revisar el CSV de anuncios activos →</Link>
            <Link href="/etsy-fee-calculator" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Estimar tarifas para un pedido →</Link>
          </div>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-stone-950">Preguntas frecuentes</h2>
          <div className="mt-4 grid gap-3">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-stone-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-stone-950 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                  {item.question}<span aria-hidden="true" className="float-right text-emerald-800 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </EtsyPageShell>
    </>
  );
}
