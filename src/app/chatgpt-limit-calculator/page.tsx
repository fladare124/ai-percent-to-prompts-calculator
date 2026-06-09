import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "ChatGPT Limit Calculator — Estimate Messages Left",
  description:
    "Estimate remaining ChatGPT messages or prompts from a remaining percentage, plan, model mode and tool selection.",
};

export default function ChatGptLimitCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="ChatGPT Limit Calculator"
      intro="Use the remaining percentage shown by ChatGPT to estimate messages or prompts left. The calculator adjusts for plan, thinking mode and heavier tools."
      platformFocus="ChatGPT"
      extraFaq={[
        {
          question: "Is the ChatGPT Plus number guaranteed?",
          answer:
            "No. The Plus preset is a rough short-window reference when applicable, and real limits can differ by model, feature and capacity.",
        },
      ]}
    />
  );
}
