import type { Snack } from './types';

export const SNACKS: Snack[] = [
  { id: 'kirieshki', name: 'Кириешки', emoji: '🍞', description: 'Сухарики со вкусом сметаны и зелени', pairs: ['lager', 'pilsner', 'pale ale', 'nealco'], vibes: ['классика', 'будни', 'дёшево'] },
  { id: 'chips-cheese', name: 'Lay\'s сыр', emoji: '🥔', description: 'Картофельные чипсы со вкусом сыра', pairs: ['lager', 'pilsner', 'wheat', 'nealco'], vibes: ['универсальное', 'кино'] },
  { id: 'pistachios', name: 'Фисташки', emoji: '🥜', description: 'Солёные фисташки', pairs: ['ipa', 'pale ale', 'pilsner', 'lager'], vibes: ['паб', 'тусовка'] },
  { id: 'cuttlefish', name: 'Кальмар сушёный', emoji: '🦑', description: 'Стружка из сушёного кальмара', pairs: ['lager', 'wheat', 'cider'], vibes: ['ретро', 'набухаться'] },
  { id: 'voblya', name: 'Вобла', emoji: '🐟', description: 'Вяленая вобла', pairs: ['lager', 'wheat'], vibes: ['классика', 'дача'] },
  { id: 'wings', name: 'Крылья BBQ', emoji: '🍗', description: 'Острые куриные крылья', pairs: ['ipa', 'stout', 'porter', 'pale ale'], vibes: ['тусовка', 'спорт-бар'] },
  { id: 'pretzel', name: 'Брецель', emoji: '🥨', description: 'Большой солёный претцель', pairs: ['wheat', 'lager', 'pilsner'], vibes: ['Октоберфест', 'универсальное'] },
  { id: 'olives', name: 'Оливки', emoji: '🫒', description: 'Маринованные оливки', pairs: ['lambic', 'sour', 'wheat'], vibes: ['свидание', 'эстетика'] },
  { id: 'cheese-plate', name: 'Сырная тарелка', emoji: '🧀', description: 'Бри, чеддер, голубой', pairs: ['lambic', 'sour', 'pale ale', 'porter'], vibes: ['свидание', 'эстетика'] },
  { id: 'dark-chocolate', name: 'Тёмный шоколад', emoji: '🍫', description: '85% какао', pairs: ['stout', 'porter'], vibes: ['зима', 'медитативно'] },
  { id: 'tacos', name: 'Тако', emoji: '🌮', description: 'С говядиной и сыром', pairs: ['ipa', 'pale ale', 'sour'], vibes: ['тусовка', 'крафт'] },
  { id: 'kimchi', name: 'Кимчи', emoji: '🌶️', description: 'Острая корейская закваска', pairs: ['ipa', 'sour', 'lambic'], vibes: ['эксперимент', 'крафт'] },
  { id: 'sausages', name: 'Колбаски', emoji: '🌭', description: 'Гриль или жареные', pairs: ['lager', 'pilsner', 'wheat', 'porter'], vibes: ['паб', 'мангал'] },
  { id: 'oysters', name: 'Устрицы', emoji: '🦪', description: 'Свежие устрицы с лимоном', pairs: ['stout', 'lambic'], vibes: ['эстетика', 'свидание'] },
  { id: 'nuts-mix', name: 'Микс орехов', emoji: '🥜', description: 'Кешью, миндаль, арахис', pairs: ['lager', 'pale ale', 'ipa', 'porter'], vibes: ['универсальное'] },
  { id: 'popcorn', name: 'Попкорн', emoji: '🍿', description: 'Солёный попкорн', pairs: ['lager', 'nealco', 'wheat'], vibes: ['кино', 'будни'] },
];
