import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsyRestockPlanner from "@/components/EtsyRestockPlanner";

const canonical = "/es/planificador-reposicion-etsy";
const englishRoute = "/etsy-restock-planner";

export const metadata: Metadata = {
  title: "Planificador de stock de Etsy desde CSV | Reposición gratis",
  description:
    "Combina los CSV de anuncios activos y pedidos de Etsy para estimar existencias y reposiciones. Gratis, privado y sin iniciar sesión.",
  robots: { index: false, follow: true },
  alternates: {
    canonical,
    languages: { en: englishRoute, "es-ES": canonical },
  },
  openGraph: {
    title: "Planificador gratis de reposición de Etsy desde CSV",
    description:
      "Relaciona cantidades actuales con unidades vendidas usando tus propios archivos de Etsy. Se procesan en el navegador.",
    url: canonical,
    type: "website",
  },
};

const faq = [
  {
    question: "¿Qué archivos de Etsy usa el planificador de reposición?",
    answer:
      "Combina el CSV de anuncios activos con uno o varios CSV Order Items de la misma tienda. El archivo de anuncios necesita título y cantidad; el SKU es recomendable. Los pedidos necesitan título del artículo; SKU y cantidad mejoran la coincidencia y el recuento.",
  },
  {
    question: "¿El planificador actualiza los anuncios de mi tienda?",
    answer:
      "No. Lee los archivos seleccionados localmente en tu navegador y crea un informe. No se conecta a tu cuenta ni cambia tus anuncios.",
  },
  {
    question: "¿Cómo calcula la reposición sugerida?",
    answer:
      "Divide las unidades de los archivos de pedidos entre los días del periodo que indiques, multiplica la media diaria por el plazo más el margen de seguridad, resta las existencias actuales y redondea hacia arriba. Es una estimación de planificación, no una predicción de demanda.",
  },
  {
    question: "¿Cómo relaciona los pedidos con los anuncios activos?",
    answer:
      "Primero compara los SKU normalizados. Si no coinciden, intenta relacionar títulos normalizados exactos cuando solo hay un anuncio activo con ese nombre. Los títulos editados, repetidos o los anuncios que ya no están activos pueden quedar sin relacionar.",
  },
  {
    question: "¿El informe incluye el beneficio o las comisiones de Etsy?",
    answer:
      "No. El plan de reposición usa nombres de producto, SKU, cantidades vendidas y existencias. No calcula ingresos, comisiones de Etsy, materiales, envío ni beneficio.",
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

export default function EtsyRestockPlannerSpanishPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        locale="es"
        eyebrow="Inventario Etsy · Planificador de reposición con CSV"
        title="Planifica reposiciones de Etsy con tus anuncios activos y pedidos"
        intro="Relaciona la cantidad de tus anuncios activos con las unidades vendidas en los archivos Order Items. Estima la cobertura de existencias y una reposición para el plazo que indiques, sin conectar tu cuenta de Etsy."
      >
        <EtsyRestockPlanner locale="es" />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Qué necesitas para preparar el informe</h2>
          <p className="mt-3 text-base leading-7">
            Descarga el CSV de anuncios activos y uno o varios CSV Order Items de la misma tienda. El archivo de anuncios contiene las cantidades actuales; los pedidos muestran las unidades vendidas durante el periodo que quieras revisar. Indica en el planificador cuántos días cubren esos pedidos.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7">
            <li>En el Gestor de la tienda de Etsy, abre <strong>Configuración → Opciones → Descargar datos</strong>.</li>
            <li>Descarga el CSV de anuncios activos.</li>
            <li>En Pedidos, elige <strong>Order Items</strong> y selecciona el mes o año que quieras revisar.</li>
            <li>Elige ambos tipos de archivo e indica los días del periodo y tu plazo de reposición habitual.</li>
          </ol>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Etsy explica cómo descargar la información de <a href="https://help.etsy.com/hc/es/articles/360000343508" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">anuncios activos ↗</a> y <a href="https://help.etsy.com/hc/es/articles/360000343328" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">pedidos vendidos ↗</a>.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Cómo se estima la cobertura de stock</h2>
          <p className="mt-3 text-base leading-7">
            Las ventas medias al día son las unidades de los archivos de pedidos divididas entre los días del periodo que indiques. La cobertura estimada es la cantidad actual del anuncio dividida entre esa media diaria. La reposición sugerida es la demanda prevista para el plazo más el margen de seguridad, menos las existencias que ya tienes.
          </p>
          <p className="mt-3 text-base leading-7">
            El cálculo supone que los archivos cubren el periodo indicado y que no contienen pedidos repetidos. No predice cambios estacionales ni modifica tus existencias automáticamente. Revisa las ventas sin coincidencia y el inventario actual antes de actuar.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Primero por SKU; si falta, por título exacto</h2>
          <p className="mt-3 text-base leading-7">
            El SKU es la forma más fiable de relacionar pedidos con anuncios activos. Si un pedido no tiene un SKU coincidente, se intenta buscar el mismo título tras normalizar puntuación, espacios y mayúsculas. Los títulos editados, nombres duplicados, lotes y variaciones pueden necesitar revisión manual. El informe muestra las unidades vendidas que no ha podido relacionar.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Los CSV se procesan de forma privada</h2>
          <p className="mt-3 text-base leading-7">
            Los dos archivos se leen en tu navegador. No se suben a esta web; el informe no incluye nombres, direcciones ni números de pedido. Esta herramienta independiente no puede editar tus anuncios ni consultar el inventario actualizado de Etsy.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Revisa el resto de los datos de tu tienda</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6">
            <Link href="/es/comprobador-csv-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">Revisar anuncios activos</Link>
            <Link href="/etsy-sales-csv-analyzer" className="font-semibold text-emerald-900 underline underline-offset-4">Resumir ventas por producto</Link>
            <Link href="/es/comprobador-etiquetas-etsy" className="font-semibold text-emerald-900 underline underline-offset-4">Comprobar etiquetas</Link>
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
