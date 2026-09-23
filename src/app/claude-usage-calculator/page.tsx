import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Claude Usage Calculator",
  description:
    "Estimate how many Claude messages or Claude Code tasks your remaining usage percentage could cover.",
  alternates: {
    canonical: "/claude-usage-calculator",
  },
};

export default function ClaudeUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Claude Usage Calculator"
      intro="Estimate how many Claude messages or Claude Code tasks your remaining percentage could cover. Adjust for plan, model, conversation length and task complexity."
      platformFocus="Claude"
      guide={{
        title: "Estimate Claude and Claude Code usage",
        summary:
          "Claude usage can span the Claude apps and Claude Code when you use a supported subscription sign-in. The messages or tasks available depend on the length and complexity of what you ask.",
        points: [
          "Anthropic says usage can change with message length, conversation context, file attachments, tools and model choice.",
          "Take both usage readings within the same reset window. For a personal estimate, count similar Claude messages or coding tasks between them.",
          "Claude subscription limits and API credits are separate. This calculator estimates subscription use and does not read either account balance.",
        ],
        sources: [
          { label: "Anthropic usage limit guide", href: "https://support.anthropic.com/en/articles/9797557-usage-limit-best-practices" },
          { label: "Claude Code with Pro or Max", href: "https://support.anthropic.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan" },
          { label: "Anthropic API pricing", href: "https://docs.anthropic.com/en/docs/about-claude/pricing" },
        ],
      }}
      extraFaq={[
        {
          question: "Are Claude and Claude Code limits shared?",
          answer:
            "Anthropic says Claude and Claude Code activity share usage limits on supported Pro and Max plan sign-ins. Check your plan and account usage page for the allowance that applies to you.",
        },
        {
          question: "Why can two Claude messages use different amounts?",
          answer:
            "Model choice, conversation length, attached files and tools can affect how quickly you reach a limit. A personal sample from similar tasks is usually more relevant than a generic average.",
        },
      ]}
    />
  );
}
