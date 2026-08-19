import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface RevealProps {
  children: ReactNode
  /** Задержка анимации в секундах (для ступенчатого появления). */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li'
}

/**
 * Оборачивает контент и запускает анимацию fadeSlideUp, когда блок попадает
 * в область видимости при скролле.
 */
export function Reveal({ children, delay = 0, className = '', as = 'div' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const Tag = as

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ animationDelay: inView ? `${delay}s` : undefined }}
    >
      {children}
    </Tag>
  )
}
