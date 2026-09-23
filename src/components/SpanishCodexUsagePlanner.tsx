"use client";

import { useState, type FormEvent } from "react";

type Readings = {
  remaining: string;
  hoursUntilReset: string;
  pointsSpent: string;
  hoursObserved: string;
};

type Estimate =
  | { kind: "empty" }
  | { kind: "steady"; sustainableRate: number }
  | {
      kind: "forecast";
      observedRate: number;
      sustainableRate: number;
      projectedRemaining: number;
      runsOutInHours: number;
    };

const initialReadings: Readings = {
  remaining: "",
  hoursUntilReset: "",
  pointsSpent: "",
  hoursObserved: "",
};

const fieldClassName =
  "mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

function parseNumber(value: string) {
  return Number(value.trim().replace(",", "."));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function SpanishCodexUsagePlanner() {
  const [readings, setReadings] = useState(initialReadings);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState("");

  function update(field: keyof Readings, value: string) {
    setReadings((current) => ({ ...current, [field]: value }));
    setEstimate(null);
    setError("");
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.values(readings).some((value) => value.trim() === "")) {
      setEstimate(null);
      setError("Completa las cuatro lecturas para calcular el ritmo de uso.");
      return;
    }

    const remaining = parseNumber(readings.remaining);
    const hoursUntilReset = parseNumber(readings.hoursUntilReset);
    const pointsSpent = parseNumber(readings.pointsSpent);
    const hoursObserved = parseNumber(readings.hoursObserved);

    if (
      ![remaining, hoursUntilReset, pointsSpent, hoursObserved].every(Number.isFinite) ||
      remaining < 0 || remaining > 100 ||
      hoursUntilReset <= 0 ||
      pointsSpent < 0 || pointsSpent > 100 ||
      hoursObserved <= 0
    ) {
      setEstimate(null);
      setError("Introduce porcentajes entre 0 y 100 y períodos de tiempo mayores que cero.");
      return;
    }

    if (remaining === 0) {
      setError("");
      setEstimate({ kind: "empty" });
      return;
    }

    const sustainableRate = remaining / hoursUntilReset;
    if (pointsSpent === 0) {
      setError("");
      setEstimate({ kind: "steady", sustainableRate });
      return;
    }

    setError("");
    const observedRate = pointsSpent / hoursObserved;
    const projectedRemaining = remaining - observedRate * hoursUntilReset;
    setEstimate({
      kind: "forecast",
      observedRate,
      sustainableRate,
      projectedRemaining: Math.max(0, projectedRemaining),
      runsOutInHours: remaining / observedRate,
    });
  }

  return (
    <section
      aria-labelledby="codex-usage-planner-title"
      className="border-t border-zinc-200 pt-8 dark:border-zinc-800"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
          Planificador de ritmo de uso
        </p>
        <h2 id="codex-usage-planner-title" className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
          ¿Te durará el uso de Codex hasta el restablecimiento?
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Compara el porcentaje que te queda con tu ritmo reciente. Si tu cuenta muestra un límite de 5 horas y otro semanal, calcula cada ventana por separado.
        </p>
      </div>

      <form
        onSubmit={calculate}
        className="mt-5 rounded-md border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Porcentaje restante en esta ventana
            <input
              aria-label="Porcentaje de uso de Codex que queda"
              type="text"
              inputMode="decimal"
              required
              value={readings.remaining}
              onChange={(event) => update("remaining", event.target.value)}
              className={fieldClassName}
              placeholder="Por ejemplo, 65"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Horas hasta el próximo restablecimiento
            <input
              aria-label="Horas hasta el restablecimiento del límite de Codex"
              type="text"
              inputMode="decimal"
              required
              value={readings.hoursUntilReset}
              onChange={(event) => update("hoursUntilReset", event.target.value)}
              className={fieldClassName}
              placeholder="Por ejemplo, 10"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Puntos porcentuales consumidos desde la lectura anterior
            <input
              aria-label="Puntos porcentuales de Codex consumidos desde la lectura anterior"
              type="text"
              inputMode="decimal"
              required
              value={readings.pointsSpent}
              onChange={(event) => update("pointsSpent", event.target.value)}
              className={fieldClassName}
              placeholder="Por ejemplo, 15"
            />
            <span className="mt-1 block text-xs font-normal leading-5 text-zinc-500 dark:text-zinc-400">
              Si el indicador bajó del 80 % al 65 %, escribe 15.
            </span>
          </label>

          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Horas entre esas dos lecturas
            <input
              aria-label="Horas entre las dos lecturas de uso de Codex"
              type="text"
              inputMode="decimal"
              required
              value={readings.hoursObserved}
              onChange={(event) => update("hoursObserved", event.target.value)}
              className={fieldClassName}
              placeholder="Por ejemplo, 4"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-5 min-h-10 rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:focus:ring-offset-zinc-900"
        >
          Calcular mi ritmo de uso
        </button>

        {error ? (
          <p className="mt-4 text-sm text-amber-800 dark:text-amber-200" role="alert">{error}</p>
        ) : null}

        {estimate ? (
          <div className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100" aria-live="polite" role="status">
            {estimate.kind === "empty" ? (
              <p>No queda saldo en esta ventana. Comprueba en tu cuenta la hora a la que se restablece.</p>
            ) : estimate.kind === "steady" ? (
              <p>
                Las lecturas no muestran consumo durante el período observado. Para repartir el saldo hasta el restablecimiento, tu uso medio debería mantenerse por debajo de <strong>{formatNumber(estimate.sustainableRate)} puntos porcentuales por hora</strong>.
              </p>
            ) : estimate.projectedRemaining === 0 ? (
              <p>
                Al ritmo observado de <strong>{formatNumber(estimate.observedRate)} puntos porcentuales por hora</strong>, el saldo podría agotarse en unas <strong>{formatNumber(estimate.runsOutInHours)} horas</strong>.
              </p>
            ) : (
              <p>
                Al ritmo observado de <strong>{formatNumber(estimate.observedRate)} puntos porcentuales por hora</strong>, podrían quedarte aproximadamente <strong>{formatNumber(estimate.projectedRemaining)} puntos porcentuales</strong> cuando se restablezca el límite.
              </p>
            )}
            {estimate.kind === "forecast" ? (
              <p className="mt-2">
                Para repartir el saldo restante hasta el restablecimiento, el uso medio debería mantenerse en torno a <strong>{formatNumber(estimate.sustainableRate)} puntos porcentuales por hora</strong> o menos.
              </p>
            ) : null}
          </div>
        ) : null}

        <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          Es una estimación, no una lectura en directo de tu cuenta. Compara porcentajes de la misma ventana y ciclo de restablecimiento. Puedes usar punto o coma decimal; los datos se calculan en este navegador y no se envían ni se guardan.
        </p>
        <a
          href="https://help.openai.com/es-es/articles/11369540"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-medium text-cyan-800 underline decoration-cyan-300 underline-offset-4 hover:text-cyan-600 dark:text-cyan-300 dark:decoration-cyan-800"
        >
          Consultar la guía oficial de uso de Codex
        </a>
      </form>
    </section>
  );
}
