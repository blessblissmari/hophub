import * as React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { BeerCard } from '@/components/BeerCard';
import { BEERS } from '@/data/beers';
import { findPrices } from '@/data/seedPrices';
import { getReviews, useLocalCollection } from '@/lib/storage';
import { SectionHeader } from './Home';

const STYLES: { id: string; label: string }[] = [
  { id: 'all', label: 'Всё' },
  { id: 'lager', label: 'Лагер' },
  { id: 'pilsner', label: 'Пильзнер' },
  { id: 'pale ale', label: 'Пейл-эль' },
  { id: 'ipa', label: 'IPA' },
  { id: 'wheat', label: 'Пшеничное' },
  { id: 'stout', label: 'Стаут' },
  { id: 'porter', label: 'Портер' },
  { id: 'sour', label: 'Кисляк' },
  { id: 'lambic', label: 'Ламбик' },
  { id: 'cider', label: 'Сидр' },
  { id: 'nealco', label: 'Безалк' },
];

const SORTS = [
  { id: 'popular', label: 'По умолчанию' },
  { id: 'price-asc', label: 'Цена ↑' },
  { id: 'price-desc', label: 'Цена ↓' },
  { id: 'abv-desc', label: 'Крепче' },
  { id: 'abv-asc', label: 'Слабее' },
  { id: 'rating', label: 'По оценке' },
];

export function CatalogPage() {
  const [query, setQuery] = React.useState('');
  const [style, setStyle] = React.useState('all');
  const [sort, setSort] = React.useState('popular');
  const [maxAbv, setMaxAbv] = React.useState(15);
  const [minAbv, setMinAbv] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(800);
  const [onlyRu, setOnlyRu] = React.useState(false);

  const reviews = useLocalCollection(getReviews);
  const ratingByBeer = React.useMemo(() => {
    const map = new Map<string, number>();
    const counts = new Map<string, number>();
    for (const r of reviews) {
      map.set(r.beerId, (map.get(r.beerId) || 0) + r.rating);
      counts.set(r.beerId, (counts.get(r.beerId) || 0) + 1);
    }
    const out = new Map<string, number>();
    map.forEach((sum, id) => out.set(id, sum / (counts.get(id) || 1)));
    return out;
  }, [reviews]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return BEERS.filter((b) => {
      if (style !== 'all' && b.style !== style) return false;
      if (onlyRu && b.country !== 'Россия') return false;
      if (b.abv > maxAbv || b.abv < minAbv) return false;
      const p = findPrices(b.id);
      const minP = p?.prices.length ? Math.min(...p.prices.map((x) => x.price)) : 0;
      if (minP > maxPrice) return false;
      if (q) {
        const hay = `${b.name} ${b.brewery} ${b.style} ${b.country}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sort === 'price-asc' || sort === 'price-desc') {
        const pa = Math.min(...(findPrices(a.id)?.prices.map((x) => x.price) ?? [9e9]));
        const pb = Math.min(...(findPrices(b.id)?.prices.map((x) => x.price) ?? [9e9]));
        return sort === 'price-asc' ? pa - pb : pb - pa;
      }
      if (sort === 'abv-asc') return a.abv - b.abv;
      if (sort === 'abv-desc') return b.abv - a.abv;
      if (sort === 'rating') return (ratingByBeer.get(b.id) || 0) - (ratingByBeer.get(a.id) || 0);
      return 0;
    });
  }, [query, style, sort, maxAbv, minAbv, maxPrice, onlyRu, ratingByBeer]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Каталог пива"
        subtitle="Цены, стили, оценки — фильтруйте на лету"
      />
      <div className="glass flex flex-col gap-3 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-muted-foreground)" />
            <Input
              placeholder="Найти пиво, пивоварню, страну…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="glass" size="icon" aria-label="Фильтры">
                <SlidersHorizontal className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88%] sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
                <SheetDescription>Под точные сценарии</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <Label className="mb-2 block">Цена до {maxPrice} ₽</Label>
                  <Slider
                    value={[maxPrice]}
                    min={50}
                    max={1500}
                    step={20}
                    onValueChange={([v]) => setMaxPrice(v)}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">
                    ABV: {minAbv}% – {maxAbv}%
                  </Label>
                  <Slider
                    value={[minAbv, maxAbv]}
                    min={0}
                    max={15}
                    step={0.5}
                    onValueChange={([a, b]) => {
                      setMinAbv(a);
                      setMaxAbv(b);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ru-only">Только Россия</Label>
                  <Switch id="ru-only" checked={onlyRu} onCheckedChange={setOnlyRu} />
                </div>
                <div>
                  <Label className="mb-2 block">Сортировка</Label>
                  <ToggleGroup
                    type="single"
                    value={sort}
                    onValueChange={(v) => v && setSort(v)}
                    className="flex-wrap"
                  >
                    {SORTS.map((s) => (
                      <ToggleGroupItem key={s.id} value={s.id}>
                        {s.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <ToggleGroup
          type="single"
          value={style}
          onValueChange={(v) => setStyle(v || 'all')}
          className="flex-wrap !rounded-2xl !p-1.5"
        >
          {STYLES.map((s) => (
            <ToggleGroupItem key={s.id} value={s.id}>
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map((b, i) => (
          <BeerCard key={b.id} beer={b} index={i} averageRating={ratingByBeer.get(b.id)} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="glass flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Badge variant="glass">Ничего не найдено</Badge>
          <p className="text-sm text-(--color-muted-foreground)">
            Попробуйте сбросить фильтры или поискать другое пиво
          </p>
        </div>
      )}
    </div>
  );
}
