"use client";

import { useState, type FormEvent } from "react";

type Locale = "en" | "es";
type ConnectionMode = "standard" | "proxy";
type RecordType = "A" | "AAAA" | "TXT" | "CNAME" | "CAA";

interface DnsAnswer {
  name: string;
  type: number;
  TTL?: number;
  data: string;
}

interface DnsJsonResponse {
  Status: number;
  Answer?: DnsAnswer[];
  Comment?: string;
}

interface QueryResult {
  key: RecordType;
  queryName: string;
  answers: DnsAnswer[];
  error?: string;
}

const recordNumbers: Record<RecordType, number> = {
  A: 1,
  CNAME: 5,
  TXT: 16,
  AAAA: 28,
  CAA: 257,
};

const copy = {
  en: {
    heading: "Check the public DNS records for a Lovable domain",
    intro: "Look up the records visible to Google Public DNS, then compare them with the exact values Lovable shows for your project. Nothing is checked until you submit this form.",
    domainLabel: "Domain or subdomain",
    domainPlaceholder: "example.com or www.example.com",
    domainHelp: "Enter a hostname only, without https:// or a page path.",
    modeLabel: "Connection method",
    standardMode: "Standard setup (A and TXT)",
    proxyMode: "CDN or proxy setup (CNAME)",
    expectedALabel: "Expected A record from Lovable (optional)",
    expectedAPlaceholder: "For example, the IP shown in Lovable",
    expectedTxtLabel: "Expected TXT verification value (optional)",
    expectedTxtPlaceholder: "Paste the complete value shown in Lovable",
    expectedCnameLabel: "Expected CNAME from Lovable (optional)",
    expectedCnamePlaceholder: "Paste the target hostname shown in Lovable",
    checkButton: "Check public DNS records",
    checkingButton: "Checking DNS…",
    invalidDomain: "Enter a valid domain or subdomain, such as example.com.",
    resultsHeading: "Records visible for",
    noRecords: "No record of this type was returned by Google Public DNS.",
    resolverError: "Lookup failed. Check the hostname or try again later.",
    expectedMatches: "Matches the value you entered.",
    expectedDoesNotMatch: "Does not match the value you entered. Compare it with Lovable before changing DNS.",
    aaaaWarning: "An AAAA record is visible. Lovable says an AAAA record can interfere with a standard domain connection; verify it belongs there before changing it.",
    standardNotice: "Compare the complete A and TXT values with Lovable. The TXT lookup uses _lovable for the hostname you entered.",
    proxyNotice: "In proxy mode, Lovable says to use its CNAME instead of the standard A and TXT records.",
    resolverView: "This is one public resolver’s view and may differ while DNS changes propagate.",
    diagnosisHeading: "What these results suggest",
    directAFound: "A records were returned for this hostname. Compare the complete values with the standard setup shown in Lovable.",
    directAMissing: "No direct A record was returned for this hostname. Check the exact host and connection method shown in Lovable.",
    txtFound: "A TXT record was returned for _lovable. Compare its complete value with the verification value in Lovable.",
    txtMissing: "No TXT record was returned for _lovable at this hostname. Check the exact host and allow time for DNS propagation.",
    cnameFound: "A CNAME was returned for this hostname. Compare its full target with the CNAME shown in Lovable.",
    cnameMissing: "No direct CNAME was returned for this hostname. Check the exact host and proxy setup shown in Lovable.",
    aaaaFound: "A direct AAAA record was returned for this hostname. Lovable says AAAA records can interfere with a standard connection; verify before changing it.",
    aaaaClear: "No direct AAAA record was returned for this hostname.",
    caaFound: "CAA records were returned. If SSL setup fails, check that the applicable policy allows the certificate authority Lovable requires.",
    caaMissing: "No CAA record was returned for this hostname. A policy on a parent domain may still apply.",
    partialLookup: "Some DNS lookups could not be completed. Review the individual results and try again.",
    privacy: "Your browser sends the hostname and record types to Google Public DNS. Google may log DNS query details under its privacy policy. This site does not receive or store the hostname or lookup results.",
    googlePrivacy: "Google Public DNS privacy",
    caaNotice: "CAA records can limit which certificate authorities issue SSL. If setup fails, compare these values with Lovable’s warning and check the authoritative DNS zone, including any parent-domain policy.",
    recordLabels: {
      A: "A record",
      AAAA: "AAAA record",
      TXT: "Lovable TXT verification record",
      CNAME: "CNAME record",
      CAA: "CAA certificate-authority records",
    } satisfies Record<RecordType, string>,
  },
  es: {
    heading: "Comprueba los registros DNS públicos del dominio de Lovable",
    intro: "Consulta los registros visibles para Google Public DNS y compáralos con los valores exactos que muestra Lovable para tu proyecto. La consulta solo empieza al enviar el formulario.",
    domainLabel: "Dominio o subdominio",
    domainPlaceholder: "ejemplo.com o www.ejemplo.com",
    domainHelp: "Escribe solo el nombre de dominio, sin https:// ni una ruta de página.",
    modeLabel: "Método de conexión",
    standardMode: "Configuración estándar (A y TXT)",
    proxyMode: "Configuración con CDN o proxy (CNAME)",
    expectedALabel: "Registro A esperado por Lovable (opcional)",
    expectedAPlaceholder: "Por ejemplo, la IP que muestra Lovable",
    expectedTxtLabel: "Valor TXT de verificación esperado (opcional)",
    expectedTxtPlaceholder: "Pega el valor completo que muestra Lovable",
    expectedCnameLabel: "CNAME esperado por Lovable (opcional)",
    expectedCnamePlaceholder: "Pega el destino que muestra Lovable",
    checkButton: "Consultar registros DNS públicos",
    checkingButton: "Consultando DNS…",
    invalidDomain: "Escribe un dominio o subdominio válido, por ejemplo ejemplo.com.",
    resultsHeading: "Registros visibles para",
    noRecords: "Google Public DNS no ha devuelto ningún registro de este tipo.",
    resolverError: "La consulta ha fallado. Comprueba el dominio o vuelve a intentarlo más tarde.",
    expectedMatches: "Coincide con el valor que has introducido.",
    expectedDoesNotMatch: "No coincide con el valor que has introducido. Compáralo con Lovable antes de cambiar el DNS.",
    aaaaWarning: "Hay un registro AAAA visible. Lovable indica que puede interferir con una conexión estándar; confirma que no sea necesario antes de cambiarlo.",
    standardNotice: "Compara los valores A y TXT completos con Lovable. La consulta TXT usa _lovable delante del dominio indicado.",
    proxyNotice: "En modo proxy, Lovable indica que debes usar su CNAME en lugar de los registros A y TXT estándar.",
    resolverView: "Es la respuesta de un resolver público; puede variar mientras se propagan los cambios de DNS.",
    diagnosisHeading: "Qué indican estos resultados",
    directAFound: "Se han devuelto registros A para este dominio. Compara todos los valores con la configuración estándar de Lovable.",
    directAMissing: "No se ha devuelto un registro A directo para este dominio. Comprueba el nombre exacto y el método de conexión que muestra Lovable.",
    txtFound: "Se ha devuelto un registro TXT para _lovable. Compara el valor completo con el que muestra Lovable para verificar el dominio.",
    txtMissing: "No se ha devuelto un TXT para _lovable en este dominio. Comprueba el nombre exacto y permite que se propaguen los cambios DNS.",
    cnameFound: "Se ha devuelto un CNAME para este dominio. Compara su destino completo con el que muestra Lovable.",
    cnameMissing: "No se ha devuelto un CNAME directo para este dominio. Comprueba el nombre exacto y la configuración proxy que muestra Lovable.",
    aaaaFound: "Se ha devuelto un registro AAAA directo para este dominio. Lovable indica que puede interferir con una conexión estándar; confírmalo antes de cambiarlo.",
    aaaaClear: "No se ha devuelto un registro AAAA directo para este dominio.",
    caaFound: "Se han devuelto registros CAA. Si falla el certificado SSL, comprueba que la política aplicable permita la autoridad que necesita Lovable.",
    caaMissing: "No se ha devuelto un registro CAA para este dominio. Puede existir una política en un dominio superior.",
    partialLookup: "No se pudieron completar algunas consultas DNS. Revisa cada resultado y vuelve a intentarlo.",
    privacy: "Tu navegador envía el dominio y los tipos de registro a Google Public DNS. Google puede registrar detalles de las consultas según su política de privacidad. Esta web no recibe ni guarda el dominio ni los resultados.",
    googlePrivacy: "Privacidad de Google Public DNS",
    caaNotice: "Los registros CAA pueden limitar qué autoridades emiten el certificado SSL. Si falla la configuración, compara estos valores con el aviso de Lovable y revisa la zona DNS autoritativa, incluida la política del dominio superior.",
    recordLabels: {
      A: "Registro A",
      AAAA: "Registro AAAA",
      TXT: "Registro TXT de verificación de Lovable",
      CNAME: "Registro CNAME",
      CAA: "Registros de autoridades de certificados CAA",
    } satisfies Record<RecordType, string>,
  },
} as const;

function normalizeHostname(rawValue: string): string | null {
  const value = rawValue.trim().replace(/\.$/, "");
  if (!value || /[\s/?#@]/.test(value)) return null;

  try {
    const parsed = new URL(`https://${value}`);
    const hostname = parsed.hostname.toLowerCase();
    const labels = hostname.split(".");
    const validLabels = labels.every((label) =>
      label.length > 0 &&
      label.length <= 63 &&
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label),
    );

    if (
      parsed.port ||
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash ||
      parsed.pathname !== "/" ||
      hostname.length > 253 ||
      labels.length < 2 ||
      !validLabels
    ) {
      return null;
    }

    return hostname;
  } catch {
    return null;
  }
}

function normalizeDnsName(name: string): string {
  return name.replace(/\.$/, "").toLowerCase();
}

function normalizeRecordValue(recordType: RecordType, value: string): string {
  const unquoted = value.trim().replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
  return recordType === "CNAME" ? unquoted.replace(/\.$/, "").toLowerCase() : unquoted;
}

function recordTypeLabel(type: number): string {
  switch (type) {
    case 1: return "A";
    case 5: return "CNAME";
    case 16: return "TXT";
    case 28: return "AAAA";
    case 257: return "CAA";
    default: return `TYPE ${type}`;
  }
}

async function lookupRecord(name: string, type: RecordType): Promise<DnsAnswer[]> {
  const query = new URLSearchParams({ name, type });
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`https://dns.google/resolve?${query.toString()}`, {
      headers: { accept: "application/dns-json" },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json() as DnsJsonResponse;
    if (result.Status !== 0 && result.Status !== 3) {
      throw new Error(result.Comment || `DNS status ${result.Status}`);
    }

    return result.Answer ?? [];
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function LovableDnsRecordChecker({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];
  const [domainInput, setDomainInput] = useState("");
  const [mode, setMode] = useState<ConnectionMode>("standard");
  const [expectedA, setExpectedA] = useState("");
  const [expectedTxt, setExpectedTxt] = useState("");
  const [expectedCname, setExpectedCname] = useState("");
  const [checkedDomain, setCheckedDomain] = useState("");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const domain = normalizeHostname(domainInput);

    if (!domain) {
      setError(t.invalidDomain);
      setResults([]);
      setCheckedDomain("");
      return;
    }

    setError("");
    setIsChecking(true);
    setCheckedDomain(domain);
    setResults([]);

    const queries: { key: RecordType; queryName: string }[] = mode === "standard"
      ? [
          { key: "A", queryName: domain },
          { key: "AAAA", queryName: domain },
          { key: "TXT", queryName: `_lovable.${domain}` },
          { key: "CAA", queryName: domain },
        ]
      : [
          { key: "CNAME", queryName: domain },
          { key: "AAAA", queryName: domain },
          { key: "CAA", queryName: domain },
        ];

    const queryResults = await Promise.all(queries.map(async ({ key, queryName }) => {
      try {
        return { key, queryName, answers: await lookupRecord(queryName, key) };
      } catch {
        return { key, queryName, answers: [], error: t.resolverError };
      }
    }));

    setResults(queryResults);
    setIsChecking(false);
  }

  function recordMatch(key: RecordType, expectedValue: string): boolean | null {
    const expected = expectedValue.trim();
    if (!expected) return null;
    const recordNumber = recordNumbers[key];
    const result = results.find((item) => item.key === key);
    if (!result || result.error) return null;
    const ownerName = normalizeDnsName(result.queryName);
    const normalizedExpected = normalizeRecordValue(key, expected);
    return result.answers.some((answer) =>
      answer.type === recordNumber &&
      normalizeDnsName(answer.name) === ownerName &&
      normalizeRecordValue(key, answer.data) === normalizedExpected,
    );
  }

  function directAnswers(key: RecordType): DnsAnswer[] {
    const result = results.find((item) => item.key === key);
    if (!result) return [];
    const ownerName = normalizeDnsName(result.queryName);
    return result.answers.filter((answer) =>
      answer.type === recordNumbers[key] &&
      normalizeDnsName(answer.name) === ownerName,
    );
  }

  const expectedAResult = recordMatch("A", expectedA);
  const expectedTxtResult = recordMatch("TXT", expectedTxt);
  const expectedCnameResult = recordMatch("CNAME", expectedCname);
  const expectedFinding = (key: RecordType, matches: boolean) =>
    `${t.recordLabels[key]}: ${matches ? t.expectedMatches : t.expectedDoesNotMatch}`;
  const findings: { tone: "good" | "warning" | "info"; text: string }[] = [];

  if (results.some((result) => result.error)) {
    findings.push({ tone: "warning", text: t.partialLookup });
  }

  if (mode === "standard") {
    const aResult = results.find((result) => result.key === "A");
    const txtResult = results.find((result) => result.key === "TXT");
    if (aResult && !aResult.error) {
      if (expectedAResult === true) findings.push({ tone: "good", text: expectedFinding("A", true) });
      else if (expectedAResult === false) findings.push({ tone: "warning", text: expectedFinding("A", false) });
      else if (directAnswers("A").length) findings.push({ tone: "info", text: t.directAFound });
      else findings.push({ tone: "warning", text: t.directAMissing });
    }
    if (txtResult && !txtResult.error) {
      if (expectedTxtResult === true) findings.push({ tone: "good", text: expectedFinding("TXT", true) });
      else if (expectedTxtResult === false) findings.push({ tone: "warning", text: expectedFinding("TXT", false) });
      else if (directAnswers("TXT").length) findings.push({ tone: "info", text: t.txtFound });
      else findings.push({ tone: "warning", text: t.txtMissing });
    }
  } else {
    const cnameResult = results.find((result) => result.key === "CNAME");
    if (cnameResult && !cnameResult.error) {
      if (expectedCnameResult === true) findings.push({ tone: "good", text: expectedFinding("CNAME", true) });
      else if (expectedCnameResult === false) findings.push({ tone: "warning", text: expectedFinding("CNAME", false) });
      else if (directAnswers("CNAME").length) findings.push({ tone: "info", text: t.cnameFound });
      else findings.push({ tone: "warning", text: t.cnameMissing });
    }
  }

  const aaaaResult = results.find((result) => result.key === "AAAA");
  if (aaaaResult && !aaaaResult.error) {
    findings.push(directAnswers("AAAA").length
      ? { tone: "warning", text: t.aaaaFound }
      : { tone: "info", text: t.aaaaClear });
  }

  const caaResult = results.find((result) => result.key === "CAA");
  if (caaResult && !caaResult.error) {
    const caaRecords = caaResult.answers.filter((answer) => answer.type === recordNumbers.CAA);
    findings.push(caaRecords.length
      ? { tone: "info", text: t.caaFound }
      : { tone: "info", text: t.caaMissing });
  }

  return (
    <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 sm:p-6" aria-labelledby="lovable-dns-checker-heading">
      <h2 id="lovable-dns-checker-heading" className="text-2xl font-semibold tracking-tight text-zinc-950">{t.heading}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{t.intro}</p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="lovable-dns-domain" className="block text-sm font-semibold text-zinc-950">{t.domainLabel}</label>
          <input
            id="lovable-dns-domain"
            value={domainInput}
            onChange={(event) => setDomainInput(event.target.value)}
            autoComplete="url"
            placeholder={t.domainPlaceholder}
            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 sm:max-w-xl"
          />
          <p className="mt-1 text-xs leading-5 text-zinc-500">{t.domainHelp}</p>
        </div>

        <div>
          <label htmlFor="lovable-dns-mode" className="block text-sm font-semibold text-zinc-950">{t.modeLabel}</label>
          <select
            id="lovable-dns-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value as ConnectionMode);
              setResults([]);
              setCheckedDomain("");
            }}
            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 sm:max-w-xl"
          >
            <option value="standard">{t.standardMode}</option>
            <option value="proxy">{t.proxyMode}</option>
          </select>
        </div>

        {mode === "standard" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lovable-dns-expected-a" className="block text-sm font-semibold text-zinc-950">{t.expectedALabel}</label>
              <input
                id="lovable-dns-expected-a"
                value={expectedA}
                onChange={(event) => setExpectedA(event.target.value)}
                placeholder={t.expectedAPlaceholder}
                className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20"
              />
            </div>
            <div>
              <label htmlFor="lovable-dns-expected-txt" className="block text-sm font-semibold text-zinc-950">{t.expectedTxtLabel}</label>
              <input
                id="lovable-dns-expected-txt"
                value={expectedTxt}
                onChange={(event) => setExpectedTxt(event.target.value)}
                placeholder={t.expectedTxtPlaceholder}
                className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20"
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="lovable-dns-expected-cname" className="block text-sm font-semibold text-zinc-950">{t.expectedCnameLabel}</label>
            <input
              id="lovable-dns-expected-cname"
              value={expectedCname}
              onChange={(event) => setExpectedCname(event.target.value)}
              placeholder={t.expectedCnamePlaceholder}
              className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 sm:max-w-xl"
            />
          </div>
        )}

        {error ? <p role="alert" className="text-sm font-medium text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={isChecking}
          className="inline-flex items-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isChecking ? t.checkingButton : t.checkButton}
        </button>
      </form>

      {checkedDomain ? (
        <div aria-live="polite" className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold text-zinc-950">{t.resultsHeading} <code>{checkedDomain}</code></h3>
            <p className="mt-1 text-xs leading-5 text-zinc-600">{mode === "standard" ? t.standardNotice : t.proxyNotice}</p>
          </div>

          {findings.length ? (
            <section className="rounded-xl border border-zinc-200 bg-white p-4" aria-labelledby="lovable-dns-diagnosis-heading">
              <h4 id="lovable-dns-diagnosis-heading" className="font-semibold text-zinc-950">{t.diagnosisHeading}</h4>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                {findings.map((finding, index) => (
                  <li
                    key={`${finding.tone}:${index}`}
                    className={finding.tone === "good" ? "text-emerald-800" : finding.tone === "warning" ? "text-amber-800" : "text-zinc-700"}
                  >
                    {finding.text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((result) => {
              const label = result.key === "TXT"
                ? `${t.recordLabels.TXT} · _lovable.${checkedDomain}`
                : `${t.recordLabels[result.key]} · ${result.queryName}`;
              const hasAaaa = result.key === "AAAA" && directAnswers("AAAA").length > 0;

              return (
                <article key={`${result.key}:${result.queryName}`} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <h4 className="text-sm font-semibold text-zinc-950">{label}</h4>
                  {result.error ? (
                    <p className="mt-2 text-sm text-red-700">{result.error}</p>
                  ) : result.answers.length ? (
                    <ul className="mt-2 space-y-2 break-all text-sm leading-5 text-zinc-700">
                      {result.answers.map((answer, index) => (
                        <li key={`${answer.type}:${answer.data}:${index}`}>
                          <span className="mr-2 text-xs text-zinc-500">{normalizeDnsName(answer.name)}</span>
                          <span className="mr-2 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">{recordTypeLabel(answer.type)}</span>
                          <span className="font-mono">{answer.data}</span>
                          {answer.TTL !== undefined ? <span className="ml-2 text-xs text-zinc-500">TTL {answer.TTL}s</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-zinc-600">{t.noRecords}</p>
                  )}
                  {hasAaaa && mode === "standard" ? <p className="mt-3 text-xs leading-5 text-amber-800">{t.aaaaWarning}</p> : null}
                  {result.key === "CAA" && !result.error ? <p className="mt-3 text-xs leading-5 text-zinc-600">{t.caaNotice}</p> : null}
                  {result.key === "A" && expectedAResult !== null ? (
                    <p className={`mt-3 text-xs leading-5 ${expectedAResult ? "text-emerald-800" : "text-amber-800"}`}>{expectedAResult ? t.expectedMatches : t.expectedDoesNotMatch}</p>
                  ) : null}
                  {result.key === "TXT" && expectedTxtResult !== null ? (
                    <p className={`mt-3 text-xs leading-5 ${expectedTxtResult ? "text-emerald-800" : "text-amber-800"}`}>{expectedTxtResult ? t.expectedMatches : t.expectedDoesNotMatch}</p>
                  ) : null}
                  {result.key === "CNAME" && expectedCnameResult !== null ? (
                    <p className={`mt-3 text-xs leading-5 ${expectedCnameResult ? "text-emerald-800" : "text-amber-800"}`}>{expectedCnameResult ? t.expectedMatches : t.expectedDoesNotMatch}</p>
                  ) : null}
                </article>
              );
            })}
          </div>

          <p className="text-xs leading-5 text-zinc-500">{t.resolverView}</p>
        </div>
      ) : null}

      <p className="mt-5 text-xs leading-5 text-zinc-500">
        {t.privacy} <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://developers.google.com/speed/public-dns/privacy" target="_blank" rel="noopener noreferrer">{t.googlePrivacy}</a>.
      </p>
    </section>
  );
}
