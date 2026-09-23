import type { EstimateResult, PlatformName } from "@/types";

export function getPlatformUnitLabel(
  platform: PlatformName,
  selectedMode?: string,
  selectedFeature?: string,
  selectedModel?: string,
) {
  if (platform === "Codex") {
    if (selectedMode === "ChatGPT chat") {
      if (selectedFeature === "Image generation") {
        return "ChatGPT image generations";
      }
      if (selectedFeature === "Deep research") {
        return "ChatGPT deep research tasks";
      }
      if (selectedFeature === "Agent mode") return "ChatGPT agent tasks";
      return "ChatGPT messages";
    }
    if (selectedMode === "Work / workspace agents") {
      return "OpenAI agentic tasks";
    }
    return "Codex tasks";
  }

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
    return "Windsurf prompt credits/agent usage";
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
  selectedModeLabel?: string,
) {
  const platformLabel =
    result.platform === "Codex" &&
    result.factors.some((factor) => factor.includes("ChatGPT chat"))
      ? "ChatGPT"
      : result.platform;
  const modelLine = selectedModelLabel
    ? `Model: ${selectedModelLabel}.\n`
    : "";
  const modeLine =
    selectedModeLabel &&
    !["Standard", "standard", "Standard chat", "None / Instant"].includes(
      selectedModeLabel,
    )
      ? `Mode: ${selectedModeLabel}.\n`
      : "";

  return `${platformLabel} shows I have ${result.remainingPercent}% usage left.
${modelLine}Estimated remaining: around ${roundDisplayUsage(
    result.estimatedMid,
  )} ${unitLabel}.
Likely range: ${roundDisplayUsage(result.estimatedLow)}-${roundDisplayUsage(
    result.estimatedHigh,
  )} ${unitLabel}.
${modeLine}Window: ${result.resetWindow}.
Status: ${result.status}.
Calculated with Percent to Prompts.`;
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
    if (result.factors.some((factor) => factor.includes("ChatGPT chat"))) {
      return "ChatGPT uses its message window plus the selected model, reasoning level and feature. Higher effort settings can use more of the allowance.";
    }
    if (result.factors.some((factor) => factor.includes("Work / workspace agents"))) {
      return "OpenAI Work and workspace agents use the shared pool, adjusted for model cost, reasoning, execution mode and task complexity.";
    }
    return "Codex uses the shared OpenAI agentic pool and token-based model rates, adjusted for reasoning, execution mode, repo size and task complexity.";
  }

  if (result.platform === "ChatGPT") {
    return "ChatGPT starts from the published plan window when available, then adjusts for model, thinking time and selected tools.";
  }

  if (result.platform === "Claude") {
    if (hasClaudeFable5) {
      if (
        result.usageIntensity === "Heavy" ||
        result.usageIntensity === "Very heavy"
      ) {
        return "Claude Fable 5 has a high per-token cost, but demanding work gets a smaller penalty because it may need fewer iterations.";
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
    return "Gemini uses Google's compute-based plan ratios, adjusted for model, thinking level, selected feature and task demand.";
  }

  if (result.platform === "Cursor") {
    return "Cursor converts the plan's monthly included API usage into model-specific request estimates, then adjusts for agent mode and context size.";
  }

  if (result.platform === "Windsurf / Devin") {
    return "Windsurf starts from monthly prompt credits and applies each model's credit rate. Devin agent sessions remain less predictable.";
  }

  if (result.platform === "Perplexity") {
    return "Perplexity uses published search allowances where available, adjusted for search mode and research depth.";
  }

  return "Estimates use the selected preset, remaining percentage and task complexity.";
}
