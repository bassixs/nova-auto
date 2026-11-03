import { motion } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1]

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' }

export function Reveal({ as = 'div', delay = 0, y = 28, duration = 1, children, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

const lineVariants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.1, ease: EASE } },
}

/** Headline revealed line by line from behind a mask. Lines are separated by "\n". */
export function MaskText({ text, as = 'h2', className, delay = 0, stagger = 0.09, play, lineClassName }) {
  const Tag = motion[as]
  const lines = text.split('\n')
  const trigger = play === undefined
    ? { initial: 'hidden', whileInView: 'show', viewport: VIEWPORT }
    : { initial: 'hidden', animate: play ? 'show' : 'hidden' }

  return (
    <Tag
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...trigger}
    >
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, i) => (
        <span className="mask-line" aria-hidden="true" key={i}>
          <motion.span
            className={`mask-line__inner${lineClassName?.(i) ? ' ' + lineClassName(i) : ''}`}
            variants={lineVariants}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function Hairline({ delay = 0, className = '' }) {
  return (
    <motion.div
      className={`hairline ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  )
}
