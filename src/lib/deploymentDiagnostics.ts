export type DeploymentDiagnosis = {
  id: string;
  title: string;
  explanation: string;
  steps: string[];
};

type DiagnosticRule = DeploymentDiagnosis & { pattern: RegExp };

const rules: DiagnosticRule[] = [
  {
    id: "environment-variable",
    pattern: /(?:missing|undefined|not set|not provided|not configured).{0,80}(?:environment variable|env(?:ironment)?\s+var(?:iable)?|process\.env\.[A-Z][A-Z0-9_]*)|(?:process\.env\.[A-Z][A-Z0-9_]*).{0,50}(?:undefined|not set|missing)/i,
    title: "An environment variable may be missing",
    explanation: "The build appears to expect a setting that is not available in this deployment environment.",
    steps: [
      "Add the required variable in the hosting dashboard for the environment that failed (preview or production).",
      "Use the exact variable name from the error, then trigger a fresh deployment.",
      "Keep secret values out of source files and never paste them into this checker.",
    ],
  },
  {
    id: "missing-build-script",
    pattern: /Missing script:\s*["']build["']/i,
    title: "The project has no build script called build",
    explanation: "The deployment platform tried to run the usual build command, but package.json does not define it.",
    steps: [
      "Open package.json and check the scripts section for the correct build command.",
      "Set the host's Build Command to the command this project actually uses, or add a valid build script.",
      "Run that command from the repository root before deploying again.",
    ],
  },
  {
    id: "module-not-found",
    pattern: /Module not found|Cannot find module|Could not resolve|Failed to resolve import|Can't resolve/i,
    title: "A file or dependency could not be found",
    explanation: "The build cannot resolve an import. A dependency may be missing, a file may not be in the repository, or its letter casing may differ.",
    steps: [
      "Check the first missing import named in the full log and confirm the file is committed to Git.",
      "Match every letter in the import path to the filename; deployment systems commonly build on case-sensitive filesystems.",
      "If it is a package, add it to the project dependencies and commit the updated lockfile.",
    ],
  },
  {
    id: "typescript",
    pattern: /Type error:|error TS\d+:|TypeScript error/i,
    title: "TypeScript stopped the production build",
    explanation: "The compiler found a type error. The final 'build failed' line is usually less useful than the first TypeScript error above it.",
    steps: [
      "Find the first TypeScript error and note its file and line number.",
      "Fix that error, then run the same production build command locally.",
      "Deploy only after the local build completes successfully.",
    ],
  },
  {
    id: "node-version",
    pattern: /Unsupported engine|EBADENGINE|requires node(?:\.js)?\s*(?:>|>=)|node\.js version.{0,50}(?:not supported|unsupported|must be|required)/i,
    title: "The Node.js version may not match the project",
    explanation: "A dependency or build tool reports that the Node.js runtime selected for deployment does not meet its requirements.",
    steps: [
      "Check the Node.js version required by the package named in the full log.",
      "Select a compatible version in the hosting project settings and, if needed, record it in the repository.",
      "Keep the local and hosted Node.js versions aligned, then rebuild.",
    ],
  },
  {
    id: "lockfile",
    pattern: /npm ci can only install packages when package\.json and package-lock\.json|ERR_PNPM.*lockfile|lockfile.{0,60}(?:incompatible|out of date|does not satisfy|not compatible)/i,
    title: "The package manifest and lockfile may be out of sync",
    explanation: "The installer detected a mismatch between the dependencies in package.json and the committed lockfile.",
    steps: [
      "Choose the package manager used by the project and keep only its intended lockfile.",
      "Regenerate the lockfile after changing dependencies, then commit it with package.json.",
      "Use the matching install command in the hosting settings.",
    ],
  },
  {
    id: "output-directory",
    pattern: /No Output Directory named|Publish directory.{0,40}(?:doesn't exist|does not exist|not found)|Directory.{0,50}(?:does not exist|not found).{0,30}(?:dist|build|out)/i,
    title: "The configured output folder was not found",
    explanation: "The build finished or started, but the host could not find files in the directory it was told to publish.",
    steps: [
      "Check the framework's actual build output folder in the local build result.",
      "Set the host's output or publish directory to that folder; do not assume every framework uses dist.",
      "For server-rendered frameworks, select the matching framework preset instead of treating the app as a static site.",
    ],
  },
  {
    id: "browser-api-on-server",
    pattern: /window is not defined|document is not defined|localStorage is not defined/i,
    title: "Browser-only code ran during a server build",
    explanation: "The build reached code that expects a browser, such as window, document or localStorage, while rendering on the server.",
    steps: [
      "Find the first file named near this error and identify the browser-only code that runs during rendering.",
      "In Next.js, isolate interactive browser code in a Client Component; in other frameworks, use the framework's client-only pattern.",
      "Run the production build locally to confirm the fix before deploying.",
    ],
  },
];

const genericDiagnosis: DeploymentDiagnosis = {
  id: "unrecognized",
  title: "The log does not match a known pattern yet",
  explanation: "Build tools often finish with a generic failure line. The useful error is usually earlier in the log, near the first specific error message.",
  steps: [
    "Open the full build log and find the first specific error, not only the final 'command exited' line.",
    "Run the project's production build command locally so you can see whether the failure is in the app or only in the hosting configuration.",
    "Check the provider's official build troubleshooting guide and compare its framework, root directory and build settings.",
  ],
};

export function diagnoseDeploymentLog(log: string): DeploymentDiagnosis[] {
  if (!log.trim()) return [];

  const matches = rules.filter((rule) => rule.pattern.test(log));
  return matches.length > 0 ? matches.slice(0, 4).map(({ pattern: _pattern, ...diagnosis }) => diagnosis) : [genericDiagnosis];
}
