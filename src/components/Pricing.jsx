import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DIRECTIONS, priceOf, servicesOf } from '../data/services'
import { useOrder } from '../lib/order'
import SectionHead from './ui/SectionHead'
import Button from './ui/Button'
import PriceTag from './ui/PriceTag'
import VehiclePicker from './ui/VehiclePicker'
import { Check, Info, Plus } from './ui/Icons'
import { EASE, Reveal } from './ui/motion'
import './Pricing.css'

/** Smoothly follows the height of its content when the list of services changes. */
function AutoHeight({ children }) {
  const inner = useRef(null)
  const [height, setHeight] = useState('auto')

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height))
    ro.observe(inner.current)
    return () => ro.disconnect()
  }, [])

  return (
    <motion.div className="price__auto" initial={false} animate={{ height }} transition={{ duration: 0.6, ease: EASE }}>
      <div ref={inner}>{children}</div>
    </motion.div>
  )
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

const rowVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export default function Pricing({ onOpen }) {
  const { vehicle, setVehicle, direction, setDirection, selection, toggle } = useOrder()
  const tabsRef = useRef(null)
  const list = servicesOf(direction)
  const mainSection = list[0].section

  useEffect(() => {
    const box = tabsRef.current
    const tab = box?.querySelector('[aria-pressed="true"]')
    if (tab) box.scrollTo({ left: tab.offsetLeft - (box.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
  }, [direction])

  return (
    <section className="price section" id="pricing">
      <div className="container">
        <SectionHead
          index="02"
          label="Прайс"
          title={'УСЛУГИ\nИ ЦЕНЫ'}
          aside="Выберите категорию автомобиля — каталог покажет цены для неё. Отметьте нужные услуги и переходите к записи."
        />

        <Reveal className="price__step">
          <p className="price__step-label mono" id="price-vehicle-label">
            <span>1</span> Категория автомобиля
          </p>
          <VehiclePicker value={vehicle} onChange={setVehicle} layoutId="vpick-catalog" labelledBy="price-vehicle-label" />
        </Reveal>

        <Reveal className="price__step" delay={0.1}>
          <p className="price__step-label mono">
            <span>2</span> Услуги
          </p>

          <div className="price__tabs" ref={tabsRef} role="group" aria-label="Направления услуг">
            {DIRECTIONS.map((d) => {
              const active = d.id === direction
              const chosen = servicesOf(d.id).filter((s) => selection[s.id]).length
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`price__tab${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => setDirection(d.id)}
                >
                  {d.title}
                  {chosen > 0 && <span className="price__tab-count">{chosen}</span>}
                  {active && <motion.span className="price__tab-line" layoutId="price-tab-line" transition={{ duration: 0.55, ease: EASE }} />}
                </button>
              )
            })}
          </div>

          <AutoHeight>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul key={direction} className="price__list" variants={listVariants} initial="hidden" animate="show" exit="exit">
                {list.map((s) => {
                  const selected = Boolean(selection[s.id])
                  const meta = s.note ?? (s.section !== mainSection && s.section !== s.title ? s.section : null)
                  return (
                    <motion.li key={s.id} className={`srow${selected ? ' is-selected' : ''}`} variants={rowVariants}>
                      <button type="button" className="srow__toggle" aria-pressed={selected} onClick={() => toggle(s.id)}>
                        <span className="srow__box" aria-hidden="true">{selected ? <Check /> : <Plus />}</span>
                        <span className="srow__name">
                          <span className="srow__title">{s.title}</span>
                          {meta && <span className="srow__meta">{meta}</span>}
                        </span>
                        <PriceTag price={priceOf(s, vehicle, selection[s.id]?.variant)} unit={s.unit} className="srow__price" />
                        <span className="sr-only">{selected ? '— убрать из заявки' : '— добавить в заявку'}</span>
                      </button>
                      <button type="button" className="srow__info" onClick={() => onOpen(s)} aria-label={`Подробнее: ${s.title}`}>
                        <Info />
                      </button>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </AnimatePresence>
          </AutoHeight>
        </Reveal>

        <Reveal className="price__footer">
          <p className="price__note">
            Цена с пометкой «от» — минимальная. Итоговую стоимость уточняйте у администратора.
          </p>
          <Button href="#booking" variant="ghost">Перейти к записи</Button>
        </Reveal>
      </div>
    </section>
  )
}
