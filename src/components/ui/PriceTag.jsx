import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'
import { formatNumber } from '../../data/services'
import { EASE } from './motion'
import './PriceTag.css'

function AnimatedNumber({ value }) {
  const ref = useRef(null)
  const current = useRef(value)

  useEffect(() => {
    if (current.current === value) return
    const controls = animate(current.current, value, {
      duration: 0.7,
      ease: EASE,
      onUpdate: (v) => {
        current.current = v
        if (ref.current) ref.current.textContent = formatNumber(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [value])

  return <span ref={ref}>{formatNumber(value)}</span>
}

/** Цена с обязательной пометкой «от», если она есть в прайсе. */
export default function PriceTag({ price, unit, className = '' }) {
  return (
    <span className={`ptag ${className}`}>
      {price.from && <span className="ptag__from">от</span>}
      <AnimatedNumber value={price.value} />
      <span className="ptag__cur">₽{unit ? `/${unit}` : ''}</span>
    </span>
  )
}
