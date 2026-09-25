"use client";

import { useEffect, useState } from "react";
import { ANALYTICS_OPT_OUT_KEY } from "@/lib/analytics-preferences";

type Locale = "en" | "es";

const copy = {
  en: {
    label: "Exclude this browser from visit and performance analytics",
    loading: "Reading this browser’s preference…",
    excluded: "Future Web Analytics and Speed Insights events from this browser are excluded.",
    included: "This browser currently contributes to Web Analytics and Speed Insights.",
    unavailable: "This browser cannot save the analytics preference.",
  },
  es: {
    label: "Excluir este navegador de las analíticas de visitas y rendimiento",
    loading: "Consultando la preferencia de este navegador…",
    excluded: "Se excluyen los próximos eventos de Web Analytics y Speed Insights de este navegador.",
    included: "Este navegador contribuye actualmente a Web Analytics y Speed Insights.",
    unavailable: "Este navegador no puede guardar la preferencia de analíticas.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function AnalyticsOptOut({ locale = "en" }: { locale?: Locale }) {
  const [excluded, setExcluded] = useState<boolean | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const text = copy[locale];

  useEffect(() => {
    try {
      setExcluded(window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1");
    } catch {
      setStorageAvailable(false);
      setExcluded(false);
    }
  }, []);

  return (
    <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
      <label className="flex items-start gap-3 text-sm font-semibold leading-6 text-zinc-800">
        <input
          type="checkbox"
          checked={excluded ?? false}
          disabled={excluded === null || !storageAvailable}
          onChange={(event) => {
            const next = event.currentTarget.checked;
            try {
              if (next) {
                window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
              } else {
                window.localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
              }
              setExcluded(next);
            } catch {
              setStorageAvailable(false);
            }
          }}
          className="mt-1 h-4 w-4 shrink-0 accent-cyan-700"
        />
        <span>{text.label}</span>
      </label>
      <p role="status" aria-live="polite" className="mt-2 pl-7 text-xs leading-5 text-zinc-600">
        {excluded === null ? text.loading : !storageAvailable ? text.unavailable : excluded ? text.excluded : text.included}
      </p>
    </div>
  );
}
