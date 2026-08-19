import { useState } from 'react'
import { MessageCircle, X, MessagesSquare } from 'lucide-react'

import { PHONE_DISPLAY, buildWhatsAppLink } from '../lib/contacts'

/**
 * Плавающая кнопка «Написать нам» в правом нижнем углу.
 * По клику разворачивает ссылку на WhatsApp Сухраба.
 * `whatsappText` — предзаполненное сообщение для WhatsApp (напр., название модуля).
 */
export default function MessengerWidget({ whatsappText }: { whatsappText?: string }) {
  const [open, setOpen] = useState(false)
  const whatsappHref = buildWhatsAppLink(whatsappText)

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Разворачивающиеся действия */}
      <div
        className={`flex flex-col items-end gap-2.5 transition-all duration-300 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0a0a0a]/90 py-2 pl-2 pr-4 text-sm font-medium text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-transform hover:scale-[1.03]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e] text-white">
            <MessageCircle size={17} strokeWidth={2} />
          </span>
          WhatsApp
        </a>
        <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs text-white/60 backdrop-blur-md">
          {PHONE_DISPLAY}
        </span>
      </div>

      {/* Главная кнопка с анимацией «нажми меня» */}
      <div className="relative h-14 w-14">
        {/* Пульсирующие кольца-волны (как у входящего звонка) */}
        {!open && (
          <>
            <span className="msg-ring pointer-events-none absolute inset-0 rounded-full bg-white/40" />
            <span className="msg-ring-2 pointer-events-none absolute inset-0 rounded-full bg-white/30" />
          </>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Закрыть' : 'Написать нам'}
          aria-expanded={open}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95 ${
            open ? '' : 'msg-bob'
          }`}
        >
          <span
            className={`relative flex h-6 w-6 items-center justify-center ${open ? '' : 'msg-wiggle'}`}
          >
            <MessagesSquare
              size={24}
              className={`absolute transition-all duration-300 ${
                open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              size={24}
              className={`absolute transition-all duration-300 ${
                open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  )
}
