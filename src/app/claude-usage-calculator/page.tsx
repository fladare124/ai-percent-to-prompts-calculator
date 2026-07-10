import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Claude Usage Calculator - Estimate Messages Left",
  description:
    "Estimate Claude Sonnet 5, Fable 5, Opus 4.8 or Haiku 4.5 messages and coding tasks from your remaining percentage.",
  alternates: {
    canonical: "/claude-usage-calculator",
  },
};

export default function ClaudeUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Claude Usage Calculator"
      intro="Estimate Claude messages or coding tasks left for Sonnet 5, Fable 5, Opus 4.8 and Haiku 4.5, with adjustments for Claude Code, files, context and effort."
      platformFocus="Claude"
      extraFaq={[
        {
          question: "Does this support Claude Fable 5?",
          answer:
            "Yes. Select Claude as the platform and choose Claude Fable 5 as the model. The estimate treats it as a high-cost, high-capability Claude model. It is conservative for light and normal tasks; for demanding work, the model penalty is slightly less severe because Fable 5 may need fewer iterations, but task complexity still lowers the total.",
        },
        {
          question: "Which current Claude models are included?",
          answer:
            "The calculator includes Claude Sonnet 5, Fable 5, Opus 4.8 and Haiku 4.5. Model prices inform the relative estimate, but subscription limits remain dynamic.",
        },
      ]}
    />
  );
}
