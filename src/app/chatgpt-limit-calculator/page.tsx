import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "ChatGPT Usage Limit Calculator",
  description:
    "Estimate remaining ChatGPT messages from the percentage shown in your account. Adjust for your plan, model and reset window.",
  alternates: {
    canonical: "/chatgpt-limit-calculator",
  },
};

export default function ChatGptLimitCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="ChatGPT Limit Calculator"
      intro="Estimate how many ChatGPT messages your remaining usage percentage could cover. Set your plan and reset window, then account for the selected model and type of request."
      platformFocus="Codex"
      productFocus="ChatGPT chat"
      guide={{
        title: "Estimate ChatGPT messages from the usage meter",
        summary:
          "ChatGPT does not have one permanent message count for every model and plan. Treat the result as a planning range and use the limit shown in your own account as the source of truth.",
        points: [
          "The model-specific allowance can vary by plan and may change over time, so a percentage does not convert to a fixed number of messages.",
          "This calculator is set to ChatGPT chat. Use the separate Codex calculator for coding-agent tasks and shared agentic usage.",
          "For a personalized estimate, compare two readings from the same reset window and enter how many similar messages you sent between them.",
        ],
        sources: [
          { label: "OpenAI ChatGPT FAQ", href: "https://help.openai.com/en/articles/12677804-what-is-chatgpt-faq" },
          { label: "Using Codex with a ChatGPT plan", href: "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan" },
          { label: "OpenAI API pricing", href: "https://developers.openai.com/api/docs/pricing" },
        ],
      }}
      extraFaq={[
        {
          question: "Does a remaining percentage give an exact message count?",
          answer:
            "No. ChatGPT limits vary by plan and model. This tool applies a reference allowance and task assumptions; it does not read your live account limit.",
        },
      ]}
    />
  );
}
