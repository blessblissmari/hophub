export const STORES = [
  { id: 'krasnoe-beloe', name: 'Красное & Белое', short: 'К&Б', url: 'https://krasnoeibeloe.ru', color: '#cf1d2c' },
  { id: 'vinlab', name: 'ВинЛаб', short: 'ВЛаб', url: 'https://winelab.ru', color: '#a13b6e' },
  { id: 'perekrestok', name: 'Перекрёсток', short: 'ПК', url: 'https://www.perekrestok.ru', color: '#0a8537' },
  { id: 'lenta', name: 'Лента', short: 'Лнт', url: 'https://lenta.com', color: '#0067ad' },
  { id: 'okey', name: 'O\'Кей', short: 'OK', url: 'https://www.okeydostavka.ru', color: '#ec6608' },
  { id: 'metro', name: 'Metro C&C', short: 'Mtr', url: 'https://www.metro-cc.ru', color: '#003a78' },
  { id: 'magnit', name: 'Магнит', short: 'Мгн', url: 'https://magnit.ru', color: '#e30613' },
  { id: 'auchan', name: 'Ашан', short: 'Аш', url: 'https://auchan.ru', color: '#e6101a' },
];

export type StoreId = (typeof STORES)[number]['id'];
