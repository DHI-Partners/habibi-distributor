import { useEffect, useRef } from 'react'

interface Butterfly {
  x: number
  y: number
  /** Базовая скорость по горизонтали, px/с (знак задаёт направление полёта). */
  vx: number
  /** Базовый снос по вертикали, px/с. */
  vy: number
  /** Полуразмах крыла, px. */
  size: number
  alpha: number
  /** Скорость взмаха, рад/с. */
  flap: number
  phase: number
  /** Амплитуда и скорость покачивания траектории. */
  bob: number
  bobSpeed: number
  hue: number
}

interface ButterfliesProps {
  className?: string
  /** Плотнее и чуть заметнее — для крупных экранов или акцентных секций. */
  dense?: boolean
}

/**
 * Бабочки, порхающие на фоне: canvas поверх фона секции, прозрачный,
 * pointer-events-none, уважает prefers-reduced-motion (тогда просто застывшие силуэты).
 */
export default function Butterflies({ className = '', dense = false }: ButterfliesProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Детерминированный ГПСЧ: расстановка не прыгает между перерисовками.
    let seed = 20260813 >>> 0
    const rng = () => {
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    let W = 0
    let H = 0
    let flock: Butterfly[] = []

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      W = wrap.clientWidth || 1
      H = wrap.clientHeight || 1
      canvas.width = Math.max(1, Math.round(W * dpr))
      canvas.height = Math.max(1, Math.round(H * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed = 20260813 >>> 0
      const count = Math.min(dense ? 8 : 5, Math.max(3, Math.round((W * H) / 180000)))
      flock = Array.from({ length: count }, () => {
        const dir = rng() > 0.5 ? 1 : -1
        const size = 6 + rng() * 8
        return {
          x: rng() * W,
          y: rng() * H,
          vx: dir * (10 + rng() * 26),
          vy: -6 - rng() * 10,
          size,
          // мелкие — бледнее, будто дальше от зрителя
          alpha: 0.18 + (size / 14) * 0.22 + rng() * 0.08,
          flap: 5 + rng() * 5,
          phase: rng() * Math.PI * 2,
          bob: 14 + rng() * 26,
          bobSpeed: 0.4 + rng() * 0.7,
          hue: rng(),
        }
      })
    }

    build()

    /** Одно крыло: верхняя доля крупнее нижней, обе — скруглённые эллипсы. */
    const drawWing = (b: Butterfly, side: 1 | -1, open: number) => {
      const s = b.size
      ctx.save()
      // Взмах = сжатие крыла по горизонтали; сторона задаёт зеркальность.
      ctx.scale(side * open, 1)
      const grad = ctx.createLinearGradient(0, -s * 0.7, s, s * 0.6)
      const warm = 0.5 + b.hue * 0.5
      grad.addColorStop(0, `rgba(255,255,255,${(0.95).toFixed(2)})`)
      grad.addColorStop(1, `rgba(${Math.round(210 + warm * 45)},${Math.round(220 + warm * 30)},255,0.35)`)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(s * 0.52, -s * 0.34, s * 0.56, s * 0.4, -0.42, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(s * 0.4, s * 0.3, s * 0.4, s * 0.29, 0.42, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawButterfly = (b: Butterfly, t: number) => {
      const flapPhase = reduce ? 0.7 : Math.sin(t * b.flap + b.phase)
      // Крылья почти не складываются полностью — иначе бабочка «исчезает».
      const open = 0.32 + 0.68 * Math.abs(flapPhase)
      // Вертикальное покачивание + наклон по направлению движения.
      const bobY = reduce ? 0 : Math.sin(t * b.bobSpeed + b.phase) * b.bob
      const tilt = reduce ? 0 : Math.sin(t * b.bobSpeed + b.phase) * 0.28

      ctx.save()
      ctx.translate(b.x, b.y + bobY)
      ctx.rotate(tilt + (b.vx < 0 ? 0.12 : -0.12))
      ctx.globalAlpha = b.alpha

      drawWing(b, -1, open)
      drawWing(b, 1, open)

      // Тельце — тонкая капля между крыльями.
      ctx.fillStyle = 'rgba(255,255,255,0.75)'
      ctx.beginPath()
      ctx.ellipse(0, 0, b.size * 0.08, b.size * 0.42, 0, 0, Math.PI * 2)
      ctx.fill()

      // Усики: без них силуэт читается скорее как цветок, чем как бабочка.
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'
      ctx.lineWidth = Math.max(0.5, b.size * 0.03)
      ctx.beginPath()
      ctx.moveTo(0, -b.size * 0.35)
      ctx.quadraticCurveTo(b.size * 0.2, -b.size * 0.62, b.size * 0.34, -b.size * 0.66)
      ctx.moveTo(0, -b.size * 0.35)
      ctx.quadraticCurveTo(-b.size * 0.2, -b.size * 0.62, -b.size * 0.34, -b.size * 0.66)
      ctx.stroke()

      ctx.restore()
    }

    const draw = (nowMs: number, dt: number) => {
      const t = nowMs * 0.001
      ctx.clearRect(0, 0, W, H)
      for (const b of flock) {
        if (!reduce) {
          b.x += b.vx * dt
          b.y += b.vy * dt
          // Перелёт через край: бабочка возвращается с противоположной стороны.
          const m = b.size * 3
          if (b.x < -m) b.x = W + m
          if (b.x > W + m) b.x = -m
          if (b.y < -m) b.y = H + m
          if (b.y > H + m) b.y = -m
        }
        drawButterfly(b, t)
      }
    }

    let raf = 0
    let prev = 0
    const loop = (now: number) => {
      const nowS = now * 0.001
      const dt = prev ? Math.min(0.05, nowS - prev) : 0
      prev = nowS
      draw(now, dt)
      raf = requestAnimationFrame(loop)
    }
    // Первый кадр рисуем сразу: иначе до первого тика rAF фон пустой
    // (например, когда вкладку открыли в фоне или окно ещё не получило размер).
    draw(0, 0)
    if (!reduce) raf = requestAnimationFrame(loop)

    // Пересборка при смене размера: с reduce-motion кадр рисуем здесь же,
    // иначе после ресайза холст остался бы пустым — rAF в этом режиме не идёт.
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            build()
            if (reduce) draw(0, 0)
          })
        : null
    ro?.observe(wrap)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro?.disconnect()
    }
  }, [dense])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
