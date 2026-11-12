// Реквизиты и контакты DARK VISION. Единственный источник для сайта, Schema.org и политики.
// Этот файл импортируется и из vite.config.js, поэтому в нём нет импортов и обращений к import.meta.

export const SITE = {
  // Адрес опубликованного сайта (со слэшем на конце). Поменять при переезде на свой домен.
  url: 'https://bassixs.github.io/nova-auto/',
  name: 'DARK VISION',
  title: 'DARK VISION — автомойка и детейлинг в Калуге',
  description:
    'DARK VISION — автомойка и детейлинг в Калуге. Мойка, уход за салоном, защита кузова, химчистка и мойка двигателя. Две локации: ул. Гурьянова, 30А и ул. Московская, 309Б. Онлайн-заявка на запись.',
  tagline: 'Чистота, которую видно.',
  lead: 'Автомойка и детейлинг в Калуге. Уход за кузовом, салоном и деталями автомобиля.',
  city: 'Калуга',
}

// Телефон, график, рейтинг и соцсети взяты из карточек организации в Яндекс Картах 11.11.2026.
// Перед публикацией их нужно подтвердить у заказчика. Чтобы скрыть поле на сайте, поставьте null.
export const CONTACT = {
  phone: '+7 (919) 037-19-69',
  socials: [
    { id: 'telegram', label: 'Telegram', url: 'https://t.me/DarkVision40' },
    { id: 'vk', label: 'ВКонтакте', url: 'https://vk.ru/vision2023' },
  ],
}

export const LOCATIONS = [
  {
    id: 'guryanova',
    index: '01',
    title: 'Гурьянова, 30А',
    street: 'ул. Гурьянова, 30А',
    address: 'Калуга, ул. Гурьянова, 30А',
    geo: { lat: 54.569592, lon: 36.224306 },
    yandexOrgId: '61630246476',
    phone: CONTACT.phone,
    hours: { label: 'Ежедневно, 09:00–20:00', opens: '09:00', closes: '20:00' },
    // Имя файла из public/images без размера и расширения, например 'location-guryanova'
    photo: null,
    badge: null,
    // Рейтинг относится только к этой точке. Не переносить на другие локации.
    rating: { value: '4,9', votes: 174, reviews: 93, asOf: 'ноябрь 2026', award: 'Хорошее место 2026' },
  },
  {
    id: 'moskovskaya',
    index: '02',
    title: 'Московская, 309Б',
    street: 'ул. Московская, 309Б',
    address: 'Калуга, ул. Московская, 309Б',
    geo: { lat: 54.577498, lon: 36.256113 },
    yandexOrgId: '38056944822',
    phone: CONTACT.phone,
    hours: { label: 'Ежедневно, 09:00–19:00', opens: '09:00', closes: '19:00' },
    photo: null,
    badge: 'Новая локация',
    rating: null,
  },
]

// Реквизиты оператора персональных данных для политики. Заполнить после согласования с заказчиком.
export const LEGAL = {
  approved: false,
  operatorName: null, // например: ИП Иванов Иван Иванович
  inn: null,
  ogrn: null,
  legalAddress: null,
  email: null,
  policyDate: null, // например: 20 ноября 2026 г.
}

export const telHref = (phone) => `tel:+${phone.replace(/\D/g, '')}`

export const yandexCardUrl = (loc) => `https://yandex.ru/maps/org/dark_vision/${loc.yandexOrgId}/`

export const yandexReviewsUrl = (loc) => `${yandexCardUrl(loc)}reviews/`

export const routeUrl = (loc) => `https://yandex.ru/maps/?rtext=~${loc.geo.lat},${loc.geo.lon}&rtt=auto`
