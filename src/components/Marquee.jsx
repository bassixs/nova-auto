import './Marquee.css'

const WORDS = ['Precision', 'Детейлинг', 'Care', 'Полировка', 'Perfection', 'Керамика', 'Химчистка']

function Row() {
  return (
    <div className="marquee__row">
      {WORDS.map((w, i) => (
        <span key={w} className={`marquee__word${i % 2 === 0 ? ' marquee__word--outline' : ''}`}>
          {w}
          <span className="marquee__sep" />
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <Row />
        <Row />
      </div>
    </div>
  )
}
