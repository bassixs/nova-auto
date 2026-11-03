import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue } from 'framer-motion'
import { REVIEWS } from '../data/content'
import SectionHead from './ui/SectionHead'
import { ArrowLeft, ArrowRight } from './ui/Icons'
import { EASE, Reveal } from './ui/motion'
import './Reviews.css'

const N = REVIEWS.length
const AUTOPLAY_S = 8

function Segment({ state, progress }) {
  return (
    <span className="rev__seg">
      <motion.span
        className="rev__seg-fill"
        style={{ scaleX: state === 'active' ? progress : state === 'done' ? 1 : 0 }}
      />
    </span>
  )
}

export default function Reviews() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const progress = useMotionValue(0)
  const controls = useRef(null)

  const go = useCallback((d) => {
    setDir(d)
    setIndex((i) => (i + d + N) % N)
  }, [])

  useEffect(() => {
    progress.set(0)
    controls.current = animate(progress, 1, { duration: AUTOPLAY_S, ease: 'linear', onComplete: () => go(1) })
    controls.current.pause()
    return () => controls.current?.stop()
  }, [index, go, progress])

  useEffect(() => {
    if (!controls.current) return
    if (inView && !paused) controls.current.play()
    else controls.current.pause()
  }, [inView, paused, index])

  const review = REVIEWS[index]

  return (
    <section className="rev section" id="reviews" ref={ref}>
      <div className="container">
        <SectionHead
          index="06"
          label="Отзывы"
          title="ДОВЕРИЕ В ДЕТАЛЯХ"
          aside={
            <span className="rev__demo">
              <span className="mono">Демо</span>
              Демонстрационные отзывы с условными именами — не реальные клиенты.
            </span>
          }
        />

        <Reveal
          className="rev__stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span className="rev__mark" aria-hidden="true">«</span>

          <div className="rev__viewport" aria-live="polite">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.blockquote
                key={index}
                className="rev__quote"
                custom={dir}
                initial={{ opacity: 0, x: dir * 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: dir * -40, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, { offset }) => {
                  if (offset.x < -60) go(1)
                  else if (offset.x > 60) go(-1)
                }}
              >
                <p className="rev__text">{review.text}</p>
                <footer className="rev__author">
                  <span className="rev__avatar" aria-hidden="true">{review.name[0]}</span>
                  <span>
                    <cite className="rev__name">{review.name}</cite>
                    <span className="rev__car mono">{review.car}</span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="rev__controls">
            <span className="mono rev__count">
              0{index + 1} <span>/ 0{N}</span>
            </span>
            <div className="rev__segs" aria-hidden="true">
              {REVIEWS.map((r, i) => (
                <Segment key={r.name} progress={progress} state={i === index ? 'active' : i < index ? 'done' : 'todo'} />
              ))}
            </div>
            <div className="rev__nav">
              <button type="button" className="rev__btn" onClick={() => go(-1)} aria-label="Предыдущий отзыв">
                <ArrowLeft />
              </button>
              <button type="button" className="rev__btn" onClick={() => go(1)} aria-label="Следующий отзыв">
                <ArrowRight />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
