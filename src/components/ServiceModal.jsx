import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { DIRECTION_PHOTOS } from '../data/content'
import { DIRECTIONS, VEHICLE_CATEGORIES, isFlatPrice, priceOf } from '../data/services'
import { useOrder } from '../lib/order'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { useMediaQuery } from '../lib/useMediaQuery'
import Img from './ui/Img'
import Button from './ui/Button'
import PriceTag from './ui/PriceTag'
import Stepper from './ui/Stepper'
import { Close } from './ui/Icons'
import { EASE } from './ui/motion'
import './ServiceModal.css'

export default function ServiceModal({ service, onClose }) {
  const { vehicle, setVehicle, selection, add, remove, setQty, goToBooking } = useOrder()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const dragControls = useDragControls()
  const closeRef = useRef(null)
  const [draft, setDraft] = useState({ qty: 1, variant: null })
  const open = Boolean(service)
  const entry = service ? selection[service.id] : null
  const selected = Boolean(entry)
  const qty = entry?.qty ?? draft.qty
  const variant = entry?.variant ?? draft.variant

  useEffect(() => {
    if (!open) return
    setDraft({ qty: 1, variant: null })
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

  const changeQty = (value) => (selected ? setQty(service.id, value) : setDraft((d) => ({ ...d, qty: value })))
  const changeVariant = (id) => (selected ? add(service.id, { variant: id }) : setDraft((d) => ({ ...d, variant: id })))

  const toBooking = () => {
    onClose()
    goToBooking()
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

  const photo = service ? DIRECTION_PHOTOS[service.direction] : null
  const hasFrom = service && (service.variants ? true : service.prices.some((p) => p.from))

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
              <Img id={photo.id} alt="" sizes="(min-width: 768px) 560px, 100vw" />
              <div className="smodal__media-shade" />
              <button ref={closeRef} type="button" className="smodal__close" onClick={onClose} aria-label="Закрыть">
                <Close />
              </button>
            </div>

            <div className="smodal__body" data-lenis-prevent>
              <span className="eyebrow">{DIRECTIONS.find((d) => d.id === service.direction).title}</span>
              <h3 id="smodal-title" className="smodal__title">{service.title}</h3>
              {service.note && <p className="smodal__lead">{service.note}</p>}

              {service.variants ? (
                <fieldset className="smodal__options">
                  <legend className="mono smodal__subtitle">Диаметр диска</legend>
                  {service.variants.map((v) => (
                    <label key={v.id} className={`smodal__opt${variant === v.id ? ' is-active' : ''}`}>
                      <input
                        type="radio"
                        name="service-variant"
                        className="sr-only"
                        checked={variant === v.id}
                        onChange={() => changeVariant(v.id)}
                      />
                      <span className="smodal__opt-name">{v.label}</span>
                      <PriceTag price={v.price} unit={service.unit} />
                    </label>
                  ))}
                </fieldset>
              ) : isFlatPrice(service) ? (
                <div className="smodal__flat">
                  <span className="mono smodal__subtitle">Для всех категорий автомобилей</span>
                  <PriceTag price={service.prices[0]} unit={service.unit} className="smodal__flat-price" />
                </div>
              ) : (
                <div className="smodal__options" role="radiogroup" aria-labelledby="smodal-prices">
                  <p className="mono smodal__subtitle" id="smodal-prices">Цена по категориям автомобиля</p>
                  {VEHICLE_CATEGORIES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={v.id === vehicle}
                      className={`smodal__opt${v.id === vehicle ? ' is-active' : ''}`}
                      onClick={() => setVehicle(v.id)}
                    >
                      <span className="smodal__opt-name">
                        <span className="mono">{v.label}</span>
                        {v.hint}
                      </span>
                      <PriceTag price={service.prices[v.id - 1]} unit={service.unit} />
                    </button>
                  ))}
                </div>
              )}

              {service.unit && (
                <div className="smodal__qty">
                  <span className="mono smodal__subtitle">Количество, {service.unit}</span>
                  <Stepper value={qty} onChange={changeQty} label={`Количество: ${service.title}`} />
                </div>
              )}

              <p className="smodal__note">
                Раздел прайса: {service.section}.
                {hasFrom && ' Цена с пометкой «от» — минимальная, итоговую стоимость уточняйте у администратора.'}
              </p>

              <div className="smodal__actions">
                {selected ? (
                  <>
                    <Button onClick={toBooking}>Перейти к записи</Button>
                    <button type="button" className="smodal__remove" onClick={() => remove(service.id)}>
                      Убрать из заявки
                    </button>
                  </>
                ) : (
                  <Button onClick={() => add(service.id, { qty, variant })}>
                    Добавить в заявку · <PriceTag price={priceOf(service, vehicle, variant)} unit={service.unit} />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
