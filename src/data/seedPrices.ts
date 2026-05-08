import { BEERS } from './beers';
import { STORES } from './stores';
import type { PriceFeedItem } from './types';

function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function basePriceFor(beerId: string): number {
  const b = BEERS.find((x) => x.id === beerId);
  if (!b) return 120;
  let base = 80;
  base += b.abv * 12;
  if (b.style === 'ipa' || b.style === 'stout' || b.style === 'sour' || b.style === 'lambic') base += 90;
  if (b.style === 'porter') base += 60;
  if (b.style === 'wheat') base += 30;
  if (b.style === 'pilsner') base += 20;
  if (b.style === 'cider') base += 25;
  if (b.country !== 'Россия') base += 70;
  base *= b.volumeMl / 500;
  return Math.round(base);
}

export const SEED_PRICES: PriceFeedItem[] = BEERS.map((beer, idx) => {
  const rand = seededRandom(beer.id.length * 7 + idx * 13);
  const base = basePriceFor(beer.id);
  const prices = STORES.map((store, sIdx) => {
    if (rand() < 0.18) return null;
    const variance = (rand() - 0.5) * 0.35;
    const price = Math.max(45, Math.round(base * (1 + variance)));
    const old = rand() < 0.25 ? Math.round(price * (1.1 + rand() * 0.18)) : undefined;
    return {
      store: store.name,
      storeUrl: store.url,
      price,
      oldPrice: old,
      inStock: rand() > 0.05,
      promo: rand() < 0.18 ? 'Акция' : undefined,
      updatedAt: new Date(Date.now() - sIdx * 36e5).toISOString(),
    };
  }).filter(Boolean) as PriceFeedItem['prices'];

  const days = 28;
  const history: { date: string; price: number; store: string }[] = [];
  for (let d = days; d >= 0; d--) {
    for (const sp of prices) {
      const wobble = Math.sin(d / 3 + beer.id.length) * 0.06 + (rand() - 0.5) * 0.05;
      const price = Math.round(sp.price * (1 + wobble));
      const date = new Date();
      date.setDate(date.getDate() - d);
      history.push({ date: date.toISOString().slice(0, 10), price, store: sp.store });
    }
  }

  return { beerId: beer.id, prices, history };
});

export function findPrices(beerId: string) {
  return SEED_PRICES.find((p) => p.beerId === beerId);
}
