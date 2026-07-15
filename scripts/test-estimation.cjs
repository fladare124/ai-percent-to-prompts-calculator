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
const { PLATFORMS, platformPresets } = require("../src/lib/platformPresets.ts");

function input(overrides = {}) {
  return {
    platform: "Claude",
    plan: "Pro",
    remainingPercent: 100,
    resetWindow: "5 hours",
    hoursUntilReset: 5,
    minutesUntilReset: 0,
    usageIntensity: "Normal",
    advancedSelections: {},
    ...overrides,
  };
}

assert.equal(getClaudeFable5Multiplier("Light"), 0.2);
assert.equal(getClaudeFable5Multiplier("Normal"), 0.24);
assert.equal(getClaudeFable5Multiplier("Heavy"), 0.4);
assert.equal(getClaudeFable5Multiplier("Very heavy"), 0.6);

const claudeProSonnet = estimateUsage(
  input({ advancedSelections: { model: "claude-sonnet-5" } }),
);
const claudeMax5 = estimateUsage(
  input({ plan: "Max 5x", advancedSelections: { model: "claude-sonnet-5" } }),
);
const claudeMax20 = estimateUsage(
  input({ plan: "Max 20x", advancedSelections: { model: "claude-sonnet-5" } }),
);
assert.equal(roundUsage(claudeProSonnet.estimatedMid), 45);
assert.equal(roundUsage(claudeMax5.estimatedMid), 225);
assert.equal(roundUsage(claudeMax20.estimatedMid), 900);

const fableLight = estimateUsage(
  input({ usageIntensity: "Light", advancedSelections: { model: "claude-fable-5" } }),
);
const fableNormal = estimateUsage(
  input({ advancedSelections: { model: "claude-fable-5" } }),
);
const fableHeavy = estimateUsage(
  input({ usageIntensity: "Heavy", advancedSelections: { model: "claude-fable-5" } }),
);
const fableVeryHeavy = estimateUsage(
  input({ usageIntensity: "Very heavy", advancedSelections: { model: "claude-fable-5" } }),
);
assert.equal(roundUsage(fableLight.estimatedMid), 11);
assert.equal(roundUsage(fableNormal.estimatedMid), 11);
assert.equal(roundUsage(fableHeavy.estimatedMid), 13);
assert.equal(roundUsage(fableVeryHeavy.estimatedMid), 12);
assert.ok(claudeProSonnet.estimatedMid > fableNormal.estimatedMid);
assert.ok(fableVeryHeavy.estimatedMid > fableLight.estimatedMid);
assert.equal(fableNormal.apiCostEstimate, undefined);
assert.match(fableNormal.costReference, /No public subscription-to-token conversion/);

const codexPlusHigh = estimateUsage(
  input({
    platform: "Codex",
    plan: "Plus",
    remainingPercent: 65,
    resetWindow: "5 hours",
    usageIntensity: "Normal",
    advancedSelections: {
      product: "Codex",
      model: "gpt-5.6-sol",
      reasoning: "High",
    },
  }),
);
const fablePro65 = estimateUsage(
  input({ remainingPercent: 65, advancedSelections: { model: "claude-fable-5" } }),
);
assert.equal(roundUsage(codexPlusHigh.estimatedMid), 49);
assert.ok(codexPlusHigh.estimatedMid > fablePro65.estimatedMid);

const codexMaxMode = estimateUsage(
  input({
    platform: "Codex",
    plan: "Plus",
    remainingPercent: 65,
    resetWindow: "5 hours",
    advancedSelections: {
      product: "Codex",
      model: "gpt-5.6-sol",
      reasoning: "High",
      mode: "max",
    },
  }),
);
const codexUltraMode = estimateUsage(
  input({
    platform: "Codex",
    plan: "Plus",
    remainingPercent: 65,
    resetWindow: "5 hours",
    advancedSelections: {
      product: "Codex",
      model: "gpt-5.6-sol",
      reasoning: "High",
      mode: "ultra",
    },
  }),
);
assert.ok(codexPlusHigh.estimatedMid > codexMaxMode.estimatedMid);
assert.ok(codexMaxMode.estimatedMid > codexUltraMode.estimatedMid);

const chatGptFiveHours = estimateUsage(
  input({
    platform: "Codex",
    plan: "Plus",
    resetWindow: "5 hours",
    hoursUntilReset: 5,
    advancedSelections: {
      product: "ChatGPT chat",
      model: "gpt-5.5-instant",
      reasoning: "None / Instant",
    },
  }),
);
const chatGptWeekly = estimateUsage(
  input({
    platform: "Codex",
    plan: "Plus",
    resetWindow: "Weekly",
    hoursUntilReset: 168,
    advancedSelections: {
      product: "ChatGPT chat",
      model: "gpt-5.5-instant",
      reasoning: "None / Instant",
    },
  }),
);
assert.equal(roundUsage(chatGptFiveHours.estimatedMid), 100);
assert.notEqual(roundUsage(chatGptFiveHours.estimatedMid), roundUsage(chatGptWeekly.estimatedMid));
assert.equal(chatGptWeekly.baseLimitFallback, false);

const cursorProGpt = estimateUsage(
  input({
    platform: "Cursor",
    plan: "Pro",
    resetWindow: "Monthly",
    hoursUntilReset: 720,
    advancedSelections: { model: "GPT-5 / GPT-5.5" },
  }),
);
const cursorProSonnet = estimateUsage(
  input({
    platform: "Cursor",
    plan: "Pro",
    resetWindow: "Monthly",
    hoursUntilReset: 720,
    advancedSelections: { model: "Claude Sonnet 5" },
  }),
);
assert.equal(roundUsage(cursorProGpt.estimatedMid), 500);
assert.equal(roundUsage(cursorProSonnet.estimatedMid), 225);

const windsurfPro = estimateUsage(
  input({
    platform: "Windsurf / Devin",
    plan: "Pro",
    resetWindow: "Monthly",
    hoursUntilReset: 720,
    advancedSelections: { model: "Adaptive" },
  }),
);
assert.equal(roundUsage(windsurfPro.estimatedMid), 500);

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
assert.match(shareText, /Calculated with AI Percent to Prompts Calculator\./);
assert.match(shareText, /Likely range:/);

const firstVisitDefault = createDefaultEstimatorForm();
assert.equal(DEFAULT_PLATFORM, "Codex");
assert.equal(DEFAULT_REMAINING_PERCENT, "65");
assert.equal(firstVisitDefault.platform, "Codex");
assert.equal(firstVisitDefault.resetWindow, "5 hours");
assert.equal(firstVisitDefault.advancedSelections.product, "ChatGPT chat");
assert.equal(firstVisitDefault.advancedSelections.model, "gpt-5.6-sol");

const claudeDefault = createDefaultEstimatorForm("Claude");
assert.equal(claudeDefault.advancedSelections.model, "claude-fable-5");
assert.equal(claudeDefault.advancedSelections.mode, "Standard chat");
assert.equal(platformPresets.Cursor.defaultResetWindow, "Monthly");
assert.deepEqual(platformPresets.Codex.resetWindows, ["5 hours", "Daily", "Weekly", "Monthly"]);
assert.ok(
  platformPresets.Codex.advancedGroups
    .find((group) => group.key === "reasoning")
    .options.some((option) => option.label === "Extra High"),
);
assert.ok(
  platformPresets.Codex.advancedGroups
    .find((group) => group.key === "reasoning")
    .options.some((option) => option.label === "Max"),
);
assert.ok(
  platformPresets.Codex.advancedGroups
    .find((group) => group.key === "mode")
    .options.some((option) => option.label === "Ultra"),
);

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
assert.equal(savedForm.remainingPercent, "42");

assert.equal(PLATFORMS[0], "Codex");
assert.equal(PLATFORMS.includes("ChatGPT"), false);
assert.equal(PLATFORMS.includes("Other"), false);
assert.equal(getPlatformFromSearch("?platform=chatgpt"), "Codex");
assert.equal(
  getPlatformUnitLabel("Codex", "ChatGPT chat", undefined, "gpt-5.6-sol"),
  "ChatGPT messages",
);
assert.equal(
  getPlatformUnitLabel("Codex", "Codex", undefined, "gpt-5.6-sol"),
  "Codex tasks",
);

const homePage = fs.readFileSync(path.join(root, "src", "app", "page.tsx"), "utf8");
assert.match(homePage, /GPT-5\.6/);
assert.match(homePage, /Claude Fable 5/);

console.log("Estimation tests passed.");
