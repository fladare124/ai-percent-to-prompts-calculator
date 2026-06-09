"use client";

import type { AdvancedOptionKey, PlatformPreset } from "@/types";

interface AdvancedOptionsProps {
  preset: PlatformPreset;
  values: Partial<Record<AdvancedOptionKey, string>>;
  hiddenKeys?: AdvancedOptionKey[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (key: AdvancedOptionKey, value: string) => void;
}

export default function AdvancedOptions({
  preset,
  values,
  hiddenKeys = [],
  isOpen,
  onToggle,
  onChange,
}: AdvancedOptionsProps) {
  const visibleGroups = preset.advancedGroups.filter(
    (group) => !hiddenKeys.includes(group.key),
  );

  if (visibleGroups.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        aria-expanded={isOpen}
      >
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
        {isOpen ? "Hide advanced options" : "Show advanced options"}
      </button>

      {isOpen ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {visibleGroups.map((group) => (
            <label key={group.key} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {group.label}
              </span>
              <select
                value={values[group.key] ?? ""}
                onChange={(event) => onChange(group.key, event.target.value)}
                className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="">Not selected</option>
                {group.options.map((option) => (
                  <option key={option.value ?? option.label} value={option.value ?? option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}
