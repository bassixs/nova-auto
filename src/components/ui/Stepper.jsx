import { Minus, Plus } from './Icons'
import './Stepper.css'

export default function Stepper({ value, onChange, min = 1, max = 20, label }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Меньше">
        <Minus />
      </button>
      <output className="stepper__value" aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Больше">
        <Plus />
      </button>
    </div>
  )
}
