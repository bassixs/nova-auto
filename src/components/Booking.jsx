import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { BOOKING_SERVICES, CONTACTS } from '../data/content'
import { useBooking } from '../lib/booking'
import { PHOTOS } from '../lib/images'
import Img from './ui/Img'
import Button from './ui/Button'
import SectionHead from './ui/SectionHead'
import { Check } from './ui/Icons'
import { EASE, Reveal } from './ui/motion'
import './Booking.css'

const EMPTY = { name: '', phone: '', car: '', service: '', date: '', comment: '', consent: false }

const CAR_BRANDS = ['Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Lexus', 'Toyota', 'Volkswagen', 'Volvo', 'Land Rover', 'Genesis', 'Kia', 'Hyundai', 'Skoda', 'Haval', 'Chery']

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

function validate(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Укажите имя'
  const digits = f.phone.replace(/\D/g, '')
  if (!digits) e.phone = 'Укажите телефон'
  else if (digits.length !== 11) e.phone = 'Номер должен содержать 11 цифр'
  if (f.car.trim().length < 2) e.car = 'Укажите марку автомобиля'
  if (!f.service) e.service = 'Выберите услугу'
  if (f.date && f.date < todayISO()) e.date = 'Дата не может быть в прошлом'
  if (!f.consent) e.consent = 'Нужно согласие на обработку данных'
  return e
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

const formatDate = (iso) =>
  iso ? new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' }) : 'Не выбрана'

export default function Booking() {
  const { request } = useBooking()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitted, setSubmitted] = useState(null)
  const [scope, animateEl] = useAnimate()
  const formRef = useRef(null)

  useEffect(() => {
    if (!request) return
    setStatus('idle')
    setForm((f) => ({ ...f, service: request.name }))
    setErrors((e) => ({ ...e, service: undefined }))
  }, [request])

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    set(name, type === 'checkbox' ? checked : name === 'phone' ? formatPhone(value) : value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length) {
      animateEl(scope.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.45 })
      const first = formRef.current.querySelector('[aria-invalid="true"], .chips.has-error input')
      first?.focus({ preventScroll: true })
      return
    }
    setStatus('sending')
    setTimeout(() => {
      setSubmitted(form)
      setStatus('done')
      setForm(EMPTY)
    }, 1100)
  }

  return (
    <section className="book section" id="booking">
      <div className="book__bg" aria-hidden="true">
        <Img id={PHOTOS.heroSilhouette} alt="" sizes="100vw" />
      </div>

      <div className="container book__grid">
        <div className="book__intro">
          <SectionHead index="07" label="Запись" title={'ВАШ АВТОМОБИЛЬ\nЗАСЛУЖИВАЕТ\nЛУЧШЕГО'} className="book__head" />
          <Reveal as="p" className="lead book__lead" delay={0.15}>
            Оставьте заявку — администратор перезвонит, уточнит детали и подберёт удобное время.
          </Reveal>
          <Reveal className="book__direct" delay={0.25}>
            <a href={CONTACTS.phoneHref} className="book__phone">{CONTACTS.phone}</a>
            <span className="mono">{CONTACTS.hoursShort}</span>
          </Reveal>
        </div>

        <Reveal className="book__card" delay={0.1} y={40}>
          <AnimatePresence mode="wait" initial={false}>
            {status === 'done' ? (
              <motion.div
                key="done"
                className="book__done"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: EASE }}
                role="status"
              >
                <svg className="book__done-icon" width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
                  <motion.circle
                    cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="1.2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: EASE }}
                  />
                  <motion.path
                    d="M23 37.5 32 46 50 27" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
                  />
                </svg>
                <h3 className="book__done-title">Заявка сформирована</h3>
                <p className="book__done-text">
                  Демонстрационный режим: данные никуда не отправлены. В рабочей версии заявка придёт
                  администратору в Telegram, на почту или в CRM.
                </p>
                <dl className="book__summary">
                  <div><dt className="mono">Имя</dt><dd>{submitted.name}</dd></div>
                  <div><dt className="mono">Телефон</dt><dd>{submitted.phone}</dd></div>
                  <div><dt className="mono">Автомобиль</dt><dd>{submitted.car}</dd></div>
                  <div><dt className="mono">Услуга</dt><dd>{submitted.service}</dd></div>
                  <div><dt className="mono">Дата</dt><dd>{formatDate(submitted.date)}</dd></div>
                </dl>
                <Button variant="ghost" onClick={() => setStatus('idle')}>Новая заявка</Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={(el) => {
                  formRef.current = el
                  scope.current = el
                }}
                className="book__form"
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <TextField id="name" label="Имя" autoComplete="name" value={form.name} onChange={onChange} error={errors.name} />
                <TextField
                  id="phone" label="Телефон" type="tel" inputMode="tel" autoComplete="tel"
                  value={form.phone} onChange={onChange} error={errors.phone}
                />
                <TextField
                  id="car" label="Марка и модель" list="car-brands" autoComplete="off"
                  value={form.car} onChange={onChange} error={errors.car} className="field--wide"
                />
                <datalist id="car-brands">
                  {CAR_BRANDS.map((b) => <option key={b} value={b} />)}
                </datalist>

                <fieldset className={`chips field--wide${errors.service ? ' has-error' : ''}`}>
                  <legend className="chips__legend">Услуга</legend>
                  <div className="chips__list">
                    {BOOKING_SERVICES.map((s) => (
                      <label key={s} className={`chip${form.service === s ? ' is-active' : ''}`}>
                        <input
                          type="radio" name="service" value={s} className="sr-only"
                          checked={form.service === s} onChange={onChange}
                          aria-invalid={Boolean(errors.service)}
                        />
                        {form.service === s && (
                          <motion.span className="chip__bg" layoutId="chip-bg" transition={{ duration: 0.5, ease: EASE }} />
                        )}
                        <span className="chip__label">{s}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError>{errors.service}</FieldError>
                </fieldset>

                <TextField
                  id="date" label="Желаемая дата" type="date" min={todayISO()}
                  value={form.date} onChange={onChange} error={errors.date} className="field--date"
                />
                <TextField
                  id="comment" as="textarea" label="Комментарий" rows={1}
                  value={form.comment} onChange={onChange} className="field--textarea"
                />

                <label className={`consent field--wide${errors.consent ? ' has-error' : ''}`}>
                  <input
                    type="checkbox" name="consent" checked={form.consent} onChange={onChange}
                    aria-invalid={Boolean(errors.consent)}
                  />
                  <span className="consent__box"><Check /></span>
                  <span className="consent__text">Согласен на обработку персональных данных для связи по заявке</span>
                  <FieldError>{errors.consent}</FieldError>
                </label>

                <div className="book__submit field--wide">
                  <Button type="submit" disabled={status === 'sending'} className="book__submit-btn">
                    {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
                  </Button>
                  <p className="book__demo">
                    <span className="mono">Демо</span>
                    Форма работает в демонстрационном режиме: заявка не отправляется реальному администратору.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
