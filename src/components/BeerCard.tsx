import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BeerGlassIcon } from './BeerGlassIcon';
import { cn, formatPrice } from '@/lib/utils';
import { findPrices } from '@/data/seedPrices';
import { getFavorites, toggleFavorite, useLocalCollection } from '@/lib/storage';
import type { BeerProduct } from '@/data/types';
import { RatingStars } from './RatingStars';

interface Props {
  beer: BeerProduct;
  index?: number;
  averageRating?: number;
}

export function BeerCard({ beer, index = 0, averageRating }: Props) {
  const favorites = useLocalCollection(getFavorites);
  const isFav = favorites.includes(beer.id);
  const priceData = findPrices(beer.id);
  const minPrice = priceData?.prices.length
    ? Math.min(...priceData.prices.map((p) => p.price))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Card className="liquid-shine group relative h-full overflow-hidden p-0">
        <Link to={`/beer/${beer.id}`} className="block">
          <div
            className="relative flex h-44 items-center justify-center overflow-hidden"
            style={{
              background: `radial-gradient(120% 80% at 30% 20%, ${beer.baseColor}55 0%, transparent 60%), radial-gradient(120% 80% at 80% 90%, ${beer.baseColor}99 0%, transparent 65%)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5" />
            <BeerGlassIcon color={beer.baseColor} size={84} animate />
            <Badge variant="glass" className="absolute left-3 top-3 capitalize">
              {beer.style}
            </Badge>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(beer.id);
              }}
              className={cn(
                'absolute right-3 top-3 rounded-full p-2 backdrop-blur-md transition-colors',
                isFav
                  ? 'bg-rose-500/90 text-white'
                  : 'bg-white/40 hover:bg-white/70 dark:bg-white/15 dark:hover:bg-white/25'
              )}
              aria-label="В избранное"
            >
              <Heart size={14} className={isFav ? 'fill-white' : ''} />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-semibold leading-tight tracking-tight">
                  {beer.name}
                </h3>
                <p className="text-xs text-(--color-muted-foreground)">
                  {beer.brewery} · {beer.country}
                </p>
              </div>
              {minPrice && (
                <div className="text-right">
                  <div className="font-display text-base font-semibold">{formatPrice(minPrice)}</div>
                  <div className="text-[10px] uppercase tracking-wider text-(--color-muted-foreground)">от</div>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary">{beer.abv}%</Badge>
                <Badge variant="secondary">{beer.ibu} IBU</Badge>
                <Badge variant="secondary">{beer.volumeMl} мл</Badge>
              </div>
              {averageRating != null && averageRating > 0 ? (
                <RatingStars value={averageRating} size={12} readOnly />
              ) : null}
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}
