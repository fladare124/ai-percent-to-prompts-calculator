"use client";

import { useState } from "react";
import { diagnoseDeploymentLog } from "@/lib/deploymentDiagnostics";

const MAX_LOG_LENGTH = 16_000;

export default function DeploymentErrorHelper() {
  const [log, setLog] = useState("");
  const [diagnosedLog, setDiagnosedLog] = useState("");
  const diagnoses = diagnoseDeploymentLog(diagnosedLog);

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <label htmlFor="deployment-log" className="text-sm font-semibold text-zinc-950">Paste the failed build log</label>
        <textarea
          id="deployment-log"
          value={log}
          onChange={(event) => {
            setLog(event.target.value.slice(0, MAX_LOG_LENGTH));
            setDiagnosedLog("");
          }}
          rows={11}
          spellCheck={false}
          autoComplete="off"
          placeholder={'Example:\nModule not found: Can\'t resolve \'date-fns\'\n...'}
          className="mt-3 block w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs leading-5 text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/20"
        />
        <div className="mt-2 flex justify-between gap-4 text-xs leading-5 text-zinc-500">
          <p>Only common build errors are recognized. This is a first check, not a complete code review.</p>
          <span className="shrink-0">{log.length.toLocaleString()} / {MAX_LOG_LENGTH.toLocaleString()}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-amber-800">Analysis runs in this browser and the text is not saved or uploaded. Remove API keys, passwords, tokens and private URLs before pasting logs.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!log.trim()}
            onClick={() => setDiagnosedLog(log)}
            className="rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Diagnose the log
          </button>
          {log ? (
            <button
              type="button"
              onClick={() => {
                setLog("");
                setDiagnosedLog("");
              }}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500"
            >
              Clear log
            </button>
          ) : null}
        </div>
      </div>

      <div aria-live="polite" className="rounded-2xl bg-zinc-950 p-5 text-white sm:p-6">
        {diagnosedLog ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">What to check first</p>
            <div className="mt-4 space-y-5">
              {diagnoses.map((diagnosis) => (
                <article key={diagnosis.id} className="border-t border-white/10 pt-4 first:border-0 first:pt-0">
                  <h3 className="text-lg font-semibold">{diagnosis.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{diagnosis.explanation}</p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-200">
                    {diagnosis.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </article>
              ))}
            </div>
            <a href="/deploy-vibe-coded-app" className="mt-5 inline-flex text-sm font-semibold text-cyan-300 underline underline-offset-4 hover:text-cyan-100">Open the deployment troubleshooting guide</a>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">How this checker works</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Find the first useful clue.</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
              <li>It looks for common build failures such as missing packages, environment settings, TypeScript errors and output folders.</li>
              <li>It runs on this page. No AI service or hosting account is connected.</li>
              <li>It does not change your project. Review the suggested checks and confirm them in your code and host settings.</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
