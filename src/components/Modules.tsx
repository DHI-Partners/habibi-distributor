import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target,
  Package,
  Warehouse,
  Factory,
  Wallet,
  Users,
  BarChart3,
  Wrench,
  ShoppingCart,
  Globe,
  Maximize2,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from './Reveal'

interface Module {
  icon: LucideIcon
  title: string
  text: string
  /** Если задан — карточка кликабельна и открывает изображение на весь экран. */
  preview?: string
  /** Если задан — «Смотреть пример» ведёт на страницу модуля (приоритетнее preview). */
  page?: string
}

const MODULES: Module[] = [
  {
    icon: Target,
    title: 'CRM и продажи',
    text: 'Все заявки, клиенты и сделки — в одной системе. Ничего не теряется, каждый шаг клиента виден в реальном времени.',
    preview: '/crm-preview.png',
    page: '/moduli/crm',
  },
  {
    icon: Package,
    title: 'Закупки',
    text: 'Прозрачный выбор поставщиков, контроль цен и сроков — без ручных сверок.',
    preview: '/purchases-preview.png',
    page: '/moduli/zakupki',
  },
  {
    icon: Warehouse,
    title: 'Склад',
    text: 'Точные остатки в реальном времени и понятная история движения товара.',
    preview: '/warehouse-preview.png',
    page: '/moduli/sklad',
  },
  {
    icon: Factory,
    title: 'Производство',
    text: 'Ясная себестоимость, планирование и контроль качества на каждом этапе.',
    preview: '/production-preview.png',
    page: '/moduli/proizvodstvo',
  },
  {
    icon: Wallet,
    title: 'Финансы',
    text: 'Актуальная картина по деньгам: отчёты, дебиторка, прогноз денежного потока — без ожидания конца месяца.',
    preview: '/finance-preview.png',
    page: '/moduli/finansy',
  },
  {
    icon: Users,
    title: 'HR и зарплата',
    text: 'Учёт сотрудников, расчёт зарплат и понятные KPI команды.',
    preview: '/hr-preview.png',
    page: '/moduli/hr',
  },
  {
    icon: BarChart3,
    title: 'Проекты и задачи',
    text: 'Сроки, ответственные и статусы — всё в одном экране.',
    preview: '/projects-preview.png',
    page: '/moduli/proekty',
  },
  {
    icon: Wrench,
    title: 'Сервис и поддержка',
    text: 'Гарантийные обращения, повторные продажи и отзывы клиентов под контролем.',
    preview: '/service-preview.png',
    page: '/moduli/servis',
  },
  {
    icon: ShoppingCart,
    title: 'Розница (POS)',
    text: 'Касса, склад и финансы работают как единое целое.',
    preview: '/pos-preview.png',
    page: '/moduli/pos',
  },
  {
    icon: Globe,
    title: 'Сайт и заявки',
    text: 'Каждое обращение с сайта сразу становится задачей в работе.',
    preview: '/site-leads-preview.jpg',
    page: '/moduli/sait-i-zayavki',
  },
]

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260419_065931_e3ca7b53-d32e-4ad5-81de-dc9d6fcfda6d.mp4'

export default function Modules() {
  const navigate = useNavigate()
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)

  const openPreview = (src: string) => {
    setImgError(false)
    setPreviewSrc(src)
  }

  /** Страница модуля приоритетнее модалки с картинкой. */
  const openModule = (mod: Module) => {
    if (mod.page) {
      navigate(mod.page)
    } else if (mod.preview) {
      openPreview(mod.preview)
    }
  }

  // Закрытие модалки по Esc + блокировка прокрутки фона, пока открыто.
  useEffect(() => {
    if (!previewSrc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewSrc(null)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [previewSrc])

  return (
    <section
      id="moduli"
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12 md:py-32 lg:px-16"
    >
      {/* Фоновое видео */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Затемнение: яркое небо приглушено; края уходят в чёрный для бесшовного стыка */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/25 to-black" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/40">
            Модули
          </p>
          <h2 className="max-w-3xl text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            Всё в одном месте — просто, наглядно и без лишней сложности
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            Растущему бизнесу сложно держать всё под контролем, когда продажи, склад, финансы и
            команда живут в разных таблицах и чатах. Habibi собирает всё это в одном месте.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod, i) => {
            const clickable = Boolean(mod.page || mod.preview)
            return (
              <Reveal key={mod.title} delay={(i % 3) * 0.06}>
                <div
                  role={clickable ? 'button' : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onClick={clickable ? () => openModule(mod) : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            openModule(mod)
                          }
                        }
                      : undefined
                  }
                  className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-black/50 ${
                    clickable
                      ? 'cursor-pointer outline-none ring-white/30 focus-visible:ring-2 hover:border-white/30'
                      : ''
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-transform group-hover:scale-105">
                      <mod.icon size={20} strokeWidth={1.75} />
                    </div>
                    {clickable && (
                      <span className="badge-glow inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black">
                        <Maximize2 size={13} strokeWidth={2.5} />
                        Смотреть пример
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-white">{mod.title}</h3>
                  <p className="text-sm leading-relaxed text-white/60">{mod.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* Полноэкранная модалка с изображением */}
      {previewSrc && (
        <div
          onClick={() => setPreviewSrc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md [animation:fadeSlideUp_0.25s_ease_both] sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Пример интерфейса Habibi"
        >
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setPreviewSrc(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:top-6"
          >
            <X size={20} />
          </button>
          {imgError ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-md rounded-xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur"
            >
              <p className="text-base font-medium text-white">Скриншот ещё не добавлен</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Сохраните изображение как{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-white/80">
                  public/crm-preview.png
                </code>{' '}
                — и оно откроется здесь на весь экран.
              </p>
            </div>
          ) : (
            <img
              src={previewSrc}
              alt="Пример интерфейса Habibi"
              onClick={(e) => e.stopPropagation()}
              onError={() => setImgError(true)}
              className="max-h-[90vh] max-w-[92vw] rounded-xl border border-white/10 object-contain shadow-2xl"
            />
          )}
        </div>
      )}
    </section>
  )
}
