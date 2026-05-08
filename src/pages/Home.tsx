import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Compass,
  Layers,
  ListOrdered,
  MapPin,
  MessageSquareText,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BeerGlassIcon } from '@/components/BeerGlassIcon';
import { BEERS } from '@/data/beers';
import { findPrices } from '@/data/seedPrices';
import { useFeedMeta } from '@/lib/useFeedMeta';
import { formatPrice } from '@/lib/utils';

const FEATURES = [
  {
    to: '/catalog',
    icon: <BarChart3 className="size-5" />,
    title: 'Цены по магазинам',
    desc: 'Сравниваем цены каждый день: К&Б, ВинЛаб, Перекрёсток, Лента и др.',
    color: 'from-amber-300/60 to-amber-500/40',
  },
  {
    to: '/top',
    icon: <ListOrdered className="size-5" />,
    title: 'Топ недели',
    desc: 'Алгоритм собирает лучшее на этой неделе по оценкам и активности.',
    color: 'from-rose-300/60 to-amber-300/40',
  },
  {
    to: '/mood',
    icon: <Compass className="size-5" />,
    title: 'Подборка по настроению',
    desc: 'Просто попить, похрустеть или набухаться — выбираем за пару кликов.',
    color: 'from-violet-300/60 to-rose-300/40',
  },
  {
    to: '/sets',
    icon: <Layers className="size-5" />,
    title: 'Сеты + автозакуски',
    desc: 'Собирайте сеты, мы автоматически подбираем закуски.',
    color: 'from-emerald-300/60 to-amber-300/40',
  },
  {
    to: '/posts',
    icon: <MessageSquareText className="size-5" />,
    title: 'Посты сообщества',
    desc: 'Пишите и читайте заметки и обзоры пива от других любителей.',
    color: 'from-sky-300/60 to-violet-300/40',
  },
  {
    to: '/daily',
    icon: <Calendar className="size-5" />,
    title: 'Трекер дейликов',
    desc: 'Дневник: что выпили, сколько и в каком настроении. Streak считается сам.',
    color: 'from-amber-300/60 to-rose-300/40',
  },
  {
    to: '/map',
    icon: <MapPin className="size-5" />,
    title: 'Карта баров и разливаек',
    desc: 'Бары, паб, разливайки и тапы по российским городам.',
    color: 'from-emerald-300/60 to-sky-300/40',
  },
  {
    to: '/ai',
    icon: <Sparkles className="size-5" />,
    title: 'AI-сомелье',
    desc: 'Бесплатные модели OpenRouter подберут пиво и закуски под повод.',
    color: 'from-violet-300/60 to-amber-300/40',
  },
];

export function HomePage() {
  const meta = useFeedMeta();
  const featured = BEERS.slice(0, 4);
  return (
    <div className="space-y-10">
      <Hero />
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Пива в каталоге" value={`${BEERS.length}+`} hint="разные стили и страны" />
        <StatCard label="Магазинов" value={`${meta.storeCount}`} hint="цены каждые 24 часа" />
        <StatCard
          label="Обновление цен"
          value={new Date(meta.generatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
          hint={meta.source === 'live' ? 'live ETL' : 'демо-фид'}
        />
        <StatCard label="ИИ-модели" value="6" hint="бесплатно через OpenRouter" />
      </section>

      <section>
        <SectionHeader
          title="Что внутри HopHub"
          subtitle="Полный комплект инструментов для пивного дегустатора"
        />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link to={f.to}>
                <Card className="group relative h-full p-4">
                  <div
                    className={`absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-br ${f.color} opacity-50 blur-2xl transition-opacity group-hover:opacity-80`}
                  />
                  <div className="flex items-center gap-2">
                    <div className="grid size-9 place-items-center rounded-2xl bg-white/60 dark:bg-white/10">
                      {f.icon}
                    </div>
                    <h3 className="font-display font-semibold tracking-tight">{f.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-(--color-muted-foreground)">{f.desc}</p>
                  <div className="mt-4 flex items-center text-xs text-(--color-muted-foreground)">
                    Открыть
                    <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Свежие сорта в поле зрения"
          subtitle="Карточки берут актуальные цены из ежедневного фида"
          right={
            <Button asChild variant="glass" size="sm">
              <Link to="/catalog">
                Весь каталог <ArrowRight className="size-3" />
              </Link>
            </Button>
          }
        />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((b, i) => {
            const p = findPrices(b.id);
            const min = p?.prices.length ? Math.min(...p.prices.map((x) => x.price)) : null;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Link to={`/beer/${b.id}`}>
                  <Card className="liquid-shine relative h-full overflow-hidden p-0">
                    <div
                      className="flex h-44 items-center justify-center"
                      style={{
                        background: `radial-gradient(120% 80% at 50% 0%, ${b.baseColor}66 0%, transparent 60%), radial-gradient(120% 80% at 80% 100%, ${b.baseColor}cc 0%, transparent 60%)`,
                      }}
                    >
                      <BeerGlassIcon color={b.baseColor} size={96} animate />
                    </div>
                    <div className="space-y-2 p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="capitalize">
                          {b.style}
                        </Badge>
                        {min && <span className="font-display font-semibold">от {formatPrice(min)}</span>}
                      </div>
                      <h3 className="font-display font-semibold leading-tight">{b.name}</h3>
                      <p className="text-xs text-(--color-muted-foreground)">{b.brewery}</p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Card className="relative overflow-hidden p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-8 lg:grid-cols-[1fr_auto]"
        >
          <div>
            <Badge variant="amber" className="mb-4 inline-flex">
              <Wand2 className="size-3" /> liquid glass · iOS · PWA
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Все пивные дела в{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 bg-clip-text text-transparent">
                одном стекле
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-(--color-muted-foreground) sm:text-lg">
              Цены по магазинам РФ обновляются каждый день, топ недели собирается автоматически, дейлики
              считают streak, AI-сомелье на бесплатных моделях OpenRouter подбирает пиво под повод и
              закуску под пиво. Карта разливаек прилагается.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button asChild size="lg">
                <Link to="/catalog">
                  В каталог
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link to="/mood">
                  <Compass className="size-4" />
                  Подобрать по настроению
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/ai">
                  <Sparkles className="size-4" />
                  Спросить AI
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative grid h-72 place-items-center sm:h-80">
            <motion.div
              className="absolute"
              animate={{ rotate: [0, 4, -3, 0], y: [0, -8, 4, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BeerGlassIcon color="#e9a92a" size={220} animate />
            </motion.div>
            <motion.div
              className="absolute -left-2 top-2"
              animate={{ rotate: [-6, 6, -6], y: [0, 6, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BeerGlassIcon color="#1a0e07" size={120} animate />
            </motion.div>
            <motion.div
              className="absolute right-0 bottom-2"
              animate={{ rotate: [4, -4, 4], y: [4, -4, 4] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BeerGlassIcon color="#f5c542" size={140} animate />
            </motion.div>
          </div>
        </motion.div>
      </Card>
    </section>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs uppercase tracking-wider text-(--color-muted-foreground)">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs text-(--color-muted-foreground)">{hint}</div>
    </Card>
  );
}

export function SectionHeader({ title, subtitle, right }: { title: React.ReactNode; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className="text-sm text-(--color-muted-foreground)">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
