import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Windsurf / Devin Usage Calculator - Estimate Agent Runs Left",
  description:
    "Estimate remaining Windsurf or Devin requests, agent runs or quota units from a remaining percentage, plan, mode and model.",
};

export default function WindsurfDevinUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Windsurf / Devin Usage Calculator"
      intro="Estimate Windsurf or Devin quota units and agent runs left from the remaining percentage you see, with adjustments for Cascade, cloud agents, Devin CLI and model choice."
      platformFocus="Windsurf / Devin"
    />
  );
}
