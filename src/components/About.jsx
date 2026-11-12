import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { LOCATIONS } from '../data/business'
import { ABOUT_PHOTO, ABOUT_STATEMENT, BOOKING_STEPS } from '../data/content'
import { SERVICES, VEHICLE_CATEGORIES, pluralize } from '../data/services'
import Img from './ui/Img'
import SectionHead from './ui/SectionHead'
import { Hairline, Reveal } from './ui/motion'
import './About.css'

// Цифры считаются из данных сайта, а не вписаны вручную
const FACTS = [
  { value: LOCATIONS.length, label: `${pluralize(LOCATIONS.length, ['локация', 'локации', 'локаций'])} в Калуге` },
  { value: SERVICES.length, label: `${pluralize(SERVICES.length, ['услуга', 'услуги', 'услуг'])} в прайсе` },
  {
    value: VEHICLE_CATEGORIES.length,
    label: `${pluralize(VEHICLE_CATEGORIES.length, ['категория', 'категории', 'категорий'])} автомобилей`,
  },
]

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span className="about__word" style={{ opacity }}>
      {children}{' '}
    </motion.span>
  )
}

/* Statement that "lights up" word by word as it scrolls into view */
function ScrollStatement({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className="about__statement">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  )
}

export default function About() {
  const mediaRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'center center'] })
  const clipPath = useTransform(scrollYProgress, [0, 1], ['inset(16% 12% 16% 12%)', 'inset(0% 0% 0% 0%)'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1])

  return (
    <section className="about section" id="about">
      <div className="container">
        <SectionHead index="04" label="О нас" title={'ЧИСТОТА,\nКОТОРУЮ ВИДНО'} />
      </div>

      <div className="about__media" ref={mediaRef}>
        <motion.div className="about__media-clip" style={{ clipPath }}>
          <motion.div className="about__media-zoom" style={{ scale }}>
            <Img id={ABOUT_PHOTO.id} alt={ABOUT_PHOTO.alt} sizes="100vw" />
          </motion.div>
        </motion.div>
      </div>

      <div className="container about__body">
        <ScrollStatement text={ABOUT_STATEMENT} />

        <ul className="about__facts">
          {FACTS.map((fact, i) => (
            <Reveal as="li" key={fact.label} className="about__fact" delay={i * 0.1}>
              <span className="about__fact-value metal-text">{fact.value}</span>
              <span className="about__fact-label">{fact.label}</span>
            </Reveal>
          ))}
        </ul>

        <div className="about__visit">
          <Reveal className="eyebrow about__visit-label" y={12}>Как записаться</Reveal>
          <ol className="about__steps">
            {BOOKING_STEPS.map((step, i) => (
              <li key={step.title} className="about__step">
                <Hairline delay={i * 0.1} />
                <Reveal delay={0.1 + i * 0.1} y={20}>
                  <span className="about__step-num">0{i + 1}</span>
                  <h3 className="about__step-title">{step.title}</h3>
                  <p className="about__step-text">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
