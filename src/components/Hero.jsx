import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { LOCATIONS, SITE } from '../data/business'
import { HERO_PHOTO } from '../data/content'
import { useMediaQuery } from '../lib/useMediaQuery'
import Img from './ui/Img'
import Button from './ui/Button'
import { Pin } from './ui/Icons'
import { EASE, MaskText } from './ui/motion'
import './Hero.css'

export default function Hero({ ready }) {
  const ref = useRef(null)
  // On large screens the hero stays pinned and the next section slides over it like a curtain
  const pinned = useMediaQuery('(min-width: 1024px) and (min-height: 700px)')
  const [covered, setCovered] = useState(false)
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / (window.innerHeight || 1))))
  const mediaY = useTransform(progress, (p) => (pinned ? '0%' : `${p * 22}%`))
  const mediaScale = useTransform(progress, (p) => (pinned ? 1 + p * 0.08 : 1))
  const dim = useTransform(progress, (p) => (pinned ? p * 0.7 : 0))
  const contentY = useTransform(progress, (p) => `${p * (pinned ? -12 : -18)}%`)
  const fade = useTransform(progress, [0, 0.6], [1, 0])

  useMotionValueEvent(progress, 'change', (p) => setCovered(p >= 1))

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
    <section
      className={`hero${pinned ? ' hero--pinned' : ''}`}
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      style={{ visibility: pinned && covered ? 'hidden' : 'visible' }}
      aria-label={SITE.name}
    >
      <motion.div className="hero__media" style={{ y: mediaY, scale: mediaScale }}>
        <motion.div
          className="hero__zoom"
          initial={{ scale: 1.18 }}
          animate={{ scale: ready ? 1 : 1.18 }}
          transition={{ duration: 2.6, ease: EASE }}
        >
          <Img id={HERO_PHOTO.id} alt={HERO_PHOTO.alt} className="hero__img" priority />
        </motion.div>
      </motion.div>
      <div className="hero__shade" />
      <div className="hero__spot" aria-hidden="true" />
      <motion.div className="hero__dim" style={{ opacity: dim }} aria-hidden="true" />

      <motion.div className="hero__content container" style={{ y: contentY, opacity: fade }}>
        <motion.a href="#locations" className="hero__badge" {...fadeUp(0.3)}>
          <Pin />
          {LOCATIONS.length} локации в Калуге
        </motion.a>

        <MaskText
          as="h1"
          text={`${SITE.name}\n${SITE.tagline}`}
          className="h-display hero__title"
          play={ready}
          delay={0.15}
          stagger={0.14}
          lineClassName={(i) => (i === 1 ? 'hero__tagline metal-text metal-text--shine' : '')}
        />

        <div className="hero__bottom">
          <motion.p className="hero__lead lead" {...fadeUp(0.6)}>{SITE.lead}</motion.p>
          <motion.div className="hero__actions" {...fadeUp(0.75)}>
            <Button href="#services">Выбрать услугу</Button>
            <Button href="#booking" variant="ghost">Записаться</Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="hero__meta" style={{ opacity: fade }}>
        <motion.div className="container hero__meta-inner" {...fadeUp(1)}>
          <div className="hero__meta-places">
            {LOCATIONS.map((loc) => (
              <a href="#locations" className="mono" key={loc.id}>{loc.title}</a>
            ))}
          </div>
          <a href="#services" className="hero__scroll mono" aria-label="Листать вниз">
            Scroll
            <span className="hero__scroll-line" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
