import { ArrowRight } from './Icons'
import './Button.css'

export default function Button({ href, variant = 'primary', arrow = true, children, className = '', ...rest }) {
  const cls = `btn btn--${variant} ${className}`
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {arrow && (
        <span className="btn__arrow" aria-hidden="true">
          <ArrowRight />
          <ArrowRight />
        </span>
      )}
    </>
  )
  if (href) {
    return <a href={href} className={cls} {...rest}>{content}</a>
  }
  return <button type="button" className={cls} {...rest}>{content}</button>
}
