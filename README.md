# HopHub 🍺

Liquid-glass PWA для пива: цены в магазинах РФ, оценки и отзывы, топ недели,
дейлики, посты, сеты, авто-закуски, мудборд, карта баров и AI-сомелье на
бесплатных моделях OpenRouter. Полностью статический хостинг — GitHub Pages.

## Стек

- Vite + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui (Radix primitives)
- Framer Motion, Recharts, Leaflet
- vite-plugin-pwa (Workbox) для оффлайна и установки на iOS/Android
- localStorage для отзывов/постов/сетов/дейликов
- GitHub Actions: ежедневный сбор цен + деплой на GitHub Pages

## Локальный запуск

```bash
pnpm install
node scripts/scrape.mjs   # подтягиваем фиксированный seed-feed
pnpm dev                  # http://localhost:5173/hophub/
```

Перед PR:

```bash
pnpm lint
pnpm build
```

## Структура

```
src/
  components/   UI + лэйаут + theme provider + общие вьюхи
  components/ui shadcn/ui примитивы
  data/         beers, snacks, bars, stores, seedPrices, types
  lib/          openrouter, storage, usePriceFeed, useFeedMeta, utils
  pages/        Home, Catalog, BeerDetail, WeeklyTop, Daily, Posts,
                Sets, Mood, Map, AI, Settings, NotFound
public/
  icons/        PWA иконки 192/512/maskable + apple-touch-icon
  data/         prices.json + meta.json (генерятся скрейпером)
scripts/
  scrape.mjs    парсер цен → public/data/*.json
.github/workflows/
  ci.yml        lint + build на PR
  scrape.yml    cron 04:17 UTC → коммит обновлённых цен
  deploy.yml    push в main → GitHub Pages
```

## OpenRouter

В `src/lib/embedded-key.ts` лежит обфусцированный ключ (XOR + base64 + чанки).
Это не криптозащита: целеустремлённый человек его извлечёт. Поэтому ключ — для
бесплатных моделей. Юзер может в Настройках вписать свой ключ — он имеет
приоритет и хранится только в `localStorage`.

Используются исключительно бесплатные модели (Llama 3.x, Gemma 2, Mistral 7B,
Qwen 2.5, Hermes 3 405B).

## PWA

- `manifest.webmanifest` генерится `vite-plugin-pwa`
- иконки в `public/icons/` (rsvg-convert из `scripts/icon-source.svg`)
- service worker кеширует ассеты и `/data/prices.json` (StaleWhileRevalidate)
- iOS: «Поделиться» → «На экран Домой»
- Android Chrome: меню → «Установить приложение»

## Настройки GitHub Pages

В репозитории включить **Pages → Source: GitHub Actions**. Workflow `deploy.yml`
сам деплоит build артефакт. Базовый путь — `/hophub/`. Для кастомного домена
нужно поменять `base` в `vite.config.ts` и `start_url`/`scope` в манифесте.

## Парсер цен

`scripts/scrape.mjs` читает `src/data/beers.ts`, прогоняет детерминированный
сид-генератор с дрифтом по дню (чтобы цены менялись день ото дня). Если
переменная `HOPHUB_LIVE_SCRAPE=1`, скрипт пробует прозондировать витрины и
помечает источник `live+seed`. Большинство ритейлеров блокируют дата-центры,
поэтому сид остаётся надёжным фолбеком.

## Лицензия

MIT
