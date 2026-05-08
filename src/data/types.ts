export type BeerStyle =
  | 'lager'
  | 'pilsner'
  | 'pale ale'
  | 'ipa'
  | 'wheat'
  | 'stout'
  | 'porter'
  | 'sour'
  | 'lambic'
  | 'cider'
  | 'craft'
  | 'nealco';

export type BeerColor = 'светлое' | 'полутёмное' | 'тёмное' | 'красное' | 'мутное';

export interface BeerProduct {
  id: string;
  name: string;
  brewery: string;
  country: string;
  style: BeerStyle;
  color: BeerColor;
  abv: number;
  ibu: number;
  volumeMl: number;
  description: string;
  pairsWell: string[];
  vibes: string[];
  image: string;
  baseColor: string;
}

export interface StorePrice {
  store: string;
  storeUrl: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  promo?: string;
  updatedAt: string;
}

export interface PriceFeedItem {
  beerId: string;
  prices: StorePrice[];
  history: { date: string; price: number; store: string }[];
}

export interface Snack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  pairs: BeerStyle[];
  vibes: string[];
}

export interface Bar {
  id: string;
  name: string;
  city: string;
  type: 'pub' | 'tap' | 'bar' | 'craft' | 'shop';
  lat: number;
  lng: number;
  address: string;
  signature: string;
  hours: string;
  vibes: string[];
}

export interface UserReview {
  id: string;
  beerId: string;
  rating: number;
  body: string;
  author: string;
  vibes: string[];
  createdAt: string;
}

export interface UserPost {
  id: string;
  title: string;
  body: string;
  author: string;
  beerIds: string[];
  tags: string[];
  createdAt: string;
  reactions: Record<string, number>;
}

export interface BeerSet {
  id: string;
  title: string;
  description?: string;
  occasion?: string;
  beerIds: string[];
  snackIds: string[];
  author: string;
  createdAt: string;
}

export interface DailyEntry {
  date: string;
  beerId?: string;
  beerName?: string;
  volumeMl: number;
  abv: number;
  rating?: number;
  note?: string;
  mood?: string;
  createdAt: string;
}
