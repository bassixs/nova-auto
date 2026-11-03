import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONTACTS } from '../data/content'
import SectionHead from './ui/SectionHead'
import Button from './ui/Button'
import { Copy, Phone } from './ui/Icons'
import { EASE, Hairline, Reveal } from './ui/motion'
import './Contacts.css'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

function MapScheme() {
  const view = { once: true, margin: '0px 0px -15% 0px' }
  return (
    <div className="map">
      <svg viewBox="0 0 600 480" className="map__svg" role="img" aria-label="Схема расположения студии NOVA AUTO">
        <path d="M-20 360 C 120 330, 180 420, 320 400 S 520 330, 640 380" stroke="rgba(142,154,168,0.12)" strokeWidth="46" fill="none" />
        {[[40, 40, 120, 80], [180, 30, 100, 110], [310, 50, 130, 70], [470, 30, 110, 120], [40, 150, 90, 120], [160, 170, 140, 90], [330, 150, 90, 120], [450, 180, 120, 90]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.04)" />
        ))}
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="2">
          <path d="M0 130 H600" />
          <path d="M0 290 H600" />
          <path d="M150 0 V330" />
          <path d="M440 0 V330" />
        </g>
        <g stroke="rgba(199,205,213,0.18)" strokeWidth="7" fill="none">
          <path d="M0 140 H600" />
          <path d="M300 0 V320" />
        </g>
        <motion.path
          d="M40 460 L40 300 L300 300 L300 140 L392 140"
          stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 8" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={view}
          transition={{ duration: 2.2, ease: EASE, delay: 0.3 }}
        />
        <g transform="translate(392 140)">
          <circle r="34" className="map__pulse" />
          <circle r="34" className="map__pulse map__pulse--late" />
          <circle r="9" fill="var(--text)" />
          <circle r="3.5" fill="var(--bg)" />
        </g>
        <text x="56" y="52" className="map__label">N ↑</text>
        <text x="460" y="455" className="map__label">200 м</text>
        <path d="M460 462 H540" stroke="rgba(255,255,255,0.35)" />
      </svg>
      <motion.div
        className="map__card"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ duration: 0.8, ease: EASE, delay: 1.6 }}
      >
        <span className="map__card-title">NOVA AUTO</span>
        <span className="mono">ул. Примерная, 10</span>
      </motion.div>
      <span className="map__note mono">Схема · демо</span>
    </div>
  )
}

export default function Contacts() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const onCopy = async () => {
    const ok = await copyText(CONTACTS.address)
    setToast(ok ? 'Адрес скопирован' : 'Не удалось скопировать адрес')
  }

  const rows = [
    { label: 'Адрес', value: CONTACTS.address },
    { label: 'Телефон', value: <a href={CONTACTS.phoneHref} className="ct__link">{CONTACTS.phone}</a> },
    { label: 'График', value: CONTACTS.hours },
  ]

  return (
    <section className="ct section" id="contacts">
      <div className="container ct__grid">
        <div>
          <SectionHead index="08" label="Контакты" title={'ЖДЁМ ВАС\nВ СТУДИИ'} />
          <dl className="ct__list">
            {rows.map((r, i) => (
              <div key={r.label} className="ct__row">
                <Hairline delay={i * 0.08} />
                <Reveal className="ct__row-inner" delay={0.1 + i * 0.08} y={14}>
                  <dt className="mono">{r.label}</dt>
                  <dd>{r.value}</dd>
                </Reveal>
              </div>
            ))}
            <Hairline delay={0.3} />
          </dl>
          <Reveal className="ct__actions" delay={0.3}>
            <Button href={CONTACTS.phoneHref} arrow={false}>
              <span className="ct__btn-inner"><Phone /> Позвонить</span>
            </Button>
            <Button variant="ghost" arrow={false} onClick={onCopy}>
              <span className="ct__btn-inner"><Copy /> Скопировать адрес</span>
            </Button>
          </Reveal>
        </div>

        <Reveal y={40} delay={0.1}>
          <MapScheme />
        </Reveal>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
