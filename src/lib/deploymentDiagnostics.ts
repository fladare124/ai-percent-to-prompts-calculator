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

const spanishDiagnoses: Record<string, DeploymentDiagnosis> = {
  "environment-variable": {
    id: "environment-variable",
    title: "Puede faltar una variable de entorno",
    explanation: "La compilación parece necesitar una configuración que no está disponible en este entorno de despliegue.",
    steps: [
      "Añade la variable necesaria en el panel del proveedor para el entorno que ha fallado (vista previa o producción).",
      "Respeta exactamente el nombre indicado en el error y vuelve a desplegar.",
      "No incluyas claves secretas en el código ni las pegues en esta herramienta.",
    ],
  },
  "missing-build-script": {
    id: "missing-build-script",
    title: "El proyecto no tiene un script de compilación llamado build",
    explanation: "La plataforma ha intentado ejecutar el comando habitual, pero package.json no define ese script.",
    steps: [
      "Abre package.json y busca el comando correcto en la sección scripts.",
      "Configura el comando de compilación del proveedor o añade un script build válido.",
      "Ejecuta ese comando desde la carpeta principal del proyecto antes de volver a desplegar.",
    ],
  },
  "module-not-found": {
    id: "module-not-found",
    title: "No se encuentra un archivo o una dependencia",
    explanation: "La compilación no puede resolver una importación. Puede faltar un paquete, un archivo o coincidir las mayúsculas y minúsculas de su ruta.",
    steps: [
      "Busca la primera importación que falta en el registro y confirma que el archivo está en el repositorio.",
      "Comprueba que cada letra de la ruta coincide con el nombre del archivo; el servidor puede distinguir mayúsculas de minúsculas.",
      "Si falta un paquete, añádelo a las dependencias y confirma el archivo de bloqueo actualizado.",
    ],
  },
  typescript: {
    id: "typescript",
    title: "TypeScript ha detenido la compilación de producción",
    explanation: "El compilador ha encontrado un error de tipos. La primera línea específica suele ser más útil que el mensaje final de fallo.",
    steps: [
      "Busca el primer error de TypeScript y anota el archivo y la línea.",
      "Corrige ese error y ejecuta localmente el mismo comando de compilación de producción.",
      "Vuelve a desplegar cuando la compilación local termine correctamente.",
    ],
  },
  "node-version": {
    id: "node-version",
    title: "La versión de Node.js puede no coincidir con el proyecto",
    explanation: "Una dependencia o herramienta de compilación indica que la versión de Node.js del despliegue no cumple sus requisitos.",
    steps: [
      "Comprueba la versión de Node.js que necesita el paquete indicado en el registro completo.",
      "Selecciona una versión compatible en la configuración del proveedor y, si hace falta, indícala también en el repositorio.",
      "Usa versiones compatibles en local y en el servidor y vuelve a compilar.",
    ],
  },
  lockfile: {
    id: "lockfile",
    title: "package.json y el archivo de bloqueo pueden no coincidir",
    explanation: "El instalador ha detectado diferencias entre las dependencias declaradas y el archivo de bloqueo guardado en el repositorio.",
    steps: [
      "Confirma qué gestor de paquetes usa el proyecto y conserva el archivo de bloqueo correspondiente.",
      "Actualiza el archivo de bloqueo al cambiar dependencias y súbelo junto con package.json.",
      "Configura el mismo comando de instalación en el proveedor de alojamiento.",
    ],
  },
  "output-directory": {
    id: "output-directory",
    title: "No se ha encontrado la carpeta de publicación configurada",
    explanation: "El proveedor no encuentra los archivos en la carpeta que debe publicar.",
    steps: [
      "Comprueba en local dónde genera los archivos la compilación de este framework.",
      "Indica esa carpeta en el proveedor; no todos los proyectos usan dist.",
      "Si la app usa renderizado en servidor, selecciona la configuración del framework en vez de publicarla como un sitio estático.",
    ],
  },
  "browser-api-on-server": {
    id: "browser-api-on-server",
    title: "Se ha ejecutado código de navegador durante la compilación del servidor",
    explanation: "La compilación ha llegado a código que necesita window, document o localStorage mientras se ejecutaba fuera del navegador.",
    steps: [
      "Busca el primer archivo mencionado junto al error y localiza el código que solo debe ejecutarse en el navegador.",
      "En Next.js, sepáralo en un componente de cliente; otros frameworks tienen un patrón equivalente.",
      "Ejecuta la compilación de producción en local para confirmar la corrección.",
    ],
  },
  unrecognized: {
    id: "unrecognized",
    title: "El registro no coincide con un patrón conocido",
    explanation: "Las herramientas de compilación suelen terminar con un mensaje genérico. La causa concreta suele aparecer antes, junto a la primera línea de error específica.",
    steps: [
      "Abre el registro completo y busca el primer error concreto, no solo la línea final de comando fallido.",
      "Ejecuta localmente el comando de compilación de producción para averiguar si falla el código o solo la configuración del proveedor.",
      "Consulta la guía oficial del proveedor y compara framework, carpeta raíz y comandos de compilación.",
    ],
  },
};

export function diagnoseDeploymentLog(log: string, locale: "en" | "es" = "en"): DeploymentDiagnosis[] {
  if (!log.trim()) return [];

  const matches = rules.filter((rule) => rule.pattern.test(log));
  const diagnoses = matches.length > 0 ? matches.slice(0, 4).map(({ pattern: _pattern, ...diagnosis }) => diagnosis) : [genericDiagnosis];

  return locale === "es" ? diagnoses.map((diagnosis) => spanishDiagnoses[diagnosis.id] ?? diagnosis) : diagnoses;
}
