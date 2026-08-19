import { useState } from 'react'
import {
  Store,
  UtensilsCrossed,
  HardHat,
  Building2,
  BedDouble,
  Plane,
  Truck,
  Factory,
  Code,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from './Reveal'
import { LiquidButton } from './ui/liquid-glass-button'
import { useContact } from './ContactProvider'
import { QUIZ_START_EVENT } from './Quiz'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4'

interface Industry {
  key: string
  Icon: LucideIcon
  label: string
  headline: string
  text: string
  /** id варианта первого вопроса квиза — с ним квиз открывается сразу со второго вопроса. */
  quizBiz?: string
  cta?: string
}

const INDUSTRIES: Industry[] = [
  {
    key: 'shop',
    quizBiz: 'retail',
    Icon: Store,
    label: 'Магазин',
    headline: 'Продажи, остатки, закупки и прибыль — под контролем.',
    text: 'Habibi помогает управлять продажами, складом, закупками, клиентами, сотрудниками и финансами. Подходит как для одного магазина, так и для сети.',
  },
  {
    key: 'restaurant',
    quizBiz: 'services',
    Icon: UtensilsCrossed,
    label: 'Ресторан или кафе',
    headline: 'Всё необходимое для управления заведением — в одном месте.',
    text: 'Контролируйте продажи, продукты, склад, закупки, персонал, расходы и прибыль каждого филиала.',
  },
  {
    key: 'construction',
    quizBiz: 'construction',
    Icon: HardHat,
    label: 'Строительная компания',
    headline: 'От первого клиента до сдачи объекта — всё под контролем.',
    text: 'Управляйте проектами, задачами, материалами, закупками, сотрудниками, расходами и прибылью по каждому объекту.',
  },
  {
    key: 'realestate',
    quizBiz: 'services',
    Icon: Building2,
    label: 'Недвижимость',
    headline: 'Клиенты, объекты, сделки и комиссии — в одной системе.',
    text: 'Ведите покупателей, арендаторов, объекты, показы, договоры, документы и финансовый результат каждой сделки.',
  },
  {
    key: 'hotel',
    quizBiz: 'services',
    Icon: BedDouble,
    label: 'Гостиница или отель',
    headline: 'Управляйте гостями и бронированиями без хаоса.',
    text: 'Habibi объединяет бронирования, номера, гостей, сотрудников, дополнительные услуги, закупки и финансы.',
  },
  {
    key: 'tourism',
    quizBiz: 'services',
    Icon: Plane,
    label: 'Туристическая компания',
    headline: 'От заявки клиента до завершения тура — всё в одной системе.',
    text: 'Управляйте турами, Умрой и Хаджем, документами, оплатами, трансферами, клиентами и сотрудниками.',
  },
  {
    key: 'logistics',
    quizBiz: 'services',
    Icon: Truck,
    label: 'Логистическая компания',
    headline: 'Заказы, водители, маршруты и расходы — всегда под контролем.',
    text: 'Ведите перевозки, клиентов, транспорт, доставку, задачи и прибыль по каждому рейсу.',
  },
  {
    key: 'manufacturing',
    quizBiz: 'manufacturing',
    Icon: Factory,
    label: 'Производство',
    headline: 'От закупки сырья до готовой продукции — полный контроль.',
    text: 'Планируйте производство, управляйте сырьём, складом, себестоимостью, продажами и финансами.',
  },
  {
    key: 'services',
    quizBiz: 'it',
    Icon: Code,
    label: 'Сервисная или IT-компания',
    headline: 'Клиенты, проекты, задачи и оплаты — в одном месте.',
    text: 'Habibi идеально подходит для агентств, консалтинга, юридических компаний, IT-команд и любых компаний, которые продают услуги.',
  },
  {
    key: 'education',
    quizBiz: 'services',
    Icon: GraduationCap,
    label: 'Образовательный бизнес',
    headline: 'Ученики, расписание, сотрудники и оплаты — без лишних таблиц.',
    text: 'Управляйте учебным центром, языковой школой, онлайн-курсами или академией из одной системы.',
  },
  {
    key: 'other',
    Icon: Sparkles,
    label: 'Не нашли свою отрасль?',
    headline: 'Habibi легко адаптируется под любой малый и средний бизнес.',
    text: 'Расскажите, чем занимается ваша компания — и мы покажем готовое решение именно для вас.',
    cta: 'Рассказать о своём бизнесе',
  },
]

export default function IndustrySelector() {
  const [active, setActive] = useState(0)
  const { open } = useContact()
  const industry = INDUSTRIES[active]

  // Квиз сам прокручивается к себе при смене шага, поэтому достаточно послать событие.
  const startQuiz = (biz: string) => {
    window.dispatchEvent(new CustomEvent(QUIZ_START_EVENT, { detail: { biz } }))
  }

  return (
    <section
      id="biznes"
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12 md:py-32 lg:px-16"
    >
      {/* Фоновое видео */}
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      {/* Затемнение, чтобы текст и чипы читались поверх видео */}
      <div className="pointer-events-none absolute inset-0 bg-black/45" />
      {/* Края — в чёрный, для бесшовного стыка с соседними секциями */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/15 to-black" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/40">
            Habibi для вашего бизнеса
          </p>
          <h2 className="max-w-3xl text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            Чем вы занимаетесь?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            У Habibi есть решения для разных видов бизнеса. Выберите свой — и узнайте, как
            упростить его ежедневное управление.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div role="tablist" aria-label="Отрасли" className="mt-10 flex flex-wrap gap-2.5">
            {INDUSTRIES.map((ind, i) => {
              const isActive = i === active
              return (
                <button
                  key={ind.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'border-white/40 bg-white/[0.1] text-white shadow-[0_0_22px_rgba(255,255,255,0.12)]'
                      : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <ind.Icon size={16} strokeWidth={2} />
                  {ind.label}
                </button>
              )
            })}
          </div>

          {/* Ремаунт по key повторяет fadeSlideUp при переключении */}
          <div
            key={industry.key}
            role="tabpanel"
            className="mt-8 rounded-3xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md [animation:fadeSlideUp_0.4s_ease_both] sm:p-8 md:min-h-[220px] md:p-10"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
              <div className="max-w-2xl">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                  <industry.Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-semibold leading-snug text-white md:text-2xl">
                  {industry.headline}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
                  {industry.text}
                </p>
              </div>
              <div className="shrink-0 md:pt-16">
                <LiquidButton
                  size="lg"
                  className="rounded-full text-white"
                  onClick={() =>
                    industry.quizBiz ? startQuiz(industry.quizBiz) : open('Habibi')
                  }
                >
                  {industry.cta ?? 'Попробовать для своего бизнеса'}
                </LiquidButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
