/**
 * Кастомные анимированные иконки для блока «Возможности».
 * Каждая иконка передаёт смысл пункта. Анимации — в index.css (классы bi-*),
 * с уважением к prefers-reduced-motion.
 */

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-5 w-5',
}

/** Прозрачность — глаз, который «осматривает» и моргает. */
export function TransparencyIcon() {
  return (
    <svg {...svgProps}>
      <g className="bi-blink">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" className="bi-look" />
      </g>
    </svg>
  )
}

/** Рост показателей — растущий график с рисующейся линией и стрелкой. */
export function GrowthIcon() {
  return (
    <svg {...svgProps}>
      {/* столбцы-подложка */}
      <rect x="3" y="15" width="2.6" height="6" rx="1" fill="currentColor" stroke="none" opacity="0.25" />
      <rect x="10.7" y="11" width="2.6" height="10" rx="1" fill="currentColor" stroke="none" opacity="0.2" />
      <rect x="18.4" y="7" width="2.6" height="14" rx="1" fill="currentColor" stroke="none" opacity="0.15" />
      {/* трендовая линия, которая «рисуется» */}
      <polyline points="3,16 9,11 13,13 21,5" className="bi-draw" />
      {/* наконечник стрелки */}
      <polyline points="16,5 21,5 21,10" />
    </svg>
  )
}

/** Лояльность клиентов — бьющееся сердце с расходящимся пульсом. */
export function LoyaltyIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" className="bi-pulsering" strokeWidth="1" />
      <path
        d="M12 20.5s-7.2-4.1-7.2-9.1A4.1 4.1 0 0 1 12 8.3a4.1 4.1 0 0 1 7.2 3.1c0 5-7.2 9.1-7.2 9.1Z"
        fill="currentColor"
        stroke="none"
        className="bi-beat"
      />
    </svg>
  )
}

/** Свободное время — часы с идущими стрелками. */
export function FreeTimeIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="12" x2="12" y2="7" className="bi-hand-hour" />
      <line x1="12" y1="12" x2="15.5" y2="12" className="bi-hand-min" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
