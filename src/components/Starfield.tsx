import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  a: number
  sp: number
  ph: number
  big: boolean
}

interface Shooter {
  x: number
  y: number
  vx: number
  vy: number
  speed: number
  len: number
  life: number
  ttl: number
}

interface StarfieldProps {
  className?: string
  /** Ярче и плотнее звёзды + больше «крупных» с ореолом. */
  bright?: boolean
  /** Периодические падающие звёзды (метеоры). */
  shootingStars?: boolean
}

/**
 * Лёгкий звёздный фон на canvas: мерцающие звёзды с очень медленным дрейфом.
 * Прозрачный (фон секции просвечивает), pointer-events-none, уважает reduced-motion.
 * Опционально: яркий режим и падающие звёзды.
 */
export default function Starfield({
  className = '',
  bright = false,
  shootingStars = false,
}: StarfieldProps) {
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

    // Детерминированный ГПСЧ (без Math.random на модульном уровне).
    let seed = 1337 >>> 0
    const rng = () => {
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    let W = 0
    let H = 0
    let stars: Star[] = []

    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      W = wrap.clientWidth || 1
      H = wrap.clientHeight || 1
      canvas.width = Math.max(1, Math.round(W * dpr))
      canvas.height = Math.max(1, Math.round(H * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed = 1337 >>> 0
      const count = Math.min(
        bright ? 440 : 260,
        Math.round((W * H) / (bright ? 4400 : 7000)),
      )
      stars = Array.from({ length: count }, () => {
        const big = rng() > (bright ? 0.86 : 0.94)
        return {
          x: rng() * W,
          y: rng() * H,
          r: big ? 1.3 + rng() * 1.1 : 0.4 + rng() * 1,
          a: (bright ? 0.4 : 0.25) + rng() * 0.7,
          sp: 0.4 + rng() * 1.8,
          ph: rng() * Math.PI * 2,
          big,
        }
      })
    }

    build()
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(build) : null
    ro?.observe(wrap)

    // ─── Падающие звёзды ───
    const shooters: Shooter[] = []
    let nextShotAt = 600 // мс до первого метеора

    const spawnShooter = () => {
      const angle = (18 + Math.random() * 24) * (Math.PI / 180) // 18–42° от горизонтали
      const speed = 480 + Math.random() * 380
      shooters.push({
        x: Math.random() * W * 0.9 - W * 0.1,
        y: Math.random() * H * 0.4 - 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        speed,
        len: 90 + Math.random() * 110,
        life: 0,
        ttl: 0.8 + Math.random() * 0.6,
      })
    }

    const drawShooters = (dt: number, elapsedMs: number) => {
      if (shootingStars && !reduce) {
        if (elapsedMs >= nextShotAt && shooters.length < 3) {
          spawnShooter()
          nextShotAt = elapsedMs + 1100 + Math.random() * 2600
        }
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.life += dt
        const a = Math.max(0, 1 - s.life / s.ttl)
        if (a <= 0 || s.x > W + s.len || s.y > H + s.len) {
          shooters.splice(i, 1)
          continue
        }
        const nx = s.vx / s.speed
        const ny = s.vy / s.speed
        const tailX = s.x - nx * s.len
        const tailY = s.y - ny * s.len
        // Хвост-градиент
        const g = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        g.addColorStop(0, `rgba(255,255,255,${(0.95 * a).toFixed(3)})`)
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = g
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()
        // Яркая головка с ореолом
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 7)
        hg.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`)
        hg.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = hg
        ctx.beginPath()
        ctx.arc(s.x, s.y, 7, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const brightBoost = bright ? 1.3 : 1

    const draw = (nowMs: number, dt: number) => {
      const t = nowMs * 0.001
      ctx.clearRect(0, 0, W, H)
      for (const s of stars) {
        const twinkle = reduce ? 1 : 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph))
        // очень медленный дрейф вниз (детерминированный от времени, без накопления)
        const y = reduce ? s.y : (s.y + t * 3 * (0.4 + s.sp * 0.3)) % (H + 4)
        const alpha = Math.min(1, s.a * twinkle * brightBoost)
        if (s.big && !reduce) {
          const g = ctx.createRadialGradient(s.x, y, 0, s.x, y, s.r * 4)
          g.addColorStop(0, `rgba(255,255,255,${(alpha * (bright ? 0.7 : 0.5)).toFixed(3)})`)
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(s.x, y, s.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
        ctx.fill()
      }
      drawShooters(dt, nowMs)
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
    if (reduce) draw(0, 0)
    else raf = requestAnimationFrame(loop)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro?.disconnect()
    }
  }, [bright, shootingStars])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
