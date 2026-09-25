import Link from "next/link";
import type { ReactNode } from "react";

export default function EtsyPageShell({
  eyebrow,
  title,
  intro,
  children,
  locale = "en",
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
  locale?: "en" | "es";
}) {
  const spanish = locale === "es";
  return (
    <main lang={spanish ? "es" : "en"} className="min-h-screen bg-[#f7f6f0] text-stone-950">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <Link href={spanish ? "/es/comprobador-csv-etsy" : "/"} className="flex items-center gap-3" aria-label={spanish ? "Inicio de Listing Checkup" : "Listing Checkup home"}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-xs font-bold text-emerald-100">LC</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Listing Checkup</span>
              <span className="block text-xs text-stone-500">{spanish ? "Herramientas independientes para Etsy" : "Free Etsy seller tools"}</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-stone-600" aria-label={spanish ? "Navegación principal" : "Main navigation"}>
            <Link href={spanish ? "/es/comprobador-csv-etsy" : "/"} className="transition hover:text-stone-950">{spanish ? "Revisión CSV" : "CSV audit"}</Link>
            {!spanish && <Link href="/etsy-bulk-pricing-audit" className="transition hover:text-stone-950">US price plan</Link>}
            {spanish && <Link href="/es/planificador-precios-etsy-eeuu" className="transition hover:text-stone-950">Precios EE. UU.</Link>}
            <Link href="/etsy-sales-csv-analyzer" className="transition hover:text-stone-950">{spanish ? "Informe de ventas" : "Sales report"}</Link>
            <Link href={spanish ? "/es/planificador-reposicion-etsy" : "/etsy-restock-planner"} className="transition hover:text-stone-950">{spanish ? "Plan de reposición" : "Restock planner"}</Link>
            <Link href={spanish ? "/es/comprobador-titulos-etsy" : "/etsy-title-checker"} className="transition hover:text-stone-950">{spanish ? "Título" : "Title checker"}</Link>
            <Link href="/etsy-fee-calculator" className="transition hover:text-stone-950">{spanish ? "Calculadora de tarifas" : "Fee calculator"}</Link>
            <Link href={spanish ? "/es/comprobador-etiquetas-etsy" : "/etsy-tag-checker"} className="transition hover:text-stone-950">{spanish ? "Etiquetas" : "Tag checker"}</Link>
          </nav>
        </header>

        <article className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">{intro}</p>
          <div className="mt-10 space-y-8 text-stone-700">{children}</div>
        </article>

        <footer className="flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-200 pt-6 text-xs text-stone-500">
          <Link href={spanish ? "/es/comprobador-csv-etsy" : "/"} className="underline underline-offset-4 hover:text-stone-900">{spanish ? "Herramientas para Etsy" : "Etsy seller tools"}</Link>
          {!spanish && <Link href="/etsy-bulk-pricing-audit" className="underline underline-offset-4 hover:text-stone-900">US price planner</Link>}
          {spanish && <Link href="/es/planificador-precios-etsy-eeuu" className="underline underline-offset-4 hover:text-stone-900">Precios para EE. UU.</Link>}
          <Link href="/etsy-sales-csv-analyzer" className="underline underline-offset-4 hover:text-stone-900">{spanish ? "Informe de ventas" : "Sales report"}</Link>
          <Link href={spanish ? "/es/planificador-reposicion-etsy" : "/etsy-restock-planner"} className="underline underline-offset-4 hover:text-stone-900">{spanish ? "Plan de reposición" : "Restock planner"}</Link>
          <Link href={spanish ? "/es/comprobador-titulos-etsy" : "/etsy-title-checker"} className="underline underline-offset-4 hover:text-stone-900">{spanish ? "Comprobador de títulos" : "Title checker"}</Link>
          <Link href="/etsy-fee-calculator" className="underline underline-offset-4 hover:text-stone-900">{spanish ? "Calculadora de tarifas" : "Fee calculator"}</Link>
          <Link href={spanish ? "/es/comprobador-etiquetas-etsy" : "/etsy-tag-checker"} className="underline underline-offset-4 hover:text-stone-900">{spanish ? "Comprobador de etiquetas" : "Tag checker"}</Link>
          {!spanish && <Link href="/about" className="underline underline-offset-4 hover:text-stone-900">About</Link>}
          <Link href={spanish ? "/es/privacidad" : "/privacy"} className="underline underline-offset-4 hover:text-stone-900">{spanish ? "Privacidad" : "Privacy"}</Link>
          {!spanish && <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-stone-900">Affiliate disclosure</Link>}
        </footer>
      </div>
    </main>
  );
}
