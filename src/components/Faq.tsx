import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useContact } from './ContactProvider'
import { CopperplateHatch } from './ui/copperplate-hatch'
import KineticGrid from './ui/kinetic-grid'

interface FaqItem {
  q: string
  a: string[]
}

const FAQ: FaqItem[] = [
  {
    q: 'Сложно ли внедрить Habibi?',
    a: [
      'Нет. Вы можете начать с тех процессов, которые наиболее важны для вашего бизнеса, и постепенно подключать дополнительные модули. Не обязательно переносить весь бизнес в систему за один день. Начните с CRM, продаж и финансов, а затем добавляйте склад, закупки, производство, HR и другие процессы по мере необходимости.',
      'Для пользователей Habibi Premium доступно персональное сопровождение, которое помогает быстрее адаптировать систему под задачи компании.',
    ],
  },
  {
    q: 'Нужно ли переносить данные из других систем?',
    a: [
      'Не обязательно. Вы можете начать работу с Habibi с чистого листа или перенести необходимые данные из используемых ранее систем.',
      'Если у вас уже есть клиентская база, товары, финансовая информация или другие данные, возможности их переноса зависят от формата и источника данных. При необходимости команда Habibi поможет определить оптимальный способ миграции.',
    ],
  },
  {
    q: 'Что будет с моими данными?',
    a: [
      'Ваши данные остаются в вашей рабочей системе Habibi и используются для управления вашим бизнесом. Доступ к информации контролируется в соответствии с правами пользователей.',
      'В Habibi Premium доступны гибкие права доступа, которые позволяют более точно определить, какую информацию могут видеть и с какими функциями могут работать разные сотрудники.',
    ],
  },
  {
    q: 'Смогу ли я подключить сотрудников?',
    a: [
      'Да. Вы можете подключать сотрудников к системе в зависимости от выбранного тарифа.',
      '**Habibi** позволяет работать до 10 пользователей, **Habibi Pro** — до 50, а **Habibi Premium** — до 100 пользователей.',
      'Каждый сотрудник может работать со своими задачами и бизнес-процессами, а в Premium вы можете гибко управлять правами доступа.',
    ],
  },
  {
    q: 'Можно ли попробовать бесплатно?',
    a: [
      'Да. У всех тарифов есть **бесплатный демо-период 14 дней** — вы получаете полный доступ ко всем функциям выбранного тарифа и знакомитесь с системой без оплаты. Банковская карта для старта не нужна.',
      'За две недели вы успеваете перенести реальные процессы, подключить команду и понять, подходит ли система вашему бизнесу.',
      'После окончания демо-периода вы выбираете подходящий тариф: **Habibi** от €29 в месяц, **Habibi Pro** или **Habibi Premium** — в зависимости от количества сотрудников и нужных возможностей.',
    ],
  },
  {
    q: 'Что произойдёт, если мой бизнес вырастет?',
    a: [
      'Habibi растёт вместе с вашим бизнесом. Вы можете начать с базового тарифа, а затем перейти на более функциональный, когда увеличится количество сотрудников, процессов и интеграций.',
      'На Habibi Pro вы получаете доступ ко всем 10 модулям системы, ИИ-агентов, до 50 пользователей и до 5 интеграций. Для компаний, которым необходимы персональное сопровождение, расширенная аналитика, гибкие права доступа и приоритетная поддержка, предусмотрен Habibi Premium.',
      'Вы можете развивать бизнес, не меняя систему управления и не собирая новые процессы из десятков разрозненных сервисов.',
    ],
  },
]

// Простой рендер **жирного** внутри абзаца.
function renderRich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-white/85">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}

export default function Faq() {
  const { open } = useContact()
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const toggle = (i: number) => setActiveIndex((prev) => (prev === i ? null : i))

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12 md:py-32 lg:px-16"
    >
      {/* Анимированный фон — гравюрная штриховка со «светом гравёра» */}
      <CopperplateHatch
        className="pointer-events-none absolute inset-0"
        density={1}
        intensity={1.2}
        speed={0.8}
        seed={7}
        interactive
        safeArea={{ x: 0.05, y: 0.1, w: 0.9, h: 0.8 }}
      />
      {/* Лёгкое приглушение для читаемости + края в чёрный для бесшовного стыка */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/40">FAQ</p>
          <h2 className="max-w-2xl text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            Часто задаваемые вопросы
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-stretch">
          {/* Интерактивный CTA с кинетической сеткой */}
          <KineticGrid
            globalColor="monochrome"
            className="min-h-[340px] rounded-[24px] border border-white/10"
          >
            <div className="flex h-full flex-col items-center justify-center px-8 py-14 text-center text-white">
              <h3
                className="mb-3 font-medium leading-[1.1]"
                style={{ fontSize: '2.4rem', letterSpacing: '-0.03em' }}
              >
                Остались
                <br />
                вопросы?
              </h3>
              <p className="mb-7 max-w-xs text-sm font-normal text-white/70">
                Напишите нам — ответим и поможем подобрать тариф под ваш бизнес.
              </p>
              <button
                type="button"
                onClick={() => open('Habibi')}
                className="cursor-pointer rounded-xl border-none bg-white px-8 py-3.5 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5"
                style={{ boxShadow: '0 10px 24px rgba(0,0,0,0.45)' }}
              >
                Оставить заявку
              </button>
            </div>
          </KineticGrid>

          {/* Аккордеон */}
          <div className="flex flex-col justify-center gap-3">
            {FAQ.map((item, i) => {
              const active = activeIndex === i
              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggle(i)
                    }
                  }}
                  className={`cursor-pointer rounded-2xl border p-5 outline-none backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/30 ${
                    active
                      ? 'border-white/25 bg-white/[0.06]'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-white sm:text-base">{item.q}</span>
                    {active ? (
                      <ChevronUp size={20} className="shrink-0 text-white/60" />
                    ) : (
                      <ChevronDown size={20} className="shrink-0 text-white/45" />
                    )}
                  </div>
                  {active && (
                    <div className="mt-3 space-y-2.5">
                      {item.a.map((p, pi) => (
                        <p key={pi} className="text-sm leading-relaxed text-white/60">
                          {renderRich(p)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
