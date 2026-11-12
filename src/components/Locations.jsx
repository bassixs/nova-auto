import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { LOCATIONS, routeUrl, telHref, yandexCardUrl } from '../data/business'
import { useOrder } from '../lib/order'
import { scrollToTarget } from '../lib/scroll'
import { useMediaQuery } from '../lib/useMediaQuery'
import { loadYmaps } from '../lib/ymaps'
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

const MARK_HTML =
  '<div class="ymark$[properties.state]"><i></i><span><b>$[properties.index]</b>$[properties.title]</span></div>'

function LocationsMap({ focus, onFocus }) {
  const ref = useRef(null)
  const map = useRef(null)
  const marks = useRef({})
  const near = useInView(ref, { once: true, margin: '500px 0px' })
  const touch = useMediaQuery('(hover: none)')
  const [status, setStatus] = useState('idle')
  const options = [{ id: null, label: 'Обе точки' }, ...LOCATIONS.map((l) => ({ id: l.id, label: l.title }))]

  useEffect(() => {
    if (!near) return
    let cancelled = false
    setStatus('loading')
    loadYmaps()
      .then((ymaps) => {
        if (cancelled || !ref.current) return
        const center = [
          LOCATIONS.reduce((s, l) => s + l.geo.lat, 0) / LOCATIONS.length,
          LOCATIONS.reduce((s, l) => s + l.geo.lon, 0) / LOCATIONS.length,
        ]
        const instance = new ymaps.Map(ref.current, { center, zoom: 13, controls: ['zoomControl'] }, { suppressMapOpenBlock: true })
        // The page keeps scrolling over the map: wheel zoom is off, and on touch screens panning needs two fingers
        instance.behaviors.disable('scrollZoom')
        if (touch) instance.behaviors.disable('drag')

        const Layout = ymaps.templateLayoutFactory.createClass(MARK_HTML)
        LOCATIONS.forEach((loc) => {
          const mark = new ymaps.Placemark(
            [loc.geo.lat, loc.geo.lon],
            { index: loc.index, title: loc.title, state: '' },
            { iconLayout: Layout, iconShape: { type: 'Rectangle', coordinates: [[-14, -14], [190, 22]] } }
          )
          mark.events.add('click', () => onFocus(loc.id))
          instance.geoObjects.add(mark)
          marks.current[loc.id] = mark
        })
        map.current = instance
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
      map.current?.destroy()
      map.current = null
      marks.current = {}
    }
  }, [near, touch, onFocus])

  useEffect(() => {
    if (status !== 'ready' || !map.current) return
    Object.entries(marks.current).forEach(([id, mark]) => mark.properties.set('state', id === focus ? ' is-active' : ''))
    const target = LOCATIONS.find((l) => l.id === focus)
    if (target) {
      map.current.setCenter([target.geo.lat, target.geo.lon], 16, { duration: 600 })
    } else {
      // Margins leave room for the marker captions, which extend to the right of each point
      const zoomMargin = ref.current.clientWidth < 520 ? [40, 140, 50, 24] : [80, 210, 80, 50]
      map.current.setBounds(map.current.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin, duration: 600 })
    }
  }, [focus, status])

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

      <div id="locations-map" className="lmap__frame">
        <div ref={ref} className="lmap__canvas" role="application" aria-label="Карта: локации DARK VISION в Калуге" />
        {status === 'loading' && <p className="lmap__state mono">Загружаем карту…</p>}
        {status === 'error' && (
          <div className="lmap__state">
            <p>Карта не загрузилась. Адреса можно открыть в Яндекс Картах:</p>
            {LOCATIONS.map((loc) => (
              <a key={loc.id} href={yandexCardUrl(loc)} target="_blank" rel="noopener noreferrer">{loc.address}</a>
            ))}
          </div>
        )}
        {status === 'ready' && touch && <span className="lmap__hint">Двигайте карту двумя пальцами</span>}
      </div>
    </Reveal>
  )
}

export default function Locations() {
  const { location } = useOrder()
  const [focus, setFocus] = useState(null)

  const showOnMap = useCallback((id) => {
    setFocus(id)
    scrollToTarget('#locations-map')
  }, [])

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
