import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Cursor Usage Calculator - Estimate Requests Left",
  description:
    "Estimate remaining Cursor requests or agent runs from a remaining percentage, plan, mode and context size.",
  alternates: {
    canonical: "/cursor-usage-calculator",
  },
};

export default function CursorUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Cursor Usage Calculator"
      intro="Estimate Cursor requests or agent runs left from the remaining percentage you see, with adjustments for chat, edit, agent mode and context size."
      platformFocus="Cursor"
    />
  );
}
