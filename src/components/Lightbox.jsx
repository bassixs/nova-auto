import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GALLERY } from '../data/content'
import { photoSrcSet, photoUrl } from '../lib/images'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { ArrowLeft, ArrowRight, Close } from './ui/Icons'
import { EASE } from './ui/motion'
import './Lightbox.css'

const N = GALLERY.length

const slide = {
  enter: (d) => ({ x: d > 0 ? '14%' : d < 0 ? '-14%' : 0, opacity: 0, scale: d === 0 ? 0.94 : 1 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d) => ({ x: d > 0 ? '-14%' : '14%', opacity: 0 }),
}

export default function Lightbox({ index, onChange }) {
  const [dir, setDir] = useState(0)
  const open = index !== null

  const go = useCallback(
    (d) => {
      setDir(d)
      onChange((i) => (i + d + N) % N)
    },
    [onChange]
  )

  const close = useCallback(() => onChange(null), [onChange])

  useEffect(() => {
    if (!open) return
    lockScroll()
    setDir(0)
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      unlockScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, go, close])

  useEffect(() => {
    if (!open) return
    ;[1, -1].forEach((d) => {
      const img = new Image()
      img.sizes = '92vw'
      img.srcset = photoSrcSet(GALLERY[(index + d + N) % N].id)
    })
  }, [open, index])

  const item = open ? GALLERY[index] : null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="lb__top container">
            <span className="mono lb__count">
              {String(index + 1).padStart(2, '0')} <span>/ {String(N).padStart(2, '0')}</span>
            </span>
            <button type="button" className="lb__btn" onClick={close} aria-label="Закрыть">
              <Close />
            </button>
          </div>

          <div className="lb__stage" onClick={(e) => e.target === e.currentTarget && close()}>
            <AnimatePresence initial={false} custom={dir}>
              <motion.img
                key={item.id}
                className="lb__img"
                src={photoUrl(item.id, 1600)}
                srcSet={photoSrcSet(item.id)}
                sizes="92vw"
                alt={item.title}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.x < -70 || velocity.x < -500) go(1)
                  else if (offset.x > 70 || velocity.x > 500) go(-1)
                }}
                draggable="false"
              />
            </AnimatePresence>
          </div>

          <div className="lb__bottom container">
            <div className="lb__caption">
              <span className="mono">{item.tag}</span>
              <span>{item.title}</span>
            </div>
            <div className="lb__nav">
              <button type="button" className="lb__btn" onClick={() => go(-1)} aria-label="Предыдущее фото">
                <ArrowLeft />
              </button>
              <button type="button" className="lb__btn" onClick={() => go(1)} aria-label="Следующее фото">
                <ArrowRight />
              </button>
            </div>
          </div>
          <motion.div
            className="lb__progress"
            animate={{ scaleX: (index + 1) / N }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
