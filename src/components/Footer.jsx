import { CONTACT, LOCATIONS, SITE, telHref } from '../data/business'
import { NAV } from '../data/content'
import Button from './ui/Button'
import { LogoMark } from './ui/Logo'
import { MaskText, Reveal } from './ui/motion'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="ft">
      <div className="container">
        <div className="ft__cta">
          <div>
            <MaskText text={'ЧИСТЫЙ АВТОМОБИЛЬ\nНАЧИНАЕТСЯ С ЗАЯВКИ'} as="p" className="h-section ft__cta-title" />
            <Reveal delay={0.2} className="ft__cta-action">
              <Button href="#booking">Записаться</Button>
            </Reveal>
          </div>
          <Reveal className="ft__logo" y={0} duration={1.6}>
            <LogoMark sizes="(min-width: 1024px) 420px, 70vw" />
          </Reveal>
        </div>

        <div className="ft__cols">
          <nav className="ft__col" aria-label="Навигация в подвале">
            <span className="mono ft__col-title">Навигация</span>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="ft__link">{n.label}</a>
            ))}
            <a href="#booking" className="ft__link">Запись</a>
          </nav>

          {LOCATIONS.map((loc) => (
            <div className="ft__col" key={loc.id}>
              <span className="mono ft__col-title">Локация {loc.index}</span>
              <span className="ft__text">{loc.address}</span>
              {loc.hours && <span className="ft__text">{loc.hours.label}</span>}
              {loc.phone && <a href={telHref(loc.phone)} className="ft__link">{loc.phone}</a>}
            </div>
          ))}

          {CONTACT.socials.length > 0 && (
            <div className="ft__col">
              <span className="mono ft__col-title">Мы в сети</span>
              {CONTACT.socials.map((s) => (
                <a key={s.id} href={s.url} className="ft__link" target="_blank" rel="noopener noreferrer">{s.label}</a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container ft__bottom">
        <span>© {new Date().getFullYear()} {SITE.name}. Автомойка и детейлинг в Калуге</span>
        <a href={`${import.meta.env.BASE_URL}privacy.html`} className="ft__link">Политика обработки персональных данных</a>
        <a href="#" className="ft__top mono">Наверх ↑</a>
      </div>
    </footer>
  )
}
