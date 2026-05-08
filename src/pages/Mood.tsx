import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BeerGlassIcon } from '@/components/BeerGlassIcon';
import { BEERS } from '@/data/beers';
import { SNACKS } from '@/data/snacks';
import { findPrices } from '@/data/seedPrices';
import { formatPrice } from '@/lib/utils';
import { SectionHeader } from './Home';

type Mood = 'drink' | 'crunch' | 'hammer' | 'cozy';

const MOODS: { id: Mood; label: string; description: string; emoji: string; gradient: string }[] = [
  {
    id: 'drink',
    label: 'Просто попить',
    description: 'Лёгкое, освежающее, чтобы под разговор. Лагеры, пилзнеры, пшеничное.',
    emoji: '🍺',
    gradient: 'from-amber-300/60 to-amber-500/40',
  },
  {
    id: 'crunch',
    label: 'Похрустеть',
    description: 'Под чипсы, орешки, кальмар. Сухие, горьковатые, IPA, пилзнер.',
    emoji: '🥨',
    gradient: 'from-amber-400/50 to-rose-300/40',
  },
  {
    id: 'hammer',
    label: 'Набухаться',
    description: 'Высокий ABV, плотные стауты, имперские IPA, сидры. Без жалости.',
    emoji: '💀',
    gradient: 'from-rose-400/60 to-violet-400/40',
  },
  {
    id: 'cozy',
    label: 'Под плед',
    description: 'Тёмное, шоколадное, портеры, стауты. Под фильм или книгу.',
    emoji: '🛋️',
    gradient: 'from-violet-400/40 to-amber-300/30',
  },
];

export function MoodPage() {
  const [mood, setMood] = React.useState<Mood>('drink');
  const [seed, setSeed] = React.useState(0);

  const filtered = React.useMemo(() => {
    const filtered = filterByMood(mood);
    return shuffleWithSeed(filtered, seed).slice(0, 6);
  }, [mood, seed]);

  const snacks = React.useMemo(() => {
    const beerStyles = new Set(filtered.map((b) => b.style));
    return SNACKS.filter((s) => s.pairs.some((style) => beerStyles.has(style))).slice(0, 8);
  }, [filtered]);

  const moodMeta = MOODS.find((m) => m.id === mood)!;

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          <>
            <Compass className="mr-2 inline size-7 text-amber-500" /> Подборка по настроению
          </>
        }
        subtitle="Скажи как — соберём пиво, закуски и направим"
      />
      <Card className="overflow-hidden">
        <div
          className={`bg-gradient-to-br ${moodMeta.gradient} p-5 sm:p-8`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-5xl">{moodMeta.emoji}</div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">{moodMeta.label}</h2>
              <p className="mt-1 max-w-xl text-sm text-(--color-foreground)/80">{moodMeta.description}</p>
            </div>
            <Button variant="glass" onClick={() => setSeed((s) => s + 1)}>
              <RefreshCcw className="size-4" />
              Перевыбрать
            </Button>
          </div>
        </div>
        <CardContent className="pt-5">
          <ToggleGroup
            type="single"
            value={mood}
            onValueChange={(v) => v && setMood(v as Mood)}
            className="flex-wrap"
          >
            {MOODS.map((m) => (
              <ToggleGroupItem key={m.id} value={m.id}>
                <span className="mr-1">{m.emoji}</span>
                {m.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Sparkles className="mr-1 inline size-4 text-amber-500" /> Подходящее пиво
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {filtered.map((b, i) => {
              const min = Math.min(...(findPrices(b.id)?.prices.map((x) => x.price) ?? [0])) || 0;
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link to={`/beer/${b.id}`}>
                    <Card className="liquid-shine relative h-full overflow-hidden p-0">
                      <div
                        className="grid h-32 place-items-center"
                        style={{ background: `radial-gradient(120% 80% at 30% 20%, ${b.baseColor}66, transparent 60%)` }}
                      >
                        <BeerGlassIcon color={b.baseColor} size={70} animate />
                      </div>
                      <div className="space-y-1 p-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="capitalize">
                            {b.style}
                          </Badge>
                          {min > 0 && <span className="text-sm font-semibold">{formatPrice(min)}</span>}
                        </div>
                        <h4 className="text-sm font-semibold leading-tight">{b.name}</h4>
                        <p className="text-xs text-(--color-muted-foreground)">{b.abv}% · {b.brewery}</p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {snacks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Закуски-компаньоны</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {snacks.map((s) => (
                <div key={s.id} className="glass-soft flex items-start gap-3 p-3">
                  <div className="text-3xl">{s.emoji}</div>
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-(--color-muted-foreground)">{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function filterByMood(mood: Mood) {
  if (mood === 'drink') {
    return BEERS.filter((b) => ['lager', 'pilsner', 'pale ale', 'wheat', 'cider', 'nealco'].includes(b.style) && b.abv <= 5.5);
  }
  if (mood === 'crunch') {
    return BEERS.filter((b) => ['ipa', 'pilsner', 'pale ale', 'wheat'].includes(b.style) && b.ibu >= 20);
  }
  if (mood === 'hammer') {
    return BEERS.filter((b) => b.abv >= 6.5 || b.style === 'ipa' || b.style === 'stout');
  }
  return BEERS.filter((b) => ['stout', 'porter', 'sour', 'lambic'].includes(b.style));
}

function shuffleWithSeed<T>(list: T[], seed: number): T[] {
  const arr = list.slice();
  let s = seed * 9301 + 49297;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
