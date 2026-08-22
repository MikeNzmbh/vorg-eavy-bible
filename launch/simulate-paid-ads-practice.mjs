#!/usr/bin/env node
/**
 * Practice-only paid-channel simulation using free public ads priors.
 * Does not authorize spend, place ads, or write readiness state.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const bibleRoot = join(here, '..');
const priorsPath = join(bibleRoot, 'research', 'commerce-intelligence', 'ads-public-priors', 'ads-public-priors.json');
const forecastBundle = join(bibleRoot, 'site', 'sales-forecast.js');
const publicPriorPath = join(bibleRoot, 'research', 'commerce-intelligence', 'public-data-model', 'public-commerce-priors.json');

const priors = JSON.parse(readFileSync(priorsPath, 'utf8'));
const publicPriorArtifact = JSON.parse(readFileSync(publicPriorPath, 'utf8'));
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(readFileSync(forecastBundle, 'utf8'), sandbox, { filename: forecastBundle });
const forecast = sandbox.VorgSalesForecast;

const usdToCad = priors.fxAssumption.usdToCad;
const gbpToCad = priors.fxAssumption.gbpToCad;
const sessions = priors.paidCoveragePlan.sessions;
const planOrders = priors.paidCoveragePlan.ordersAtPlanningRate;
const planRate = priors.paidCoveragePlan.planningSessionPurchaseRate;
const cpcUsd = priors.practicePriors.metaTrafficCpcUsd;
const ctr = priors.practicePriors.metaTrafficCtr;
const irpCvr = priors.practicePriors.fashionSessionConversionRate;
const irpCpsGbp = priors.practicePriors.fashionCostPerSessionGbp;
const paidCapCad = priors.vorgWorkingCaps.paidSocialAndSeedingCad;

const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const money = n => `C$${round(n).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const spendAtWordstream = sessions * cpcUsd * usdToCad;
const impressionsAtCtr = sessions / ctr;
const ordersAtIrp = sessions * irpCvr;
const sessionsFor26AtIrp = planOrders / irpCvr;
const spendFor26AtIrp = sessionsFor26AtIrp * cpcUsd * usdToCad;
const cacAtIrpUsd = cpcUsd / irpCvr;
const cacAtIrpCad = cacAtIrpUsd * usdToCad;
const cacAtPlanCad = (cpcUsd * usdToCad) / planRate;
const sessionsInsideCap = paidCapCad / (cpcUsd * usdToCad);
const ordersInsideCapAtPlan = sessionsInsideCap * planRate;
const ordersInsideCapAtIrp = sessionsInsideCap * irpCvr;
const spendAtIrpCps = sessions * irpCpsGbp * gbpToCad;

const products = [
  { id: 'jacket', name: 'The Firm Jacket', inventory: 12, price: 249, landedCogs: 85, weight: 12 },
  { id: 'womens-denim', name: "Women's low-rise denim", inventory: 24, price: 128, landedCogs: 38, weight: 24 },
  { id: 'mens-denim', name: "Men's denim", inventory: 20, price: 128, landedCogs: 38, weight: 20 },
  { id: 'scarf', name: 'Scarves', inventory: 40, price: 35, landedCogs: 12, weight: 40 },
  { id: 'womens-top', name: "Women's top", inventory: 30, price: 68, landedCogs: 18, weight: 30 }
];

const externalPrior = {
  id: publicPriorArtifact.profileId,
  modelVersion: publicPriorArtifact.modelVersion,
  checkedOn: publicPriorArtifact.checkedOn,
  directConversionStrength: publicPriorArtifact.engineProfile.directConversionStrength,
  refundStrength: publicPriorArtifact.engineProfile.refundStrength,
  sourceUrls: publicPriorArtifact.sources.map(source => source.url)
};

const baseInput = {
  asOf: '2026-08-20T18:00:00.000Z',
  dropId: '001-ads-practice',
  horizonDays: 30,
  plannedOnlineSessions: 2160,
  plannedPopupVisitors: 135,
  plannedOnlineConversionRate: 3.06,
  unitsPerOrderAssumption: 1.25,
  committedNonInventorySpend: 4700,
  priorProfile: 'public-transfer-v1',
  externalPrior,
  trafficEvidenceUrl: 'launch/drop-001-traffic-channel-plan.md',
  trafficEvidenceClass: 'plan',
  simulations: 10000,
  seed: 260722,
  products
};

const base = forecast.calculateForecast(baseInput);

// Practice challenger: pretend the 850 paid sessions already ran at IRP fashion CVR.
// Labelled external practice — still scenario, still zero readiness.
const paidPracticePurchases = Math.round(sessions * irpCvr);
const practiceObserved = {
  sessions,
  purchases: paidPracticePurchases
};
const practice = forecast.calculateForecast({
  ...baseInput,
  plannedOnlineSessions: sessions,
  plannedPopupVisitors: 0,
  committedNonInventorySpend: Math.min(paidCapCad, spendAtWordstream),
  observed: practiceObserved,
  trafficEvidenceUrl: 'research/commerce-intelligence/ads-public-priors/ads-public-priors.json',
  funnelEvidenceUrl: '',
  simulations: 5000,
  seed: 260820
});

const output = {
  truth: 'external-public-practice',
  checkedOn: priors.checkedOn,
  modelVersion: priors.modelVersion,
  emptyFieldsFilled: {
    channel: 'Meta traffic · Apparel / Fashion & Jewelry (WordStream)',
    ctr,
    cpcUsd,
    cpcCad: round(cpcUsd * usdToCad),
    fashionSessionCvr: irpCvr,
    costPerSessionCadFromIrp: round(irpCpsGbp * gbpToCad),
    paidCapCad,
    plannedPaidSessions: sessions,
    plannedPaidOrdersAt3_06: planOrders
  },
  cashGeometry: {
    spendToBuy850AtWordstreamCpcCad: round(spendAtWordstream),
    spendToBuy850AtIrpCostPerSessionCad: round(spendAtIrpCps),
    impressionsImpliedAtWordstreamCtr: Math.round(impressionsAtCtr),
    ordersIf850ConvertAtIrpCvr: round(ordersAtIrp, 1),
    sessionsNeededFor26OrdersAtIrpCvr: Math.round(sessionsFor26AtIrp),
    spendFor26OrdersAtIrpCvrAndWordstreamCpcCad: round(spendFor26AtIrp),
    impliedCacAtIrpCvrCad: round(cacAtIrpCad),
    impliedCacAtPlan3_06Cad: round(cacAtPlanCad),
    sessionsAffordableInsideC450AtWordstreamCpc: Math.round(sessionsInsideCap),
    ordersAffordableInsideC450AtPlan3_06: round(ordersInsideCapAtPlan, 1),
    ordersAffordableInsideC450AtIrpCvr: round(ordersInsideCapAtIrp, 1),
    gapVs26OrdersAtIrp: round(26 - ordersAtIrp, 1),
    c450Covers850Sessions: spendAtWordstream <= paidCapCad
  },
  forecastPractice: {
    fullDropBase: {
      status: base.status,
      sellThroughP50Pct: base.summary.sellThrough.p50,
      soldP50: base.summary.soldUnits.p50,
      chance85Pct: base.summary.sellThrough85Probability,
      revenueP50: base.summary.revenue.p50
    },
    paidOnlyIrpPractice: {
      status: practice.status,
      onlineConversionMode: practice.onlineConversionMode,
      planningPriorMeanPct: practice.rates.find(r => r.key === 'plannedSessionPurchase')?.mean,
      planningPriorEvidence: practice.rates.find(r => r.key === 'plannedSessionPurchase')?.evidence,
      planningPriorTrials: practice.rates.find(r => r.key === 'plannedSessionPurchase')?.trials,
      soldP50: practice.summary.soldUnits.p50,
      sellThroughP50Pct: practice.summary.sellThrough.p50,
      chance85Pct: practice.summary.sellThrough85Probability,
      observedInjected: practiceObserved,
      note: 'Paid-only practice run. Not a Drop 001 freeze. IRP CVR used only to invent practice purchase counts.'
    }
  },
  killRulesDemonstrated: [
    `If WordStream CPC holds, buying all 850 plan sessions costs ~${money(spendAtWordstream)}, which ${spendAtWordstream <= paidCapCad ? 'fits' : 'blows'} the C$450 paid-social working line.`,
    `If IRP fashion CVR (1.74%) holds, 850 sessions yield ~${round(ordersAtIrp, 1)} orders, not 26.`,
    `Inside C$450 at WordStream CPC you can buy ~${Math.round(sessionsInsideCap)} sessions → ~${round(ordersInsideCapAtIrp, 1)} orders at IRP CVR.`,
    'Do not raise P(85%) by typing fake purchases. Replace practice counts with tagged VORG ad sessions.'
  ],
  hermesAutopilot: {
    recommendation: 'do-not-build-unattended-buyer',
    reason: 'These priors have no live account balance, auction, creative fatigue, or Quebec ad compliance state. A Hermes bot spending from them would optimize a fiction.'
  }
};

console.log(JSON.stringify(output, null, 2));
