import { motion } from 'framer-motion'
import { VEHICLE_CATEGORIES } from '../../data/services'
import { EASE } from './motion'
import './VehiclePicker.css'

/** Выбор категории автомобиля. value может быть null, пока посетитель не сделал выбор. */
export default function VehiclePicker({ value, onChange, layoutId, compact = false, invalid = false, labelledBy }) {
  return (
    <div
      className={`vpick${compact ? ' vpick--compact' : ''}${invalid ? ' has-error' : ''}`}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-invalid={invalid || undefined}
    >
      {VEHICLE_CATEGORIES.map((v) => {
        const active = v.id === value
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`vpick__item${active ? ' is-active' : ''}`}
            onClick={() => onChange(v.id)}
          >
            {active && (
              <motion.span className="vpick__active" layoutId={layoutId} transition={{ duration: 0.55, ease: EASE }} />
            )}
            <span className="vpick__label mono">{v.label}</span>
            <span className="vpick__title">{v.title}</span>
            {v.hint !== v.title && <span className="vpick__hint">{v.hint}</span>}
          </button>
        )
      })}
    </div>
  )
}
