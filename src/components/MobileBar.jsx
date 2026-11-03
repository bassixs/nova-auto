import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { CONTACTS } from '../data/content'
import { useMediaQuery } from '../lib/useMediaQuery'
import { ArrowRight, Phone } from './ui/Icons'
import { EASE } from './ui/motion'
import './MobileBar.css'

const inViewport = (id) => {
  const r = document.getElementById(id)?.getBoundingClientRect()
  return Boolean(r && r.top < window.innerHeight * 0.85 && r.bottom > 0)
}

export default function MobileBar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [show, setShow] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShow(y > window.innerHeight * 0.75 && !inViewport('booking'))
  })

  return (
    <AnimatePresence>
      {isMobile && show && (
        <motion.div
          className="mbar"
          initial={{ y: '130%' }}
          animate={{ y: '0%' }}
          exit={{ y: '130%' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <a href={CONTACTS.phoneHref} className="mbar__call" aria-label={`Позвонить ${CONTACTS.phone}`}>
            <Phone />
          </a>
          <a href="#booking" className="mbar__book">
            Записаться
            <ArrowRight />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
