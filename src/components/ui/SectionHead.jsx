import { MaskText, Reveal } from './motion'
import './SectionHead.css'

export default function SectionHead({ index, label, title, aside, className = '' }) {
  return (
    <header className={`shead ${className}`}>
      <Reveal className="shead__label eyebrow" y={12}>
        <span className="shead__index">{index}</span>
        <span className="shead__rule" />
        <span>{label}</span>
      </Reveal>
      <div className="shead__row">
        <MaskText text={title} className="h-section shead__title" />
        {aside && (
          <Reveal className="shead__aside lead" delay={0.2}>
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  )
}
