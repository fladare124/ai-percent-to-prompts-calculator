import type { Metadata } from "next";
import Link from "next/link";
import DeploymentFinder from "@/components/DeploymentFinder";
import DeploymentErrorHelper from "@/components/DeploymentErrorHelper";

export const metadata: Metadata = {
  title: "Fix an AI App Deployment Error: Build Log Checker",
  description:
    "Paste a failed build log to identify common AI app deployment errors. Get browser-based troubleshooting and a practical path to launch.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fix an AI App Deployment Error",
    description: "Diagnose common build failures in your browser and get a practical next step.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fix an AI App Deployment Error",
    description: "Paste a failed build log for a browser-based first check.",
    images: ["/opengraph-image"],
  },
};

const faq = [
  {
    question: "What should I check first when an AI-built app fails to deploy?",
    answer:
      "Find the first specific error in the build log, not only the final command-failed line. Fix that issue and run the production build locally before deploying again.",
  },
  {
    question: "Why does my app work locally but fail on the host?",
    answer:
      "The deployed environment may use different dependencies, environment variables, Node.js versions, root directories or case-sensitive file paths. Compare those settings with the working local build.",
  },
  {
    question: "Does the deployment checker upload my log?",
    answer:
      "No. The checker reads the text in your browser and does not upload or save it. Remove secrets, tokens and private URLs before pasting logs.",
  },
  {
    question: "Will this checker automatically fix my app?",
    answer:
      "No. It recognizes a limited set of common build errors and suggests checks. Review the full log and your project settings to confirm the cause.",
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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Prompt to Production home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-sm font-bold text-cyan-300">P→</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Prompt to Production</span>
              <span className="block text-xs text-zinc-500">by Percent to Prompts</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-zinc-600" aria-label="Main">
            <a href="#troubleshoot" className="transition hover:text-zinc-950">Fix a deploy error</a>
            <a href="#finder" className="transition hover:text-zinc-950">Choose a host</a>
            <a href="#guides" className="transition hover:text-zinc-950">Guides</a>
            <Link href="/es/arreglar-error-despliegue" lang="es" className="transition hover:text-zinc-950">Español</Link>
            <Link href="/about" className="transition hover:text-zinc-950">About</Link>
          </nav>
        </header>

        <section className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-800">From failed build to working launch</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">AI app won’t deploy? Find the first useful clue.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">Paste a failed build log to check for common deployment problems in your browser. Then use the hosting finder and step-by-step guides to get the app ready to launch.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#troubleshoot" className="rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">Check a failed build log</a>
              <a href="#finder" className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-500">Choose where to deploy</a>
            </div>
            <p className="mt-4 text-xs leading-5 text-zinc-500">No account connection. Analysis stays in your browser; remove secrets from logs before pasting.</p>
          </div>

          <div className="rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">A practical route to launch</p>
            <div className="mt-5 space-y-4">
              {[
                ["01", "Find the first real error", "Look above the generic final build-failed message"],
                ["02", "Check the project settings", "Build command, dependencies, runtime and environment"],
                ["03", "Choose a matching host", "Compare framework support, services and plan terms"],
              ].map(([number, title, detail]) => (
                <div key={number} className="flex gap-4 border-t border-white/10 pt-4">
                  <span className="text-sm font-bold text-cyan-300">{number}</span>
                  <div>
                    <h2 className="text-base font-semibold">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="troubleshoot" className="scroll-mt-6 border-t border-zinc-200 pt-12 sm:pt-16" aria-labelledby="troubleshoot-heading">
          <div className="mb-7 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Free browser-based first check</p>
            <h2 id="troubleshoot-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Why did the AI-built app deployment fail?</h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">Paste the build log from your hosting dashboard. The checker recognizes common error patterns and gives you a short list of things to verify.</p>
          </div>
          <DeploymentErrorHelper />
        </section>

        <section id="finder" className="scroll-mt-6 border-t border-zinc-200 pt-12 sm:pt-16" aria-labelledby="finder-heading">
          <div className="mb-7 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">The next step after the build works</p>
            <h2 id="finder-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Find a host that fits your app</h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">Choose the framework or app shape, your priority and whether the project is commercial. We show the trade-offs and link to the provider’s current requirements.</p>
          </div>
          <DeploymentFinder />
        </section>

        <section id="guides" className="scroll-mt-6 border-t border-zinc-200 pt-12 sm:pt-16" aria-labelledby="guides-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">From generated code to a live app</p>
            <h2 id="guides-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Deployment guides that cover the last mile</h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">Choosing a provider is only part of launch. Check framework support, build commands, environment variables, domains and the costs that appear after the first deployment.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Link href="/deploy-vibe-coded-app" className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-cyan-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Troubleshooting</p>
              <h3 className="mt-3 text-xl font-semibold">Fix a failed AI app deployment</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Check build logs, missing dependencies, environment settings and common configuration mistakes.</p>
              <span className="mt-5 inline-block text-sm font-semibold text-cyan-800 underline underline-offset-4">Troubleshoot a build →</span>
            </Link>
            <Link href="/hostinger-nodejs-app" className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-cyan-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Managed Node.js</p>
              <h3 className="mt-3 text-xl font-semibold">Host a Next.js or Node app</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Hostinger plan requirements, GitHub deploy flow and checks before migrating.</p>
              <span className="mt-5 inline-block text-sm font-semibold text-cyan-800 underline underline-offset-4">See the requirements →</span>
            </Link>
            <Link href="/digitalocean-app-platform" className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-cyan-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Frontend + services</p>
              <h3 className="mt-3 text-xl font-semibold">Price an App Platform launch</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Understand containers, static hosting, databases and outbound transfer.</p>
              <span className="mt-5 inline-block text-sm font-semibold text-cyan-800 underline underline-offset-4">Read the cost guide →</span>
            </Link>
            <Link href="/lovable-to-vercel-checker" className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-cyan-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Lovable + Vercel</p>
              <h3 className="mt-3 text-xl font-semibold">Check your Lovable deployment version</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Verify the current framework requirement before importing the GitHub repository.</p>
              <span className="mt-5 inline-block text-sm font-semibold text-cyan-800 underline underline-offset-4">Check the setup →</span>
            </Link>
          </div>
        </section>

        <section className="mt-12 grid gap-8 rounded-3xl bg-cyan-50 p-6 sm:mt-16 sm:grid-cols-[0.8fr_1.2fr] sm:p-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-900">Before you go live</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Check these four things first</h2>
          </div>
          <ol className="grid gap-3 text-sm leading-6 text-zinc-700 sm:grid-cols-2">
            <li className="rounded-xl border border-cyan-100 bg-white p-4"><strong>Secrets:</strong> move API keys out of source files and into the host’s environment settings.</li>
            <li className="rounded-xl border border-cyan-100 bg-white p-4"><strong>Build:</strong> confirm the project builds from its Git repository, not only on your computer.</li>
            <li className="rounded-xl border border-cyan-100 bg-white p-4"><strong>Data:</strong> check database backups, access rules and where user data is stored.</li>
            <li className="rounded-xl border border-cyan-100 bg-white p-4"><strong>Plan terms:</strong> verify that the selected plan permits your commercial use.</li>
          </ol>
        </section>

        <section className="border-t border-zinc-200 pt-12 sm:pt-16" aria-labelledby="faq-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Common questions</p>
            <h2 id="faq-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Launching AI-generated code</h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-zinc-200 bg-white p-5">
                <summary className="cursor-pointer list-none pr-6 font-semibold text-zinc-950 marker:hidden">{item.question}<span aria-hidden="true" className="float-right text-cyan-800 transition group-open:rotate-45">＋</span></summary>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-xs leading-5 text-zinc-500">Provider information reviewed September 25, 2026. This site is independent and does not currently earn commission from the hosting providers mentioned.</p>
        </section>

        <footer className="mt-14 flex flex-col gap-4 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Prompt to Production · Troubleshooting and deployment guidance for AI-built apps.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            <Link href="/about" className="underline underline-offset-4 hover:text-zinc-900">About</Link>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-zinc-900">Privacy</Link>
            <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-zinc-900">Affiliate disclosure</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
