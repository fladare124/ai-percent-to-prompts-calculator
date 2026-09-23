import type { Metadata } from "next";
import Gpt6ProLimitCalculator from "@/components/Gpt6ProLimitCalculator";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "ChatGPT Limit Calculator for GPT-6 Pro",
  description:
    "Calculate GPT-6 Pro messages left in ChatGPT Pro or Business. Account for weekly, monthly and shared GPT-5.6 Sol Pro limits.",
  alternates: {
    canonical: "/chatgpt-limit-calculator",
  },
};

export default function ChatGptLimitCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="ChatGPT Limit Calculator: GPT-6 Pro Messages Left"
      intro="Calculate the GPT-6 Pro messages left in your ChatGPT plan. Enter what you have used so far to account for weekly or monthly allowances shared with GPT-5.6 Sol Pro."
      calculator={<Gpt6ProLimitCalculator />}
      guide={{
        title: "GPT-6 Pro message limits in ChatGPT",
        summary:
          "OpenAI publishes different GPT-6 Pro allowances by plan. Some of those messages share a limit with GPT-5.6 Sol Pro, so switching between the two models does not create a fresh allowance.",
        points: [
          "Pro $100 includes 50 messages per week shared across GPT-6 Pro and GPT-5.6 Sol Pro.",
          "Pro $200 includes up to 200 GPT-6 Pro messages per week. GPT-5.6 Sol Pro has a separate daily allowance of 170 messages, and the two Pro models together are capped at 200 messages per day.",
          "Business Standard includes 15 Pro-model messages per month; Business Premium includes 50 per week. Both allowances are shared across GPT-6 Pro and GPT-5.6 Sol Pro.",
          "GPT-6 Pro is available in Chat on Pro, Business and eligible Enterprise plans. Plus includes GPT-6 Astra in Work and Codex, which use separate allowances.",
          "This page subtracts the message counts you enter from the published plan limits. Check ChatGPT for your workspace permissions and exact reset times.",
        ],
        sources: [
          {
            label: "OpenAI: GPT-5.6 and GPT-6 Pro limits",
            href: "https://help.openai.com/en/articles/20001354-gpt-5-6",
          },
          {
            label: "OpenAI: ChatGPT Pro plans",
            href: "https://help.openai.com/en/articles/9793128-what-is-chatgpt-pro",
          },
          {
            label: "OpenAI: Codex usage and limits",
            href: "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan",
          },
        ],
      }}
      extraFaq={[
        {
          question: "How many GPT-6 Pro messages do I get?",
          answer:
            "OpenAI lists 50 per week on Pro $100, 200 per week on Pro $200, 15 per month on Business Standard, and 50 per week on Business Premium. The Pro-model allowance is shared with GPT-5.6 Sol Pro on Pro $100 and Business plans.",
        },
        {
          question: "Does GPT-6 Pro share its limit with GPT-5.6 Sol Pro?",
          answer:
            "Yes. Pro $100 and Business Standard/Premium use a shared allowance. Pro $200 has a separate GPT-6 Pro weekly limit and a shared daily cap across GPT-6 Pro and GPT-5.6 Sol Pro.",
        },
        {
          question: "Can ChatGPT Plus use GPT-6 Pro in Chat?",
          answer:
            "OpenAI lists GPT-6 Pro for Pro, Business and Enterprise Chat plans. Plus includes GPT-6 Astra in Work and Codex, whose usage rules are separate from Chat.",
        },
        {
          question: "Does this calculator read my ChatGPT account?",
          answer:
            "No. Enter the Pro-model messages you have used during the current period. ChatGPT remains the source for your account’s usage, workspace settings and reset time.",
        },
      ]}
    />
  );
}
