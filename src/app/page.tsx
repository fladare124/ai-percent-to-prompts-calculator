import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Percent to Prompts Calculator - Estimate AI Prompts Left",
  description:
    "Enter your remaining usage percentage and estimate how many AI prompts, messages or tasks you may have left across Codex, ChatGPT, Claude, Gemini and more.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Percent to Prompts Calculator",
    description:
      "Convert your remaining AI usage percentage into estimated prompts, messages or tasks left.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Percent to Prompts Calculator",
    description:
      "Convert your remaining AI usage percentage into estimated prompts, messages or tasks left.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Percent to Prompts Calculator"
      intro="Enter your remaining usage percentage and estimate how many AI prompts, messages or tasks you may have left across Codex, ChatGPT, Claude, Gemini and more."
    />
  );
}
