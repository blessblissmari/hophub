import * as React from 'react';
import { SEED_PRICES } from '@/data/seedPrices';
import type { PriceFeedItem } from '@/data/types';

const FEED_URL = `${import.meta.env.BASE_URL}data/prices.json`;

let cachedFeed: PriceFeedItem[] | null = null;
let pendingPromise: Promise<PriceFeedItem[]> | null = null;

async function fetchFeed(): Promise<PriceFeedItem[]> {
  if (cachedFeed) return cachedFeed;
  if (pendingPromise) return pendingPromise;
  pendingPromise = (async () => {
    try {
      const res = await fetch(FEED_URL, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`feed ${res.status}`);
      const json = (await res.json()) as PriceFeedItem[];
      if (Array.isArray(json) && json.length) {
        cachedFeed = json;
        return json;
      }
    } catch {
      /* fall through */
    }
    cachedFeed = SEED_PRICES;
    return SEED_PRICES;
  })();
  return pendingPromise;
}

export function usePriceFeed() {
  const [feed, setFeed] = React.useState<PriceFeedItem[]>(cachedFeed ?? SEED_PRICES);
  const [loading, setLoading] = React.useState(!cachedFeed);
  React.useEffect(() => {
    let alive = true;
    fetchFeed()
      .then((data) => {
        if (alive) {
          setFeed(data);
          setLoading(false);
        }
      })
      .catch(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);
  return { feed, loading };
}

export function priceForBeer(feed: PriceFeedItem[], beerId: string) {
  return feed.find((f) => f.beerId === beerId);
}
