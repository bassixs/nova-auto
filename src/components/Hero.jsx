import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CONTACTS } from '../data/content'
import { PHOTOS } from '../lib/images'
import Img from './ui/Img'
import Button from './ui/Button'
import { EASE, MaskText } from './ui/motion'
import './Hero.css'

export default function Hero({ ready }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    ref.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1.1, ease: EASE, delay },
  })

  return (
    <section className="hero" id="top" ref={ref} onPointerMove={onPointerMove} aria-label="NOVA AUTO">
      <motion.div className="hero__media" style={{ y: mediaY }}>
        <motion.div
          className="hero__zoom"
          initial={{ scale: 1.18 }}
          animate={{ scale: ready ? 1 : 1.18 }}
          transition={{ duration: 2.6, ease: EASE }}
        >
          <Img
            id={PHOTOS.hero}
            alt="Чёрный Porsche в тёмном боксе под направленным студийным светом"
            className="hero__img"
            priority
          />
        </motion.div>
      </motion.div>
      <div className="hero__shade" />
      <div className="hero__spot" aria-hidden="true" />

      <motion.div className="hero__content container" style={{ y: contentY, opacity: fade }}>
        <motion.p className="eyebrow hero__eyebrow" {...fadeUp(0.3)}>
          <span className="hero__eyebrow-rule" />
          Premium Car Care Studio
        </motion.p>

        <MaskText
          as="h1"
          text={'СОВЕРШЕНСТВО\nВ КАЖДОЙ ДЕТАЛИ'}
          className="h-display hero__title"
          play={ready}
          delay={0.15}
          stagger={0.12}
          lineClassName={(i) => (i === 1 ? 'metal-text metal-text--shine' : '')}
        />

        <div className="hero__bottom">
          <motion.p className="hero__lead lead" {...fadeUp(0.6)}>
            Профессиональный уход за автомобилем. Детейлинг, глубокая очистка и защита кузова
            с вниманием к каждой детали.
          </motion.p>
          <motion.div className="hero__actions" {...fadeUp(0.75)}>
            <Button href="#services">Выбрать услугу</Button>
            <Button href="#booking" variant="ghost">Записаться</Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="hero__meta" {...fadeUp(1)}>
        <div className="container hero__meta-inner">
          <span className="mono">{CONTACTS.address}</span>
          <span className="mono hero__meta-hours">{CONTACTS.hoursShort}</span>
          <span className="mono hero__meta-claim">Precision. Care. Perfection.</span>
          <a href="#advantages" className="hero__scroll mono" aria-label="Листать вниз">
            Scroll
            <span className="hero__scroll-line" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
