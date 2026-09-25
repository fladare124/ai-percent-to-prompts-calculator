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

export default function EtsyPaymentStatementAnalyzer() {
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
        throw new Error("This file is over 10 MB. Export a smaller month and try again.");
      }
      setReport(parseStatementCsv(await file.text()));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The CSV could not be read. Check the file and try again.");
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
    const sample = [
      "Date,Type,Title,Info,Currency,Amount,Fees & Taxes,Net",
      "2026-09-01,Sale,Silver Moon Necklace,Order #1001,USD,48.00,-4.21,43.79",
      "2026-09-01,Transaction,Transaction fee,Order #1001,USD,0.00,-3.12,-3.12",
      "2026-09-01,Payment,Payment processing fee,Order #1001,USD,0.00,-1.09,-1.09",
      "2026-09-02,Refund,Clay Earrings,Order #1004,USD,-10.00,0.00,-10.00",
      "2026-09-03,Marketing,Etsy Ads,Ads,USD,0.00,-2.00,-2.00",
      "2026-09-04,Deposit,Deposit,Deposit 555,USD,-30.00,0.00,-30.00",
    ].join("\r\n");
    setReport(parseStatementCsv(sample));
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
    const headers = ["Activity type", "Currency", "Rows", "Amount column total", "Fees & Taxes column total", "Net column total"];
    const rows = activities.map((activity) => [
      activity.type,
      activity.currency,
      String(activity.rows),
      activity.amountRows ? activity.amount.toFixed(2) : "",
      activity.feeRows ? activity.feesAndTaxes.toFixed(2) : "",
      activity.netRows ? activity.net.toFixed(2) : "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    downloadCsv(csv, `etsy-payment-statement-summary-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const currencies = [...new Set(activities.map((activity) => activity.currency))];
  const typeCount = new Set(activities.map((activity) => normalizeText(activity.type))).size;

  return (
    <section id="payment-statement-analyzer" aria-labelledby="payment-statement-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Free · Private · No sign-in</p>
          <h2 id="payment-statement-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Read your Etsy statement by activity type</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">Choose a Monthly Statement CSV to total the Amount, Fees &amp; Taxes, and Net columns by activity and currency. The report runs in this browser.</p>
        </div>
        {report && <button type="button" onClick={clear} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">Clear report</button>}
      </div>

      {report && isSample && <p role="status" className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950">Demo statement only. These figures are examples; choose your own Etsy CSV before relying on any total.</p>}

      {!report ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 bg-[#fbfaf6] p-5 text-center sm:p-7">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-900" aria-hidden="true">↥</div>
          <p className="mt-4 font-semibold text-stone-900">Choose an Etsy Monthly Statement CSV</p>
          <p className="mt-1 text-xs text-stone-500">CSV up to 10 MB · one statement at a time</p>
          <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
            {isReading ? "Reading file…" : "Choose CSV"}
            <input type="file" accept=".csv,text/csv" disabled={isReading} onChange={onFileSelected} className="sr-only" aria-label="Choose Etsy Monthly Statement CSV file" />
          </label>
          <div className="mt-4">
            <button type="button" onClick={loadSample} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">Try a sample statement</button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric value={formatNumber(report.lines.length)} label="statement rows included" />
            <Metric value={formatNumber(typeCount)} label="activity types" />
            <Metric value={formatNumber(currencies.length)} label="currencies" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={downloadSummary} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900">Download activity summary CSV</button>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Activity type</th>
                  <th className="px-4 py-3 font-semibold">Currency</th>
                  <th className="px-4 py-3 text-right font-semibold">Rows</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount column total</th>
                  <th className="px-4 py-3 text-right font-semibold">Fees &amp; Taxes total</th>
                  <th className="px-4 py-3 text-right font-semibold">Net column total</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={`${activity.currency}:${activity.type}`} className="border-t border-stone-200">
                    <td className="px-4 py-3 font-medium text-stone-900">{activity.type}</td>
                    <td className="px-4 py-3 text-stone-600">{activity.currency}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{formatNumber(activity.rows)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{activity.amountRows ? formatCurrency(activity.amount, activity.currency) : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{activity.feeRows ? formatCurrency(activity.feesAndTaxes, activity.currency) : "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-stone-900">{activity.netRows ? formatCurrency(activity.net, activity.currency) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {report.skippedRows > 0 && <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{formatNumber(report.skippedRows)} non-empty rows were skipped because they had no readable activity type or amount values.</p>}
        </>
      )}

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">{error}</p>}

      <div className="mt-6 border-t border-stone-100 pt-5">
        <p className="text-sm font-semibold text-stone-900">Download the right report in Etsy</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-600">
          <li>Open Shop Manager → Finances → Monthly statements.</li>
          <li>Choose a month, select <strong>Generate CSV</strong>, then download the file from Etsy’s email.</li>
          <li>Choose that statement above. The analyzer reads the CSV locally and does not upload it.</li>
        </ol>
        <a href="https://help.etsy.com/hc/en-us/articles/360016389113-How-to-Calculate-Your-Etsy-Payments-Deposit-Amount" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">Etsy’s monthly statement instructions ↗</a>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
        This report groups the signed values from the CSV by its exact activity type and currency. It does not connect every fee to a specific order, calculate product costs, or reconcile bank deposits. Etsy deposits and payment-account net profit are different measures; do not treat these statement totals as business profit or tax advice.
      </div>
      <p className="mt-4 text-xs leading-5 text-stone-500">Titles, buyer details, order references, and raw statement rows are not shown in the report or downloaded summary. The file stays in this browser.</p>
    </section>
  );
}

function parseStatementCsv(csvText: string): StatementReport {
  const cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) throw new Error("The file is empty. Choose an Etsy Monthly Statement CSV export.");
  const rows = parseCsv(cleanText, detectDelimiter(cleanText)).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error("The CSV has a header but no activity rows.");

  const headers = rows[0].map(normalizeHeader);
  const typeIndex = findColumn(headers, ["type", "activity", "activitytype", "transactiontype"]);
  const currencyIndex = findColumn(headers, ["currency", "currencycode", "moneda", "divisa"]);
  const amountIndex = findColumn(headers, ["amount", "grossamount", "importe", "monto"]);
  const feesIndex = findColumn(headers, ["feesandtaxes", "feesandtax", "feeandtaxes", "chargesandtaxes", "feessuttaxes", "tasaseimpuestos", "tasasimpuestos"]);
  const netIndex = findColumn(headers, ["net", "netamount", "netproceeds", "neto", "importeneto"]);

  if (typeIndex < 0 || currencyIndex < 0 || (amountIndex < 0 && feesIndex < 0 && netIndex < 0)) {
    throw new Error("I couldn’t find the Etsy statement columns for Type, Currency, and Amount, Fees & Taxes, or Net. Download the Monthly Statement CSV from Etsy and try again.");
  }

  const activityRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (activityRows.length > MAX_ROWS) throw new Error(`This file has more than ${MAX_ROWS.toLocaleString()} rows. Export one month and try again.`);

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

  if (lines.length === 0) throw new Error("No readable statement rows were found. Check that the file is an Etsy Monthly Statement CSV with activity types and currency codes.");
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

function parseCsv(text: string, delimiter: string): string[][] {
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
  if (inQuotes) throw new Error("The CSV contains an unclosed quoted field. Re-download it from Etsy and try again.");
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

function formatCurrency(amount: number, currency: string): string {
  if (currency === "Unknown") return amount.toFixed(2);
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
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
