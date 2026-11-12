import { LOCATIONS, yandexReviewsUrl } from '../data/business'
import { pluralize } from '../data/services'
import Button from './ui/Button'
import SectionHead from './ui/SectionHead'
import { ArrowUpRight, Star } from './ui/Icons'
import { Reveal } from './ui/motion'
import './Reviews.css'

// Отзывы не копируются на сайт: показываем только данные конкретной локации и ведём на Яндекс Карты.
function ReviewCard({ loc, index }) {
  const { rating } = loc
  const url = yandexReviewsUrl(loc)

  return (
    <Reveal as="article" className={`rcard${rating ? ' rcard--rated' : ''}`} delay={index * 0.12} y={40}>
      <header className="rcard__head">
        <span className="mono">Локация {loc.index}</span>
        <h3 className="rcard__title">{loc.street}</h3>
      </header>

      {rating ? (
        <div className="rcard__rating">
          <span className="rcard__value metal-text">{rating.value}</span>
          <div className="rcard__meta">
            <span className="rcard__stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} />)}
            </span>
            <span>
              Рейтинг на Яндекс Картах · {rating.votes} {pluralize(rating.votes, ['оценка', 'оценки', 'оценок'])},{' '}
              {rating.reviews} {pluralize(rating.reviews, ['отзыв', 'отзыва', 'отзывов'])}
            </span>
            {rating.award && <span className="tag rcard__award">{rating.award} · Яндекс Карты</span>}
          </div>
        </div>
      ) : (
        <p className="rcard__text">
          Новая точка DARK VISION. Были у нас — расскажите, как всё прошло: ваш отзыв поможет другим автовладельцам.
        </p>
      )}

      <div className="rcard__actions">
        <Button href={url} target="_blank" rel="noopener noreferrer" variant={rating ? 'primary' : 'ghost'} arrow={false}>
          <span className="rcard__btn-inner">
            {rating ? 'Читать отзывы' : 'Оставить отзыв'} <ArrowUpRight />
          </span>
        </Button>
        {rating && <span className="rcard__asof">Данные на {rating.asOf}</span>}
      </div>
    </Reveal>
  )
}

export default function Reviews() {
  return (
    <section className="rev section" id="reviews">
      <div className="container">
        <SectionHead
          index="06"
          label="Отзывы"
          title={'ОТЗЫВЫ —\nНА ЯНДЕКС КАРТАХ'}
          aside="Мы не переписываем отзывы на сайт. Читайте их там, где их оставили клиенты, — без редактуры."
        />

        <div className="rev__grid">
          {LOCATIONS.map((loc, i) => (
            <ReviewCard key={loc.id} loc={loc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
