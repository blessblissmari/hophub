import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Plus, Trash2, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { BeerGlassIcon } from '@/components/BeerGlassIcon';
import { BEERS } from '@/data/beers';
import { SNACKS } from '@/data/snacks';
import { addSet, deleteSet, getSets, getUser, useLocalCollection } from '@/lib/storage';
import { toast } from 'sonner';
import { SectionHeader } from './Home';

export function SetsPage() {
  const sets = useLocalCollection(getSets);
  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          <>
            <Layers className="mr-2 inline size-7 text-amber-500" /> Сеты
          </>
        }
        subtitle="Собирай свой набор пива — закуски подскажем автоматически"
        right={
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="size-4" /> Новый сет
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[92%] sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Новый сет</SheetTitle>
              </SheetHeader>
              <SetComposer />
            </SheetContent>
          </Sheet>
        }
      />

      {sets.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-(--color-muted-foreground)">
            У тебя пока нет сетов. Собери первый — мы автоматически подкинем закуски!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {sets.map((s, i) => {
            const beersInSet = s.beerIds
              .map((id) => BEERS.find((b) => b.id === id))
              .filter(Boolean) as (typeof BEERS)[number][];
            const recommendedSnacks = autoSnacks(beersInSet);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                    <div>
                      <CardTitle>{s.title}</CardTitle>
                      {s.occasion && (
                        <Badge variant="amber" className="mt-1">
                          {s.occasion}
                        </Badge>
                      )}
                      {s.description && (
                        <p className="mt-2 text-sm text-(--color-muted-foreground)">{s.description}</p>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => deleteSet(s.id)} aria-label="Удалить сет">
                      <Trash2 className="size-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--color-muted-foreground)">
                        Пиво ({beersInSet.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {beersInSet.map((b) => (
                          <Link key={b.id} to={`/beer/${b.id}`}>
                            <div className="glass-soft flex items-center gap-2 p-2 transition hover:bg-white/55 dark:hover:bg-white/10">
                              <div
                                className="grid size-9 shrink-0 place-items-center rounded-xl"
                                style={{ background: `radial-gradient(120% 80% at 30% 20%, ${b.baseColor}66, transparent)` }}
                              >
                                <BeerGlassIcon color={b.baseColor} size={26} animate={false} />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">{b.name}</div>
                                <div className="text-[10px] text-(--color-muted-foreground)">{b.abv}%</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-(--color-muted-foreground)">
                        <Wand2 className="size-3 text-amber-500" /> авто-закуски
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {recommendedSnacks.map((s) => (
                          <Badge key={s.id} variant="glass">
                            {s.emoji} {s.name}
                          </Badge>
                        ))}
                        {recommendedSnacks.length === 0 && (
                          <span className="text-xs text-(--color-muted-foreground)">подбираю…</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function autoSnacks(beers: (typeof BEERS)[number][]) {
  const styles = new Set(beers.map((b) => b.style));
  const tally = new Map<string, number>();
  for (const s of SNACKS) {
    let score = 0;
    for (const style of styles) if (s.pairs.includes(style)) score += 2;
    if (score > 0) tally.set(s.id, score);
  }
  return SNACKS.filter((s) => tally.has(s.id))
    .sort((a, b) => (tally.get(b.id) || 0) - (tally.get(a.id) || 0))
    .slice(0, 6);
}

function SetComposer() {
  const [title, setTitle] = React.useState('');
  const [occasion, setOccasion] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [beerIds, setBeerIds] = React.useState<string[]>([]);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const user = getUser();

  const beersInSet = beerIds.map((id) => BEERS.find((b) => b.id === id)!).filter(Boolean);
  const previewSnacks = autoSnacks(beersInSet);

  const submit = () => {
    if (!title.trim() || beerIds.length === 0) {
      toast.error('Название и хотя бы одно пиво');
      return;
    }
    addSet({
      title: title.trim(),
      description: description.trim() || undefined,
      occasion: occasion.trim() || undefined,
      beerIds,
      snackIds: previewSnacks.map((s) => s.id),
      author: user.name,
    });
    toast.success('Сет сохранён!');
    setTitle('');
    setOccasion('');
    setDescription('');
    setBeerIds([]);
    closeRef.current?.click();
  };

  return (
    <div className="mt-6 space-y-3">
      <div>
        <Label className="mb-1 block">Название</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Дегустация светлых" />
      </div>
      <div>
        <Label className="mb-1 block">Повод (опционально)</Label>
        <Input value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="ДР, баня, премьера" />
      </div>
      <div>
        <Label className="mb-1 block">Описание (опционально)</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div>
        <Label className="mb-1 block">Пиво в сете</Label>
        <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">
          {BEERS.map((b) => {
            const on = beerIds.includes(b.id);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBeerIds(on ? beerIds.filter((x) => x !== b.id) : [...beerIds, b.id])}
              >
                <Badge variant={on ? 'amber' : 'secondary'} className="cursor-pointer">
                  {b.name}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
      {previewSnacks.length > 0 && (
        <div>
          <Label className="mb-1 block">
            <Wand2 className="mr-1 inline size-3 text-amber-500" /> Авто-закуски
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {previewSnacks.map((s) => (
              <Badge key={s.id} variant="glass">
                {s.emoji} {s.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <Button className="w-full" onClick={submit}>
        Сохранить сет
      </Button>
      <SheetClose ref={closeRef} className="hidden" />
    </div>
  );
}
