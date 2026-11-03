import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { CONTACTS, NAV } from '../data/content'
import { lockScroll, unlockScroll } from '../lib/scroll'
import Button from './ui/Button'
import { EASE } from './ui/motion'
import './Header.css'

function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const SECTION_IDS = NAV.map((n) => n.href.slice(1))

export function Logo({ className = '' }) {
  return (
    <a href="#" className={`logo ${className}`} aria-label="NOVA AUTO — наверх">
      <span className="logo__main">NOVA</span>
      <span className="logo__sub">AUTO</span>
    </a>
  )
}

export default function Header({ ready }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 36, restDelta: 0.001 })

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    if (Math.abs(y - prev) > 4) setHidden(y > prev && y > 320)
  })

  useEffect(() => {
    if (!menuOpen) return
    lockScroll()
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      unlockScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const showHeader = ready && (!hidden || menuOpen)

  return (
    <>
      <motion.header
        className={`header${scrolled && !menuOpen ? ' header--solid' : ''}`}
        initial={{ y: '-100%' }}
        animate={{ y: showHeader ? '0%' : '-100%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="header__inner container">
          <Logo />

          <nav className="header__nav" aria-label="Основная навигация">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`header__link${active === item.href.slice(1) ? ' is-active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <a href={CONTACTS.phoneHref} className="header__phone mono">{CONTACTS.phone}</a>
            <Button href="#booking" className="header__cta" arrow={false}>Записаться</Button>
            <button
              type="button"
              className={`burger${menuOpen ? ' is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <motion.div className="header__progress" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileMenu active={active} onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
}

const itemVariants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
}

function MobileMenu({ active, onClose }) {
  return (
    <motion.div
      id="mobile-menu"
      className="mmenu"
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="mmenu__inner container">
        <motion.ul className="mmenu__list" variants={listVariants} initial="hidden" animate="show">
          {NAV.map((item, i) => (
            <li key={item.href} className="mmenu__item">
              <motion.a
                href={item.href}
                variants={itemVariants}
                className={`mmenu__link${active === item.href.slice(1) ? ' is-active' : ''}`}
                onClick={onClose}
              >
                <span className="mmenu__num mono">0{i + 1}</span>
                {item.label}
              </motion.a>
            </li>
          ))}
        </motion.ul>

        <motion.div
          className="mmenu__footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
        >
          <div className="mmenu__contacts">
            <a href={CONTACTS.phoneHref} className="mmenu__phone">{CONTACTS.phone}</a>
            <span className="mono">{CONTACTS.hoursShort}</span>
            <span className="mono">{CONTACTS.address}</span>
          </div>
          <Button href="#booking" onClick={onClose} className="mmenu__cta">Записаться</Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
