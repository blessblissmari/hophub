import * as React from 'react';
import type { BeerSet, DailyEntry, UserPost, UserReview } from '@/data/types';

const KEYS = {
  reviews: 'hophub:reviews',
  posts: 'hophub:posts',
  sets: 'hophub:sets',
  daily: 'hophub:daily',
  user: 'hophub:user',
  apiKey: 'hophub:openrouter-key',
  modelOverride: 'hophub:openrouter-model',
  favorites: 'hophub:favorites',
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('hophub:storage', { detail: { key } }));
  } catch (err) {
    console.warn('storage write failed', err);
  }
}

export function getUser(): { name: string } {
  return read(KEYS.user, { name: 'Пивнойдетектив' });
}
export function setUser(u: { name: string }) {
  write(KEYS.user, u);
}

export function getReviews(): UserReview[] {
  return read<UserReview[]>(KEYS.reviews, []);
}
export function addReview(r: Omit<UserReview, 'id' | 'createdAt'>) {
  const list = getReviews();
  const item: UserReview = { ...r, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write(KEYS.reviews, [item, ...list]);
  return item;
}

export function getPosts(): UserPost[] {
  return read<UserPost[]>(KEYS.posts, [
    {
      id: 'seed-1',
      title: 'Тёмные вечера и стауты',
      body: 'Холодный сезон — время вытащить из бара тёмные имперские стауты. Сегодня открыл Salden\'s Russian Imperial — бомба.',
      author: 'хмельной_денди',
      beerIds: ['salden-russian-imperial', 'afanasy-stout'],
      tags: ['стаут', 'осень'],
      reactions: { '🍺': 12, '🔥': 4, '🤝': 2 },
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'seed-2',
      title: 'Топ закусок к пшеничному',
      body: 'Попробовал Paulaner с белыми колбасками и сладкой горчицей. Это база.',
      author: 'baltic_capt',
      beerIds: ['paulaner-hefe', 'volkovskaya-pshenichnoe'],
      tags: ['закуска', 'пшеничное'],
      reactions: { '🍺': 7, '🥨': 3 },
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ]);
}
export function addPost(p: Omit<UserPost, 'id' | 'createdAt' | 'reactions'>) {
  const list = getPosts();
  const item: UserPost = {
    ...p,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    reactions: {},
  };
  write(KEYS.posts, [item, ...list]);
  return item;
}
export function reactToPost(id: string, emoji: string) {
  const list = getPosts();
  const next = list.map((p) =>
    p.id === id ? { ...p, reactions: { ...p.reactions, [emoji]: (p.reactions[emoji] || 0) + 1 } } : p
  );
  write(KEYS.posts, next);
}

export function getSets(): BeerSet[] {
  return read<BeerSet[]>(KEYS.sets, []);
}
export function addSet(s: Omit<BeerSet, 'id' | 'createdAt'>) {
  const list = getSets();
  const item: BeerSet = { ...s, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write(KEYS.sets, [item, ...list]);
  return item;
}
export function deleteSet(id: string) {
  write(KEYS.sets, getSets().filter((s) => s.id !== id));
}

export function getDaily(): DailyEntry[] {
  return read<DailyEntry[]>(KEYS.daily, []);
}
export function addDaily(d: Omit<DailyEntry, 'createdAt'>) {
  const list = getDaily();
  const item: DailyEntry = { ...d, createdAt: new Date().toISOString() };
  write(KEYS.daily, [item, ...list]);
  return item;
}
export function deleteDaily(createdAt: string) {
  write(KEYS.daily, getDaily().filter((d) => d.createdAt !== createdAt));
}

export function getFavorites(): string[] {
  return read<string[]>(KEYS.favorites, []);
}
export function toggleFavorite(beerId: string) {
  const list = getFavorites();
  const next = list.includes(beerId) ? list.filter((x) => x !== beerId) : [beerId, ...list];
  write(KEYS.favorites, next);
  return next;
}

export function getApiKey(): string {
  return read<string>(KEYS.apiKey, '');
}
export function setApiKey(k: string) {
  write(KEYS.apiKey, k);
}
export function getModelOverride(): string {
  return read<string>(KEYS.modelOverride, '');
}
export function setModelOverride(m: string) {
  write(KEYS.modelOverride, m);
}

export function exportAll() {
  return {
    reviews: getReviews(),
    posts: getPosts(),
    sets: getSets(),
    daily: getDaily(),
    user: getUser(),
    favorites: getFavorites(),
  };
}

export function clearAll() {
  for (const k of Object.values(KEYS)) {
    if (typeof window !== 'undefined') window.localStorage.removeItem(k);
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('hophub:storage'));
}

export function useLocalCollection<T>(reader: () => T): T {
  const [state, setState] = React.useState<T>(() => reader());
  React.useEffect(() => {
    const handler = () => setState(reader());
    window.addEventListener('hophub:storage', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('hophub:storage', handler);
      window.removeEventListener('storage', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return state;
}
