import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "AI Usage Limit Calculator: Messages & Tasks Left",
  description:
    "Estimate remaining prompts, messages, searches or coding tasks from your AI usage meter. Choose a platform, plan and reset window for a practical range.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Usage Limit Calculator: Messages & Tasks Left",
    description:
      "Estimate remaining AI prompts, messages or coding tasks from your usage meter, plan and selected reset window.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Usage Limit Calculator: Messages & Tasks Left",
    description:
      "Estimate remaining AI prompts, messages or coding tasks from your usage meter, plan and selected reset window.",
  },
};

export default function Home() {
  return (
    <SeoCalculatorPage
      h1="AI Usage Limit Calculator"
      intro="Estimate remaining prompts, messages, searches or coding tasks from your AI usage meter. Choose the platform, plan and reset window that match your account for a practical range."
    />
  );
}
