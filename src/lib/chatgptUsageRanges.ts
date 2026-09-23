export type ChatGPTPlanKey = "plus" | "pro5x" | "pro20x" | "business";

export interface MessageRange {
  low: number;
  high: number;
}

export interface ChatGPTModelRange {
  model: string;
  plans: Record<ChatGPTPlanKey, MessageRange>;
}

export const chatGPTPlans: Array<{ key: ChatGPTPlanKey; label: string }> = [
  { key: "plus", label: "Plus" },
  { key: "pro5x", label: "Pro 5x" },
  { key: "pro20x", label: "Pro 20x" },
  { key: "business", label: "Business Standard" },
];

export const chatGPTModelRanges: ChatGPTModelRange[] = [
  {
    model: "GPT-6 Astra",
    plans: {
      plus: { low: 5, high: 45 },
      pro5x: { low: 25, high: 225 },
      pro20x: { low: 100, high: 900 },
      business: { low: 5, high: 45 },
    },
  },
  {
    model: "GPT-6 Sol",
    plans: {
      plus: { low: 15, high: 150 },
      pro5x: { low: 70, high: 700 },
      pro20x: { low: 300, high: 3000 },
      business: { low: 15, high: 150 },
    },
  },
  {
    model: "GPT-6 Luna",
    plans: {
      plus: { low: 350, high: 3000 },
      pro5x: { low: 1750, high: 14000 },
      pro20x: { low: 7000, high: 56000 },
      business: { low: 350, high: 3000 },
    },
  },
  {
    model: "GPT-5.6 Sol",
    plans: {
      plus: { low: 10, high: 100 },
      pro5x: { low: 50, high: 500 },
      pro20x: { low: 200, high: 2000 },
      business: { low: 10, high: 100 },
    },
  },
  {
    model: "GPT-5.6 Terra",
    plans: {
      plus: { low: 25, high: 200 },
      pro5x: { low: 125, high: 1000 },
      pro20x: { low: 500, high: 4000 },
      business: { low: 25, high: 200 },
    },
  },
  {
    model: "GPT-5.6 Luna",
    plans: {
      plus: { low: 250, high: 2000 },
      pro5x: { low: 1250, high: 10000 },
      pro20x: { low: 5000, high: 40000 },
      business: { low: 250, high: 2000 },
    },
  },
  {
    model: "GPT-5.5",
    plans: {
      plus: { low: 15, high: 80 },
      pro5x: { low: 75, high: 400 },
      pro20x: { low: 300, high: 1600 },
      business: { low: 15, high: 80 },
    },
  },
  {
    model: "GPT-5.4",
    plans: {
      plus: { low: 20, high: 100 },
      pro5x: { low: 100, high: 500 },
      pro20x: { low: 400, high: 2000 },
      business: { low: 20, high: 100 },
    },
  },
  {
    model: "GPT-5.4 mini",
    plans: {
      plus: { low: 60, high: 350 },
      pro5x: { low: 300, high: 1750 },
      pro20x: { low: 1200, high: 7000 },
      business: { low: 60, high: 350 },
    },
  },
];

export const chatGPTUsageSource = "https://learn.chatgpt.com/docs/pricing";
