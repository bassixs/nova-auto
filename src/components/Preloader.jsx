import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { LogoMark } from './ui/Logo'
import { EASE } from './ui/motion'
import './Preloader.css'

const SWEEP_S = 1.5
const HOLD_MS = 450
const MAX_MS = 4200

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function imageReady(img) {
  if (!img || (img.complete && img.naturalWidth > 0)) return Promise.resolve()
  return new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true })
    img.addEventListener('error', resolve, { once: true })
  })
}

export default function Preloader({ onDone }) {
  const [visible, setVisible] = useState(true)
  const reduce = useReducedMotion()
  const logoRef = useRef(null)

  // The logo is revealed by a conic wipe around the ring centre, as if light draws the eclipse
  const sweep = useMotionValue(0)
  const from = useTransform(sweep, (v) => v * 400 - 36)
  const to = useTransform(sweep, (v) => v * 400)
  const mask = useMotionTemplate`conic-gradient(from -30deg at 50.2% 48.6%, #000 ${from}deg, transparent ${to}deg)`
  const progress = useMotionValue(0)

  useEffect(() => {
    lockScroll()
    let cancelled = false
    let released = false
    const release = () => {
      if (released) return
      released = true
      unlockScroll()
    }

    const logo = logoRef.current?.querySelector('img')
    const intro = Promise.race([imageReady(logo), wait(1200)]).then(() => {
      if (cancelled) return
      if (reduce) {
        sweep.set(1)
        progress.set(1)
        return wait(700)
      }
      animate(progress, 1, { duration: SWEEP_S + HOLD_MS / 1000, ease: [0.65, 0, 0.35, 1] })
      return animate(sweep, 1, { duration: SWEEP_S, ease: [0.5, 0, 0.2, 1] }).then(() => wait(HOLD_MS))
    })
    const assets = Promise.all([document.fonts?.ready, imageReady(document.querySelector('.hero__img'))])

    Promise.race([Promise.all([intro, assets]), wait(MAX_MS)]).then(() => {
      if (cancelled) return
      setVisible(false)
      release()
      onDone()
    })
    return () => {
      cancelled = true
      release()
    }
  }, [onDone, reduce, sweep, progress])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          initial="shown"
          animate="shown"
          exit="gone"
          variants={{ shown: {}, gone: { transition: { duration: 1.1 } } }}
          aria-hidden="true"
        >
          <motion.div
            className="preloader__bg"
            variants={{ shown: { opacity: 1 }, gone: { opacity: 0, transition: { duration: 1, ease: [0.65, 0, 0.35, 1] } } }}
          />
          <motion.div
            ref={logoRef}
            className="preloader__logo"
            variants={{
              shown: { opacity: 1, scale: 1, filter: 'blur(0px)' },
              gone: { opacity: 0, scale: 1.14, filter: 'blur(10px)', transition: { duration: 0.9, ease: EASE, delay: 0.12 } },
            }}
          >
            <motion.div
              className="preloader__sweep"
              style={{ maskImage: mask, WebkitMaskImage: mask }}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: SWEEP_S + 0.6, ease: EASE }}
            >
              <LogoMark priority />
            </motion.div>
          </motion.div>
          <motion.div
            className="preloader__bar"
            variants={{ shown: { opacity: 1 }, gone: { opacity: 0, transition: { duration: 0.3 } } }}
          >
            <motion.div className="preloader__bar-fill" style={{ scaleX: progress }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
