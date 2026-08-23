#!/usr/bin/env node
/* ============================================================
   export-portfolio-fixtures.ts: the broker derivations, frozen.

       node scripts/export-portfolio-fixtures.ts          write
       node scripts/export-portfolio-fixtures.ts --check  fail on drift

   `shared/portfolio.ts` turns Trading 212's own JSON into a
   dashboard, and the Android app has a Kotlin port of it. This is
   what holds the two together.

   ---- the account below is invented, and has to be ----

   Not a snapshot of the real one. That account is one person's
   and this file is committed: every rule in CLAUDE.md's Backups
   section about what may go in git applies, and "the repository
   is private" is not an answer, because visibility is one click
   and retroactive in neither direction.

   So the positions here are made up, and they are made up to be
   AWKWARD rather than realistic: a holding bought for nothing,
   one with no currency on its instrument, a loss, a ticker with
   no underscore in it, a month with two dividends in it and a
   dividend with no date at all. A fixture of four healthy
   holdings would prove the happy path agrees and nothing else.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  dividendMonths, dividendTotal, holdingsOf, totalsOf,
} from "../shared/portfolio.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "content", "portfolio.fixtures.json");

/** A summary, and what it is for. */
const SUMMARIES: Array<{ name: string; why: string; summary: unknown }> = [
  {
    name: "ordinary",
    why: "a funded account in profit, with cash and something parked in pies",
    summary: {
      currency: "GBP", totalValue: 18420.55,
      cash: { availableToTrade: 1240.10, inPies: 300, reservedForOrders: 0 },
      investments: {
        currentValue: 16880.45, realizedProfitLoss: 812.33,
        totalCost: 15100, unrealizedProfitLoss: 1780.45,
      },
    },
  },
  {
    name: "at-a-loss",
    why: "the sign has to survive: a percentage that loses its minus is the one "
      + "number on this page nobody would question",
    summary: {
      currency: "USD", totalValue: 7400,
      cash: { availableToTrade: 400, inPies: 0 },
      investments: {
        currentValue: 7000, realizedProfitLoss: -220,
        totalCost: 9000, unrealizedProfitLoss: -2000,
      },
    },
  },
  {
    name: "empty",
    why: "a new account, where every ratio divides by nought and must answer nought "
      + "rather than NaN",
    summary: {
      currency: "GBP", totalValue: 0,
      cash: { availableToTrade: 0, inPies: 0 },
      investments: { currentValue: 0, realizedProfitLoss: 0, totalCost: 0, unrealizedProfitLoss: 0 },
    },
  },
  {
    name: "broker-changed-a-name",
    why: "the failure this whole layer is defensive about: fields missing, a number "
      + "arriving as a string, and no currency at all. It must render a page of "
      + "noughts rather than throwing",
    summary: {
      totalValue: "18420.55",
      investments: { currentValue: 16880.45 },
    },
  },
];

const POSITIONS: Array<{ name: string; why: string; positions: unknown }> = [
  {
    name: "mixed",
    why: "four holdings out of order, in two currencies, one at a loss, one bought "
      + "for nothing (an infinite gain if it is not guarded) and one whose ticker "
      + "carries no underscore to split on",
    positions: [
      {
        averagePricePaid: 141.2, currentPrice: 186.4, quantity: 12.5,
        instrument: { name: "Apple Inc", ticker: "AAPL_US_EQ", currency: "USD" },
        walletImpact: { currentValue: 2330, totalCost: 1765, unrealizedProfitLoss: 565 },
      },
      {
        averagePricePaid: 55, currentPrice: 51.2, quantity: 100,
        instrument: { name: "Vanguard FTSE All-World", ticker: "VWRL", currency: "GBP" },
        walletImpact: { currentValue: 5120, totalCost: 5500, unrealizedProfitLoss: -380 },
      },
      {
        averagePricePaid: 9.4, currentPrice: 21.05, quantity: 450.6667,
        instrument: { name: "A Company With A Very Long Name That Will Not Fit In A Column At All" },
        walletImpact: { currentValue: 9472.5, totalCost: 4230, unrealizedProfitLoss: 5242.5 },
      },
      {
        averagePricePaid: 0, currentPrice: 3, quantity: 1,
        instrument: { name: "Free Share", ticker: "FREE_EQ" },
        walletImpact: { currentValue: 3, totalCost: 0, unrealizedProfitLoss: 3 },
      },
    ],
  },
  {
    name: "none",
    why: "an account holding nothing, where the largest holding does not exist and "
      + "every bar would divide by it",
    positions: [],
  },
  {
    name: "not-an-array",
    why: "what a changed endpoint sends: this must be an empty list rather than a throw",
    positions: { error: "nope" },
  },
];

const DIVIDENDS: Array<{ name: string; why: string; items: unknown }> = [
  {
    name: "sparse",
    why: "two in one month, one outside the window, one with no date at all, and "
      + "eight months with nothing in them. The empty months are the point: a chart "
      + "of only the months that paid has no gaps and reads as a monthly income",
    items: [
      { paidOn: "2026-08-03T00:00:00Z", amount: 12.4 },
      { paidOn: "2026-08-19T00:00:00Z", amount: 3.1 },
      { paidOn: "2026-05-02T00:00:00Z", amount: 22 },
      { paidOn: "2025-11-11T00:00:00Z", amount: 7.5 },
      { paidOn: "", amount: 99 },
      { paidOn: "2024-01-01T00:00:00Z", amount: 500 },
    ],
  },
  {
    name: "none",
    why: "a portfolio that pays nothing, where the total is nought and the chart is "
      + "twelve empty columns rather than an absence",
    items: [],
  },
];

/* Frozen, and it has to be: `dividendMonths` buckets against a
   date, so a fixture generated from the clock would change every
   month and the port would fail on the first of one. */
const NOW = "2026-08-22T00:00:00.000Z";

const built = {
  now: NOW,
  summaries: SUMMARIES.map((s) => ({ ...s, out: totalsOf(s.summary) })),
  positions: POSITIONS.map((p) => ({
    ...p,
    /* Weights are a share of what is invested, so the same
       positions under two different invested figures are two
       different answers. Both are here. */
    out: {
      invested16880: holdingsOf(p.positions, 16880.45),
      investedNought: holdingsOf(p.positions, 0),
    },
  })),
  dividends: DIVIDENDS.map((d) => {
    const months = dividendMonths(d.items, new Date(NOW));
    return { ...d, out: { months, total: dividendTotal(months) } };
  }),
};

const text = `${JSON.stringify(built, null, 2)}\n`;

if (process.argv.includes("--check")) {
  if (readFileSync(OUT, "utf8") === text) {
    console.log("portfolio fixtures: unchanged.");
    process.exit(0);
  }
  console.error("\n  x content/portfolio.fixtures.json is not what shared/portfolio.ts");
  console.error("        produces. Either it changed and the fixtures were not");
  console.error("        regenerated, or they were edited by hand. Run:");
  console.error("          node scripts/export-portfolio-fixtures.ts");
  console.error("        and read the diff: every line is a number the Android app is");
  console.error("        asserting, so a change here is a change there.\n");
  process.exit(1);
}

writeFileSync(OUT, text);
console.log(`portfolio fixtures: ${SUMMARIES.length} summaries, ${POSITIONS.length} position`
  + ` sets and ${DIVIDENDS.length} dividend histories written.`);
