'use strict';

(function attachSyntheticForecastFixture(root) {
  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  const fixture = {
    schemaVersion: 1,
    synthetic: true,
    purpose: 'forecast-engine-test-only',
    scenario: {
      version: 'synthetic-forecast-bench-2026-07-22',
      label: 'SYNTHETIC · Forecast engine evidence bench',
      source: 'fixtures/synthetic-forecast/README.md',
      truth: 'synthetic-test-only'
    },
    input: {
      asOf: '2026-07-22T12:00:00.000Z',
      dropId: 'SYNTH-001',
      evidenceMode: 'synthetic',
      priorProfile: 'internal-weak',
      horizonDays: 30,
      plannedOnlineSessions: 2160,
      plannedPopupVisitors: 135,
      plannedOnlineConversionRate: 3.06,
      unitsPerOrderAssumption: 1.25,
      committedNonInventorySpend: 4700,
      reservations: 40,
      reservationConversionRate: 70,
      trafficEvidenceUrl: 'fixtures/synthetic-forecast/traffic-receipt.csv',
      trafficEvidenceClass: 'historical',
      funnelEvidenceUrl: 'fixtures/synthetic-forecast/funnel-receipt.csv',
      reservationEvidenceUrl: 'fixtures/synthetic-forecast/reservation-receipt.csv',
      productionSpendCap: 6000,
      simulations: 3000,
      seed: 260722,
      observed: {
        sessions: 5000,
        productViews: 3150,
        addsToCart: 520,
        checkouts: 300,
        purchases: 165,
        unitsPurchased: 203,
        refunds: 12,
        popupVisitors: 420,
        popupPurchases: 65
      },
      products: [
        {
          id: 'sku-jacket', name: 'The Firm Jacket', inventory: 12, price: 249, landedCogs: 85, weight: 36,
          variants: [
            { label: 'S', inventory: 3, weight: 6 }, { label: 'M', inventory: 5, weight: 14 },
            { label: 'L', inventory: 3, weight: 10 }, { label: 'XL', inventory: 1, weight: 6 }
          ]
        },
        {
          id: 'sku-womens-denim', name: "Women's Low-Rise Denim Jean", inventory: 24, price: 128, landedCogs: 38, weight: 92,
          variants: [
            { label: '24', inventory: 6, weight: 18 }, { label: '26', inventory: 6, weight: 30 },
            { label: '28', inventory: 6, weight: 26 }, { label: '30', inventory: 6, weight: 18 }
          ]
        },
        {
          id: 'sku-mens-denim', name: "Men's Denim Jean", inventory: 20, price: 128, landedCogs: 38, weight: 70,
          variants: [
            { label: '28', inventory: 4, weight: 12 }, { label: '30', inventory: 6, weight: 22 },
            { label: '32', inventory: 6, weight: 24 }, { label: '34', inventory: 4, weight: 12 }
          ]
        },
        {
          id: 'sku-scarf', name: 'Scarf', inventory: 40, price: 35, landedCogs: 12, weight: 120,
          variants: [{ label: 'Black', inventory: 25, weight: 78 }, { label: 'White', inventory: 15, weight: 42 }]
        },
        {
          id: 'sku-womens-top-bodysuit', name: "Women's Top / Bodysuit", inventory: 30, price: 68, landedCogs: 18, weight: 82,
          variants: [
            { label: 'XS', inventory: 4, weight: 14 }, { label: 'S', inventory: 9, weight: 24 },
            { label: 'M', inventory: 10, weight: 28 }, { label: 'L', inventory: 7, weight: 16 }
          ]
        }
      ]
    },
    actual: {
      revenue: 9360,
      unitsSold: 101,
      sellThroughPct: 80.2,
      evidenceUrl: 'fixtures/synthetic-forecast/outcome-receipt.csv'
    }
  };

  root.VorgSyntheticForecastFixture = deepFreeze(fixture);
}(typeof window !== 'undefined' ? window : globalThis));
