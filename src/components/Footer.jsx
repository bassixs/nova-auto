import { motion } from 'framer-motion'
import { CONTACTS, NAV } from '../data/content'
import { Logo } from './Header'
import Button from './ui/Button'
import { EASE, MaskText, Reveal } from './ui/motion'
import './Footer.css'

const SOCIALS = ['Telegram', 'WhatsApp', 'VK']

export default function Footer() {
  return (
    <footer className="ft">
      <div className="container">
        <div className="ft__cta">
          <MaskText text={'ГОТОВЫ ВЕРНУТЬ\nАВТОМОБИЛЮ БЛЕСК?'} as="p" className="h-section ft__cta-title" />
          <Reveal delay={0.2}>
            <Button href="#booking">Записаться</Button>
          </Reveal>
        </div>

        <div className="ft__cols">
          <div className="ft__brand">
            <Logo />
            <p className="ft__tagline">Premium Car Care &amp; Detailing Studio</p>
          </div>

          <nav className="ft__col" aria-label="Навигация в подвале">
            <span className="mono ft__col-title">Навигация</span>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="ft__link">{n.label}</a>
            ))}
          </nav>

          <div className="ft__col">
            <span className="mono ft__col-title">Контакты</span>
            <span className="ft__text">{CONTACTS.address}</span>
            <a href={CONTACTS.phoneHref} className="ft__link">{CONTACTS.phone}</a>
            <span className="ft__text">{CONTACTS.hoursShort}</span>
          </div>

          <div className="ft__col">
            <span className="mono ft__col-title">Соцсети</span>
            <ul className="ft__socials">
              {SOCIALS.map((s) => (
                <li key={s} className="ft__social">{s}</li>
              ))}
            </ul>
            <span className="ft__hint">Ссылки подключаются при запуске проекта</span>
          </div>
        </div>
      </div>

      <div className="ft__word" aria-hidden="true">
        <motion.span
          className="metal-text"
          initial={{ y: '60%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -5% 0px' }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          NOVA AUTO
        </motion.span>
      </div>

      <div className="container ft__bottom">
        <span>© {new Date().getFullYear()} NOVA AUTO · Демонстрационный проект</span>
        <span>Разработка — NOVA lab</span>
        <a href="#" className="ft__top mono">Наверх ↑</a>
      </div>
    </footer>
  )
}
