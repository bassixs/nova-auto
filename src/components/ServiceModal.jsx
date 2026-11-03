import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { formatPrice } from '../data/content'
import { useBooking } from '../lib/booking'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { useMediaQuery } from '../lib/useMediaQuery'
import Img from './ui/Img'
import Button from './ui/Button'
import { Check, Close } from './ui/Icons'
import { EASE } from './ui/motion'
import './ServiceModal.css'

export default function ServiceModal({ service, onClose }) {
  const { chooseService } = useBooking()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const dragControls = useDragControls()
  const closeRef = useRef(null)
  const open = Boolean(service)

  useEffect(() => {
    if (!open) return
    lockScroll()
    const prevFocus = document.activeElement
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
    return () => {
      unlockScroll()
      window.removeEventListener('keydown', onKey)
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  const book = () => {
    const name = service.bookingName
    onClose()
    chooseService(name)
  }

  const panelMotion = isMobile
    ? {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        drag: 'y',
        dragControls,
        dragListener: false,
        dragConstraints: { top: 0, bottom: 0 },
        dragElastic: { top: 0, bottom: 0.7 },
        onDragEnd: (_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 600) onClose()
        },
      }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }

  return (
    <AnimatePresence>
      {open && (
        <div className="smodal" role="dialog" aria-modal="true" aria-labelledby="smodal-title">
          <motion.div
            className="smodal__overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div className="smodal__panel" transition={{ duration: 0.8, ease: EASE }} {...panelMotion}>
            <div className="smodal__media" onPointerDown={(e) => isMobile && dragControls.start(e)}>
              <span className="smodal__grip" aria-hidden="true" />
              <Img id={service.photo} alt={service.photoAlt} sizes="(min-width: 768px) 560px, 100vw" />
              <div className="smodal__media-shade" />
              <button ref={closeRef} type="button" className="smodal__close" onClick={onClose} aria-label="Закрыть">
                <Close />
              </button>
            </div>

            <div className="smodal__body" data-lenis-prevent>
              <span className="eyebrow">Услуга</span>
              <h3 id="smodal-title" className="smodal__title">{service.title}</h3>
              <p className="smodal__lead">{service.short}</p>

              <dl className="smodal__facts">
                <div>
                  <dt className="mono">Стоимость</dt>
                  <dd>от {formatPrice(service.priceFrom)} ₽</dd>
                </div>
                <div>
                  <dt className="mono">Длительность</dt>
                  <dd>{service.duration}</dd>
                </div>
              </dl>

              <h4 className="mono smodal__subtitle">Что входит</h4>
              <ul className="smodal__list">
                {service.includes.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05, duration: 0.6, ease: EASE }}
                  >
                    <Check />
                    {item}
                  </motion.li>
                ))}
              </ul>

              <p className="smodal__note">
                Демонстрационные данные. Состав работ, сроки и стоимость уточняются после осмотра автомобиля.
              </p>

              <Button onClick={book} className="smodal__cta">Записаться на эту услугу</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
