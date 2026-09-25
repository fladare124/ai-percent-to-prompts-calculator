import Link from "next/link";
import type { ReactNode } from "react";

export default function SitePageShell({
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
  return (
    <main lang={locale} className="min-h-screen bg-[#f7f7f4] text-zinc-950">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Prompt to Production home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-sm font-bold text-cyan-300">P→</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Prompt to Production</span>
              <span className="block text-xs text-zinc-500">by Percent to Prompts</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-zinc-600" aria-label={locale === "es" ? "Navegación principal" : "Main"}>
            {locale === "es" ? (
              <>
                <Link href="#diagnostics" className="transition hover:text-zinc-950">Solucionar errores</Link>
                <Link href="/#finder" className="transition hover:text-zinc-950">Buscador de alojamiento (EN)</Link>
                <Link href="/deploy-vibe-coded-app" lang="en" className="transition hover:text-zinc-950">English</Link>
              </>
            ) : (
              <>
                <Link href="/#troubleshoot" className="transition hover:text-zinc-950">Fix a deploy error</Link>
                <Link href="/#finder" className="transition hover:text-zinc-950">Choose a host</Link>
                <Link href="/deploy-vibe-coded-app" className="transition hover:text-zinc-950">Troubleshooting guide</Link>
                <Link href="/es/arreglar-error-despliegue" lang="es" className="transition hover:text-zinc-950">Español</Link>
              </>
            )}
          </nav>
        </header>

        <article className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">{intro}</p>
          <div className="mt-10 space-y-8 text-zinc-700">{children}</div>
        </article>

        <footer className="flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          <Link href="/" className="underline underline-offset-4 hover:text-zinc-900">{locale === "es" ? "Inicio · Sitio en inglés" : "Prompt to Production"}</Link>
          <Link href="/about" className="underline underline-offset-4 hover:text-zinc-900">{locale === "es" ? "Acerca del proyecto (EN)" : "About"}</Link>
          <Link href={locale === "es" ? "/es/privacidad" : "/privacy"} className="underline underline-offset-4 hover:text-zinc-900">{locale === "es" ? "Aviso de privacidad" : "Privacy"}</Link>
          <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-zinc-900">{locale === "es" ? "Afiliación (EN)" : "Affiliate disclosure"}</Link>
        </footer>
      </div>
    </main>
  );
}
