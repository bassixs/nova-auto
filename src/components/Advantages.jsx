import { ADVANTAGES } from '../data/content'
import { Hairline, MaskText, Reveal } from './ui/motion'
import './Advantages.css'

export default function Advantages() {
  return (
    <section className="adv section" id="advantages">
      <div className="container adv__grid">
        <div className="adv__intro">
          <Reveal className="eyebrow adv__label" y={12}>
            <span className="adv__index">01</span>
            <span className="adv__rule" />
            Преимущества
          </Reveal>
          <MaskText text={'БОЛЬШЕ,\nЧЕМ ПРОСТО\nЧИСТОТА'} className="h-section" />
          <Reveal as="p" className="lead adv__lead" delay={0.2}>
            Мы относимся к автомобилю как к объекту дизайна: каждая поверхность требует своего
            материала, инструмента и времени.
          </Reveal>
        </div>

        <ol className="adv__list">
          {ADVANTAGES.map((item, i) => (
            <li className="adv__item" key={item.title}>
              <Hairline delay={i * 0.08} />
              <Reveal className="adv__row" delay={0.1 + i * 0.08}>
                <span className="adv__num mono">0{i + 1}</span>
                <h3 className="adv__title">{item.title}</h3>
                <p className="adv__text">{item.text}</p>
              </Reveal>
            </li>
          ))}
          <Hairline delay={0.4} />
        </ol>
      </div>
    </section>
  )
}
