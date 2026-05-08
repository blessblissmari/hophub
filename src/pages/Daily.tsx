import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { RatingStars } from '@/components/RatingStars';
import { BeerGlassIcon } from '@/components/BeerGlassIcon';
import { BEERS } from '@/data/beers';
import { addDaily, deleteDaily, getDaily, useLocalCollection } from '@/lib/storage';
import { dayKey } from '@/lib/utils';
import { toast } from 'sonner';
import { SectionHeader } from './Home';

export function DailyPage() {
  const entries = useLocalCollection(getDaily);
  const today = dayKey();
  const [beerId, setBeerId] = React.useState(BEERS[0].id);
  const [volume, setVolume] = React.useState(500);
  const [rating, setRating] = React.useState(4);
  const [note, setNote] = React.useState('');
  const [mood, setMood] = React.useState<'drink' | 'crunch' | 'hammer' | 'cozy'>('drink');

  const streak = computeStreak(entries.map((e) => e.date));
  const totalAlcohol = entries
    .reduce((sum, e) => sum + (e.volumeMl * e.abv) / 100, 0)
    .toFixed(0);
  const last7 = React.useMemo(() => {
    const days: { date: string; count: number; alcohol: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayEntries = entries.filter((e) => e.date === key);
      days.push({
        date: key,
        count: dayEntries.length,
        alcohol: dayEntries.reduce((s, e) => s + (e.volumeMl * e.abv) / 100, 0),
      });
    }
    return days;
  }, [entries]);

  const submit = () => {
    const beer = BEERS.find((b) => b.id === beerId);
    if (!beer) return;
    addDaily({
      date: today,
      beerId,
      beerName: beer.name,
      volumeMl: volume,
      abv: beer.abv,
      rating,
      note: note.trim() || undefined,
      mood,
    });
    setNote('');
    toast.success('Записано в дневник 🍺');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          <>
            <Calendar className="mr-2 inline size-7 text-amber-500" /> Дневник дегустаций
          </>
        }
        subtitle="Каждое пиво — запись. Streak считается автоматически."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Streak" value={`${streak} дн.`} icon={<Flame className="size-5 text-amber-500" />} />
        <StatCard label="Записей всего" value={`${entries.length}`} />
        <StatCard label="Алкоголя выпито" value={`${totalAlcohol} мл чистого`} hint="оценка" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Календарь недели</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {last7.map((d) => {
              const intensity = Math.min(d.alcohol / 30, 1);
              const date = new Date(d.date);
              return (
                <div
                  key={d.date}
                  className="glass-soft p-3 text-center"
                  style={{
                    background:
                      intensity > 0
                        ? `linear-gradient(180deg, color-mix(in oklch, var(--color-primary) ${
                            intensity * 60
                          }%, transparent), transparent)`
                        : undefined,
                  }}
                >
                  <div className="text-[10px] uppercase tracking-wider text-(--color-muted-foreground)">
                    {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                  </div>
                  <div className="font-display text-lg font-semibold">{date.getDate()}</div>
                  <div className="text-[10px] text-(--color-muted-foreground)">
                    {d.count > 0 ? `${d.count} пива` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Записать сегодняшнее</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1 block">Пиво</Label>
            <Select value={beerId} onValueChange={setBeerId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BEERS.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} · {b.abv}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Объём, мл</Label>
            <Input
              type="number"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value) || 0)}
              min={50}
              max={3000}
              step={50}
            />
          </div>
          <div>
            <Label className="mb-1 block">Оценка</Label>
            <RatingStars value={rating} onChange={setRating} />
          </div>
          <div>
            <Label className="mb-1 block">Настроение</Label>
            <ToggleGroup
              type="single"
              value={mood}
              onValueChange={(v) => v && setMood(v as typeof mood)}
              className="flex-wrap"
            >
              <ToggleGroupItem value="drink">Попить</ToggleGroupItem>
              <ToggleGroupItem value="crunch">Похрустеть</ToggleGroupItem>
              <ToggleGroupItem value="hammer">Набухаться</ToggleGroupItem>
              <ToggleGroupItem value="cozy">Под плед</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1 block">Заметка</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Где, с кем, под что зашло…"
              rows={3}
            />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={submit}>Сохранить запись</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>История</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-(--color-muted-foreground)">
              Пока пусто — запиши первое пиво, чтобы начать streak.
            </p>
          ) : (
            <div className="space-y-2">
              {entries.map((e, i) => {
                const beer = BEERS.find((b) => b.id === e.beerId);
                return (
                  <motion.div
                    key={e.createdAt}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                    className="glass-soft flex items-center gap-3 px-3 py-2"
                  >
                    {beer && (
                      <div
                        className="grid size-10 shrink-0 place-items-center rounded-2xl"
                        style={{ background: `radial-gradient(120% 80% at 30% 20%, ${beer.baseColor}66, transparent)` }}
                      >
                        <BeerGlassIcon color={beer.baseColor} size={28} animate={false} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="truncate">{e.beerName}</strong>
                        <Badge variant="secondary">{e.volumeMl} мл</Badge>
                        <Badge variant="secondary">{e.abv}%</Badge>
                        <Badge variant="secondary">{e.mood}</Badge>
                      </div>
                      <div className="text-xs text-(--color-muted-foreground)">
                        {new Date(e.date).toLocaleDateString('ru-RU')} · оценка {e.rating}/5
                      </div>
                      {e.note && <div className="mt-1 text-sm">{e.note}</div>}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteDaily(e.createdAt)}
                      aria-label="Удалить запись"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-(--color-muted-foreground)">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold tracking-tight">{value}</div>
      {hint && <div className="text-xs text-(--color-muted-foreground)">{hint}</div>}
    </Card>
  );
}

function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}
