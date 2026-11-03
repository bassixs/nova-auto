import { motion } from 'framer-motion'
import { GALLERY } from '../data/content'
import BeforeAfter from './BeforeAfter'
import Img from './ui/Img'
import SectionHead from './ui/SectionHead'
import { Expand } from './ui/Icons'
import { EASE } from './ui/motion'
import './Gallery.css'

export default function Gallery({ onOpen }) {
  return (
    <section className="gal section" id="gallery">
      <div className="container">
        <SectionHead
          index="04"
          label="Работы"
          title={'РЕЗУЛЬТАТ ГОВОРИТ\nСАМ ЗА СЕБЯ'}
          aside="Глубокий цвет, ровные отражения и чистые детали — то, ради чего к нам приезжают."
        />

        <BeforeAfter />

        <div className="gal__grid">
          {GALLERY.map((item, i) => (
            <motion.button
              type="button"
              key={item.id}
              className="gal__item"
              style={{ '--dc': item.d[0], '--dr': item.d[1], '--mc': item.m[0], '--mr': item.m[1] }}
              onClick={() => onOpen(i)}
              aria-label={`Открыть фото: ${item.title}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            >
              <motion.span
                className="gal__clip"
                variants={{ hidden: { clipPath: 'inset(100% 0% 0% 0%)' }, show: { clipPath: 'inset(0% 0% 0% 0%)' } }}
                transition={{ duration: 1.2, ease: EASE, delay: (i % 3) * 0.08 }}
              >
                <motion.span
                  className="gal__zoom"
                  variants={{ hidden: { scale: 1.3 }, show: { scale: 1 } }}
                  transition={{ duration: 1.6, ease: EASE, delay: (i % 3) * 0.08 }}
                >
                  <Img id={item.id} alt={item.title} sizes="(min-width: 640px) 50vw, 100vw" />
                </motion.span>
                <span className="gal__shade" />
                <span className="gal__caption">
                  <span className="mono">{item.tag}</span>
                  <span className="gal__title">{item.title}</span>
                </span>
                <span className="gal__expand" aria-hidden="true">
                  <Expand />
                </span>
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
