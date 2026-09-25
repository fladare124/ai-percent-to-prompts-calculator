"use client";

import { useMemo, useState, type ChangeEvent } from "react";

type StatementLine = {
  type: string;
  currency: string;
  amount: number | null;
  feesAndTaxes: number | null;
  net: number | null;
};

type StatementReport = {
  lines: StatementLine[];
  skippedRows: number;
};

type ActivitySummary = {
  type: string;
  currency: string;
  rows: number;
  amount: number;
  amountRows: number;
  feesAndTaxes: number;
  feeRows: number;
  net: number;
  netRows: number;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_ROWS = 100_000;

type Locale = "en" | "es";

const copyByLocale: Record<Locale, {
  badge: string;
  title: string;
  intro: string;
  clear: string;
  demo: string;
  chooseTitle: string;
  fileLimit: string;
  chooseCsv: string;
  reading: string;
  sample: string;
  rowMetric: string;
  typeMetric: string;
  currencyMetric: string;
  download: string;
  headers: string[];
  skippedRows: (count: string) => string;
  guideTitle: string;
  guideSteps: string[];
  guideLink: string;
  disclaimer: string;
  privacy: string;
  errors: {
    fileTooLarge: string;
    readFailure: string;
    emptyFile: string;
    noActivityRows: string;
    headers: string;
    maxRows: (count: string) => string;
    noReadableRows: string;
    unclosedQuote: string;
  };
}> = {
  en: {
    badge: "Free · Private · No sign-in",
    title: "Read your Etsy statement by activity type",
    intro: "Choose a Monthly Statement CSV to total the Amount, Fees & Taxes, and Net columns by activity and currency. The report runs in this browser.",
    clear: "Clear report",
    demo: "Demo statement only. These figures are examples; choose your own Etsy CSV before relying on any total.",
    chooseTitle: "Choose an Etsy Monthly Statement CSV",
    fileLimit: "CSV up to 10 MB · one statement at a time",
    chooseCsv: "Choose CSV",
    reading: "Reading file…",
    sample: "Try a sample statement",
    rowMetric: "statement rows included",
    typeMetric: "activity types",
    currencyMetric: "currencies",
    download: "Download activity summary CSV",
    headers: ["Activity type", "Currency", "Rows", "Amount column total", "Fees & Taxes column total", "Net column total"],
    skippedRows: (count) => `${count} non-empty rows were skipped because they had no readable activity type or amount values.`,
    guideTitle: "Download the right report in Etsy",
    guideSteps: [
      "Open Shop Manager → Finances → Monthly statements.",
      "Choose a month, select Generate CSV, then download the file from Etsy’s email.",
      "Choose that statement above. The analyzer reads the CSV locally and does not upload it.",
    ],
    guideLink: "Etsy’s monthly statement instructions ↗",
    disclaimer: "This report groups the signed values from the CSV by its exact activity type and currency. It does not connect every fee to a specific order, calculate product costs, or reconcile bank deposits. Etsy deposits and payment-account net profit are different measures; do not treat these statement totals as business profit or tax advice.",
    privacy: "Titles, buyer details, order references, and raw statement rows are not shown in the report or downloaded summary. The file stays in this browser.",
    errors: {
      fileTooLarge: "This file is over 10 MB. Export a smaller month and try again.",
      readFailure: "The CSV could not be read. Check the file and try again.",
      emptyFile: "The file is empty. Choose an Etsy Monthly Statement CSV export.",
      noActivityRows: "The CSV has a header but no activity rows.",
      headers: "I couldn’t find the Etsy statement columns for Type, Currency, and Amount, Fees & Taxes, or Net. Download the Monthly Statement CSV from Etsy and try again.",
      maxRows: (count) => `This file has more than ${count} rows. Export one month and try again.`,
      noReadableRows: "No readable statement rows were found. Check that the file is an Etsy Monthly Statement CSV with activity types and currency codes.",
      unclosedQuote: "The CSV contains an unclosed quoted field. Re-download it from Etsy and try again.",
    },
  },
  es: {
    badge: "Gratis · Privado · Sin iniciar sesión",
    title: "Resume tu extracto de Etsy por tipo de actividad",
    intro: "Elige un CSV de extracto mensual para sumar las columnas Importe, Tarifas e impuestos y Neto por tipo de actividad y moneda. El informe se procesa en este navegador.",
    clear: "Borrar informe",
    demo: "Extracto de ejemplo. Estas cifras son ficticias; selecciona tu CSV antes de usar cualquier total.",
    chooseTitle: "Selecciona un CSV de extracto mensual de Etsy",
    fileLimit: "CSV de hasta 10 MB · un extracto cada vez",
    chooseCsv: "Seleccionar CSV",
    reading: "Leyendo archivo…",
    sample: "Probar con un extracto de ejemplo",
    rowMetric: "filas del extracto incluidas",
    typeMetric: "tipos de actividad",
    currencyMetric: "monedas",
    download: "Descargar resumen de actividad CSV",
    headers: ["Tipo de actividad", "Moneda", "Filas", "Total en columna Importe", "Total en Tarifas e impuestos", "Total en columna Neto"],
    skippedRows: (count) => `Se omitieron ${count} filas con contenido porque no tenían un tipo de actividad o importes legibles.`,
    guideTitle: "Descarga el informe adecuado en Etsy",
    guideSteps: [
      "Abre el Administrador de la tienda → Finanzas → Extractos mensuales.",
      "Elige un mes y selecciona Generar CSV. Etsy te enviará un correo cuando el archivo esté listo para descargar.",
      "Selecciona el extracto aquí arriba. El CSV se lee en este navegador y no se sube a un servidor.",
    ],
    guideLink: "Ayuda de Etsy sobre la cuenta de pagos ↗",
    disclaimer: "Este informe agrupa los valores con signo del CSV por tipo de actividad y moneda. No asigna cada tarifa a un pedido, no calcula los costes del producto ni concilia depósitos bancarios. Etsy distingue los depósitos del beneficio neto de la cuenta de pagos; estos totales no son el beneficio contable de tu negocio ni asesoramiento fiscal.",
    privacy: "El informe y el CSV descargado no muestran títulos, datos de compradores, referencias de pedido ni las filas originales del extracto. El archivo permanece en este navegador.",
    errors: {
      fileTooLarge: "El archivo supera los 10 MB. Exporta un mes más pequeño e inténtalo de nuevo.",
      readFailure: "No se pudo leer el CSV. Comprueba el archivo e inténtalo de nuevo.",
      emptyFile: "El archivo está vacío. Elige un CSV de extracto mensual de Etsy.",
      noActivityRows: "El CSV contiene encabezados, pero no filas de actividad.",
      headers: "No encuentro las columnas Tipo, Moneda e Importe, Tarifas e impuestos o Neto del extracto de Etsy. Descarga el CSV de Extractos mensuales e inténtalo de nuevo.",
      maxRows: (count) => `El archivo tiene más de ${count} filas. Exporta un solo mes e inténtalo de nuevo.`,
      noReadableRows: "No se encontraron filas legibles. Comprueba que sea un CSV de extracto mensual de Etsy con tipo de actividad y código de moneda.",
      unclosedQuote: "El CSV contiene un campo entre comillas sin cerrar. Descárgalo de nuevo desde Etsy e inténtalo otra vez.",
    },
  },
};

export default function EtsyPaymentStatementAnalyzer({ locale = "en" }: { locale?: Locale }) {
  const copy = copyByLocale[locale];
  const [report, setReport] = useState<StatementReport | null>(null);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isSample, setIsSample] = useState(false);

  const activities = useMemo(() => {
    if (!report) return [];
    const grouped = new Map<string, ActivitySummary>();
    for (const line of report.lines) {
      const key = `${line.currency}:${normalizeText(line.type)}`;
      const current = grouped.get(key) ?? {
        type: line.type,
        currency: line.currency,
        rows: 0,
        amount: 0,
        amountRows: 0,
        feesAndTaxes: 0,
        feeRows: 0,
        net: 0,
        netRows: 0,
      };
      current.rows += 1;
      if (line.amount !== null) {
        current.amount = cents(current.amount + line.amount);
        current.amountRows += 1;
      }
      if (line.feesAndTaxes !== null) {
        current.feesAndTaxes = cents(current.feesAndTaxes + line.feesAndTaxes);
        current.feeRows += 1;
      }
      if (line.net !== null) {
        current.net = cents(current.net + line.net);
        current.netRows += 1;
      }
      grouped.set(key, current);
    }
    return [...grouped.values()].sort((a, b) =>
      a.currency.localeCompare(b.currency) || a.type.localeCompare(b.type),
    );
  }, [report]);

  const readFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setReport(null);
    setIsSample(false);
    setIsReading(true);
    try {
      if (file.size > MAX_FILE_BYTES) {
        throw new Error(copy.errors.fileTooLarge);
      }
      setReport(parseStatementCsv(await file.text(), locale));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.errors.readFailure);
    } finally {
      setIsReading(false);
    }
  };

  const onFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    void readFile(file);
  };

  const loadSample = () => {
    const sample = locale === "es"
      ? [
          "Fecha;Tipo;Título;Info;Moneda;Importe;Tarifas e impuestos;Neto",
          "2026-09-01;Venta;Collar Luna de Plata;Pedido #1001;EUR;48,00;-4,21;43,79",
          "2026-09-01;Transacción;Tarifa de transacción;Pedido #1001;EUR;0,00;-3,12;-3,12",
          "2026-09-01;Pago;Tarifa de procesamiento;Pedido #1001;EUR;0,00;-1,09;-1,09",
          "2026-09-02;Reembolso;Pendientes de arcilla;Pedido #1004;EUR;-10,00;0,00;-10,00",
          "2026-09-03;Marketing;Anuncios de Etsy;Anuncios;EUR;0,00;-2,00;-2,00",
          "2026-09-04;Depósito;Depósito;Depósito 555;EUR;-30,00;0,00;-30,00",
        ].join("\r\n")
      : [
          "Date,Type,Title,Info,Currency,Amount,Fees & Taxes,Net",
          "2026-09-01,Sale,Silver Moon Necklace,Order #1001,USD,48.00,-4.21,43.79",
          "2026-09-01,Transaction,Transaction fee,Order #1001,USD,0.00,-3.12,-3.12",
          "2026-09-01,Payment,Payment processing fee,Order #1001,USD,0.00,-1.09,-1.09",
          "2026-09-02,Refund,Clay Earrings,Order #1004,USD,-10.00,0.00,-10.00",
          "2026-09-03,Marketing,Etsy Ads,Ads,USD,0.00,-2.00,-2.00",
          "2026-09-04,Deposit,Deposit,Deposit 555,USD,-30.00,0.00,-30.00",
        ].join("\r\n");
    setReport(parseStatementCsv(sample, locale));
    setIsSample(true);
    setError("");
  };

  const clear = () => {
    setReport(null);
    setIsSample(false);
    setError("");
  };

  const downloadSummary = () => {
    if (!activities.length) return;
    const headers = copy.headers;
    const rows = activities.map((activity) => [
      activity.type,
      activity.currency,
      String(activity.rows),
      activity.amountRows ? activity.amount.toFixed(2) : "",
      activity.feeRows ? activity.feesAndTaxes.toFixed(2) : "",
      activity.netRows ? activity.net.toFixed(2) : "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    const filenamePrefix = locale === "es" ? "resumen-extracto-mensual-etsy" : "etsy-payment-statement-summary";
    downloadCsv(csv, `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const currencies = [...new Set(activities.map((activity) => activity.currency))];
  const typeCount = new Set(activities.map((activity) => normalizeText(activity.type))).size;

  return (
    <section id="payment-statement-analyzer" aria-labelledby="payment-statement-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">{copy.badge}</p>
          <h2 id="payment-statement-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{copy.intro}</p>
        </div>
        {report && <button type="button" onClick={clear} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">{copy.clear}</button>}
      </div>

      {report && isSample && <p role="status" className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950">{copy.demo}</p>}

      {!report ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 bg-[#fbfaf6] p-5 text-center sm:p-7">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-900" aria-hidden="true">↥</div>
          <p className="mt-4 font-semibold text-stone-900">{copy.chooseTitle}</p>
          <p className="mt-1 text-xs text-stone-500">{copy.fileLimit}</p>
          <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
            {isReading ? copy.reading : copy.chooseCsv}
            <input type="file" accept=".csv,text/csv" disabled={isReading} onChange={onFileSelected} className="sr-only" aria-label={copy.chooseTitle} />
          </label>
          <div className="mt-4">
            <button type="button" onClick={loadSample} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">{copy.sample}</button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric value={formatNumber(report.lines.length, locale)} label={copy.rowMetric} />
            <Metric value={formatNumber(typeCount, locale)} label={copy.typeMetric} />
            <Metric value={formatNumber(currencies.length, locale)} label={copy.currencyMetric} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={downloadSummary} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900">{copy.download}</button>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  {copy.headers.map((header, index) => <th key={header} className={`px-4 py-3 font-semibold ${index < 2 ? "text-left" : "text-right"}`}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={`${activity.currency}:${activity.type}`} className="border-t border-stone-200">
                    <td className="px-4 py-3 font-medium text-stone-900">{activity.type}</td>
                    <td className="px-4 py-3 text-stone-600">{activity.currency}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{formatNumber(activity.rows, locale)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{activity.amountRows ? formatCurrency(activity.amount, activity.currency, locale) : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{activity.feeRows ? formatCurrency(activity.feesAndTaxes, activity.currency, locale) : "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-stone-900">{activity.netRows ? formatCurrency(activity.net, activity.currency, locale) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {report.skippedRows > 0 && <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{copy.skippedRows(formatNumber(report.skippedRows, locale))}</p>}
        </>
      )}

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">{error}</p>}

      <div className="mt-6 border-t border-stone-100 pt-5">
        <p className="text-sm font-semibold text-stone-900">{copy.guideTitle}</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-600">
          {copy.guideSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <a href={locale === "es" ? "https://help.etsy.com/hc/es/articles/115015747228-Como-gestionar-tu-cuenta-de-pagos" : "https://help.etsy.com/hc/en-us/articles/360016389113-How-to-Calculate-Your-Etsy-Payments-Deposit-Amount"} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">{copy.guideLink}</a>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
        {copy.disclaimer}
      </div>
      <p className="mt-4 text-xs leading-5 text-stone-500">{copy.privacy}</p>
    </section>
  );
}

function parseStatementCsv(csvText: string, locale: Locale = "en"): StatementReport {
  const errors = copyByLocale[locale].errors;
  const cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) throw new Error(errors.emptyFile);
  const rows = parseCsv(cleanText, detectDelimiter(cleanText), locale).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error(errors.noActivityRows);

  const headers = rows[0].map(normalizeHeader);
  const typeIndex = findColumn(headers, ["type", "activity", "activitytype", "transactiontype", "tipo", "actividad"]);
  const currencyIndex = findColumn(headers, ["currency", "currencycode", "moneda", "divisa"]);
  const amountIndex = findColumn(headers, ["amount", "grossamount", "importe", "monto"]);
  const feesIndex = findColumn(headers, ["feesandtaxes", "feesandtax", "feeandtaxes", "chargesandtaxes", "feessuttaxes", "tasaseimpuestos", "tasasimpuestos", "tarifaseimpuestos"]);
  const netIndex = findColumn(headers, ["net", "netamount", "netproceeds", "neto", "importeneto"]);

  if (typeIndex < 0 || currencyIndex < 0 || (amountIndex < 0 && feesIndex < 0 && netIndex < 0)) {
    throw new Error(errors.headers);
  }

  const activityRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (activityRows.length > MAX_ROWS) throw new Error(errors.maxRows(formatNumber(MAX_ROWS, locale)));

  let skippedRows = 0;
  const lines: StatementLine[] = [];
  for (const row of activityRows) {
    const type = row[typeIndex]?.trim() ?? "";
    const currency = normalizeStatementCurrency(row[currencyIndex] ?? "");
    const amount = amountIndex >= 0 ? parseSignedMoney(row[amountIndex] ?? "") : null;
    const feesAndTaxes = feesIndex >= 0 ? parseSignedMoney(row[feesIndex] ?? "") : null;
    const net = netIndex >= 0 ? parseSignedMoney(row[netIndex] ?? "") : null;
    if (!type || currency === "Unknown" || (amount === null && feesAndTaxes === null && net === null)) {
      skippedRows += 1;
      continue;
    }
    lines.push({ type, currency, amount, feesAndTaxes, net });
  }

  if (lines.length === 0) throw new Error(errors.noReadableRows);
  return { lines, skippedRows };
}

function detectDelimiter(text: string): string {
  const counts = new Map([[",", 0], [";", 0], ["\t", 0]]);
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (inQuotes && text[index + 1] === '"') index += 1;
      else inQuotes = !inQuotes;
    } else if ((character === "\n" || character === "\r") && !inQuotes) break;
    else if (!inQuotes && counts.has(character)) counts.set(character, (counts.get(character) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function parseCsv(text: string, delimiter: string, locale: Locale): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (inQuotes && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else inQuotes = !inQuotes;
    } else if (character === delimiter && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (inQuotes) throw new Error(copyByLocale[locale].errors.unclosedQuote);
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function normalizeHeader(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findColumn(headers: string[], aliases: string[]): number {
  return headers.findIndex((header) => aliases.includes(header));
}

function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeStatementCurrency(value: string): string {
  const currency = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(currency) ? currency : "Unknown";
}

function parseSignedMoney(value: string): number | null {
  const normalized = value.trim().replace(/\u2212/g, "-");
  if (!normalized) return null;
  const parenthesizedNegative = /^\(.*\)$/.test(normalized);
  const negative = parenthesizedNegative || normalized.includes("-");
  const absolute = normalized.replace(/[()\-+]/g, "");
  const amount = parseMoney(absolute);
  return amount === null ? null : cents(negative ? -amount : amount);
}

function parseMoney(value: string): number | null {
  let normalized = value.trim().replace(/\u00a0/g, "").replace(/[^0-9,.-]/g, "");
  if (!normalized || !/[0-9]/.test(normalized)) return null;
  const comma = normalized.lastIndexOf(",");
  const period = normalized.lastIndexOf(".");
  if (comma >= 0 && period >= 0) {
    if (comma > period) normalized = normalized.replace(/\./g, "").replace(",", ".");
    else normalized = normalized.replace(/,/g, "");
  } else if (comma >= 0) {
    const decimalDigits = normalized.length - comma - 1;
    if (decimalDigits === 3) normalized = normalized.replace(/,/g, "");
    else normalized = normalized.replace(",", ".");
  } else if (period >= 0 && normalized.indexOf(".") !== period) {
    const decimalDigits = normalized.length - period - 1;
    if (decimalDigits === 3) normalized = normalized.replace(/\./g, "");
    else normalized = normalized.slice(0, period).replace(/\./g, "") + normalized.slice(period);
  }
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? cents(amount) : null;
}

function formatCurrency(amount: number, currency: string, locale: Locale): string {
  if (currency === "Unknown") return amount.toFixed(2);
  try {
    return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", { maximumFractionDigits: 2 }).format(value);
}

function cents(value: number): number {
  return Math.round((value + Math.sign(value) * Number.EPSILON) * 100) / 100;
}

function toCsvCell(value: string): string {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function downloadCsv(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-[#f7f6f0] p-4">
      <p className="text-2xl font-semibold tracking-tight text-stone-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-600">{label}</p>
    </div>
  );
}
