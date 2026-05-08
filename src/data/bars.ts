import type { Bar } from './types';

export const BARS: Bar[] = [
  { id: 'jawspot-msk', name: 'Jaws Spot', city: 'Москва', type: 'craft', lat: 55.7639, lng: 37.6208, address: 'Покровка, 27', signature: 'Atomic Laundry NEIPA на кране', hours: '15:00–02:00', vibes: ['крафт', 'тусовка'] },
  { id: 'william-bass-msk', name: 'William Bass', city: 'Москва', type: 'pub', lat: 55.7558, lng: 37.6173, address: 'Маросейка, 6/8', signature: 'Английский паб с 30+ кранами', hours: '12:00–01:00', vibes: ['паб', 'после работы'] },
  { id: 'bottlebros-msk', name: 'Bottle Brothers', city: 'Москва', type: 'shop', lat: 55.7745, lng: 37.6053, address: 'Никитский б-р, 7', signature: 'Бутылочный магазин крафта', hours: '11:00–23:00', vibes: ['магазин', 'крафт'] },
  { id: 'tap-and-barrel-msk', name: 'Tap & Barrel', city: 'Москва', type: 'tap', lat: 55.7321, lng: 37.5897, address: 'Шаболовка, 10', signature: '20 кранов локального крафта', hours: '14:00–02:00', vibes: ['крафт', 'тусовка'] },
  { id: 'gambrinus-spb', name: 'Gambrinus', city: 'Санкт-Петербург', type: 'pub', lat: 59.9311, lng: 30.3609, address: 'Казанская, 3', signature: 'Чешские лагеры на разлив', hours: '12:00–01:00', vibes: ['паб', 'классика'] },
  { id: 'bottle-share-spb', name: 'BottleShare', city: 'Санкт-Петербург', type: 'craft', lat: 59.9356, lng: 30.3489, address: 'Б. Конюшенная, 9', signature: 'Бельгийский трапистский крафт', hours: '15:00–02:00', vibes: ['крафт', 'эстетика'] },
  { id: 'redrum-spb', name: 'Redrum', city: 'Санкт-Петербург', type: 'craft', lat: 59.9378, lng: 30.3594, address: 'Невский, 22-24', signature: 'Российский крафт + бургеры', hours: '12:00–02:00', vibes: ['тусовка', 'крафт'] },
  { id: 'stop-list-ekb', name: 'Stop List', city: 'Екатеринбург', type: 'craft', lat: 56.8389, lng: 60.6057, address: 'Ленина, 49', signature: 'Лучший крафт-бар на Урале', hours: '14:00–02:00', vibes: ['крафт'] },
  { id: 'jaws-zar', name: 'Jaws Brewery Tasting Room', city: 'Заречный', type: 'craft', lat: 56.8131, lng: 61.3192, address: 'Курчатова, 25', signature: 'Прямо у пивоварни', hours: '14:00–22:00', vibes: ['заводская', 'крафт'] },
  { id: 'pivnushka-kzn', name: 'Пивная №1', city: 'Казань', type: 'pub', lat: 55.7951, lng: 49.1064, address: 'Баумана, 38', signature: 'Татарские лагеры', hours: '12:00–00:00', vibes: ['классика'] },
  { id: 'craftery-kzn', name: 'Craftery', city: 'Казань', type: 'craft', lat: 55.7895, lng: 49.1213, address: 'Кремлёвская, 15', signature: 'Локальный крафт + чизкейк-стаут', hours: '14:00–02:00', vibes: ['крафт'] },
  { id: 'shanghai-nsk', name: 'Шанхай', city: 'Новосибирск', type: 'bar', lat: 55.0410, lng: 82.9344, address: 'Ленина, 12', signature: 'Караоке-бар с пивом', hours: '20:00–06:00', vibes: ['набухаться'] },
  { id: 'rocknroll-nsk', name: "Rock'n'Roll Pub", city: 'Новосибирск', type: 'pub', lat: 55.0292, lng: 82.9168, address: 'Красный пр., 25', signature: 'Гитары и портер', hours: '18:00–04:00', vibes: ['паб', 'тусовка'] },
  { id: 'oldcity-rnd', name: 'Old City', city: 'Ростов-на-Дону', type: 'pub', lat: 47.2225, lng: 39.7187, address: 'Б. Садовая, 64', signature: 'Гиннесс на азоте', hours: '12:00–01:00', vibes: ['паб'] },
  { id: 'tap-volga', name: 'Tap Volga', city: 'Нижний Новгород', type: 'tap', lat: 56.3263, lng: 44.0064, address: 'Б. Покровская, 25', signature: 'Поволжский крафт', hours: '14:00–01:00', vibes: ['крафт'] },
  { id: 'liter-spb', name: 'Литр', city: 'Санкт-Петербург', type: 'shop', lat: 59.9421, lng: 30.3505, address: 'Рубинштейна, 3', signature: 'Магазин-бар на Рубинштейна', hours: '11:00–23:00', vibes: ['разливайка', 'магазин'] },
  { id: 'crazy-daisy-msk', name: 'Crazy Daisy', city: 'Москва', type: 'bar', lat: 55.7669, lng: 37.6207, address: 'Чистопрудный б-р, 12', signature: 'Сидры и кисляки', hours: '17:00–04:00', vibes: ['тусовка', 'набухаться'] },
  { id: 'tap-house-krd', name: 'Tap House', city: 'Краснодар', type: 'tap', lat: 45.0392, lng: 38.9869, address: 'Красная, 145', signature: 'Краснодарский крафт', hours: '14:00–02:00', vibes: ['крафт'] },
  { id: 'yarpivo-yar', name: 'Ярпиво Бар', city: 'Ярославль', type: 'pub', lat: 57.6232, lng: 39.8957, address: 'Свободы, 56', signature: 'Местный лагер свежак', hours: '12:00–00:00', vibes: ['классика'] },
  { id: 'okhota-vlg', name: 'Охота', city: 'Волгоград', type: 'pub', lat: 48.7080, lng: 44.5133, address: 'пр. Ленина, 80', signature: 'Стейки + охотничий стаут', hours: '12:00–02:00', vibes: ['паб'] },
];

export const CITIES = Array.from(new Set(BARS.map((b) => b.city))).sort();
