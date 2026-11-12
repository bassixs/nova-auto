import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MARQUEE_WORDS } from '../data/content'
import './Marquee.css'

function Row() {
  return (
    <div className="marquee__row">
      {MARQUEE_WORDS.map((w, i) => (
        <span key={w} className={`marquee__word${i % 2 === 0 ? ' marquee__word--outline' : ''}`}>
          {w}
          <span className="marquee__sep" />
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  const ref = useRef(null)
  // The band drifts on its own and is additionally pushed sideways by scrolling
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])

  return (
    <div className="marquee" aria-hidden="true" ref={ref}>
      <motion.div className="marquee__shift" style={{ x }}>
        <div className="marquee__track">
          <Row />
          <Row />
        </div>
      </motion.div>
    </div>
  )
}
