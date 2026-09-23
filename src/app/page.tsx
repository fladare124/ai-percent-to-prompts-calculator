import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Usage Calculator: Estimate Prompts Left",
  description:
    "Turn your remaining AI usage percentage into an estimate of prompts, messages, searches or coding tasks. Free calculator for ChatGPT, Codex, Claude, Gemini, Cursor and more.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Usage Calculator: Estimate Prompts Left",
    description:
      "Estimate remaining AI prompts, messages, searches or coding tasks from the percentage shown in your usage meter.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Usage Calculator: Estimate Prompts Left",
    description:
      "Estimate remaining AI prompts, messages, searches or coding tasks from the percentage shown in your usage meter.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Percent to Prompts Calculator"
      intro="Enter the percentage shown as remaining in your AI usage meter. Estimate how many prompts, messages, searches or coding tasks that allowance could cover across ChatGPT, Codex, Claude, Gemini and more."
    />
  );
}
