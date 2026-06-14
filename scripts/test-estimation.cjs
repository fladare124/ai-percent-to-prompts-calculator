/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");

const root = process.cwd();
const originalResolveFilename = Module._resolveFilename;

require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  module._compile(output, filename);
};

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(root, "src", request.slice(2)),
      parent,
      isMain,
      options,
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const {
  estimateUsage,
  getClaudeFable5Multiplier,
  roundUsage,
} = require("../src/lib/estimation.ts");
const {
  buildShareText,
  getPlatformUnitLabel,
} = require("../src/lib/displayLabels.ts");
const {
  createDefaultEstimatorForm,
  DEFAULT_PLATFORM,
  DEFAULT_REMAINING_PERCENT,
  getPlatformFromSearch,
  normalizeStoredEstimatorForm,
} = require("../src/lib/formState.ts");
const { PLATFORMS } = require("../src/lib/platformPresets.ts");

function claudeInput(usageIntensity, advancedSelections = {}) {
  return {
    platform: "Claude",
    plan: "Pro",
    remainingPercent: 100,
    resetWindow: "5 hours",
    hoursUntilReset: 5,
    minutesUntilReset: 0,
    usageIntensity,
    advancedSelections,
  };
}

assert.equal(getClaudeFable5Multiplier("Light"), 0.26);
assert.equal(getClaudeFable5Multiplier("Normal"), 0.3);
assert.equal(getClaudeFable5Multiplier("Heavy"), 0.38);
assert.equal(getClaudeFable5Multiplier("Very heavy"), 0.5);

const fableLight = estimateUsage(
  claudeInput("Light", { model: "claude-fable-5" }),
);
const fableNormal = estimateUsage(
  claudeInput("Normal", { model: "claude-fable-5" }),
);
const fableHeavy = estimateUsage(
  claudeInput("Heavy", { model: "claude-fable-5" }),
);
const fableVeryHeavy = estimateUsage(
  claudeInput("Very heavy", { model: "claude-fable-5" }),
);

assert.equal(roundUsage(fableLight.estimatedMid), 31);
assert.equal(roundUsage(fableNormal.estimatedMid), 30);
assert.equal(roundUsage(fableHeavy.estimatedMid), 27);
assert.equal(roundUsage(fableVeryHeavy.estimatedMid), 23);

const sonnetLight = estimateUsage(
  claudeInput("Light", { model: "claude-sonnet" }),
);
const sonnetNormal = estimateUsage(
  claudeInput("Normal", { model: "claude-sonnet" }),
);

assert.ok(
  sonnetLight.estimatedMid > fableLight.estimatedMid,
  "Claude Sonnet should estimate more messages than Fable 5 for light tasks.",
);
assert.ok(
  sonnetNormal.estimatedMid > fableNormal.estimatedMid,
  "Claude Sonnet should estimate more messages than Fable 5 for normal tasks.",
);
assert.ok(
  fableVeryHeavy.estimatedMid < fableLight.estimatedMid,
  "Fable 5 very heavy should still estimate fewer tasks than Fable 5 light because task complexity is expensive.",
);

const codexPlusHigh = estimateUsage({
  platform: "Codex",
  plan: "Plus",
  remainingPercent: 65,
  resetWindow: "5 hours",
  hoursUntilReset: 5,
  minutesUntilReset: 0,
  usageIntensity: "Normal",
  advancedSelections: { reasoning: "High" },
});
const fablePro65 = estimateUsage({
  ...claudeInput("Normal", { model: "claude-fable-5" }),
  remainingPercent: 65,
});

assert.ok(
  codexPlusHigh.estimatedMid > fablePro65.estimatedMid,
  "Codex Plus with High reasoning should estimate more tasks than Claude Pro with Fable 5 for the same 65% window.",
);

assert.equal(
  getPlatformUnitLabel("Claude", "Claude Code", undefined, "claude-fable-5"),
  "Claude Code coding tasks",
);
assert.equal(
  getPlatformUnitLabel("Claude", "Standard chat", undefined, "claude-fable-5"),
  "Claude Fable 5 messages/tasks",
);

const shareText = buildShareText(
  fableNormal,
  getPlatformUnitLabel("Claude", "Standard chat", undefined, "claude-fable-5"),
  "Claude Fable 5",
);

assert.match(shareText, /Model: Claude Fable 5\./);
assert.match(shareText, /Estimated remaining: around 30 Claude Fable 5 messages\/tasks\./);
assert.match(shareText, /Calculated with AI Percent to Prompts Calculator\./);
assert.match(shareText, /Likely range:/);

const firstVisitDefault = createDefaultEstimatorForm();
assert.equal(DEFAULT_PLATFORM, "Codex");
assert.equal(DEFAULT_REMAINING_PERCENT, "65");
assert.equal(firstVisitDefault.platform, "Codex");
assert.equal(firstVisitDefault.remainingPercent, "65");
assert.deepEqual(firstVisitDefault.advancedSelections, {});

const claudeDefault = createDefaultEstimatorForm("Claude");
assert.equal(claudeDefault.advancedSelections.model, "claude-sonnet");
assert.equal(claudeDefault.advancedSelections.mode, "Standard chat");

const savedForm = normalizeStoredEstimatorForm(
  JSON.stringify({
    platform: "Codex",
    plan: "Plus",
    remainingPercent: "42",
    resetWindow: "Weekly",
    hoursUntilReset: "1",
    minutesUntilReset: "30",
    usageIntensity: "Heavy",
    advancedSelections: { reasoning: "High" },
  }),
);

assert.equal(savedForm.platform, "Codex");
assert.equal(savedForm.advancedSelections.reasoning, "High");
assert.equal(savedForm.remainingPercent, "42");

const savedBlankPercentForm = normalizeStoredEstimatorForm(
  JSON.stringify({
    platform: "Codex",
    plan: "Plus",
    remainingPercent: "",
    resetWindow: "5 hours",
    hoursUntilReset: "5",
    minutesUntilReset: "0",
    usageIntensity: "Normal",
    advancedSelections: {},
  }),
);

assert.equal(savedBlankPercentForm.remainingPercent, "65");

assert.equal(PLATFORMS[0], "Codex");
assert.equal(PLATFORMS.at(-1), "Other");
assert.equal(getPlatformFromSearch("?platform=chatgpt"), "ChatGPT");

const homePage = fs.readFileSync(
  path.join(root, "src", "app", "page.tsx"),
  "utf8",
);
assert.match(homePage, /Codex, ChatGPT, Claude, Gemini and more/);
assert.match(homePage, /AI Percent to Prompts Calculator - Estimate AI Prompts Left/);

console.log("Estimation tests passed.");
