import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DIRECTION_PHOTOS } from '../data/content'
import { DIRECTIONS, countServices, servicesOf } from '../data/services'
import { useOrder } from '../lib/order'
import Img from './ui/Img'
import SectionHead from './ui/SectionHead'
import { ArrowRight } from './ui/Icons'
import { EASE, Reveal } from './ui/motion'
import './Services.css'

export default function Services() {
  const { openDirection } = useOrder()
  const [active, setActive] = useState(0)
  const [slide, setSlide] = useState(0)
  const trackRef = useRef(null)

  const onTrackScroll = () => {
    const el = trackRef.current
    const card = el.firstElementChild
    if (!card) return
    const step = card.getBoundingClientRect().width + 12
    setSlide(Math.min(DIRECTIONS.length - 1, Math.round(el.scrollLeft / step)))
  }

  const current = DIRECTIONS[active]
  const photo = DIRECTION_PHOTOS[current.id]

  return (
    <section className="svc section" id="services">
      <div className="container">
        <SectionHead
          index="01"
          label="Услуги"
          title={'УХОД ЗА КУЗОВОМ,\nСАЛОНОМ И ДЕТАЛЯМИ'}
          aside="Шесть направлений — от мойки до защиты кузова. Откройте любое, чтобы увидеть цены для вашего автомобиля."
        />

        <div className="svc__layout">
          <Reveal className="svc__stage" y={40}>
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="svc__stage-frame"
                initial={{ clipPath: 'inset(0% 0% 0% 100%)', zIndex: 2 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', zIndex: 2 }}
                exit={{ zIndex: 1, transition: { duration: 0.9 } }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <motion.div
                  className="svc__stage-zoom"
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease: EASE }}
                >
                  <Img id={photo.id} alt={photo.alt} sizes="(min-width: 1024px) 50vw, 100vw" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className="svc__stage-shade" />
            <div className="svc__stage-caption">
              <span className="svc__stage-num">0{active + 1}</span>
              <span className="mono">/ 0{DIRECTIONS.length}</span>
            </div>
          </Reveal>

          <div className="svc__track" ref={trackRef} onScroll={onTrackScroll}>
            {DIRECTIONS.map((d, i) => (
              <Reveal
                as="article"
                key={d.id}
                className={`svc__item${i === active ? ' is-active' : ''}`}
                delay={i * 0.06}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                onFocus={() => setActive(i)}
              >
                <div className="svc__item-media">
                  <Img id={DIRECTION_PHOTOS[d.id].id} alt={DIRECTION_PHOTOS[d.id].alt} sizes="(min-width: 1024px) 50vw, 82vw" />
                </div>
                <div className="svc__item-body">
                  <div className="svc__item-top">
                    <span className="mono svc__item-num">0{i + 1}</span>
                    <span className="mono svc__item-count">{countServices(servicesOf(d.id).length)}</span>
                  </div>
                  <h3 className="svc__item-title">{d.title}</h3>
                  <p className="svc__item-text">{d.text}</p>
                  <button type="button" className="svc__more" onClick={() => openDirection(d.id)}>
                    Смотреть цены
                    <ArrowRight />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="svc__dots" aria-hidden="true">
            {DIRECTIONS.map((d, i) => (
              <span key={d.id} className={i === slide ? 'is-active' : ''} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
