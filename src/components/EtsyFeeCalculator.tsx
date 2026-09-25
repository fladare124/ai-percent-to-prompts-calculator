"use client";

import { useMemo, useState, type ChangeEvent } from "react";

type OffsiteRate = "none" | "15" | "12";

type CalculatorInputs = {
  itemPrice: string;
  shippingCharged: string;
  giftWrapCharged: string;
  materialsCost: string;
  shippingLabelCost: string;
  packagingCost: string;
  laborCost: string;
  buyerTaxRate: string;
  desiredProfit: string;
  offsiteRate: OffsiteRate;
};

type Breakdown = {
  orderTotal: number;
  listingFee: number;
  transactionFee: number;
  processingFee: number;
  offsiteAdsFee: number;
  totalFees: number;
  totalCosts: number;
  profit: number;
};

const initialInputs: CalculatorInputs = {
  itemPrice: "24.00",
  shippingCharged: "4.99",
  giftWrapCharged: "0.00",
  materialsCost: "8.00",
  shippingLabelCost: "4.50",
  packagingCost: "0.50",
  laborCost: "6.00",
  buyerTaxRate: "0",
  desiredProfit: "10.00",
  offsiteRate: "none",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function numberFrom(value: string): number {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function cents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateBreakdown(inputs: CalculatorInputs, itemPrice: number): Breakdown {
  const shippingCharged = numberFrom(inputs.shippingCharged);
  const giftWrapCharged = numberFrom(inputs.giftWrapCharged);
  const orderTotal = itemPrice + shippingCharged + giftWrapCharged;
  const salesTax = orderTotal * numberFrom(inputs.buyerTaxRate) / 100;
  const rate = inputs.offsiteRate === "none" ? 0 : Number(inputs.offsiteRate) / 100;
  const listingFee = itemPrice > 0 ? 0.2 : 0;
  const transactionFee = cents(orderTotal * 0.065);
  const processingFee = orderTotal > 0 ? cents((orderTotal + salesTax) * 0.03 + 0.25) : 0;
  const offsiteAdsFee = rate > 0 ? cents(Math.min(orderTotal * rate, 100)) : 0;
  const totalFees = cents(listingFee + transactionFee + processingFee + offsiteAdsFee);
  const totalCosts = cents(
    numberFrom(inputs.materialsCost) +
    numberFrom(inputs.shippingLabelCost) +
    numberFrom(inputs.packagingCost) +
    numberFrom(inputs.laborCost),
  );

  return {
    orderTotal: cents(orderTotal),
    listingFee,
    transactionFee,
    processingFee,
    offsiteAdsFee,
    totalFees,
    totalCosts,
    profit: cents(orderTotal - totalFees - totalCosts),
  };
}

function findPriceForProfit(inputs: CalculatorInputs, desiredProfit: number): number {
  if (desiredProfit <= 0) return 0;

  let low = 0;
  let high = Math.max(10, desiredProfit + numberFrom(inputs.materialsCost) + numberFrom(inputs.shippingLabelCost) + 10);
  while (calculateBreakdown(inputs, high).profit < desiredProfit && high < 1_000_000) {
    high *= 2;
  }

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const middle = (low + high) / 2;
    if (calculateBreakdown(inputs, middle).profit >= desiredProfit) high = middle;
    else low = middle;
  }

  return cents(high);
}

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-800">{label}</label>
      <div className="mt-1 flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-100">
        {!suffix && <span className="pl-3 text-sm text-stone-500">$</span>}
        <input
          id={id}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget.value)}
          className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2.5 text-sm text-stone-950 outline-none"
        />
        {suffix && <span className="pr-3 text-sm text-stone-500">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs leading-5 text-stone-500">{hint}</p>}
    </div>
  );
}

export default function EtsyFeeCalculator() {
  const [inputs, setInputs] = useState(initialInputs);
  const breakdown = useMemo(
    () => calculateBreakdown(inputs, numberFrom(inputs.itemPrice)),
    [inputs],
  );
  const targetPrice = useMemo(
    () => findPriceForProfit(inputs, numberFrom(inputs.desiredProfit)),
    [inputs],
  );
  const margin = breakdown.orderTotal > 0 ? breakdown.profit / breakdown.orderTotal : 0;

  const update = (key: Exclude<keyof CalculatorInputs, "offsiteRate">, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <section id="calculator" aria-labelledby="etsy-fee-calculator-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Free Etsy profit calculator · US fee defaults</p>
          <h2 id="etsy-fee-calculator-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">Estimate your Etsy fees and set a target price</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">Enter what the buyer pays and what it costs you to fulfil one order. The estimate updates here in your browser; it is not sent or saved.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">No account · No upload</span>
      </div>

      <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
        Example values are prefilled so you can see the result. Replace them with your own numbers. This estimate is for one US order and does not include income tax or every possible shop fee.
      </p>

      <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_0.82fr]">
        <div className="grid content-start gap-4 sm:grid-cols-2">
          <NumberField id="item-price" label="Item price" value={inputs.itemPrice} onChange={(value) => update("itemPrice", value)} />
          <NumberField id="shipping-charged" label="Shipping charged to buyer" value={inputs.shippingCharged} onChange={(value) => update("shippingCharged", value)} />
          <NumberField id="gift-wrap-charged" label="Gift wrap charged" value={inputs.giftWrapCharged} onChange={(value) => update("giftWrapCharged", value)} />
          <NumberField id="materials-cost" label="Product or materials cost" value={inputs.materialsCost} onChange={(value) => update("materialsCost", value)} />
          <NumberField id="shipping-label-cost" label="Shipping label / postage you pay" value={inputs.shippingLabelCost} onChange={(value) => update("shippingLabelCost", value)} />
          <NumberField id="packaging-cost" label="Packaging cost" value={inputs.packagingCost} onChange={(value) => update("packagingCost", value)} />
          <NumberField id="labor-cost" label="Your labor cost" value={inputs.laborCost} onChange={(value) => update("laborCost", value)} hint="Optional; enter the amount you want to pay yourself." />
          <NumberField id="buyer-tax-rate" label="Estimated buyer sales tax" value={inputs.buyerTaxRate} onChange={(value) => update("buyerTaxRate", value)} suffix="%" hint="Optional estimate; Etsy calculates tax by order location." />

          <div className="sm:col-span-2">
            <label htmlFor="offsite-rate" className="block text-sm font-semibold text-stone-800">Offsite Ads on this order</label>
            <select
              id="offsite-rate"
              value={inputs.offsiteRate}
              onChange={(event) => setInputs((current) => ({ ...current, offsiteRate: event.currentTarget.value as OffsiteRate }))}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="none">No Offsite Ads fee attributed</option>
              <option value="15">15% — shop below $10,000 in 365-day sales</option>
              <option value="12">12% — shop at or above $10,000 in 365-day sales</option>
            </select>
            <p className="mt-1 text-xs leading-5 text-stone-500">If selected, the fee is capped at $100 per attributed order.</p>
          </div>

          <div className="sm:col-span-2 rounded-2xl border border-stone-200 bg-[#f7f6f0] p-4">
            <label htmlFor="desired-profit" className="block text-sm font-semibold text-stone-900">Desired profit after listed costs</label>
            <div className="mt-2 flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-100">
              <span className="pl-3 text-sm text-stone-500">$</span>
              <input id="desired-profit" type="number" min="0" step="0.01" inputMode="decimal" value={inputs.desiredProfit} onChange={(event) => update("desiredProfit", event.currentTarget.value)} className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2.5 text-sm text-stone-950 outline-none" />
            </div>
            <p className="mt-1 text-xs leading-5 text-stone-500">We solve for the item price that reaches this estimate, with your shipping charge and other costs unchanged.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-950 p-5 text-white sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-200">Estimate · USD</p>
          <p className="mt-2 text-sm text-emerald-100">Estimated profit on the example order</p>
          <p className={`mt-1 text-4xl font-semibold tracking-tight ${breakdown.profit < 0 ? "text-rose-200" : "text-white"}`}>{currency.format(breakdown.profit)}</p>
          <p className="mt-1 text-xs text-emerald-200">{(margin * 100).toFixed(1)}% of item, shipping and gift-wrap charges</p>

          <div className="mt-6 border-t border-emerald-800 pt-4">
            <p className="text-sm font-semibold">Estimated order breakdown</p>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Order amount before tax" value={currency.format(breakdown.orderTotal)} />
              <Row label="Etsy fees" value={`−${currency.format(breakdown.totalFees)}`} />
              <Row label="Materials, postage, packaging and labor" value={`−${currency.format(breakdown.totalCosts)}`} />
            </dl>
          </div>

          <div className="mt-6 rounded-xl bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Item price for your target profit</p>
            <p className="mt-1 text-3xl font-semibold">{currency.format(targetPrice)}</p>
            <p className="mt-1 text-xs leading-5 text-emerald-100">Buyer shipping stays at {currency.format(numberFrom(inputs.shippingCharged))}; check the full breakdown before changing a listing.</p>
          </div>

          <details className="mt-5 rounded-xl border border-emerald-800 px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold">See the fee estimate line by line</summary>
            <dl className="mt-3 space-y-2 text-xs text-emerald-50">
              <Row label="Listing fee" value={currency.format(breakdown.listingFee)} />
              <Row label="Transaction fee · 6.5%" value={currency.format(breakdown.transactionFee)} />
              <Row label="Payment processing · 3% + $0.25" value={currency.format(breakdown.processingFee)} />
              <Row label="Offsite Ads" value={currency.format(breakdown.offsiteAdsFee)} />
            </dl>
          </details>
        </div>
      </div>

      <p className="mt-6 text-xs leading-5 text-stone-500">Fee rules and payment rates can change and vary by seller location. This tool uses the current US listing, transaction and Etsy Payments rates as a planning estimate. It omits refunds, currency conversion, some taxes on fees, and multi-quantity renewals. Confirm actual deductions in your Etsy Payment account.</p>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-left">{label}</dt>
      <dd className="shrink-0 text-right font-semibold">{value}</dd>
    </div>
  );
}
