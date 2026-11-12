// Утверждённый прайс DARK VISION. Цены правятся только здесь: компоненты их не дублируют.
// Пометка «от» хранится в самой цене (from: true) и всегда выводится вместе с суммой.

const fix = (value) => ({ value, from: false })
const from = (value) => ({ value, from: true })
const all = (price) => [price, price, price, price]

export const VEHICLE_CATEGORIES = [
  { id: 1, label: '№1', title: 'Средние автомобили', hint: 'Седаны, хэтчбеки, универсалы' },
  { id: 2, label: '№2', title: 'Кроссоверы', hint: 'Малые джипы, кроссоверы, минивэны' },
  { id: 3, label: '№3', title: 'Внедорожники', hint: 'Внедорожники' },
  { id: 4, label: '№4', title: 'Большие автомобили', hint: 'Большие джипы, микроавтобусы, пикапы' },
]

// Направления для карточек услуг и вкладок каталога
export const DIRECTIONS = [
  { id: 'wash', title: 'Мойка', text: 'Двухфазная мойка, комплекс и программа OFF ROAD.' },
  { id: 'interior', title: 'Салон', text: 'Пылесос, влажная уборка, стёкла, пластик, кожа и багажник.' },
  { id: 'protection', title: 'Защита кузова', text: 'Воск, кварцевое покрытие и твёрдый воск.' },
  { id: 'deep', title: 'Глубокая очистка', text: 'Химчистка кузова и колёсных дисков, озонирование салона.' },
  { id: 'engine', title: 'Двигатель', text: 'Техническая и комплексная мойка ДВС.' },
  { id: 'extra', title: 'Дополнительные услуги', text: 'Коврики, резина, битум, следы насекомых и зимний уход.' },
]

// section — название раздела в исходном прайсе; prices — цены для категорий №1–№4
export const SERVICES = [
  { id: 'two-phase', direction: 'wash', section: 'Основная мойка', title: 'Двухфазная мойка', prices: [fix(1000), fix(1200), fix(1300), from(1500)] },
  { id: 'complex', direction: 'wash', section: 'Основная мойка', title: 'Комплекс', prices: [from(1600), from(1800), from(1900), from(2100)] },
  { id: 'off-road', direction: 'wash', section: 'Основная мойка', title: 'OFF ROAD', prices: [fix(2000), fix(2400), fix(2600), from(3000)] },

  { id: 'vacuum', direction: 'interior', section: 'Уход за салоном', title: 'Пылесос', prices: [fix(300), fix(300), fix(300), from(300)] },
  { id: 'wet-cleaning', direction: 'interior', section: 'Уход за салоном', title: 'Влажная уборка', prices: [fix(300), fix(300), fix(300), from(300)] },
  { id: 'glass', direction: 'interior', section: 'Уход за салоном', title: 'Обезжиривание стёкол', prices: [fix(300), fix(300), fix(300), from(300)] },
  { id: 'plastic-polish', direction: 'interior', section: 'Уход за салоном', title: 'Полироль пластика', prices: [fix(300), fix(300), fix(300), from(300)] },
  { id: 'leather', direction: 'interior', section: 'Уход за салоном', title: 'Кондиционер кожи', prices: [fix(500), fix(500), fix(600), from(600)] },
  { id: 'trunk', direction: 'interior', section: 'Уборка багажника', title: 'Уборка багажника', prices: [fix(400), fix(400), fix(400), from(400)] },

  { id: 'wax', direction: 'protection', section: 'Дополнительные услуги', title: 'Воск', prices: all(fix(300)) },
  { id: 'quartz', direction: 'protection', section: 'Дополнительные услуги', title: 'Кварцевое покрытие', prices: [fix(900), fix(1000), fix(1000), fix(1000)] },
  { id: 'hard-wax', direction: 'protection', section: 'Дополнительные услуги', title: 'Твёрдый воск', prices: [fix(3000), fix(3000), fix(3000), fix(4000)] },

  {
    id: 'wheels',
    direction: 'deep',
    section: 'Глубокая очистка',
    title: 'Химчистка колёсных дисков',
    note: 'Снаружи. Цена за один диск зависит от диаметра.',
    unit: 'шт.',
    // Диапазоны как в исходном прайсе, включая пересечение на R18
    variants: [
      { id: 'r14-16', label: 'R14–R16', price: from(350) },
      { id: 'r17-18', label: 'R17–R18', price: from(400) },
      { id: 'r18-20', label: 'R18–R20', price: from(400) },
      { id: 'r21-22', label: 'R21–R22', price: from(500) },
    ],
  },
  { id: 'body-cleaning', direction: 'deep', section: 'Глубокая очистка', title: 'Химчистка кузова', prices: [fix(4000), fix(4000), fix(5000), fix(5000)] },
  { id: 'ozone', direction: 'deep', section: 'Глубокая очистка', title: 'Озонирование салона', prices: all(fix(700)) },

  { id: 'engine-tech', direction: 'engine', section: 'Мойка двигателя', title: 'Техническая мойка ДВС', prices: all(fix(1000)) },
  { id: 'engine-complex', direction: 'engine', section: 'Мойка двигателя', title: 'Комплексная мойка ДВС', prices: all(from(2000)) },

  { id: 'mats', direction: 'extra', section: 'Дополнительные услуги', title: 'Мойка ковриков', unit: 'шт.', prices: all(fix(25)) },
  { id: 'tire-shine', direction: 'extra', section: 'Дополнительные услуги', title: 'Чернение резины', prices: all(fix(300)) },
  { id: 'bitumen', direction: 'extra', section: 'Дополнительные услуги', title: 'Удаление битума', prices: all(fix(300)) },
  { id: 'insects', direction: 'extra', section: 'Дополнительные услуги', title: 'Удаление следов насекомых', prices: all(fix(300)) },
  { id: 'silicone', direction: 'extra', section: 'Зимний уход', title: 'Силикон', prices: all(fix(300)) },
  { id: 'blow-dry', direction: 'extra', section: 'Зимний уход', title: 'Продувка', prices: all(fix(100)) },
]

export const getService = (id) => SERVICES.find((s) => s.id === id)
export const getVehicle = (id) => VEHICLE_CATEGORIES.find((v) => v.id === id)
export const servicesOf = (directionId) => SERVICES.filter((s) => s.direction === directionId)

/** Цена услуги для категории автомобиля; для услуг с вариантами — выбранный или самый дешёвый вариант. */
export function priceOf(service, vehicleId, variantId) {
  if (service.variants) {
    const variant = service.variants.find((v) => v.id === variantId)
    if (variant) return variant.price
    const min = Math.min(...service.variants.map((v) => v.price.value))
    return { value: min, from: true }
  }
  return service.prices[vehicleId - 1]
}

/** true, если цена не зависит от категории автомобиля */
export const isFlatPrice = (service) =>
  Boolean(service.variants) || service.prices.every((p) => p.value === service.prices[0].value && p.from === service.prices[0].from)

export const formatNumber = (value) => new Intl.NumberFormat('ru-RU').format(value)

export const formatPrice = (price, unit) => `${price.from ? 'от ' : ''}${formatNumber(price.value)} ₽${unit ? `/${unit}` : ''}`

export function pluralize(n, [one, few, many]) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export const countServices = (n) => `${n} ${pluralize(n, ['услуга', 'услуги', 'услуг'])}`

/** Предварительная сумма по выбранным услугам. items: [{ service, qty, variant }] */
export function estimate(items, vehicleId) {
  return items.reduce(
    (acc, { service, qty, variant }) => {
      const price = priceOf(service, vehicleId, variant)
      return { value: acc.value + price.value * qty, from: acc.from || price.from }
    },
    { value: 0, from: false }
  )
}
