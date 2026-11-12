// Обработчик заявок с сайта DARK VISION: проверяет заявку и пересылает её в Telegram.
// Готов для Yandex Cloud Functions (Node.js 18+, точка входа index.handler). Инструкция: docs/booking-setup.md
//
// Переменные окружения:
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather (хранится только здесь, в браузер не попадает)
//   TELEGRAM_CHAT_ID   — id чата или группы, куда приходят заявки
//   ALLOWED_ORIGINS    — адреса сайта через запятую, например https://bassixs.github.io

const MIN_FILL_MS = 2500
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT = 5
const recent = new Map()

const str = (value, max) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : '')

function parse(bodyText) {
  let data
  try {
    data = JSON.parse(bodyText)
  } catch {
    return { error: 'Некорректный запрос' }
  }
  if (!data || typeof data !== 'object') return { error: 'Некорректный запрос' }

  const booking = {
    name: str(data.name, 80),
    phone: str(data.phone, 24),
    location: str(data.location?.address, 120),
    vehicle: str(data.vehicle, 120),
    services: Array.isArray(data.services)
      ? data.services.slice(0, 30).map((s) => ({ title: str(s?.title, 120), price: str(s?.price, 40) })).filter((s) => s.title)
      : [],
    total: str(data.total, 40),
    when: str(data.when, 80),
    comment: str(data.comment, 500),
    page: str(data.page, 200),
  }

  if (booking.name.length < 2) return { error: 'Укажите имя' }
  if (booking.phone.replace(/\D/g, '').length !== 11) return { error: 'Укажите телефон полностью' }
  if (!booking.location) return { error: 'Выберите локацию' }
  if (!booking.vehicle) return { error: 'Выберите категорию автомобиля' }

  // Поле-ловушка заполняют только боты; слишком быстрая отправка — тоже признак автоматики
  const spam = Boolean(str(data.website, 200)) || !(Number(data.elapsedMs) >= MIN_FILL_MS)
  return { booking, spam }
}

function formatMessage(b) {
  return [
    'Новая заявка с сайта DARK VISION',
    '',
    `Локация: ${b.location}`,
    `Автомобиль: ${b.vehicle}`,
    b.services.length ? `Услуги:\n${b.services.map((s) => `— ${s.title}${s.price ? `: ${s.price}` : ''}`).join('\n')}` : 'Услуги: не выбраны',
    b.total ? `Предварительно: ${b.total}` : null,
    b.when ? `Когда удобно: ${b.when}` : null,
    '',
    `Имя: ${b.name}`,
    `Телефон: ${b.phone}`,
    b.comment ? `Комментарий: ${b.comment}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

function rateLimited(ip) {
  const now = Date.now()
  const hits = (recent.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  hits.push(now)
  recent.set(ip, hits)
  if (recent.size > 5000) recent.clear()
  return hits.length > RATE_LIMIT
}

async function sendToTelegram(text, env) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
  })
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${(await res.text()).slice(0, 200)}`)
}

/** Ядро без привязки к платформе. deliver можно подменить в тестах. */
async function handleBooking({ method, origin, ip, bodyText }, env, deliver = sendToTelegram) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const originOk = allowed.length === 0 || allowed.includes(origin)
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': originOk && origin ? origin : allowed[0] || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
  const reply = (status, body) => ({ status, headers, body: JSON.stringify(body) })

  if (method === 'OPTIONS') return { status: 204, headers, body: '' }
  if (method !== 'POST') return reply(405, { ok: false, error: 'Метод не поддерживается' })
  if (!originOk) return reply(403, { ok: false, error: 'Запрос с этого сайта не разрешён' })
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return reply(500, { ok: false, error: 'Приём заявок не настроен' })
  if ((bodyText || '').length > 10000) return reply(413, { ok: false, error: 'Слишком большой запрос' })
  if (rateLimited(ip || 'unknown')) return reply(429, { ok: false, error: 'Слишком много заявок. Попробуйте позже' })

  const { booking, spam, error } = parse(bodyText || '')
  if (error) return reply(400, { ok: false, error })
  // Боту отвечаем так же, как человеку, но заявку никуда не отправляем
  if (spam) return reply(200, { ok: true })

  try {
    await deliver(formatMessage(booking), env)
  } catch (err) {
    console.error('Booking delivery failed:', err)
    return reply(502, { ok: false, error: 'Не удалось передать заявку администратору' })
  }
  return reply(200, { ok: true })
}

// Yandex Cloud Functions
module.exports.handler = async function (event) {
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]))
  const bodyText = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || ''
  const result = await handleBooking(
    { method: event.httpMethod, origin: headers.origin || '', ip: event.requestContext?.identity?.sourceIp || '', bodyText },
    process.env
  )
  return { statusCode: result.status, headers: result.headers, body: result.body }
}

module.exports.handleBooking = handleBooking
module.exports.formatMessage = formatMessage

// Локальный запуск для проверки: node server/booking-function/index.js
// С DRY_RUN=1 заявка не уходит в Telegram, а печатается в консоль.
if (require.main === module) {
  const http = require('node:http')
  const port = Number(process.env.PORT) || 8787
  const dryRun = process.env.DRY_RUN === '1'
  const env = dryRun ? { TELEGRAM_BOT_TOKEN: 'dry-run', TELEGRAM_CHAT_ID: 'dry-run', ...process.env } : process.env
  const deliver = dryRun ? async (text) => console.log(`\n--- Заявка (DRY_RUN) ---\n${text}\n`) : sendToTelegram

  http
    .createServer((req, res) => {
      let bodyText = ''
      req.on('data', (chunk) => (bodyText += chunk))
      req.on('end', async () => {
        const result = await handleBooking(
          { method: req.method, origin: req.headers.origin || '', ip: req.socket.remoteAddress, bodyText },
          env,
          deliver
        )
        res.writeHead(result.status, result.headers)
        res.end(result.body)
      })
    })
    .listen(port, () => console.log(`Booking handler: http://localhost:${port}${dryRun ? ' (DRY_RUN)' : ''}`))
}
