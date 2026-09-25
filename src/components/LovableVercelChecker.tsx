"use client";

import { useState } from "react";

const PACKAGE_NAME = "@lovable.dev/vite-tanstack-config";
const MAX_INPUT_LENGTH = 12_000;

type Locale = "en" | "es";
type ResultStatus = "ready" | "below" | "check-lockfile" | "missing" | "invalid";
type VersionSource = "lockfile" | "manifest" | "version";

type CheckResult = {
  status: ResultStatus;
  version?: string;
  source?: VersionSource;
};

type PackageJsonLike = {
  packages?: Record<string, { version?: string }>;
  dependencies?: Record<string, string | { version?: string }>;
  devDependencies?: Record<string, string | { version?: string }>;
};

const copy = {
  en: {
    label: "Paste package.json, a lockfile version, or the dependency line",
    placeholder: '{\n  "devDependencies": {\n    "@lovable.dev/vite-tanstack-config": "^2.6.2"\n  }\n}',
    hint: "For the resolved version, copy it from package-lock.json or enter the exact version shown in your lockfile.",
    privacy: "This check runs in your browser. Nothing is uploaded or saved. Paste package metadata only, never secrets or environment values.",
    button: "Check Lovable setup",
    clear: "Clear",
    detected: "Detected version",
    resultTitles: {
      ready: "The version meets Vercel’s documented threshold",
      below: "The resolved version is below the threshold",
      "check-lockfile": "Check the resolved version before changing config",
      missing: "No Lovable framework package found",
      invalid: "Could not read a version",
    } satisfies Record<ResultStatus, string>,
    resultBodies: {
      ready: "Vercel documents zero-configuration detection for Lovable projects with @lovable.dev/vite-tanstack-config version 2.6.2 or later. Sync the current project to GitHub, import that repository into Vercel, and confirm the latest commit is the one being deployed.",
      below: "This exact version is below the minimum Vercel documents for automatic Lovable framework detection. Update the dependency to 2.6.2 or later, sync the change to GitHub, and redeploy. A lower version does not by itself prove the project cannot be deployed with a different setup.",
      "check-lockfile": "This input does not establish the exact installed version. Check the resolved version in your lockfile. If it is below 2.6.2, update the dependency and commit the updated lockfile.",
      missing: "This text does not show @lovable.dev/vite-tanstack-config. It may be an older Vite/React project, a different framework, or an incomplete manifest. Identify the framework in the repository before applying a TanStack Start configuration.",
      invalid: "Enter a version such as 2.6.2 or ^2.6.2, the dependency line from package.json, or the JSON contents of package.json/package-lock.json.",
    } satisfies Record<ResultStatus, string>,
    manifestNote: "Because this came from package.json, also make sure the committed lockfile resolves to a compatible version.",
    unknownNote: "The checker does not access your repository or Vercel settings; it only reads the text you paste.",
  },
  es: {
    label: "Pega package.json, la versión del archivo de bloqueo o la línea de la dependencia",
    placeholder: '{\n  "devDependencies": {\n    "@lovable.dev/vite-tanstack-config": "^2.6.2"\n  }\n}',
    hint: "Para saber la versión resuelta, cópiala de package-lock.json o escribe la versión exacta del archivo de bloqueo.",
    privacy: "La comprobación se ejecuta en tu navegador. No se sube ni se guarda nada. Pega solo los datos de paquetes; nunca claves ni valores de entorno.",
    button: "Comprobar proyecto de Lovable",
    clear: "Borrar",
    detected: "Versión detectada",
    resultTitles: {
      ready: "La versión cumple el requisito documentado por Vercel",
      below: "La versión resuelta es inferior al requisito",
      "check-lockfile": "Comprueba la versión resuelta antes de cambiar la configuración",
      missing: "No se encontró el paquete de Lovable",
      invalid: "No se pudo leer la versión",
    } satisfies Record<ResultStatus, string>,
    resultBodies: {
      ready: "Vercel documenta la detección automática de proyectos Lovable con @lovable.dev/vite-tanstack-config versión 2.6.2 o posterior. Sincroniza el proyecto actual con GitHub, importa ese repositorio en Vercel y confirma que se despliega el último commit.",
      below: "Esta versión exacta está por debajo del mínimo que Vercel documenta para detectar automáticamente el framework de Lovable. Actualiza la dependencia a 2.6.2 o posterior, sincroniza el cambio con GitHub y vuelve a desplegar. Una versión inferior no demuestra por sí sola que el proyecto no pueda desplegarse con otra configuración.",
      "check-lockfile": "Este dato no confirma la versión exacta instalada. Comprueba la versión resuelta en el archivo de bloqueo. Si es inferior a 2.6.2, actualiza la dependencia y sube también el archivo de bloqueo.",
      missing: "El texto no muestra @lovable.dev/vite-tanstack-config. Puede ser un proyecto antiguo de Vite/React, usar otro framework o faltar parte del manifiesto. Identifica el framework del repositorio antes de aplicar una configuración de TanStack Start.",
      invalid: "Escribe una versión como 2.6.2 o ^2.6.2, pega la línea de la dependencia de package.json o pega el JSON de package.json/package-lock.json.",
    } satisfies Record<ResultStatus, string>,
    manifestNote: "Como has pegado package.json, confirma también que el archivo de bloqueo guardado en el repositorio resuelve una versión compatible.",
    unknownNote: "La herramienta no accede al repositorio ni a la configuración de Vercel; solo lee el texto que pegues.",
  },
} as const;

function readVersion(input: string): { version?: string; source?: VersionSource; status?: ResultStatus } {
  const trimmed = input.trim();
  if (!trimmed) return { status: "invalid" };

  try {
    const data = JSON.parse(trimmed) as PackageJsonLike;
    const lockfileDependency = data.dependencies?.[PACKAGE_NAME];
    const resolvedVersion =
      data.packages?.[`node_modules/${PACKAGE_NAME}`]?.version ??
      (typeof lockfileDependency === "object" && lockfileDependency ? lockfileDependency.version : undefined);
    if (resolvedVersion) return { version: resolvedVersion, source: "lockfile" };

    const declaredVersion = data.dependencies?.[PACKAGE_NAME] ?? data.devDependencies?.[PACKAGE_NAME];
    if (typeof declaredVersion === "string") return { version: declaredVersion, source: "manifest" };
    if (typeof declaredVersion === "object" && declaredVersion?.version) {
      return { version: declaredVersion.version, source: "manifest" };
    }

    return { status: "missing" };
  } catch {
    // A single dependency line or version string is also accepted below.
  }

  const dependencyLine = trimmed.match(/"?@lovable\.dev\/vite-tanstack-config"?\s*:\s*["']([^"']+)["']/i);
  const version = dependencyLine?.[1] ?? trimmed;
  const source: VersionSource = dependencyLine ? "manifest" : "version";
  return { version, source };
}

function evaluateInput(input: string): CheckResult {
  const parsed = readVersion(input);
  if (parsed.status) return parsed as CheckResult;

  const versionMatch = parsed.version?.match(/^([~^<>]=?|=)?\s*v?(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?$/);
  if (!versionMatch) return { status: "invalid", version: parsed.version, source: parsed.source };

  const operator = versionMatch[1] ?? "";
  const comparison =
    Number(versionMatch[2]) - 2 ||
    Number(versionMatch[3]) - 6 ||
    Number(versionMatch[4]) - 2;

  let status: ResultStatus;
  if (operator === "<" || operator === "<=" || versionMatch[5]) status = "check-lockfile";
  else if (comparison >= 0) status = "ready";
  else if (operator === "^" || operator === "~" || operator === ">" || operator === ">=") status = "check-lockfile";
  else status = "below";

  return { status, version: parsed.version, source: parsed.source };
}

export default function LovableVercelChecker({ locale = "en" }: { locale?: Locale }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const text = copy[locale];

  function check() {
    setResult(evaluateInput(input));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <label htmlFor={`lovable-vercel-version-${locale}`} className="text-sm font-semibold text-zinc-950">
          {text.label}
        </label>
        <textarea
          id={`lovable-vercel-version-${locale}`}
          value={input}
          onChange={(event) => {
            setInput(event.target.value.slice(0, MAX_INPUT_LENGTH));
            setResult(null);
          }}
          rows={7}
          spellCheck={false}
          autoComplete="off"
          placeholder={text.placeholder}
          className="mt-3 block w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs leading-5 text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/20"
        />
        <p className="mt-2 text-xs leading-5 text-zinc-500">{text.hint}</p>
        <p className="mt-2 text-xs leading-5 text-amber-800">{text.privacy}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!input.trim()}
            onClick={check}
            className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {text.button}
          </button>
          {input ? (
            <button
              type="button"
              onClick={() => {
                setInput("");
                setResult(null);
              }}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500"
            >
              {text.clear}
            </button>
          ) : null}
        </div>
      </div>

      <div aria-live="polite" className="rounded-2xl bg-zinc-950 p-5 text-white sm:p-6">
        {result ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
              {result.status === "ready" ? (locale === "es" ? "Compatible" : "Ready to check") : (locale === "es" ? "Resultado" : "Check result")}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">{text.resultTitles[result.status]}</h3>
            {result.version ? <p className="mt-3 font-mono text-sm text-cyan-100">{text.detected}: {result.version}</p> : null}
            <p className="mt-3 text-sm leading-6 text-zinc-300">{text.resultBodies[result.status]}</p>
            {result.source === "manifest" && result.status === "ready" ? <p className="mt-3 text-sm leading-6 text-zinc-300">{text.manifestNote}</p> : null}
            <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-5 text-zinc-400">{text.unknownNote}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">{locale === "es" ? "Comprobación local" : "Browser-based check"}</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">{locale === "es" ? "¿Tu proyecto Lovable encaja con la detección automática de Vercel?" : "Does your Lovable project meet Vercel’s auto-detection requirement?"}</h3>
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              {locale === "es"
                ? "Comprueba la versión declarada o resuelta de @lovable.dev/vite-tanstack-config sin conectar cuentas."
                : "Check the declared or resolved @lovable.dev/vite-tanstack-config version without connecting any accounts."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
