/** Пиксельное «цифровое» сердце — фирменный акцент рядом с логотипом Habibi. */
export default function DigitalHeart({ className = '' }: { className?: string }) {
  // Классическое 8-битное сердце на сетке 7×6.
  const cells: Array<[number, number]> = [
    [1, 0], [2, 0], [4, 0], [5, 0],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4],
    [3, 5],
  ]

  return (
    <svg viewBox="0 0 7 6" className={className} aria-hidden="true">
      {cells.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x + 0.07}
          y={y + 0.07}
          width={0.86}
          height={0.86}
          rx={0.18}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}
