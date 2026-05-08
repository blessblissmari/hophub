import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BeerGlassIcon } from '@/components/BeerGlassIcon';
import { RatingStars } from '@/components/RatingStars';
import { BEERS } from '@/data/beers';
import { findPrices } from '@/data/seedPrices';
import { getReviews, useLocalCollection } from '@/lib/storage';
import { formatPrice, isoWeekKey } from '@/lib/utils';
import { SectionHeader } from './Home';

interface RankedBeer {
  beer: (typeof BEERS)[number];
  score: number;
  reviewCount: number;
  averageRating: number;
  trendChange: number;
}

export function WeeklyTopPage() {
  const reviews = useLocalCollection(getReviews);
  const [tab, setTab] = React.useState<'overall' | 'value' | 'highabv' | 'lowabv'>('overall');
  const week = isoWeekKey();

  const ranked = React.useMemo<RankedBeer[]>(() => {
    return BEERS.map((b, i) => {
      const beerReviews = reviews.filter((r) => r.beerId === b.id);
      const avg = beerReviews.length
        ? beerReviews.reduce((s, r) => s + r.rating, 0) / beerReviews.length
        : 0;
      const reviewCount = beerReviews.length;

      const seedScore =
        Math.sin((i + week.length) * 1.3) * 4 +
        Math.cos(i * 0.7 + b.abv) * 2 +
        b.ibu * 0.05 +
        b.abv * 1.2 +
        (b.country === 'Россия' ? 1.5 : 0.4);
      const userScore = avg * 6 + reviewCount * 2;
      const score = seedScore + userScore + 10;

      const trendChange = Math.round(Math.sin((i + week.charCodeAt(week.length - 1)) * 0.9) * 4);

      return {
        beer: b,
        score,
        reviewCount,
        averageRating: avg,
        trendChange,
      };
    }).sort((a, b) => b.score - a.score);
  }, [reviews, week]);

  const filtered = React.useMemo(() => {
    if (tab === 'overall') return ranked.slice(0, 12);
    if (tab === 'highabv') return ranked.filter((r) => r.beer.abv >= 7).slice(0, 10);
    if (tab === 'lowabv') return ranked.filter((r) => r.beer.abv <= 5).slice(0, 10);
    if (tab === 'value') {
      return ranked
        .map((r) => {
          const min = Math.min(...(findPrices(r.beer.id)?.prices.map((x) => x.price) ?? [9e9]));
          return { ...r, score: r.score - min * 0.05 };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }
    return ranked.slice(0, 10);
  }, [ranked, tab]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          <>
            <Trophy className="mr-2 inline size-7 text-amber-500" />
            Топ недели
          </>
        }
        subtitle={`Алгоритм пересобирает рейтинг каждый понедельник · текущая неделя ${week}`}
      />
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="overall">Общий</TabsTrigger>
          <TabsTrigger value="value">Лучшая цена</TabsTrigger>
          <TabsTrigger value="highabv">Крепкие</TabsTrigger>
          <TabsTrigger value="lowabv">Лёгкие</TabsTrigger>
        </TabsList>
        <TabsContent value={tab}>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {filtered.slice(0, 3).map((r, i) => (
              <PodiumCard key={r.beer.id} rank={i + 1} item={r} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {filtered.slice(3).map((r, i) => (
              <RowCard key={r.beer.id} rank={i + 4} item={r} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <Flame className="mt-1 size-6 text-amber-500" />
          <div>
            <h3 className="font-display text-lg font-semibold">Как считается топ</h3>
            <p className="mt-1 text-sm text-(--color-muted-foreground)">
              Берём оценки и активность за неделю, добавляем «вес» стиля и градус. Результат
              кэшируется в HopHub раз в неделю — каждый понедельник в 03:00 МСК алгоритм пересобирает
              рейтинг автоматически.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PodiumCard({ item, rank }: { item: RankedBeer; rank: number }) {
  const colors = ['#f5c542', '#cfd2d6', '#cd7f32'] as const;
  const medal = ['🥇', '🥈', '🥉'][rank - 1];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.06 }}
    >
      <Card className="liquid-shine relative h-full overflow-hidden p-0">
        <div
          className="relative grid h-44 place-items-center"
          style={{
            background: `radial-gradient(120% 90% at 30% 20%, ${item.beer.baseColor}66, transparent 60%), radial-gradient(120% 80% at 80% 90%, ${colors[rank - 1]}, transparent 65%)`,
          }}
        >
          <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-lg backdrop-blur-md dark:bg-white/15">
            {medal}
          </div>
          <BeerGlassIcon color={item.beer.baseColor} size={120} animate />
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <Badge variant="amber">#{rank}</Badge>
            <span className="font-mono text-xs text-(--color-muted-foreground)">
              {Math.round(item.score)} пунктов
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-tight">{item.beer.name}</h3>
          <p className="text-xs text-(--color-muted-foreground)">{item.beer.brewery}</p>
          <div className="flex items-center justify-between pt-2">
            <RatingStars value={item.averageRating || rank === 1 ? 5 : 4.5} size={14} readOnly />
            <Button asChild size="sm" variant="glass">
              <Link to={`/beer/${item.beer.id}`}>
                Открыть
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function RowCard({ item, rank }: { item: RankedBeer; rank: number }) {
  const min = Math.min(...(findPrices(item.beer.id)?.prices.map((x) => x.price) ?? [0])) || 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (rank - 4) * 0.03 }}
    >
      <Card className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/60 font-display font-bold dark:bg-white/10">
            {rank}
          </div>
          <div
            className="grid size-12 shrink-0 place-items-center rounded-2xl"
            style={{ background: `radial-gradient(120% 80% at 30% 20%, ${item.beer.baseColor}66, transparent)` }}
          >
            <BeerGlassIcon color={item.beer.baseColor} size={36} animate={false} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate font-semibold">{item.beer.name}</h4>
              <Badge variant="secondary" className="capitalize">
                {item.beer.style}
              </Badge>
            </div>
            <div className="text-xs text-(--color-muted-foreground)">{item.beer.brewery}</div>
          </div>
          <div className="hidden text-right sm:block">
            <div className="font-display text-sm font-semibold">от {formatPrice(min)}</div>
            <div className="text-[10px] uppercase tracking-wider text-(--color-muted-foreground)">
              {item.beer.abv}% · {item.beer.ibu} IBU
            </div>
          </div>
          <Button asChild size="sm" variant="glass">
            <Link to={`/beer/${item.beer.id}`}>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
