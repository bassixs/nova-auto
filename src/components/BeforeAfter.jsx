import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { PHOTOS } from '../lib/images'
import Img from './ui/Img'
import { ArrowLeft, ArrowRight } from './ui/Icons'
import './BeforeAfter.css'

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/* Concentric micro-scratches ("swirl marks") that a machine polish removes */
function Swirls() {
  const arcs = useMemo(() => {
    const rnd = seeded(7)
    const centers = [[90, 80], [300, 120], [210, 230], [360, 260], [40, 250]]
    return centers.flatMap(([cx, cy]) =>
      Array.from({ length: 18 }, (_, i) => {
        const r = 6 + i * 7 + rnd() * 4
        const len = 2 * Math.PI * r
        const dash = len * (0.04 + rnd() * 0.14)
        return { cx, cy, r, dash, gap: len - dash, rot: rnd() * 360 }
      })
    )
  }, [])

  return (
    <svg className="ba__swirls" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {arcs.map((a, i) => (
        <circle
          key={i}
          cx={a.cx}
          cy={a.cy}
          r={a.r}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.3"
          strokeDasharray={`${a.dash} ${a.gap}`}
          transform={`rotate(${a.rot} ${a.cx} ${a.cy})`}
        />
      ))}
    </svg>
  )
}

export default function BeforeAfter() {
  const ref = useRef(null)
  const dragging = useRef(false)
  const pos = useMotionValue(50)
  const [value, setValue] = useState(50)
  const clip = useTransform(pos, (v) => `inset(0% ${100 - v}% 0% 0%)`)
  const left = useTransform(pos, (v) => `${v}%`)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useMotionValueEvent(pos, 'change', (v) => setValue(Math.round(v)))

  useEffect(() => {
    if (!inView) return
    const controls = animate(pos, [50, 24, 74, 50], { duration: 2.8, ease: 'easeInOut', times: [0, 0.32, 0.72, 1], delay: 0.4 })
    return () => controls.stop()
  }, [inView, pos])

  const setFromEvent = (e) => {
    const r = ref.current.getBoundingClientRect()
    pos.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)))
  }

  const onPointerDown = (e) => {
    dragging.current = true
    pos.stop()
    ref.current.setPointerCapture(e.pointerId)
    setFromEvent(e)
  }

  const onPointerMove = (e) => dragging.current && setFromEvent(e)
  const endDrag = () => {
    dragging.current = false
  }

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft') pos.set(Math.max(0, pos.get() - step))
    else if (e.key === 'ArrowRight') pos.set(Math.min(100, pos.get() + step))
    else return
    e.preventDefault()
  }

  return (
    <figure className="ba">
      <div
        ref={ref}
        className="ba__frame"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <Img id={PHOTOS.porscheRear} alt="После полировки: глубокий блеск и чистые отражения" className="ba__img" sizes="(min-width: 1440px) 1312px, 100vw" />
        <motion.div className="ba__before" style={{ clipPath: clip }}>
          <Img id={PHOTOS.porscheRear} alt="" className="ba__img ba__img--dull" sizes="(min-width: 1440px) 1312px, 100vw" />
          <Swirls />
          <div className="ba__haze" />
        </motion.div>

        <span className="ba__tag ba__tag--before mono">До</span>
        <span className="ba__tag ba__tag--after mono">После</span>

        <motion.div
          className="ba__handle"
          style={{ left }}
          role="slider"
          tabIndex={0}
          aria-label="Сравнение до и после полировки"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          onKeyDown={onKeyDown}
        >
          <span className="ba__knob">
            <ArrowLeft />
            <ArrowRight />
          </span>
        </motion.div>
      </div>
      <figcaption className="ba__caption">
        <span className="mono">Полировка кузова</span>
        <span>Потяните ползунок. Визуализация эффекта — демонстрационная, не реальный кейс.</span>
      </figcaption>
    </figure>
  )
}
