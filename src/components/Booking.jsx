import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { CONTACT, LOCATIONS, telHref } from '../data/business'
import { BOOKING_PHOTO } from '../data/content'
import { DIRECTIONS, formatPrice, getVehicle, priceOf, servicesOf } from '../data/services'
import { isBookingConfigured, submitBooking } from '../lib/booking-api'
import { brandUrl } from '../lib/images'
import { reachGoal } from '../lib/metrika'
import { useOrder } from '../lib/order'
import { scrollToTarget } from '../lib/scroll'
import Img from './ui/Img'
import Button from './ui/Button'
import PriceTag from './ui/PriceTag'
import SectionHead from './ui/SectionHead'
import Stepper from './ui/Stepper'
import VehiclePicker from './ui/VehiclePicker'
import { Check, Close, Copy, Phone } from './ui/Icons'
import { EASE, Reveal } from './ui/motion'
import './Booking.css'

const EMPTY = { name: '', phone: '', date: '', time: '', comment: '', consent: false, website: '' }
const TIMES = ['Утро', 'День', 'Вечер']

function formatPhone(raw) {
  let d = raw.replace(/\D/g, '')
  if (!d) return ''
  if (d[0] === '8') d = '7' + d.slice(1)
  if (d[0] !== '7') d = '7' + d
  const p = d.slice(1, 11)
  let out = '+7'
  if (p.length > 0) out += ' (' + p.slice(0, 3)
  if (p.length > 3) out += ') ' + p.slice(3, 6)
  if (p.length > 6) out += '-' + p.slice(6, 8)
  if (p.length > 8) out += '-' + p.slice(8, 10)
  return out
}

const todayISO = () => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })

function validate(form, order) {
  const e = {}
  if (!order.location) e.location = 'Выберите локацию'
  if (!order.vehicleChosen) e.vehicle = 'Выберите категорию автомобиля'
  if (form.name.trim().length < 2) e.name = 'Укажите имя'
  const digits = form.phone.replace(/\D/g, '')
  if (!digits) e.phone = 'Укажите телефон'
  else if (digits.length !== 11) e.phone = 'Номер должен содержать 11 цифр'
  if (form.date && form.date < todayISO()) e.date = 'Дата не может быть в прошлом'
  if (!form.consent) e.consent = 'Нужно согласие на обработку данных'
  return e
}

/** Заявка в том виде, в котором она уходит обработчику и показывается посетителю. */
function buildRequest(form, order) {
  const loc = LOCATIONS.find((l) => l.id === order.location)
  const vehicle = getVehicle(order.vehicle)
  const when = [form.date && formatDate(form.date), form.time && form.time.toLowerCase()].filter(Boolean).join(', ')
  return {
    location: { id: loc.id, address: loc.address },
    vehicle: `${vehicle.label} — ${vehicle.hint}`,
    services: order.items.map(({ service, qty, variant }) => {
      const price = priceOf(service, order.vehicle, variant)
      const variantLabel = service.variants?.find((v) => v.id === variant)?.label
      return {
        title: `${service.title}${variantLabel ? ` (${variantLabel})` : ''}${qty > 1 ? ` × ${qty}` : ''}`,
        price: formatPrice({ value: price.value * qty, from: price.from }),
      }
    }),
    total: order.items.length ? formatPrice(order.total) : null,
    when: when || null,
    name: form.name.trim(),
    phone: form.phone,
    comment: form.comment.trim() || null,
  }
}

const requestToText = (r) =>
  [
    'Заявка с сайта DARK VISION',
    `Локация: ${r.location.address}`,
    `Автомобиль: ${r.vehicle}`,
    r.services.length ? `Услуги:\n${r.services.map((s) => `— ${s.title}: ${s.price}`).join('\n')}` : 'Услуги: не выбраны',
    r.total && `Предварительно: ${r.total}`,
    r.when && `Когда удобно: ${r.when}`,
    `Имя: ${r.name}`,
    `Телефон: ${r.phone}`,
    r.comment && `Комментарий: ${r.comment}`,
  ]
    .filter(Boolean)
    .join('\n')

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function FieldError({ children }) {
  return (
    <AnimatePresence>
      {children && (
        <motion.span
          className="field__error"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function TextField({ id, label, error, as = 'input', className = '', ...props }) {
  const Tag = as
  return (
    <div className={`field${error ? ' has-error' : ''} ${className}`}>
      <Tag id={id} name={id} className="field__input" placeholder=" " aria-invalid={Boolean(error)} {...props} />
      <label htmlFor={id} className="field__label">{label}</label>
      <span className="field__line" />
      <FieldError>{error}</FieldError>
    </div>
  )
}

function Step({ num, title, error, children }) {
  return (
    <fieldset className={`bstep${error ? ' has-error' : ''}`} data-error={Boolean(error) || undefined}>
      <legend className="bstep__legend mono">
        <span>{num}</span> {title}
      </legend>
      {children}
      <FieldError>{error}</FieldError>
    </fieldset>
  )
}

function SelectedServices() {
  const { items, vehicle, total, selection, add, remove, setQty } = useOrder()

  return (
    <>
      {items.length > 0 ? (
        <ul className="bsum">
          <AnimatePresence initial={false}>
            {items.map(({ service, qty, variant }) => {
              const price = priceOf(service, vehicle, variant)
              return (
                <motion.li
                  key={service.id}
                  className="bsum__item"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <div className="bsum__row">
                    <span className="bsum__title">{service.title}</span>
                    <PriceTag price={{ value: price.value * qty, from: price.from }} className="bsum__price" />
                    <button type="button" className="bsum__remove" onClick={() => remove(service.id)} aria-label={`Убрать: ${service.title}`}>
                      <Close width="14" height="14" />
                    </button>
                  </div>
                  {(service.variants || service.unit) && (
                    <div className="bsum__opts">
                      {service.variants && (
                        <select
                          className="bsum__select"
                          value={variant ?? ''}
                          onChange={(e) => add(service.id, { variant: e.target.value || null })}
                          aria-label={`Диаметр диска: ${service.title}`}
                        >
                          <option value="">Диаметр уточним</option>
                          {service.variants.map((v) => (
                            <option key={v.id} value={v.id}>{v.label} — {formatPrice(v.price, service.unit)}</option>
                          ))}
                        </select>
                      )}
                      {service.unit && (
                        <Stepper value={qty} onChange={(v) => setQty(service.id, v)} label={`Количество: ${service.title}`} />
                      )}
                    </div>
                  )}
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      ) : (
        <p className="bsum__empty">Услуги пока не выбраны. Добавьте их здесь или обсудите с администратором по телефону.</p>
      )}

      <div className="bsum__add">
        <select className="bsum__select" value="" onChange={(e) => e.target.value && add(e.target.value)} aria-label="Добавить услугу">
          <option value="">+ Добавить услугу</option>
          {DIRECTIONS.map((d) => (
            <optgroup key={d.id} label={d.title}>
              {servicesOf(d.id)
                .filter((s) => !selection[s.id])
                .map((s) => (
                  <option key={s.id} value={s.id}>{s.title} — {formatPrice(priceOf(s, vehicle), s.unit)}</option>
                ))}
            </optgroup>
          ))}
        </select>
        <a href="#pricing" className="bsum__catalog">Открыть каталог</a>
      </div>

      {items.length > 0 && (
        <div className="bsum__total">
          <span>Предварительная стоимость</span>
          <PriceTag price={total} />
        </div>
      )}
    </>
  )
}

function Result({ result, onBack, onReset }) {
  const [copied, setCopied] = useState(false)
  const { kind, request, message } = result
  const success = kind === 'success'

  const onCopy = async () => setCopied(await copyText(requestToText(request)))

  return (
    <motion.div
      className="book__result"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.6, ease: EASE }}
      role={success ? 'status' : 'alert'}
    >
      <svg className={`book__result-icon${success ? '' : ' is-fail'}`} width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
        <motion.circle
          cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="1.2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: EASE }}
        />
        <motion.path
          d={success ? 'M23 37.5 32 46 50 27' : 'M36 21v20M36 49.5v1'}
          fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
        />
      </svg>

      <h3 className="book__result-title" tabIndex={-1}>{success ? 'Заявка отправлена' : 'Заявка не отправлена'}</h3>
      <p className="book__result-text">
        {success
          ? `Администратор перезвонит по номеру ${request.phone} и согласует время визита.`
          : `${message}.${CONTACT.phone ? ' Запишитесь по телефону — данные заявки сохранены ниже.' : ''}`}
      </p>

      <dl className="book__summary">
        <div><dt className="mono">Локация</dt><dd>{request.location.address}</dd></div>
        <div><dt className="mono">Автомобиль</dt><dd>{request.vehicle}</dd></div>
        <div>
          <dt className="mono">Услуги</dt>
          <dd>{request.services.length ? request.services.map((s) => s.title).join(', ') : 'Не выбраны'}</dd>
        </div>
        {request.total && <div><dt className="mono">Предварительно</dt><dd>{request.total}</dd></div>}
        {request.when && <div><dt className="mono">Когда удобно</dt><dd>{request.when}</dd></div>}
      </dl>

      <div className="book__result-actions">
        {success ? (
          <Button variant="ghost" onClick={onReset}>Новая заявка</Button>
        ) : (
          <>
            {CONTACT.phone && (
              <Button href={telHref(CONTACT.phone)} arrow={false}>
                <span className="book__btn-inner"><Phone /> {CONTACT.phone}</span>
              </Button>
            )}
            <Button variant="ghost" arrow={false} onClick={onCopy}>
              <span className="book__btn-inner">{copied ? <Check /> : <Copy />} {copied ? 'Скопировано' : 'Скопировать заявку'}</span>
            </Button>
            <button type="button" className="book__back" onClick={onBack}>Вернуться к форме</button>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default function Booking() {
  const order = useOrder()
  const { location, setLocation, vehicle, vehicleChosen, setVehicle, clear } = order
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [scope, animateEl] = useAnimate()
  const cardRef = useRef(null)
  const startedAt = useRef(Date.now())

  // Choosing a location or a category elsewhere on the page clears the related error
  useEffect(() => {
    setErrors((e) => (e.location || e.vehicle ? { ...e, location: location ? undefined : e.location, vehicle: vehicleChosen ? undefined : e.vehicle } : e))
  }, [location, vehicleChosen])

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    set(name, type === 'checkbox' ? checked : name === 'phone' ? formatPhone(value) : value)
  }

  const showResult = (next) => {
    setResult(next)
    scrollToTarget(cardRef.current)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    const found = validate(form, order)
    setErrors(found)
    if (Object.values(found).some(Boolean)) {
      animateEl(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.45 })
      const first = scope.current.querySelector('[data-error="true"], [aria-invalid="true"]')
      first?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      first?.querySelector?.('input, button')?.focus({ preventScroll: true })
      if (first?.matches('input, textarea')) first.focus({ preventScroll: true })
      return
    }

    const request = buildRequest(form, order)
    setSending(true)
    try {
      // website — поле-ловушка: человек его не видит, бот заполняет; обработчик отклонит такую заявку
      await submitBooking({ ...request, website: form.website, elapsedMs: Date.now() - startedAt.current, page: window.location.href })
      reachGoal('booking_sent')
      showResult({ kind: 'success', request })
      setForm(EMPTY)
      clear()
    } catch (err) {
      showResult({ kind: 'error', request, message: err.message || 'Не удалось отправить заявку' })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="book section" id="booking">
      <div className="book__bg" aria-hidden="true">
        <Img id={BOOKING_PHOTO} alt="" sizes="100vw" />
      </div>

      <div className="container book__grid">
        <div className="book__intro">
          <SectionHead index="07" label="Запись" title={'ЗАПИСЬ\nВ DARK VISION'} className="book__head" />
          <Reveal as="p" className="lead book__lead" delay={0.15}>
            Соберите заявку за минуту. Администратор перезвонит и согласует удобное время визита.
          </Reveal>
          {CONTACT.phone && (
            <Reveal className="book__direct" delay={0.25}>
              <a href={telHref(CONTACT.phone)} className="book__phone">{CONTACT.phone}</a>
              {LOCATIONS.map((loc) => loc.hours && (
                <span className="mono" key={loc.id}>{loc.title} · {loc.hours.opens}–{loc.hours.closes}</span>
              ))}
            </Reveal>
          )}
          <img className="book__mark" src={brandUrl('logo-640.webp')} alt="" width="640" height="640" loading="lazy" aria-hidden="true" />
        </div>

        <Reveal className="book__card" delay={0.1} y={40}>
          <div ref={cardRef} className="book__anchor" />
          <AnimatePresence mode="wait" initial={false}>
            {result ? (
              <Result
                key="result"
                result={result}
                onBack={() => setResult(null)}
                onReset={() => {
                  setResult(null)
                  startedAt.current = Date.now()
                }}
              />
            ) : (
              <motion.form
                key="form"
                ref={scope}
                className="book__form"
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Step num="1" title="Локация" error={errors.location}>
                  <div className="bloc">
                    {LOCATIONS.map((loc) => {
                      const active = location === loc.id
                      return (
                        <label key={loc.id} className={`bloc__item${active ? ' is-active' : ''}`}>
                          <input
                            type="radio" name="location" value={loc.id} className="sr-only"
                            checked={active} onChange={() => setLocation(loc.id)}
                          />
                          {active && <motion.span className="bloc__active" layoutId="bloc-active" transition={{ duration: 0.55, ease: EASE }} />}
                          <span className="bloc__title">{loc.street}</span>
                          {loc.hours && <span className="bloc__hint">{loc.hours.label}</span>}
                        </label>
                      )
                    })}
                  </div>
                </Step>

                <Step num="2" title="Категория автомобиля" error={errors.vehicle}>
                  <VehiclePicker
                    value={vehicleChosen ? vehicle : null}
                    onChange={setVehicle}
                    layoutId="vpick-form"
                    compact
                    invalid={Boolean(errors.vehicle)}
                  />
                </Step>

                <Step num="3" title="Услуги">
                  <SelectedServices />
                </Step>

                <Step num="4" title="Контакты и время">
                  <div className="book__fields">
                    <TextField id="name" label="Имя" autoComplete="name" value={form.name} onChange={onChange} error={errors.name} />
                    <TextField
                      id="phone" label="Телефон" type="tel" inputMode="tel" autoComplete="tel"
                      value={form.phone} onChange={onChange} error={errors.phone}
                    />
                    <TextField
                      id="date" label="Желаемая дата" type="date" min={todayISO()}
                      value={form.date} onChange={onChange} error={errors.date} className="field--date"
                    />
                    <div className="btime">
                      <span className="btime__label" id="btime-label">Удобное время</span>
                      <div className="btime__list" role="group" aria-labelledby="btime-label">
                        {TIMES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`btime__chip${form.time === t ? ' is-active' : ''}`}
                            aria-pressed={form.time === t}
                            onClick={() => set('time', form.time === t ? '' : t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <TextField
                      id="comment" as="textarea" label="Комментарий" rows={1} maxLength={500}
                      value={form.comment} onChange={onChange} className="field--textarea field--wide"
                    />
                  </div>
                  <p className="book__hint">
                    Дата и время — пожелание, а не подтверждённая запись: точное время согласует администратор.
                  </p>
                </Step>

                <div className="book__trap" aria-hidden="true">
                  <label htmlFor="website">Не заполняйте это поле</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange} />
                </div>

                <label className={`consent${errors.consent ? ' has-error' : ''}`}>
                  <input
                    type="checkbox" name="consent" checked={form.consent} onChange={onChange}
                    aria-invalid={Boolean(errors.consent)}
                  />
                  <span className="consent__box"><Check /></span>
                  <span className="consent__text">
                    Согласен на обработку персональных данных в соответствии с{' '}
                    <a href={`${import.meta.env.BASE_URL}privacy.html`} target="_blank" rel="noopener">политикой обработки персональных данных</a>
                  </span>
                  <FieldError>{errors.consent}</FieldError>
                </label>

                <div className="book__submit">
                  <Button type="submit" disabled={sending} className="book__submit-btn">
                    {sending ? 'Отправляем…' : 'Отправить заявку'}
                  </Button>
                  {!isBookingConfigured && (
                    <p className="book__notice">
                      <span className="tag">Важно</span>
                      Онлайн-приём заявок ещё не подключён: форма проверит данные, но не отправит их. Пока записывайтесь по телефону.
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
