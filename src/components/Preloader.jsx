import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { EASE } from './ui/motion'
import './Preloader.css'

const MIN_MS = 1300
const MAX_MS = 2400

function heroImageReady() {
  const img = document.querySelector('.hero__img')
  if (!img || img.complete) return Promise.resolve()
  return new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true })
    img.addEventListener('error', resolve, { once: true })
  })
}

export default function Preloader({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    lockScroll()
    let cancelled = false
    let released = false
    const release = () => {
      if (released) return
      released = true
      unlockScroll()
    }
    const minDelay = new Promise((r) => setTimeout(r, MIN_MS))
    const assets = Promise.all([document.fonts?.ready, heroImageReady()])
    const maxDelay = new Promise((r) => setTimeout(r, MAX_MS))

    Promise.race([Promise.all([minDelay, assets]), maxDelay]).then(() => {
      if (cancelled) return
      setVisible(false)
      release()
      onDone()
    })
    return () => {
      cancelled = true
      release()
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="preloader__mark">
            {'NOVA'.split('').map((ch, i) => (
              <span className="preloader__char" key={i}>
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.07 }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </div>
          <motion.div
            className="preloader__tag mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Precision. Care. Perfection.
          </motion.div>
          <div className="preloader__bar">
            <motion.div
              className="preloader__bar-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: MIN_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
