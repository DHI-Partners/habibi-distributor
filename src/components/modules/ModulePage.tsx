import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import Butterflies from '../Butterflies'
import { ContactProvider, useContact } from '../ContactProvider'
import Footer from '../Footer'
import MessengerWidget from '../MessengerWidget'
import { Reveal } from '../Reveal'
import { MODULE_PAGES } from './data'
import type { ModulePageData } from './types'

/** Пилюля-этап (воронка, цепочка ИИ-агента). */
function Pill({ children, active = false }: { children: string; active?: boolean }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
        active
          ? 'border-white bg-white font-semibold text-black'
          : 'border-white/20 bg-white/5 text-white/85'
      }`}
    >
      {children}
    </span>
  )
}

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2.5">
          <Pill active={i === 0}>{step}</Pill>
          {i < steps.length - 1 && <span className="text-white/35">→</span>}
        </span>
      ))}
    </div>
  )
}

function SectionTag({ children }: { children: string }) {
  return (
    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/50">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {children}
    </p>
  )
}

function ModulePageContent({ data }: { data: ModulePageData }) {
  const { open } = useContact()
  // CRM — про живое общение с клиентами, поэтому на фоне порхают бабочки.
  // Чтобы добавить их другому модулю, допишите его slug.
  const airy = data.slug === 'crm'

  useEffect(() => {
    document.title = `${data.title} — модуль Habibi ERP`
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Habibi'
    }
  }, [data])

  return (
    <div
      className={`relative min-h-screen w-full bg-[#12121a] font-geist text-white ${
        // isolate — иначе слои с -z-10 уходят под фон страницы и бабочек не видно
        airy ? 'isolate' : ''
      }`}
    >
      {airy && (
        <>
          {/* Мягкая подсветка сверху — фон дышит, а не выглядит просто серым */}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(85%_55%_at_50%_0%,rgba(255,255,255,0.09),transparent_70%)]" />
          <Butterflies className="pointer-events-none fixed inset-0 -z-10" dense />
        </>
      )}
      {/* Шапка */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8 md:px-12">
        <a
          href="/#moduli"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Все модули
        </a>
        <span className="text-sm font-bold uppercase tracking-[0.22em] text-white/70">Habibi</span>
      </header>

      {/* Герой */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 text-center md:px-12 md:pb-24 md:pt-20">
        <Reveal>
          <SectionTag>Модуль Habibi ERP</SectionTag>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {data.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
            {data.lead}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-2.5">
            {data.pills.map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            <button
              type="button"
              onClick={() => open()}
              className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
            >
              Начать бесплатно
            </button>
            <a
              href="#vozmozhnosti-modulya"
              className="rounded-full border border-white/25 px-8 py-3.5 text-base font-medium text-white transition-colors hover:border-white/50"
            >
              Смотреть возможности
            </a>
          </div>
        </Reveal>
      </section>

      {/* Знакомая картина */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Проблема</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Знакомая картина?
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.pains.map((pain, i) => (
            <Reveal key={pain.title} delay={(i % 3) * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <span className="mb-4 block text-2xl">{pain.icon}</span>
                <h3 className="mb-2 text-lg font-medium">{pain.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{pain.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Цена хаоса */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Цена хаоса</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Во что это обходится бизнесу
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            {data.chaos.lead}
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data.chaos.stats.map((stat, i) => (
            <Reveal key={stat.value + i} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-3 text-4xl font-semibold tracking-tight">{stat.value}</div>
                <p className="text-sm leading-relaxed text-white/60">{stat.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-5 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <span className="text-2xl">💡</span>
            <p className="text-base leading-relaxed text-white/85">
              {data.chaos.example.before}
              <b className="font-semibold text-emerald-400">{data.chaos.example.accent}</b>
              {data.chaos.example.after}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Что это */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Решение</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Модуль «{data.title}»
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">
            {data.about.lead}
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.about.cards.map((card, i) => (
            <Reveal key={card.title} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="mb-2 text-lg font-medium">{card.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Возможности */}
      <section id="vozmozhnosti-modulya" className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Возможности</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Что умеет модуль
          </h2>
        </Reveal>
        <div className="mt-12 space-y-16">
          {data.capabilities.map((cap, i) => (
            <Reveal key={cap.title}>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/40">
                  {i + 1} из {data.capabilities.length}
                </p>
                <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{cap.title}</h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60">{cap.lead}</p>
                {cap.flow && (
                  <div className="mt-6">
                    <Flow steps={cap.flow} />
                  </div>
                )}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cap.cards.map((card) => (
                    <div
                      key={card.title}
                      className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                    >
                      <h4 className="mb-2 text-base font-medium">{card.title}</h4>
                      <p className="text-sm leading-relaxed text-white/60">{card.text}</p>
                    </div>
                  ))}
                </div>
                {cap.note && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm leading-relaxed text-white/85">{cap.note}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Скриншот */}
      {data.screenshot && (
        <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
          <Reveal>
            <SectionTag>Интерфейс</SectionTag>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
              {data.screenshot.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <img
              src={data.screenshot.src}
              alt={`Интерфейс модуля ${data.title} в Habibi`}
              className="mt-10 w-full rounded-2xl border border-white/15 shadow-2xl"
              loading="lazy"
            />
          </Reveal>
        </section>
      )}

      {/* Было → стало */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Итог</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Какие проблемы решает модуль
          </h2>
        </Reveal>
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-2 border-b border-white/10">
            <span className="bg-white/[0.04] px-6 py-3.5 text-xs font-medium uppercase tracking-widest text-white/45">
              Было
            </span>
            <span className="border-l border-emerald-400/25 bg-emerald-400/[0.1] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              Стало с Habibi
            </span>
          </div>
          {data.solve.map((row, i) => (
            <div key={row.was} className={`grid grid-cols-2 ${i > 0 ? 'border-t border-white/[0.07]' : ''}`}>
              <p className="flex items-start gap-3 px-6 py-4 pr-4 text-sm leading-relaxed text-white/55">
                <X size={15} className="mt-0.5 shrink-0 text-white/30" />
                {row.was}
              </p>
              <p className="flex items-start gap-3 border-l border-emerald-400/25 bg-emerald-400/[0.07] px-6 py-4 text-sm leading-relaxed text-white">
                <Check size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                {row.now}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Деньги */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Главное</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Как модуль помогает заработать больше
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.money.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-6">
                <h3 className="mb-2 text-lg font-medium text-emerald-300">+ {item.title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ИИ-агенты */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Скоро в Habibi</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            {data.ai.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">
            {data.ai.lead}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="mt-8">
            <Flow steps={data.ai.flow} />
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.ai.cards.map((card, i) => (
            <Reveal key={card.title} delay={(i % 3) * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="mb-2 text-base font-medium">{card.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Сильнее вместе */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Экосистема</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Сильнее вместе с другими модулями
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">
            Habibi — одна система вместо десяти разрозненных инструментов. Продажи видят склад,
            склад видит закупки, а вы видите весь бизнес целиком.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.together.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h3 className="mb-2 text-lg font-medium">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Кому подходит */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Кому подходит</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Подойдёт вашему бизнесу
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {data.industries.list.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-base leading-relaxed text-white/85">{data.industries.note}</p>
          </div>
        </Reveal>
      </section>

      {/* Тариф */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <Reveal>
          <SectionTag>Тарифы</SectionTag>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            {data.tariff.headline}
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              name: 'Habibi',
              price: '€29/мес',
              period: 'от €19/мес при оплате за год',
              features: data.tariff.baseIncludes
                ? [`${data.title} — включён`, 'CRM, проекты, сайт, финансы', 'До 10 пользователей']
                : ['CRM и продажи', 'Проекты и задачи, сайт, финансы', 'До 10 пользователей'],
              highlight: data.tariff.baseIncludes,
            },
            {
              name: 'Habibi Pro',
              price: '€69/мес',
              period: 'от €49/мес при оплате за год',
              features: ['Все 10 модулей системы и ИИ-агенты', 'До 50 пользователей и 5 интеграций', 'Базовая техподдержка'],
              highlight: !data.tariff.baseIncludes,
            },
            {
              name: 'Habibi Premium',
              price: '€269/мес',
              period: 'от €189/мес при оплате за год',
              features: ['Все модули и расширенные лимиты', 'До 100 пользователей', 'Приоритетная поддержка'],
              highlight: false,
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 ${
                tier.highlight ? 'border-white/40 bg-white/[0.07]' : 'border-white/10 bg-white/[0.04]'
              }`}
            >
              <h3 className="text-lg font-medium">{tier.name}</h3>
              <div className="mt-3 text-4xl font-semibold tracking-tight">{tier.price}</div>
              <p className="mt-1 text-sm text-white/50">{tier.period}</p>
              <ul className="mt-5 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center md:px-12 md:py-28">
        <Reveal>
          <SectionTag>Следующий шаг</SectionTag>
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {data.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            {data.cta.text}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => open()}
              className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
            >
              Начать бесплатно
            </button>
            <a
              href="/#moduli"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-3.5 text-base font-medium text-white transition-colors hover:border-white/50"
            >
              Все модули
              <ArrowRight size={17} />
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
      <MessengerWidget whatsappText={`Здравствуйте! Интересует модуль «${data.title}» в Habibi.`} />
    </div>
  )
}

export default function ModulePage() {
  const { slug } = useParams<{ slug: string }>()
  const data = slug ? MODULE_PAGES[slug] : undefined

  if (!data) return <Navigate to="/" replace />

  return (
    <ContactProvider>
      <ModulePageContent data={data} />
    </ContactProvider>
  )
}
