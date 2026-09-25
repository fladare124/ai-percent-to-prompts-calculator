import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";

const canonical = "/es/guia-extracto-mensual-etsy-csv";

export const metadata: Metadata = {
  title: "Cómo leer el extracto mensual de Etsy en CSV | Guía",
  description:
    "Aprende a descargar y entender tu extracto mensual de Etsy en CSV: actividad, importes, tarifas, impuestos, neto y depósitos.",
  robots: { index: false, follow: true },
  alternates: { canonical },
  openGraph: {
    title: "Guía para leer el extracto mensual de Etsy en CSV",
    description:
      "Qué significan los importes, tarifas, impuestos y neto del extracto mensual de Etsy, y cómo distinguirlo del CSV de artículos pedidos.",
    url: canonical,
    type: "article",
  },
};

const faq = [
  {
    question: "¿Dónde se descarga el extracto mensual de Etsy?",
    answer:
      "En Etsy.com, abre el Administrador de la tienda, ve a Finanzas y abre Extractos mensuales. Elige el mes, genera el CSV y descárgalo desde el correo que Etsy envía cuando está listo.",
  },
  {
    question: "¿El extracto mensual es lo mismo que el CSV de pedidos?",
    answer:
      "No. El extracto mensual muestra actividad de la cuenta de pagos, como ventas, tarifas, reembolsos y depósitos. El CSV de artículos pedidos enumera los productos vendidos y puede incluir el SKU si lo añadiste.",
  },
  {
    question: "¿El importe neto del extracto es mi beneficio real?",
    answer:
      "No necesariamente. Etsy calcula el beneficio neto de la cuenta de pagos con ventas y otros costes, mientras que el depósito depende de los fondos disponibles y del calendario de pagos. El CSV tampoco incluye tus costes de fabricación fuera de Etsy.",
  },
  {
    question: "¿Puedo sumar todas las monedas en un único total?",
    answer:
      "No. Suma cada moneda por separado o convierte los importes con un tipo de cambio y una fecha documentados. El analizador de esta web mantiene las monedas separadas y no convierte divisas.",
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

export default function EtsyMonthlyStatementCsvGuideEsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        locale="es"
        eyebrow="Guía gratuita · Extractos y CSV de Etsy"
        title="Cómo leer el extracto mensual de Etsy en CSV"
        intro="El extracto mensual reúne la actividad de tu cuenta de pagos durante un mes. Esta guía explica dónde descargarlo, cómo interpretar sus importes y por qué un depósito bancario no es lo mismo que el beneficio de tu tienda."
      >
        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Primero, descarga el informe adecuado</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7">
            <li>En Etsy.com, abre el <strong>Administrador de la tienda</strong>.</li>
            <li>Ve a <strong>Finanzas → Extractos mensuales</strong> y selecciona <strong>Ver todos los extractos mensuales</strong>.</li>
            <li>Elige el año y el mes y selecciona <strong>Generar CSV</strong>.</li>
            <li>Cuando recibas el correo de Etsy, pulsa el enlace de descarga y guarda el CSV.</li>
          </ol>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Etsy puede cambiar sus menús. Consulta su <a href="https://help.etsy.com/hc/en-us/articles/360016389113-How-to-Calculate-Your-Etsy-Payments-Deposit-Amount" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">guía oficial para descargar el extracto mensual ↗</a> y su <a href="https://help.etsy.com/hc/es/articles/115015747228-Como-gestionar-tu-cuenta-de-pagos" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">explicación en español de la cuenta de pagos ↗</a> si los pasos cambian.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Extracto mensual, pedidos y anuncios activos: tres archivos distintos</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Archivo</th>
                  <th className="px-4 py-3 font-semibold">Qué ayuda a revisar</th>
                  <th className="px-4 py-3 font-semibold">Herramienta relacionada</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-stone-200">
                  <td className="px-4 py-3 font-medium">Extracto mensual</td>
                  <td className="px-4 py-3">Actividad de pagos, tarifas, impuestos, reembolsos y depósitos del mes.</td>
                  <td className="px-4 py-3"><Link href="/es/analizador-extracto-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">Resumen por tipo de actividad</Link></td>
                </tr>
                <tr className="border-t border-stone-200">
                  <td className="px-4 py-3 font-medium">Artículos pedidos</td>
                  <td className="px-4 py-3">Artículos pedidos, títulos y SKU cuando los configuraste.</td>
                  <td className="px-4 py-3"><Link href="/etsy-sales-csv-analyzer" className="font-semibold text-emerald-900 underline underline-offset-4">Estimación por producto o SKU</Link></td>
                </tr>
                <tr className="border-t border-stone-200">
                  <td className="px-4 py-3 font-medium">Anuncios actualmente en venta</td>
                  <td className="px-4 py-3">Catálogo activo, precios, cantidades, etiquetas y SKU cuando están disponibles.</td>
                  <td className="px-4 py-3"><Link href="/es/comprobador-csv-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">Revisión del catálogo CSV</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Etsy explica cómo descargar los CSV de pedidos y anuncios en sus <a href="https://help.etsy.com/hc/es/articles/360000343328-C%C3%B3mo-descargar-una-hoja-de-c%C3%A1lculo-con-tus-transacciones-de-ventas" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">instrucciones de exportación ↗</a>. No uses un CSV de artículos pedidos para cuadrar por sí solo todos los movimientos de la cuenta de pagos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Qué significan los importes del extracto</h2>
          <p className="mt-3 text-base leading-7">
            Los nombres exactos de las categorías dependen del movimiento. En la cuenta de pagos, Etsy separa ventas, reembolsos, tarifas, marketing y gastos de envío, entre otros conceptos. En los datos de actividad reciente, Etsy describe el importe, las tarifas e impuestos y el neto de cada actividad. Usa el tipo de actividad para entender qué representa una fila y conserva el signo del valor tal como aparece en el CSV.
          </p>
          <p className="mt-3 text-base leading-7">
            Si el archivo muestra una fecha, úsala para ordenar los movimientos del periodo. El título o la descripción pueden identificar el artículo o el cargo. El campo <strong>Info</strong> puede aportar contexto adicional: Etsy indica que puede señalar cuándo estarán disponibles para depósito los fondos de una venta. Estas referencias no garantizan que todos los cargos se puedan relacionar con un pedido.
          </p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <dt className="font-semibold text-stone-950">Tipo y moneda</dt>
              <dd className="mt-2 text-sm leading-6 text-stone-600">El tipo clasifica el movimiento. La moneda identifica en qué unidad está expresado. Agrupa por separado cada moneda: sumar EUR y USD directamente no produce un total válido.</dd>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <dt className="font-semibold text-stone-950">Importe</dt>
              <dd className="mt-2 text-sm leading-6 text-stone-600">Es el valor de la actividad de esa fila. Puede ser positivo o negativo según sea una venta, devolución, cargo o movimiento de fondos. No lo interpretes automáticamente como dinero recibido en el banco.</dd>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <dt className="font-semibold text-stone-950">Tarifas e impuestos</dt>
              <dd className="mt-2 text-sm leading-6 text-stone-600">Muestra los cargos e impuestos asociados que aparecen en la fila. Etsy descuenta tarifas de las ventas y también puede registrar cargos por otros conceptos, como publicidad o etiquetas de envío.</dd>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <dt className="font-semibold text-stone-950">Neto</dt>
              <dd className="mt-2 text-sm leading-6 text-stone-600">Resume el importe neto de esa actividad después de las tarifas e impuestos que correspondan. No incluye tus costes externos de producto, materiales o mano de obra.</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-900">Ejemplo ficticio</p>
          <h2 className="mt-2 text-xl font-semibold text-stone-950">Una venta y un anuncio son movimientos distintos</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">Estos números solo ilustran cómo leer los signos; no son tarifas oficiales ni datos de una tienda real.</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-sky-200 bg-white">
            <table className="w-full min-w-[540px] border-collapse text-left text-sm">
              <thead className="bg-sky-100/70 text-sky-950">
                <tr>
                  <th className="px-4 py-3 font-semibold">Actividad</th>
                  <th className="px-4 py-3 font-semibold">Importe</th>
                  <th className="px-4 py-3 font-semibold">Tarifas e impuestos</th>
                  <th className="px-4 py-3 font-semibold">Neto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-sky-100"><td className="px-4 py-3">Venta (EUR)</td><td className="px-4 py-3">48,00</td><td className="px-4 py-3">−4,21</td><td className="px-4 py-3">43,79</td></tr>
                <tr className="border-t border-sky-100"><td className="px-4 py-3">Publicidad (EUR)</td><td className="px-4 py-3">0,00</td><td className="px-4 py-3">−2,00</td><td className="px-4 py-3">−2,00</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-700">No sumes filas de monedas distintas ni mezcles un depósito con las ventas del periodo: responde a otra pregunta financiera.</p>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Por qué el depósito no coincide con el beneficio neto</h2>
          <p className="mt-3 text-base leading-7 text-stone-700">
            El depósito depende del saldo disponible y de tu calendario de pagos. Algunas ventas pueden seguir pendientes, y tarifas, reembolsos, impuestos u otros movimientos reducen el dinero disponible. Etsy calcula el beneficio neto de la cuenta de pagos para un periodo, mientras que un depósito es una transferencia concreta. Además, ni el depósito ni el extracto restan automáticamente tus costes de materiales, producción o mano de obra.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Para ver cómo Etsy define estos importes, consulta su explicación de <a href="https://help.etsy.com/hc/en-us/articles/360016389113-How-to-Calculate-Your-Etsy-Payments-Deposit-Amount" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">depósitos frente al beneficio neto ↗</a>. Para decisiones contables o fiscales, consulta a un profesional que conozca tu jurisdicción.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-900">Siguiente paso</p>
          <h2 className="mt-2 text-xl font-semibold text-stone-950">Combina extractos mensuales sin subirlos</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">El analizador gratuito combina hasta 12 archivos y separa Importe, Tarifas e impuestos y Neto por tipo de actividad y moneda. Puedes seleccionar un CSV por mes para ver un resumen anual. Los archivos se quedan en tu navegador; el resultado no es una conciliación contable.</p>
          <Link href="/es/analizador-extracto-etsy" className="mt-4 inline-flex rounded-xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900">
            Abrir el analizador de extractos →
          </Link>
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

        <p className="text-xs leading-5 text-stone-500">
          Etsy puede cambiar los nombres de los menús, las columnas y las tarifas. Esta guía independiente se basa en la documentación enlazada, no está afiliada a Etsy y no sustituye asesoramiento contable o fiscal.
        </p>
      </EtsyPageShell>
    </>
  );
}
