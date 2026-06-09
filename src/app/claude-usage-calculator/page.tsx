import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Claude Usage Calculator - Estimate Messages Left",
  description:
    "Estimate remaining Claude messages or coding tasks from a remaining percentage, with support for Claude Fable 5, Claude Code, files, context size and effort level.",
};

export default function ClaudeUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Claude Usage Calculator"
      intro="Estimate Claude messages or coding tasks left from the remaining percentage you see, with adjustments for Claude Fable 5, Claude Code, files, long context and extended thinking."
      platformFocus="Claude"
      extraFaq={[
        {
          question: "Does this support Claude Fable 5?",
          answer:
            "Yes. Select Claude as the platform and choose Claude Fable 5 as the model. The estimate treats it as a high-cost, high-capability Claude model. It is conservative for light and normal tasks; for demanding work, the model penalty is slightly less severe because Fable 5 may need fewer iterations, but task complexity still lowers the total.",
        },
      ]}
    />
  );
}
