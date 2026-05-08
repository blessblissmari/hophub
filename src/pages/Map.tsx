import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BARS } from '@/data/bars';
import type { Bar } from '@/data/types';
import { useTheme } from '@/components/theme-provider';
import { SectionHeader } from './Home';

const TYPES: { id: Bar['type'] | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'pub', label: 'Пабы' },
  { id: 'tap', label: 'Разливайки' },
  { id: 'bar', label: 'Бары' },
  { id: 'craft', label: 'Крафт' },
  { id: 'shop', label: 'Магазины' },
];

const TYPE_COLORS: Record<Bar['type'], string> = {
  pub: '#e9a92a',
  tap: '#f97316',
  bar: '#a855f7',
  craft: '#22c55e',
  shop: '#0ea5e9',
};

function makeIcon(type: Bar['type']) {
  const color = TYPE_COLORS[type];
  return L.divIcon({
    className: 'hophub-marker',
    html: `<div style="width:32px;height:42px;display:flex;align-items:flex-start;justify-content:center;">
      <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g${color.replace('#','')}" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.7"/>
          </radialGradient>
        </defs>
        <path d="M16 41 C 4 26 2 18 2 14 a14 14 0 1 1 28 0 c0 4-2 12-14 27z" fill="url(#g${color.replace('#','')})" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="16" cy="14" r="5" fill="white"/>
      </svg>
    </div>`,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
    popupAnchor: [0, -36],
  });
}

const ICONS = Object.fromEntries(
  (Object.keys(TYPE_COLORS) as Bar['type'][]).map((t) => [t, makeIcon(t)])
) as Record<Bar['type'], L.DivIcon>;

export function MapPage() {
  const [type, setType] = React.useState<Bar['type'] | 'all'>('all');
  const [city, setCity] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const cities = React.useMemo(
    () => Array.from(new Set(BARS.map((b) => b.city))).sort(),
    []
  );
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return BARS.filter(
      (b) =>
        (type === 'all' || b.type === type) &&
        (city === 'all' || b.city === city) &&
        (!q || `${b.name} ${b.signature} ${b.address}`.toLowerCase().includes(q))
    );
  }, [type, city, query]);

  const center: LatLngExpression =
    filtered.length > 0
      ? [
          filtered.reduce((s, b) => s + b.lat, 0) / filtered.length,
          filtered.reduce((s, b) => s + b.lng, 0) / filtered.length,
        ]
      : [55.7558, 37.6173];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={
          <>
            <MapPin className="mr-2 inline size-7 text-amber-500" /> Карта баров и разливаек
          </>
        }
        subtitle="Подобрали проверенные места по российским городам"
      />
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Поиск по названию, адресу или изюминке"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(v) => v && setType(v as Bar['type'] | 'all')}
            className="flex-wrap"
          >
            {TYPES.map((t) => (
              <ToggleGroupItem key={t.id} value={t.id}>
                {t.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup
            type="single"
            value={city}
            onValueChange={(v) => v && setCity(v)}
            className="flex-wrap"
          >
            <ToggleGroupItem value="all">Все города</ToggleGroupItem>
            {cities.map((c) => (
              <ToggleGroupItem key={c} value={c}>
                {c}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card className="overflow-hidden p-0">
        <MapShell center={center} key={`${city}-${type}`}>
          {filtered.map((b) => (
            <Marker key={b.id} position={[b.lat, b.lng]} icon={ICONS[b.type]}>
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <strong>{b.name}</strong>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {b.city} · {b.address}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 6 }}>{b.signature}</div>
                  <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>{b.hours}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapShell>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge style={{ background: TYPE_COLORS[b.type] }} className="text-white">
                    {labelForType(b.type)}
                  </Badge>
                  <Badge variant="glass">{b.city}</Badge>
                </div>
                <CardTitle className="text-lg">{b.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{b.signature}</p>
                <p className="text-xs text-(--color-muted-foreground)">{b.address}</p>
                <p className="text-xs text-(--color-muted-foreground)">{b.hours}</p>
                <div className="flex flex-wrap gap-1">
                  {b.vibes.map((v) => (
                    <Badge key={v} variant="secondary">
                      {v}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="glass" size="sm">
                  <a
                    href={`https://yandex.ru/maps/?text=${encodeURIComponent(`${b.city} ${b.address}`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Открыть в картах
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function labelForType(t: Bar['type']) {
  return { pub: 'Паб', tap: 'Разливайка', bar: 'Бар', craft: 'Крафт', shop: 'Магазин' }[t];
}

function MapShell({ center, children }: { center: LatLngExpression; children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const tileUrl =
    resolvedTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  return (
    <div className="h-[480px] w-full overflow-hidden">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <RecenterMap center={center} />
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> · CARTO'
        />
        {children}
      </MapContainer>
    </div>
  );
}

function RecenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 5);
  }, [center, map]);
  return null;
}
