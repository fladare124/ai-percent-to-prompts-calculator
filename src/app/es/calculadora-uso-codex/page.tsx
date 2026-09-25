import Link from "next/link";
import type { Metadata } from "next";
import SpanishCodexUsagePlanner from "@/components/SpanishCodexUsagePlanner";

const pageTitle = "Calculadora de uso de Codex: límite y restablecimiento";
const pageDescription =
  "Calcula si tu porcentaje de uso de Codex te durará hasta el próximo restablecimiento. Compara tu saldo actual, tu ritmo reciente y las horas que faltan.";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/es/calculadora-uso-codex",
    languages: {
      en: "/codex-usage-calculator",
      "es-ES": "/es/calculadora-uso-codex",
    },
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    locale: "es_ES",
    type: "website",
  },
};

export default function CalculadoraUsoCodexPage() {
  return (
    <main lang="es" className="mx-auto max-w-6xl space-y-10 px-5 py-10 sm:px-8">
      <nav aria-label="Navegación principal">
        <Link
          href="/"
          className="text-sm font-semibold text-cyan-800 underline decoration-cyan-300 underline-offset-4 dark:text-cyan-300"
        >
          Percent to Prompts
        </Link>
      </nav>

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
          Calculadora gratuita e independiente
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-zinc-950 dark:text-white sm:text-5xl">
          Calculadora de uso de Codex
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          Comprueba si el porcentaje que te queda podría durar hasta el próximo restablecimiento. Introduce dos lecturas de tu indicador de uso y el tiempo hasta el reinicio de esa ventana.
        </p>
      </header>

      <SpanishCodexUsagePlanner />

      <section className="grid gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
            Guía rápida
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            Cómo calcular si tu límite de Codex llegará al próximo reinicio
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            El planificador proyecta el ritmo observado con esta fórmula: saldo actual − (consumo por hora × horas hasta el reinicio). No necesita acceso a tu cuenta ni convierte el porcentaje en un número fijo de tareas.
          </p>
        </div>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <strong>1. Elige una sola ventana.</strong> Si tu cuenta muestra un límite de cinco horas y uno semanal, calcula cada uno por separado y usa el horario de reinicio que aparece para ese límite.
          </p>
          <p className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <strong>2. Anota dos lecturas.</strong> Por ejemplo, si el indicador bajó del 80 % al 65 % durante cuatro horas, se consumieron 15 puntos porcentuales en ese período.
          </p>
          <p className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <strong>3. Proyecta hasta el reinicio.</strong> Con un 65 % restante, diez horas hasta el reinicio y un ritmo observado de 3,75 puntos por hora, quedarían aproximadamente 27,5 puntos si el ritmo se mantuviera.
          </p>
        </div>
      </section>

      <section className="grid gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Por qué el porcentaje no equivale a un número fijo de tareas
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            La cantidad de uso que consume una tarea cambia según el modelo y el trabajo que realiza.
          </p>
        </div>
        <ul className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <li className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            OpenAI indica que influyen el modelo, el entorno donde se ejecuta la tarea, su complejidad, el contexto, el razonamiento, la velocidad y las herramientas utilizadas.
          </li>
          <li className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            Codex puede mostrar una ventana de cinco horas y otra semanal. Comprueba el saldo y las horas de reinicio en Configuración o en tu panel de uso.
          </li>
          <li className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            Según el plan, Codex puede compartir el saldo con ChatGPT Work, Excel u otros agentes de espacio de trabajo. El chat normal de ChatGPT usa límites aparte.
          </li>
          <li className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            Esta página no lee tu cuenta ni sustituye el indicador oficial. La previsión solo resulta útil si comparas lecturas de la misma cuenta, ventana y ciclo.
          </li>
        </ul>
      </section>

      <section className="grid gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Preguntas frecuentes
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Respuestas sobre límites, saldo restante y privacidad.
          </p>
        </div>
        <div className="space-y-3">
          <details className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-950 dark:text-white">
              ¿Cuántos mensajes o tareas de Codex me quedan?
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              No existe una conversión universal de porcentaje a tareas. El consumo cambia según el modelo, el contexto, la complejidad y las herramientas. Esta calculadora estima el ritmo de tu saldo a partir de tus propias lecturas.
            </p>
          </details>
          <details className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-950 dark:text-white">
              ¿Tengo que calcular por separado el límite de cinco horas y el semanal?
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              Sí. Anota el porcentaje, el tiempo hasta el reinicio y las lecturas anteriores para una ventana a la vez. Usa siempre la hora que muestra tu cuenta.
            </p>
          </details>
          <details className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-950 dark:text-white">
              ¿La calculadora accede a mi cuenta de OpenAI?
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              No. Introduces las lecturas manualmente y el cálculo se realiza en tu navegador. No se envían ni se guardan.
            </p>
          </details>
          <details className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-950 dark:text-white">
              ¿Codex comparte el uso con ChatGPT?
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              En planes con saldos compartidos, Codex puede compartir uso con ChatGPT Work y otras funciones disponibles en ese plan. Los mensajes del chat normal de ChatGPT tienen límites separados. Comprueba tu plan y el saldo mostrado en tu cuenta.
            </p>
          </details>
        </div>
      </section>

      <section className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
          Fuentes oficiales
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li>
            <a className="font-medium text-cyan-800 underline underline-offset-4 dark:text-cyan-300" href="https://help.openai.com/es-es/articles/11369540" target="_blank" rel="noreferrer">
              Límites y uso de Codex según OpenAI
            </a>
          </li>
          <li>
            <a className="font-medium text-cyan-800 underline underline-offset-4 dark:text-cyan-300" href="https://chatgpt.com/es-ES/codex/pricing/" target="_blank" rel="noreferrer">
              Precios y rangos de uso de Codex
            </a>
          </li>
        </ul>
      </section>

      <p className="border-t border-zinc-200 pt-6 text-xs leading-5 text-zinc-500 dark:border-zinc-800">
        Esta herramienta es independiente y no está afiliada ni respaldada por OpenAI. Los resultados son estimaciones; consulta tu cuenta para ver el saldo y la hora de restablecimiento actuales.
      </p>

      <nav className="flex flex-wrap gap-4 border-t border-zinc-200 pt-6 text-sm dark:border-zinc-800" aria-label="Más calculadoras">
        <Link href="/codex-usage-calculator" className="font-medium text-cyan-800 underline underline-offset-4 dark:text-cyan-300">
          Codex usage calculator (English)
        </Link>
        <Link href="/" className="font-medium text-cyan-800 underline underline-offset-4 dark:text-cyan-300">
          Estimador general de uso de IA
        </Link>
      </nav>
    </main>
  );
}
