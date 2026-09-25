"use client";

import { useState } from "react";
import { HOSTINGER_HREF, HOSTINGER_REL } from "@/lib/partners";

type Stack = "static" | "next" | "tanstack" | "backend";
type Priority = "easy" | "budget" | "services";
type ProjectUse = "personal" | "commercial";
type Detection = { stack: Stack; label: string };

type Host = {
  name: string;
  plan: string;
  summary: string;
  reason: string;
  caveat: string;
  href: string;
  linkLabel: string;
  rel?: string;
};

const hosts: Record<string, Host> = {
  vercel: {
    name: "Vercel",
    plan: "Hobby for personal demos · Pro for commercial projects",
    summary: "A documented deployment route for current Lovable/TanStack Start projects, Next.js apps and GitHub-based frontends.",
    reason: "Current Lovable projects use TanStack Start and Vercel documents zero-configuration deployment when the framework helper meets its version requirement.",
    caveat: "Vercel says Hobby is for personal, non-commercial use. Choose a commercial plan before you use the app for business or revenue.",
    href: "https://vercel.com/pricing",
    linkLabel: "Check Vercel plans",
  },
  hostinger: {
    name: "Hostinger",
    plan: "Business Web or a Cloud plan for managed Node.js apps",
    summary: "A managed hosting route for eligible Node.js apps, with GitHub import and framework detection.",
    reason: "It can fit an exported AI-built app when you prefer a guided hosting dashboard over configuring a server yourself.",
    caveat: "Node.js hosting requires an eligible Business or Cloud plan. Check the current plan price and app limits before moving a production project.",
    href: HOSTINGER_HREF,
    rel: HOSTINGER_REL,
    linkLabel: "Review Hostinger app hosting plans",
  },
  digitalocean: {
    name: "DigitalOcean App Platform",
    plan: "Static sites from $0 · app containers from $5/month",
    summary: "A managed option for apps with a Node service, worker or database alongside the frontend.",
    reason: "You can deploy from a Git repository and add app components as the project grows, without managing a virtual machine first.",
    caveat: "Container, database and outbound-transfer costs are separate. Price every component your app needs.",
    href: "https://www.digitalocean.com/pricing/app-platform",
    linkLabel: "Check App Platform pricing",
  },
};

function detectProjectType(packageJson: string): Detection | null {
  if (!packageJson.trim()) return null;

  try {
    const manifest = JSON.parse(packageJson) as {
      dependencies?: Record<string, unknown>;
      devDependencies?: Record<string, unknown>;
    };
    const dependencies = new Set([
      ...Object.keys(manifest.dependencies ?? {}),
      ...Object.keys(manifest.devDependencies ?? {}),
    ]);

    const serverFramework = ["express", "fastify", "@nestjs/core", "koa", "hono"].find((name) => dependencies.has(name));
    if (serverFramework) return { stack: "backend", label: `${serverFramework} server` };
    if (dependencies.has("@tanstack/react-start") || dependencies.has("@lovable.dev/vite-tanstack-config")) {
      return { stack: "tanstack", label: "TanStack Start app" };
    }
    if (dependencies.has("next")) return { stack: "next", label: "Next.js app" };
    if (dependencies.has("vite")) return { stack: "static", label: "Vite frontend" };

    const frontendFramework = ["react", "vue", "svelte", "astro"].find((name) => dependencies.has(name));
    if (frontendFramework) return { stack: "static", label: `${frontendFramework} frontend` };
  } catch {
    return null;
  }

  return null;
}

function getRecommendation(stack: Stack, priority: Priority, use: ProjectUse): Host {
  if (stack === "tanstack") return hosts.vercel;

  if (stack === "static") {
    if (use === "personal" && priority === "easy") return hosts.vercel;
    return hosts.digitalocean;
  }

  if (priority === "services") return hosts.digitalocean;
  if (stack === "backend" && priority === "easy") return hosts.hostinger;
  if (priority === "budget") return hosts.hostinger;
  return hosts.vercel;
}

const stackOptions: Array<{ id: Stack; title: string; detail: string }> = [
  { id: "tanstack", title: "TanStack Start app", detail: "Current Lovable projects · Vite plus a server framework" },
  { id: "static", title: "Static site or React frontend", detail: "Pages, portfolio or client-side app" },
  { id: "next", title: "Next.js app", detail: "Server-rendered pages or API routes" },
  { id: "backend", title: "Full-stack Node app", detail: "Backend, worker or database too" },
];

const priorityOptions: Array<{ id: Priority; title: string }> = [
  { id: "easy", title: "Easiest setup" },
  { id: "budget", title: "Predictable cost" },
  { id: "services", title: "Add app services" },
];

function Choice<T extends string>({
  value,
  current,
  title,
  detail,
  onClick,
}: {
  value: T;
  current: T;
  title: string;
  detail?: string;
  onClick: (value: T) => void;
}) {
  const selected = value === current;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onClick(value)}
      className={`rounded-xl border p-3 text-left transition ${selected ? "border-cyan-700 bg-cyan-50 ring-1 ring-cyan-700" : "border-zinc-200 bg-white hover:border-zinc-400"}`}
    >
      <span className="block text-sm font-semibold text-zinc-950">{title}</span>
      {detail ? <span className="mt-1 block text-xs leading-5 text-zinc-500">{detail}</span> : null}
    </button>
  );
}

export default function DeploymentFinder() {
  const [stack, setStack] = useState<Stack>("next");
  const [priority, setPriority] = useState<Priority>("easy");
  const [use, setUse] = useState<ProjectUse>("personal");
  const [packageJson, setPackageJson] = useState("");
  const [manualStack, setManualStack] = useState<Stack | null>(null);
  const detected = detectProjectType(packageJson);
  const activeStack = manualStack ?? detected?.stack ?? stack;
  const result = getRecommendation(activeStack, priority, use);

  return (
    <section id="finder" className="scroll-mt-6 rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="grid gap-9 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-7">
          <div>
            <label htmlFor="package-json" className="text-sm font-semibold">Have a package.json? Paste it for a quick framework check.</label>
            <textarea
              id="package-json"
              value={packageJson}
              onChange={(event) => {
                setPackageJson(event.target.value);
                setManualStack(null);
              }}
              rows={5}
              spellCheck={false}
              autoComplete="off"
              placeholder={'{\n  "dependencies": { "next": "..." }\n}'}
              className="mt-3 block w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs leading-5 text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/20"
            />
            <p className="mt-2 text-xs leading-5 text-zinc-500">The manifest is checked in this browser and is not uploaded. Do not paste API keys or other secrets.</p>
            {packageJson.trim() ? (
              detected ? (
                <p role="status" className="mt-2 text-xs font-medium text-cyan-800">
                  Detected {detected.label}. This is a starting point; the manifest cannot show routes, databases or environment settings.
                  {manualStack ? (
                    <button type="button" className="ml-1 underline underline-offset-2" onClick={() => setManualStack(null)}>Use detected type</button>
                  ) : null}
                </p>
              ) : (
                <p role="status" className="mt-2 text-xs leading-5 text-amber-800">No familiar framework was detected. Choose the app type below, or check that you pasted a valid package.json.</p>
              )
            ) : null}
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">What did your AI builder create?</legend>
            <div className="mt-3 grid gap-2">
              {stackOptions.map((option) => (
                <Choice
                  key={option.id}
                  value={option.id}
                  current={activeStack}
                  title={option.title}
                  detail={option.detail}
                  onClick={(value) => {
                    setStack(value);
                    setManualStack(value);
                  }}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">What matters most?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {priorityOptions.map((option) => (
                <Choice key={option.id} value={option.id} current={priority} title={option.title} onClick={setPriority} />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">Is this a personal demo or a commercial project?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Choice value="personal" current={use} title="Personal demo" detail="Portfolio, learning or private project" onClick={setUse} />
              <Choice value="commercial" current={use} title="Commercial project" detail="Business, clients or earning revenue" onClick={setUse} />
            </div>
          </fieldset>
        </div>

        <div aria-live="polite" className="rounded-2xl bg-zinc-950 p-5 text-white sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">A sensible starting point</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight">{result.name}</h3>
          <p className="mt-2 text-sm font-semibold text-cyan-200">{result.plan}</p>
          <p className="mt-4 text-sm leading-6 text-zinc-300">{result.summary}</p>
          <p className="mt-4 text-sm leading-6 text-zinc-300">{result.reason}</p>
          <p className="mt-5 rounded-xl border border-amber-200/20 bg-amber-100/10 p-4 text-sm leading-6 text-amber-100">{result.caveat}</p>
          <a href={result.href} target="_blank" rel={result.rel ?? "noopener noreferrer"} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200">
            {result.linkLabel} <span aria-hidden="true">↗</span>
          </a>
          <p className="mt-4 text-xs leading-5 text-zinc-400">This is a starting recommendation, not a quote. Hosting prices, limits and included services can change.</p>
        </div>
      </div>
    </section>
  );
}
