import type { EstimateResult, PlatformName } from "@/types";

export function getPlatformUnitLabel(
  platform: PlatformName,
  selectedMode?: string,
  selectedFeature?: string,
  selectedModel?: string,
) {
  if (platform === "Codex") return "Codex tasks";

  if (platform === "ChatGPT") {
    if (selectedFeature === "Image generation") {
      return "ChatGPT image generations";
    }
    if (selectedFeature === "Deep research") {
      return "ChatGPT deep research tasks";
    }
    if (selectedFeature === "Agent mode") {
      return "ChatGPT agent tasks";
    }
    return "ChatGPT messages";
  }

  if (platform === "Claude") {
    if (
      (selectedModel === "claude-fable-5" ||
        selectedModel === "Claude Fable 5") &&
      selectedMode === "Claude Code"
    ) {
      return "Claude Code coding tasks";
    }
    if (
      selectedModel === "claude-fable-5" ||
      selectedModel === "Claude Fable 5"
    ) {
      return "Claude Fable 5 messages/tasks";
    }
    if (selectedMode === "Claude Code") return "Claude Code coding tasks";
    return "Claude messages/tasks";
  }

  if (platform === "Gemini") {
    if (selectedFeature === "Video generation") return "Gemini video generations";
    if (selectedFeature === "Image generation") return "Gemini image generations";
    return "Gemini prompts/actions";
  }

  if (platform === "Perplexity") {
    return "Perplexity searches/research tasks";
  }

  if (platform === "Cursor") {
    return "Cursor requests/agent runs";
  }

  if (platform === "Windsurf / Devin") {
    return "Windsurf quota units/agent runs";
  }

  return "AI usage units";
}

function roundDisplayUsage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

export function buildShareText(
  result: EstimateResult,
  unitLabel: string,
  selectedModelLabel?: string,
) {
  const modelLine = selectedModelLabel
    ? `Model: ${selectedModelLabel}.\n`
    : "";

  return `${result.platform} shows I have ${result.remainingPercent}% usage left.
${modelLine}Estimated remaining: around ${roundDisplayUsage(
    result.estimatedMid,
  )} ${unitLabel}.
Likely range: ${roundDisplayUsage(result.estimatedLow)}-${roundDisplayUsage(
    result.estimatedHigh,
  )} ${unitLabel}.
Window: ${result.resetWindow}.
Status: ${result.status}.
Calculated with Percent to Prompts Calculator.`;
}

export function getMainFactorsSummary(result: EstimateResult) {
  const hasClaudeFable5 = result.factors.some((factor) =>
    factor.includes("Claude Fable 5"),
  );
  const intensity = result.factors.find((factor) =>
    factor.endsWith("task complexity"),
  );
  const intensityPrefix = intensity
    ? `${intensity.replace(" task complexity", "")} tasks lower it because `
    : "";

  if (result.platform === "Codex") {
    return "Codex estimates use your plan, remaining percentage, reasoning effort, task type, repo size and execution style.";
  }

  if (result.platform === "ChatGPT") {
    return "ChatGPT estimates use your plan, model, thinking time and selected tools.";
  }

  if (result.platform === "Claude") {
    if (hasClaudeFable5) {
      if (
        result.usageIntensity === "Heavy" ||
        result.usageIntensity === "Very heavy"
      ) {
        return "Claude Fable 5 is high-cost, but demanding work gets a slightly less severe model penalty because it may need fewer iterations. Task complexity still lowers the total.";
      }
      return "Claude Fable 5 is treated as a high-cost, high-capability model, so the estimate is conservative for lighter tasks.";
    }

    const basePhrase = result.plan.startsWith("Max")
      ? "gives a high base estimate"
      : "sets the base estimate";

    if (intensityPrefix) {
      return `Claude ${result.plan} ${basePhrase}, but ${intensityPrefix}long context, files or coding can use more.`;
    }
    return `Claude ${result.plan} uses your plan, remaining percentage, mode, context and effort level.`;
  }

  if (result.platform === "Gemini") {
    return "Gemini estimates use your plan, model, thinking level and selected feature.";
  }

  if (result.platform === "Cursor" || result.platform === "Windsurf / Devin") {
    return "Coding assistant estimates use your plan, mode, context size and agent usage.";
  }

  if (result.platform === "Perplexity") {
    return "Perplexity estimates use your plan, search mode, API model and research depth.";
  }

  return "Estimates use the selected preset, remaining percentage and task complexity.";
}
