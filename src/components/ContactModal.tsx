import { useEffect, useMemo, useState } from 'react'
import { X, Check, Mail, User, Phone, MessageCircle } from 'lucide-react'
import { LiquidButton } from './ui/liquid-glass-button'
import { buildWhatsAppLink, PHONE_DISPLAY } from '../lib/contacts'

interface ContactModalProps {
  open: boolean
  onClose: () => void
  /** Название выбранного тарифа — показываем в шапке формы. */
  tierName?: string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactModal({ open, onClose, tierName }: ContactModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Сброс формы при каждом открытии + Esc + блокировка прокрутки фона.
  useEffect(() => {
    if (!open) return
    setName('')
    setPhone('')
    setEmail('')
    setSubmitted(false)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  // Email необязателен, но если введён — должен быть корректным.
  const valid = name.trim().length > 1 && phone.trim().length > 4 && (!email.trim() || EMAIL_RE.test(email))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    const lines = [
      'Здравствуйте! Заявка с сайта Habibi.',
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
    ]
    if (email.trim()) lines.push(`Email: ${email.trim()}`)
    if (tierName) lines.push(`Тариф: ${tierName}`)
    // Открываем чат синхронно по клику — иначе блокировщик всплывающих окон срежет вкладку.
    window.open(buildWhatsAppLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md [animation:fadeSlideUp_0.25s_ease_both]"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#0a0a0a]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          /* ─── Форма ─── */
          <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold tracking-tight text-white">Оставьте заявку</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {tierName ? (
                <>
                  Тариф{' '}
                  <span className="font-medium text-white">{tierName}</span>. Заполните контакты — и
                  мы свяжемся с вами.
                </>
              ) : (
                'Заполните контакты — и мы свяжемся с вами.'
              )}
            </p>

            {/* Имя */}
            <label className="mt-6 block">
              <span className="mb-1.5 block text-sm font-medium text-white/70">
                Имя <span className="text-red-400">*</span>
              </span>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 focus-within:border-white/30">
                <User size={16} className="shrink-0 text-white/40" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </label>

            {/* Телефон */}
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-white/70">
                Номер WhatsApp <span className="text-red-400">*</span>
              </span>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 focus-within:border-white/30">
                <Phone size={16} className="shrink-0 text-white/40" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 5X XXX XX XX"
                  inputMode="tel"
                  className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </label>

            {/* Email */}
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-white/70">
                Email <span className="text-white/35">(необязательно)</span>
              </span>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 focus-within:border-white/30">
                <Mail size={16} className="shrink-0 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={!valid}
              className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 ${
                valid
                  ? 'bg-[#22c55e] text-white hover:scale-[1.02]'
                  : 'cursor-not-allowed bg-white/15 text-white/40'
              }`}
            >
              <MessageCircle size={17} />
              Отправить в WhatsApp
            </button>
            <p className="mt-3 text-center text-xs text-white/35">
              Нажимая кнопку, вы соглашаетесь на обработку контактных данных.
            </p>
          </form>
        ) : (
          /* ─── Успех ─── */
          <div className="py-4 text-center [animation:fadeSlideUp_0.4s_ease_both]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-black">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">Заявка принята!</h3>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Мы открыли чат в WhatsApp — отправьте сообщение, и мы ответим в ближайшее время.
              Если вкладка не открылась, напишите нам сами:{' '}
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline underline-offset-4"
              >
                {PHONE_DISPLAY}
              </a>
              .
            </p>
            <LiquidButton
              size="lg"
              onClick={onClose}
              className="mt-7 w-full justify-center rounded-full text-white"
            >
              Отлично
            </LiquidButton>
          </div>
        )}
      </div>

      {submitted && <Balloons />}
    </div>
  )
}

/* ─── Воздушные шары ─── */

const BALLOON_COLORS = [
  '#f472b6',
  '#60a5fa',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#f87171',
  '#22d3ee',
  '#fb923c',
]

function Balloons() {
  const balloons = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const w = 26 + Math.round(Math.random() * 22)
        return {
          id: i,
          left: Math.round(Math.random() * 100),
          color: BALLOON_COLORS[i % BALLOON_COLORS.length],
          w,
          rise: 7 + Math.random() * 4,
          delay: Math.random() * 1.8,
          sway: 1.8 + Math.random() * 1.8,
        }
      }),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon-rise absolute"
          style={{
            left: `${b.left}%`,
            animationDuration: `${b.rise}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div className="balloon-sway" style={{ animationDuration: `${b.sway}s` }}>
            <span
              className="balloon-body block"
              style={{ ['--c' as string]: b.color, width: `${b.w}px`, height: `${Math.round(b.w * 1.2)}px` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
