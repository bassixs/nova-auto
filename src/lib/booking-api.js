// Доставка заявок. Сайт статический, поэтому заявка уходит на внешний обработчик (см. docs/booking-setup.md).
// Адрес обработчика публичный и задаётся при сборке; токен Telegram хранится только на стороне обработчика.
const ENDPOINT = import.meta.env.VITE_BOOKING_ENDPOINT || ''

export const isBookingConfigured = Boolean(ENDPOINT)

export class BookingError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

/** Отправляет заявку. Успехом считается только ответ обработчика { ok: true }. */
export async function submitBooking(payload) {
  if (!ENDPOINT) throw new BookingError('not-configured', 'Приём онлайн-заявок ещё не подключён')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    const data = await res.json().catch(() => null)
    if (res.status === 429) throw new BookingError('rate-limit', 'Слишком много заявок подряд. Попробуйте через пару минут')
    if (!res.ok || !data?.ok) throw new BookingError('rejected', data?.error || 'Сервер не принял заявку')
  } catch (err) {
    if (err instanceof BookingError) throw err
    throw new BookingError('network', 'Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз')
  } finally {
    clearTimeout(timer)
  }
}
