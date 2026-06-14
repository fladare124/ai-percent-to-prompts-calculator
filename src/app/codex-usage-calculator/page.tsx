import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Codex Usage Calculator - Estimate Remaining Tasks",
  description:
    "Estimate remaining Codex tasks, local messages or cloud tasks from the remaining percentage shown by the platform.",
  alternates: {
    canonical: "/codex-usage-calculator",
  },
};

export default function CodexUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Codex Usage Calculator"
      intro="Estimate roughly how many Codex tasks, local messages or cloud tasks may remain by entering the remaining usage percentage, plan and task style."
      platformFocus="Codex"
      extraFaq={[
        {
          question: "Why can Codex estimates vary?",
          answer:
            "Codex usage can vary a lot by reasoning effort, repo size, local or cloud execution and task complexity.",
        },
      ]}
    />
  );
}
