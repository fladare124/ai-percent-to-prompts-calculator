import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percent to Prompts Calculator - GPT-5.6, Claude & Gemini",
  description:
    "Convert a remaining AI usage percentage into estimated prompts or tasks for GPT-5.6, Codex, Claude Sonnet 5, Fable 5, Gemini and more.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate prompts or tasks left for GPT-5.6, Codex, Claude Sonnet 5, Fable 5, Gemini and more.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Percent to Prompts Calculator",
    description:
      "Estimate prompts or tasks left for GPT-5.6, Codex, Claude Sonnet 5, Fable 5, Gemini and more.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Percent to Prompts Calculator"
      intro="Enter your remaining usage percentage and estimate prompts, messages or tasks left across GPT-5.6, Codex, Claude Sonnet 5, Fable 5, Gemini and more."
    />
  );
}
