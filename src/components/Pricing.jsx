import { useEffect, useRef, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { CAR_CLASSES, PRICES, formatPrice } from '../data/content'
import { useBooking } from '../lib/booking'
import SectionHead from './ui/SectionHead'
import Button from './ui/Button'
import { ArrowRight } from './ui/Icons'
import { EASE, Hairline, Reveal } from './ui/motion'
import './Pricing.css'

function AnimatedPrice({ value }) {
  const ref = useRef(null)
  const from = useRef(value)

  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => {
        from.current = v
        if (ref.current) ref.current.textContent = formatPrice(v)
      },
    })
    return () => controls.stop()
  }, [value])

  return <span ref={ref}>{formatPrice(value)}</span>
}

const priceFor = (base, factor) => Math.round((base * factor) / 500) * 500

export default function Pricing() {
  const [carClass, setCarClass] = useState(CAR_CLASSES[0])
  const { chooseService } = useBooking()

  return (
    <section className="price section" id="pricing">
      <div className="container">
        <SectionHead
          index="03"
          label="Прайс-лист"
          title="ПРОЗРАЧНЫЙ СЕРВИС"
          aside="Ориентировочная стоимость по классу автомобиля. Точную цену называем после осмотра — до начала работ."
        />

        <Reveal className="price__switch" role="radiogroup" aria-label="Класс автомобиля">
          {CAR_CLASSES.map((c) => (
            <button
              key={c.key}
              type="button"
              role="radio"
              aria-checked={c.key === carClass.key}
              className={`price__switch-btn${c.key === carClass.key ? ' is-active' : ''}`}
              onClick={() => setCarClass(c)}
            >
              {c.key === carClass.key && (
                <motion.span className="price__switch-pill" layoutId="price-pill" transition={{ duration: 0.6, ease: EASE }} />
              )}
              <span className="price__switch-label">{c.label}</span>
            </button>
          ))}
        </Reveal>

        <ul className="price__list">
          {PRICES.map((p, i) => (
            <li key={p.title}>
              <Hairline delay={i * 0.06} />
              <Reveal delay={0.05 + i * 0.06} y={16}>
                <button type="button" className="price__row" onClick={() => chooseService(p.title)}>
                  <span className="price__num mono">0{i + 1}</span>
                  <span className="price__name">
                    <span className="price__title">{p.title}</span>
                    <span className="price__note">{p.note}</span>
                  </span>
                  <span className="price__value">
                    <span className="price__from">от</span>
                    <AnimatedPrice value={priceFor(p.base, carClass.factor)} />
                    <span className="price__cur">₽</span>
                  </span>
                  <span className="price__go" aria-hidden="true">
                    <ArrowRight />
                  </span>
                  <span className="sr-only">— записаться</span>
                </button>
              </Reveal>
            </li>
          ))}
          <Hairline delay={0.3} />
        </ul>

        <Reveal className="price__footer">
          <p className="price__disclaimer">
            <span className="mono">Демо</span>
            Цены демонстрационные и зависят от класса, размера и состояния автомобиля.
          </p>
          <Button href="#booking" variant="ghost">Уточнить стоимость</Button>
        </Reveal>
      </div>
    </section>
  )
}
