import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { CONTACT, telHref } from '../data/business'
import { countServices, formatPrice } from '../data/services'
import { useOrder } from '../lib/order'
import { useMediaQuery } from '../lib/useMediaQuery'
import { ArrowRight, Phone } from './ui/Icons'
import { EASE } from './ui/motion'
import './OrderBar.css'

const inViewport = (id) => {
  const r = document.getElementById(id)?.getBoundingClientRect()
  return Boolean(r && r.top < window.innerHeight * 0.85 && r.bottom > 0)
}

/** Fixed booking panel: always on phones after the hero, on desktop once services are chosen. */
export default function OrderBar() {
  const { items, total } = useOrder()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [pastHero, setPastHero] = useState(false)
  const [atBooking, setAtBooking] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setPastHero(y > window.innerHeight * 0.75)
    setAtBooking(inViewport('booking'))
  })

  const count = items.length
  const show = !atBooking && (isMobile ? pastHero : count > 0)
  const summary = count > 0 ? `${countServices(count)} · ${formatPrice(total)}` : null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`obar${isMobile ? ' obar--mobile' : ''}`}
          initial={{ y: '140%' }}
          animate={{ y: '0%' }}
          exit={{ y: '140%' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {isMobile && CONTACT.phone && (
            <a href={telHref(CONTACT.phone)} className="obar__call" aria-label={`Позвонить ${CONTACT.phone}`}>
              <Phone />
            </a>
          )}
          <a href="#booking" className="obar__book">
            <span className="obar__text">
              <span className="obar__label">Записаться</span>
              <AnimatePresence mode="wait" initial={false}>
                {summary && (
                  <motion.span
                    key={summary}
                    className="obar__sum"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {summary}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <ArrowRight />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
