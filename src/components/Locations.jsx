import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { LOCATIONS, mapWidgetUrl, routeUrl, telHref } from '../data/business'
import { useOrder } from '../lib/order'
import { scrollToTarget } from '../lib/scroll'
import { useMediaQuery } from '../lib/useMediaQuery'
import Img from './ui/Img'
import Button from './ui/Button'
import SectionHead from './ui/SectionHead'
import { ArrowUpRight, Check, Clock, Phone, Pin } from './ui/Icons'
import { EASE, Reveal } from './ui/motion'
import './Locations.css'

function LocationCard({ loc, index, selected, onShowOnMap }) {
  const { bookAt } = useOrder()

  return (
    <Reveal as="article" className={`lcard${selected ? ' is-selected' : ''}`} delay={index * 0.12} y={40}>
      <div className="lcard__media">
        {loc.photo ? (
          <Img id={loc.photo} alt={`DARK VISION на ${loc.street}`} sizes="(min-width: 900px) 50vw, 100vw" />
        ) : (
          <div className="lcard__plate" aria-hidden="true">
            <span className="lcard__plate-num">{loc.index}</span>
          </div>
        )}
        <div className="lcard__media-shade" />
        <span className="lcard__index mono">Локация {loc.index}</span>
        {loc.badge && <span className="lcard__badge tag">{loc.badge}</span>}
      </div>

      <div className="lcard__body">
        <h3 className="lcard__title">{loc.street}</h3>
        <ul className="lcard__facts">
          <li>
            <Pin />
            <span>{loc.address}</span>
          </li>
          {loc.hours && (
            <li>
              <Clock />
              <span>{loc.hours.label}</span>
            </li>
          )}
          {loc.phone && (
            <li>
              <Phone width="16" height="16" />
              <a href={telHref(loc.phone)}>{loc.phone}</a>
            </li>
          )}
        </ul>

        <div className="lcard__actions">
          <Button onClick={() => bookAt(loc.id)}>Записаться</Button>
          <Button href={routeUrl(loc)} target="_blank" rel="noopener noreferrer" variant="ghost" arrow={false}>
            <span className="lcard__btn-inner">Построить маршрут <ArrowUpRight /></span>
          </Button>
        </div>

        <div className="lcard__foot">
          <button type="button" className="lcard__link" onClick={() => onShowOnMap(loc.id)}>
            Показать на карте
          </button>
          {selected && (
            <motion.span
              className="lcard__chosen mono"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Check /> Выбрана для записи
            </motion.span>
          )}
        </div>
      </div>
    </Reveal>
  )
}

function LocationsMap({ focus, onFocus }) {
  const ref = useRef(null)
  const near = useInView(ref, { once: true, margin: '400px 0px' })
  const wide = useMediaQuery('(min-width: 768px)')
  const [active, setActive] = useState(false)
  const options = [{ id: null, label: 'Обе точки' }, ...LOCATIONS.map((l) => ({ id: l.id, label: l.title }))]

  return (
    <Reveal className="lmap" y={40}>
      <div className="lmap__bar" role="radiogroup" aria-label="Показать на карте">
        {options.map((o) => (
          <button
            key={o.id ?? 'all'}
            type="button"
            role="radio"
            aria-checked={focus === o.id}
            className={`lmap__chip${focus === o.id ? ' is-active' : ''}`}
            onClick={() => onFocus(o.id)}
          >
            {focus === o.id && <motion.span className="lmap__chip-bg" layoutId="lmap-chip" transition={{ duration: 0.5, ease: EASE }} />}
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      <div
        ref={ref}
        id="locations-map"
        className={`lmap__frame${active ? ' is-active' : ''}`}
        onMouseLeave={() => setActive(false)}
        data-lenis-prevent
      >
        {near && (
          <iframe
            key={`${focus}-${wide}`}
            src={mapWidgetUrl(focus, wide)}
            title="Карта: локации DARK VISION в Калуге"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
        {!active && (
          <button type="button" className="lmap__cover" onClick={() => setActive(true)}>
            <span>Нажмите, чтобы управлять картой</span>
          </button>
        )}
      </div>
    </Reveal>
  )
}

export default function Locations() {
  const { location } = useOrder()
  const [focus, setFocus] = useState(null)

  const showOnMap = (id) => {
    setFocus(id)
    scrollToTarget('#locations-map')
  }

  return (
    <section className="loc section" id="locations">
      <div className="container">
        <SectionHead
          index="05"
          label="Локации"
          title={'НАШИ\nЛОКАЦИИ'}
          aside="Две точки DARK VISION в Калуге. Выберите удобную — она сразу подставится в заявку."
        />

        <div className="loc__grid">
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.id} loc={loc} index={i} selected={location === loc.id} onShowOnMap={showOnMap} />
          ))}
        </div>

        <LocationsMap focus={focus} onFocus={setFocus} />
      </div>
    </section>
  )
}
