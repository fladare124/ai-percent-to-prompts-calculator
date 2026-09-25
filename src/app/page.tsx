import type { Metadata } from "next";
import Link from "next/link";
import DeploymentFinder from "@/components/DeploymentFinder";

export const metadata: Metadata = {
  title: "Where to Deploy an AI-Built App: Hosting Finder",
  description:
    "Choose where to launch an app made with Cursor, Claude Code, Lovable, Bolt or Replit. Compare Vercel, Hostinger and DigitalOcean by app type and commercial use.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Where to Deploy an AI-Built App",
    description: "A practical hosting finder for apps made with AI coding tools.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where to Deploy an AI-Built App",
    description: "Pick a hosting path by framework, project needs and commercial use.",
    images: ["/opengraph-image"],
  },
};

const faq = [
  {
    question: "Can I deploy an app made with an AI coding tool anywhere?",
    answer:
      "Often, yes, if you can export the project or connect its Git repository. The best host depends on the framework, whether the app needs a backend or database, and how much server setup you want to manage.",
  },
  {
    question: "Can I earn money from a project hosted on Vercel Hobby?",
    answer:
      "Vercel describes Hobby as personal and non-commercial. For a business or revenue-generating project, review Vercel's current commercial plans or choose another host that fits the app.",
  },
  {
    question: "Can Hostinger run a Next.js app?",
    answer:
      "Hostinger lists Next.js among its supported Node.js frameworks. Its managed Node.js app workflow requires an eligible Business Web or Cloud plan; check current plan details before migrating.",
  },
  {
    question: "What does DigitalOcean App Platform cost?",
    answer:
      "DigitalOcean currently offers a free tier for static sites and paid app containers starting at $5 per month. Databases, outbound transfer and extra components can add costs, so price the full stack.",
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
            <a href="#finder" className="transition hover:text-zinc-950">Choose a host</a>
            <a href="#guides" className="transition hover:text-zinc-950">Deployment guides</a>
            <Link href="/about" className="transition hover:text-zinc-950">About</Link>
          </nav>
        </header>

        <section className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-800">A launch guide for AI-built apps</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Built an app with AI? Choose where to launch it.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">Cursor, Claude Code, Lovable, Bolt and Replit can leave you with very different projects. Pick a hosting path based on the files you have, whether the app makes money, and how much infrastructure you want to manage.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#finder" className="rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">Find my launch path</a>
              <Link href="/deploy-vibe-coded-app" className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-zinc-500">Read the deployment guide</Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-zinc-500">Independent guidance. Provider terms and prices change; confirm current details on their official pages before you deploy.</p>
          </div>

          <div className="rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">Three things that decide it</p>
            <div className="mt-5 space-y-4">
              {[
                ["01", "What did the AI create?", "Static frontend, Next.js, or a backend with data"],
                ["02", "Will the app earn money?", "Personal demos and commercial projects have different plan rules"],
                ["03", "What should the host run?", "Only a frontend, or also an API, worker or database"],
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

        <section id="finder" className="scroll-mt-6 border-t border-zinc-200 pt-12 sm:pt-16" aria-labelledby="finder-heading">
          <div className="mb-7 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Quick recommendation</p>
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
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Start here</p>
              <h3 className="mt-3 text-xl font-semibold">Deploy a vibe-coded app</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">A practical checklist for code from Cursor, Claude, Lovable, Bolt or Replit.</p>
              <span className="mt-5 inline-block text-sm font-semibold text-cyan-800 underline underline-offset-4">Read the guide →</span>
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
          <p>Prompt to Production · Practical hosting guidance for AI-built apps.</p>
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
