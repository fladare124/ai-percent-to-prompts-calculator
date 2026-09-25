import type { Metadata } from "next";
import Link from "next/link";
import DeploymentErrorHelper from "@/components/DeploymentErrorHelper";
import DeploymentFinder from "@/components/DeploymentFinder";

export const metadata: Metadata = {
  title: "AI App Deployment Troubleshooter | Lovable, Bolt & Vercel",
  description:
    "Diagnose common AI-built app deployment errors from a build log, choose a suitable host, and follow focused launch guides. Private, free, and no account required.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: { en: "/", "es-ES": "/es/arreglar-error-despliegue" },
  },
  openGraph: {
    title: "Fix an AI app deployment error",
    description:
      "Check a failed build log, choose a hosting path, and get your AI-built app ready to launch.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI App Deployment Troubleshooter",
    description: "Private deployment diagnostics and hosting guides for AI-built apps.",
    images: ["/opengraph-image"],
  },
};

const guides = [
  {
    label: "Lovable → Vercel",
    title: "App works in preview but Vercel shows 404",
    detail: "Identify the project setup before changing routes or build settings.",
    href: "/lovable-to-vercel-checker",
  },
  {
    label: "Bolt.new",
    title: "Bolt will not publish or deploy",
    detail: "Separate a preview problem from a publish or external build failure.",
    href: "/bolt-deployment-failed",
  },
  {
    label: "Build logs",
    title: "Find the first useful build error",
    detail: "Work through missing packages, TypeScript, Node versions and output folders.",
    href: "/deploy-vibe-coded-app",
  },
  {
    label: "Hosting",
    title: "Choose where to host an AI-built app",
    detail: "Compare options based on framework, commercial use and the services your app needs.",
    href: "/where-to-host-lovable-app",
  },
];

const faq = [
  {
    question: "Does this checker upload my deployment log?",
    answer:
      "No. The log is checked in your browser and is not sent to this site or an AI service. Remove passwords, API keys, tokens and private URLs before pasting it.",
  },
  {
    question: "Can it fix my app automatically?",
    answer:
      "No. It matches common error patterns and gives you a focused checklist and a prompt you can copy into your coding assistant. You decide what to change and should review it before deploying.",
  },
  {
    question: "Which tools does it support?",
    answer:
      "The checks apply to common deployment logs from Lovable, Bolt, Vercel, Cursor, Replit, Claude Code and other tools that generate web apps. The provider-specific guides explain when a fix applies to one framework or host.",
  },
  {
    question: "Can I use this for a commercial app?",
    answer:
      "Yes. The hosting finder asks whether the project is commercial and points you to provider terms to check. Review the live plan, pricing and commercial-use rules before launch.",
  },
];

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Prompt to Production Deployment Checker",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Diagnose common AI app deployment errors locally in the browser",
    "Copy a focused prompt for a coding assistant",
    "Identify a framework from package.json without uploading the file",
    "Compare hosting starting points for personal and commercial projects",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Prompt to Production home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-cyan-300">P→</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Prompt to Production</span>
              <span className="block text-xs text-slate-500">Launch help for AI-built apps</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600" aria-label="Main navigation">
            <a href="#diagnose" className="transition hover:text-slate-950">Error checker</a>
            <a href="#finder" className="transition hover:text-slate-950">Hosting finder</a>
            <a href="#guides" className="transition hover:text-slate-950">Guides</a>
            <Link href="/es/arreglar-error-despliegue" lang="es" hrefLang="es" className="transition hover:text-slate-950">Español</Link>
          </nav>
        </header>

        <section className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.78fr] lg:items-center lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-950">
              Free launch tools · Private in your browser
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
              Your AI-built app works in preview. Let’s get it live.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Paste a failed build log to find likely causes and the first checks to make. Then choose a hosting path that fits your app, framework and project use.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#diagnose" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Diagnose a deployment error
              </a>
              <a href="#finder" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-500">
                Choose where to host
              </a>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">For Lovable, Bolt, Vercel, Cursor, Replit, Claude Code and other AI app builders.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)] sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">The launch path</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">From error to next step</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">No sign-up</span>
            </div>
            <ol className="mt-5 space-y-4">
              {[
                ["01", "Paste a redacted build log", "Common failure patterns are matched locally."],
                ["02", "Check the likely cause", "Get a short list of steps and a prompt to copy."],
                ["03", "Pick a launch path", "Compare hosting by framework and how the app will be used."],
              ].map(([number, title, description]) => (
                <li key={number} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-cyan-300">{number}</span>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">Your log and project files stay on your device. The checker does not run or change your code.</p>
          </div>
        </section>

        <section id="diagnose" className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="diagnose-heading">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Deployment error checker</p>
            <h2 id="diagnose-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Find the first useful clue in your build log.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">Paste the relevant error lines, not secrets or private credentials. The checker looks for common build and deployment problems, then gives you a focused repair prompt to use with your coding assistant.</p>
          </div>
          <DeploymentErrorHelper />
        </section>

        <section id="finder" className="mt-14 scroll-mt-6" aria-labelledby="finder-heading">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Hosting decision helper</p>
            <h2 id="finder-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Choose a host that matches the app you actually built.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">Paste your <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">package.json</code> or select a framework. Then compare ease, cost and the needs of a personal demo or commercial project.</p>
          </div>
          <DeploymentFinder />
        </section>

        <section id="guides" className="mt-14 scroll-mt-6 border-t border-slate-200 pt-12 sm:pt-16" aria-labelledby="guides-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Step-by-step fixes</p>
            <h2 id="guides-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Get help for the problem you’re seeing.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">Provider settings differ by framework and by the generation of the project. These guides explain what to check before changing configuration or paying for another host.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <article key={guide.href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:shadow-sm sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">{guide.label}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{guide.detail}</p>
                <Link href={guide.href} className="mt-4 inline-flex text-sm font-semibold text-cyan-900 underline decoration-cyan-300 underline-offset-4">Open the guide →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-4 border-t border-slate-200 pt-12 md:grid-cols-3" aria-label="How the checker works">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Local log analysis</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">The pasted text is compared with known patterns on this page. It is not uploaded to a server or sent to an AI model.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Practical next checks</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">The result is a starting point, not a full code review. Verify the fix in your project and the provider’s current documentation.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Clear hosting trade-offs</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Recommendations consider framework, commercial use and app services. Prices, included limits and provider terms can change.</p>
          </article>
        </section>

        <section className="mt-14 border-t border-slate-200 pt-12 sm:pt-16" aria-labelledby="faq-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Frequently asked questions</p>
            <h2 id="faq-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">About the deployment checker</h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none pr-6 font-semibold marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-700">
                  {item.question}<span aria-hidden="true" className="float-right text-cyan-800 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-14 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Prompt to Production · Independent tools and guides for launching AI-built apps.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            <Link href="/about" className="underline underline-offset-4 hover:text-slate-900">About</Link>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-slate-900">Privacy</Link>
            <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-slate-900">Affiliate disclosure</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
