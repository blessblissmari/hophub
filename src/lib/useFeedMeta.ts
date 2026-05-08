import * as React from 'react';

const META_URL = `${import.meta.env.BASE_URL}data/meta.json`;

export interface FeedMeta {
  generatedAt: string;
  source: 'live' | 'seed';
  storeCount: number;
  productCount: number;
}

const FALLBACK: FeedMeta = {
  generatedAt: new Date().toISOString(),
  source: 'seed',
  storeCount: 8,
  productCount: 22,
};

export function useFeedMeta() {
  const [meta, setMeta] = React.useState<FeedMeta>(FALLBACK);
  React.useEffect(() => {
    let alive = true;
    fetch(META_URL, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data) setMeta(data as FeedMeta);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
  return meta;
}
