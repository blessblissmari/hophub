import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowLeft, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { BeerGlassIcon } from '@/components/BeerGlassIcon';
import { RatingStars } from '@/components/RatingStars';
import { BEERS } from '@/data/beers';
import { SNACKS } from '@/data/snacks';
import { findPrices } from '@/data/seedPrices';
import {
  addReview,
  getFavorites,
  getReviews,
  getUser,
  toggleFavorite,
  useLocalCollection,
} from '@/lib/storage';
import { cn, formatPrice, relativeTime } from '@/lib/utils';
import { toast } from 'sonner';

export function BeerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const beer = BEERS.find((b) => b.id === id);

  const reviews = useLocalCollection(getReviews);
  const favorites = useLocalCollection(getFavorites);

  const priceData = beer ? findPrices(beer.id) : undefined;
  const chartData = React.useMemo(() => {
    if (!priceData) return [];
    const byDate = new Map<string, number[]>();
    for (const h of priceData.history) {
      if (!byDate.has(h.date)) byDate.set(h.date, []);
      byDate.get(h.date)!.push(h.price);
    }
    return Array.from(byDate.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, list]) => ({
        date: date.slice(5),
        avg: Math.round(list.reduce((a, b) => a + b, 0) / list.length),
        min: Math.min(...list),
      }));
  }, [priceData]);

  if (!beer) {
    return (
      <Card className="p-10 text-center">
        <p>Пиво не найдено.</p>
        <Button onClick={() => navigate('/catalog')} className="mt-4">
          В каталог
        </Button>
      </Card>
    );
  }

  const isFav = favorites.includes(beer.id);
  const beerReviews = reviews.filter((r) => r.beerId === beer.id);
  const avg = beerReviews.length
    ? beerReviews.reduce((s, r) => s + r.rating, 0) / beerReviews.length
    : 0;

  const minPrice = priceData?.prices.length ? Math.min(...priceData.prices.map((p) => p.price)) : 0;
  const maxPrice = priceData?.prices.length ? Math.max(...priceData.prices.map((p) => p.price)) : 0;

  const recommendedSnacks = SNACKS.filter((s) => s.pairs.includes(beer.style)).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="glass" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
          Назад
        </Button>
        <Button
          variant={isFav ? 'default' : 'glass'}
          size="sm"
          onClick={() => {
            toggleFavorite(beer.id);
            toast.success(isFav ? 'Убрано из избранного' : 'В избранное!');
          }}
        >
          <Heart className={cn('size-4', isFav && 'fill-current')} />
          {isFav ? 'В избранном' : 'В избранное'}
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid items-center gap-6 p-5 sm:grid-cols-[auto_1fr] sm:p-8">
          <motion.div
            className="relative grid h-48 w-full place-items-center overflow-hidden rounded-3xl sm:h-64 sm:w-64"
            style={{
              background: `radial-gradient(120% 80% at 30% 20%, ${beer.baseColor}66 0%, transparent 60%), radial-gradient(120% 80% at 80% 90%, ${beer.baseColor}cc 0%, transparent 60%)`,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <BeerGlassIcon color={beer.baseColor} size={180} animate />
          </motion.div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="amber" className="capitalize">
                {beer.style}
              </Badge>
              <Badge variant="glass">{beer.country}</Badge>
              <Badge variant="secondary">{beer.color}</Badge>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {beer.name}
            </h1>
            <p className="text-(--color-muted-foreground)">{beer.brewery}</p>
            <p className="mt-3 text-sm leading-relaxed text-(--color-muted-foreground)">
              {beer.description}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:max-w-md">
              <Stat label="ABV" value={`${beer.abv}%`} />
              <Stat label="IBU" value={`${beer.ibu}`} />
              <Stat label="Объём" value={`${beer.volumeMl} мл`} />
            </div>
            {avg > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <RatingStars value={avg} size={16} readOnly />
                <span className="text-(--color-muted-foreground)">
                  {avg.toFixed(1)} · {beerReviews.length} отзыв(ов)
                </span>
              </div>
            )}
            {minPrice > 0 && (
              <div className="mt-4 flex items-end gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-(--color-muted-foreground)">
                    Цена сейчас
                  </div>
                  <div className="font-display text-3xl font-bold">
                    {formatPrice(minPrice)}
                    <span className="ml-2 text-sm font-normal text-(--color-muted-foreground)">
                      до {formatPrice(maxPrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="prices">
        <TabsList>
          <TabsTrigger value="prices">Цены</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="snacks">Закуски</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы ({beerReviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="prices" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>Цены по магазинам</CardTitle>
            </CardHeader>
            <CardContent>
              {priceData?.prices?.length ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {priceData.prices
                    .slice()
                    .sort((a, b) => a.price - b.price)
                    .map((p, i) => (
                      <a
                        key={`${p.store}-${i}`}
                        href={p.storeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="glass-soft flex items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-white/55 dark:hover:bg-white/10"
                      >
                        <div className="min-w-0">
                          <div className="font-medium">{p.store}</div>
                          <div className="text-xs text-(--color-muted-foreground)">
                            {p.inStock ? 'В наличии' : 'Нет в наличии'}
                            {p.promo && <span className="ml-2 text-amber-500">{p.promo}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <div>
                            <div className="font-display text-lg font-semibold">
                              {formatPrice(p.price)}
                            </div>
                            {p.oldPrice && (
                              <div className="text-xs text-(--color-muted-foreground) line-through">
                                {formatPrice(p.oldPrice)}
                              </div>
                            )}
                          </div>
                          <ExternalLink className="size-3 text-(--color-muted-foreground)" />
                        </div>
                      </a>
                    ))}
                </div>
              ) : (
                <div className="text-sm text-(--color-muted-foreground)">Цены пока не собраны</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>История цены, ₽ за бутылку</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="g-price" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e9a92a" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#e9a92a" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} />
                    <YAxis tickLine={false} axisLine={false} fontSize={11} domain={['auto', 'auto']} />
                    <RechartsTooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderRadius: '14px',
                      }}
                    />
                    <Area type="monotone" dataKey="avg" stroke="#e9a92a" fill="url(#g-price)" strokeWidth={2} />
                    <Area type="monotone" dataKey="min" stroke="#e9602a" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-(--color-muted-foreground)">
                Сплошная линия — средняя по магазинам, штриховая — минимальная.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="snacks">
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" /> Закуски под этот стиль
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedSnacks.length === 0 ? (
                <p className="text-sm text-(--color-muted-foreground)">
                  Подберу позже — пока нет точных пар для стиля «{beer.style}»
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {recommendedSnacks.map((s) => (
                    <div key={s.id} className="glass-soft flex items-start gap-3 p-3">
                      <div className="text-3xl">{s.emoji}</div>
                      <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-(--color-muted-foreground)">{s.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Separator className="my-5" />
              <div>
                <h4 className="font-display font-semibold">Хорошо звучит с</h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {beer.pairsWell.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewSection beerId={beer.id} reviews={beerReviews} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Похожее</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BEERS.filter((b) => b.id !== beer.id && (b.style === beer.style || b.color === beer.color))
              .slice(0, 4)
              .map((b) => (
                <Link key={b.id} to={`/beer/${b.id}`} className="glass-soft p-3 transition hover:bg-white/55 dark:hover:bg-white/10">
                  <div
                    className="grid h-24 place-items-center rounded-2xl"
                    style={{
                      background: `radial-gradient(120% 80% at 50% 20%, ${b.baseColor}66, transparent 60%)`,
                    }}
                  >
                    <BeerGlassIcon color={b.baseColor} size={56} animate={false} />
                  </div>
                  <div className="mt-2 text-sm font-semibold">{b.name}</div>
                  <div className="text-xs text-(--color-muted-foreground)">{b.brewery}</div>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-soft px-3 py-2 text-center">
      <div className="text-[10px] uppercase tracking-wider text-(--color-muted-foreground)">{label}</div>
      <div className="font-display text-lg font-semibold">{value}</div>
    </div>
  );
}

function ReviewSection({ beerId, reviews }: { beerId: string; reviews: ReturnType<typeof getReviews> }) {
  const [rating, setRating] = React.useState(0);
  const [body, setBody] = React.useState('');
  const user = getUser();

  const submit = () => {
    if (rating < 1 || rating > 5) {
      toast.error('Поставь оценку от 1 до 5');
      return;
    }
    if (!body.trim()) {
      toast.error('Напиши пару слов в отзыве');
      return;
    }
    addReview({
      beerId,
      rating,
      body: body.trim(),
      author: user.name,
      vibes: [],
    });
    setBody('');
    setRating(0);
    toast.success('Отзыв опубликован!');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Оставить отзыв</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Оценка:</span>
            <RatingStars value={rating} onChange={setRating} />
          </div>
          <Textarea
            placeholder="Что почувствовал? Цвет, аромат, вкус, послевкусие, с чем зашло…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
          />
          <Button onClick={submit}>Опубликовать</Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-(--color-muted-foreground)">
              Отзывов пока нет — будь первым!
            </p>
          </Card>
        ) : (
          reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-start gap-3 pt-5">
                <Avatar>
                  <AvatarFallback>{r.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>{r.author}</strong>
                    <RatingStars value={r.rating} size={14} readOnly />
                    <span className="text-xs text-(--color-muted-foreground)">
                      {relativeTime(r.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{r.body}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
