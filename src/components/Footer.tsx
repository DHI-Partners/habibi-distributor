import { MessageCircle } from 'lucide-react'
import { LiquidButton } from './ui/liquid-glass-button'
import { useContact } from './ContactProvider'
import { PHONE_DISPLAY, buildWhatsAppLink } from '../lib/contacts'

const FOOTER_LINKS = [
  { label: 'Возможности', href: '#vozmozhnosti' },
  { label: 'Модули', href: '#moduli' },
  { label: 'Тарифы', href: '#tarify' },
  { label: 'Отрасли', href: '#biznes' },
  { label: 'Вопросы', href: '#faq' },
]

export default function Footer() {
  const { open } = useContact()

  return (
    <footer id="kontakty" className="bg-black px-6 py-14 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <span className="text-lg font-semibold tracking-tight text-white">Habibi</span>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Цифровая экосистема для вашего бизнеса. Больше контроля, меньше рутины, рост
              показателей.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-3">
            <span className="text-sm font-medium text-white/70">Свяжитесь с нами</span>
            <a
              href={buildWhatsAppLink('Здравствуйте! Хочу узнать больше о Habibi.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e] text-white">
                <MessageCircle size={16} strokeWidth={2} />
              </span>
              {PHONE_DISPLAY}
            </a>
            <LiquidButton
              size="sm"
              onClick={() => open('Habibi')}
              className="w-fit rounded-full text-white"
            >
              Попробовать бесплатно
            </LiquidButton>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Habibi. Все права защищены.</span>
          <span>Одна система вместо десяти разрозненных инструментов.</span>
        </div>
      </div>
    </footer>
  )
}
