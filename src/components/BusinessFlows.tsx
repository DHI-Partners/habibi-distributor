import { Fragment, useState } from 'react'
import {
  // Иконки вкладок-направлений
  ShoppingCart,
  Utensils,
  Wrench,
  Hotel,
  Building2,
  // Иконки блоков (гостиничный бизнес)
  Globe,
  BedDouble,
  KeyRound,
  SprayCan,
  ConciergeBell,
  // Иконки блоков (недвижимость)
  MapPin,
  FileText,
  Landmark,
  // Иконки блоков схемы
  PhoneCall,
  Users,
  Headphones,
  ListChecks,
  Warehouse,
  Route,
  Truck,
  CheckCircle2,
  CreditCard,
  Wallet,
  BarChart3,
  Shield,
  Smartphone,
  ChefHat,
  PackageCheck,
  Bike,
  MessageSquare,
  CalendarCheck,
  ClipboardList,
  HardHat,
  ClipboardCheck,
  Repeat,
  // Иконки «хаоса» + служебные
  MessageCircle,
  Table2,
  NotebookPen,
  Calculator,
  Phone,
  Instagram,
  Files,
  Boxes,
  Unlink,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  ArrowDown,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from './Reveal'
import Starfield from './Starfield'

/* ─── Разрозненные инструменты «как сейчас» ─── */

interface Tool {
  icon: LucideIcon
  label: string
  rot: number
}

const CHAOS: Tool[] = [
  { icon: MessageCircle, label: 'Заявки в WhatsApp', rot: -3 },
  { icon: Table2, label: 'Склад в Excel', rot: 2 },
  { icon: NotebookPen, label: 'Финансы в тетради', rot: -1.5 },
  { icon: Instagram, label: 'Заказы в Instagram Direct', rot: 2.5 },
  { icon: Phone, label: 'Звонки без учёта', rot: -2 },
  { icon: Boxes, label: 'Остатки на глаз', rot: 1.5 },
  { icon: Files, label: 'Договоры в папках', rot: -2.5 },
  { icon: Calculator, label: 'Прибыль в калькуляторе', rot: 3 },
]

/* ─── Во что обходится хаос (усреднённые оценки для МСБ) ─── */

interface Stat {
  value: string
  label: string
}

const STATS: Stat[] = [
  { value: 'до 20%', label: 'прибыли теряется на ошибках и ручном учёте' },
  { value: '~30%', label: 'заявок остаются без ответа или теряются' },
  { value: '×2', label: 'дольше обработка каждого заказа' },
  { value: 'до 15%', label: 'товара — пересортица и списания' },
]

/* ─── Схемы процессов по направлениям (стиль Doctor Ali) ─── */

interface Block {
  icon: LucideIcon
  title: string
  points: string[]
}

interface Group {
  label: string
  blocks: Block[]
}

interface Flow {
  key: string
  label: string
  icon: LucideIcon
  groups: Group[]
}

const FLOWS: Flow[] = [
  {
    key: 'trade',
    label: 'Торговля и доставка',
    icon: ShoppingCart,
    groups: [
      {
        label: 'Заказ и обработка',
        blocks: [
          { icon: PhoneCall, title: 'Каналы заказов', points: ['Звонок и сайт', 'Telegram, Instagram', 'Реклама', 'Повторный заказ'] },
          { icon: Users, title: 'CRM: лид и клиент', points: ['Автосоздание лида', 'Проверка клиента', 'Поиск по телефону', 'История и долги'] },
          { icon: Headphones, title: 'Колл-центр', points: ['Подбор товара', 'Адрес и время', 'Способ оплаты', 'Подтверждение'] },
          { icon: ListChecks, title: 'Статусы заказа', points: ['Новый, подтверждён', 'Собран на складе', 'У курьера', 'Доставлен'] },
        ],
      },
      {
        label: 'Склад и доставка',
        blocks: [
          { icon: Warehouse, title: 'Склад / WMS', points: ['Приём и комплектация', 'Проверка по QR', 'Упаковка', 'Точные остатки'] },
          { icon: Route, title: 'Диспетчер и маршрут', points: ['Назначение курьеру', 'Группировка по районам', 'Оптимальный маршрут', 'Контроль загрузки'] },
          { icon: Truck, title: 'Курьер', points: ['Заказы на день', 'Навигация и GPS', 'Фото и подпись', 'Офлайн-режим'] },
          { icon: CheckCircle2, title: 'Результат доставки', points: ['Доставлено / возврат', 'Оценка клиента', 'Оплата принята', 'Заказ завершён'] },
        ],
      },
      {
        label: 'Деньги и контроль',
        blocks: [
          { icon: CreditCard, title: 'Оплаты', points: ['Наличные, карта', 'Click / Payme', 'Смешанная оплата', 'Возврат средств'] },
          { icon: Wallet, title: 'Финансы', points: ['Выручка и расходы', 'Себестоимость', 'Чистая прибыль', 'Дебиторка'] },
          { icon: BarChart3, title: 'Аналитика и KPI', points: ['Продажи за день', 'KPI сотрудников', 'Топ-товары', 'Отчёты'] },
          { icon: Shield, title: 'Интеграции и защита', points: ['Bitrix24, 1С', 'SMS-сервис', 'Права доступа', '2FA и журнал'] },
        ],
      },
    ],
  },
  {
    key: 'food',
    label: 'Ресторан / доставка еды',
    icon: Utensils,
    groups: [
      {
        label: 'Заказ',
        blocks: [
          { icon: Smartphone, title: 'Каналы заказов', points: ['Сайт и приложение', 'Звонок', 'Агрегаторы', 'Столик в зале'] },
          { icon: Users, title: 'Приём в CRM', points: ['Создание заказа', 'Клиент и история', 'Бонусы', 'Комментарии'] },
          { icon: Utensils, title: 'Меню и состав', points: ['Позиции и модификаторы', 'Стоп-лист', 'Себестоимость', 'Комментарий к блюду'] },
          { icon: ListChecks, title: 'Статусы', points: ['Принят', 'Готовится', 'Собран', 'В пути / доставлен'] },
        ],
      },
      {
        label: 'Кухня и доставка',
        blocks: [
          { icon: ChefHat, title: 'Кухня', points: ['Тикеты по цехам', 'Статус блюд', 'Контроль времени', 'Очередь заказов'] },
          { icon: PackageCheck, title: 'Сборка', points: ['Комплектация', 'Упаковка', 'Проверка состава', 'Готов к выдаче'] },
          { icon: Bike, title: 'Курьер и маршрут', points: ['Назначение курьеру', 'GPS-маршрут', 'Статус клиенту', 'Время доставки'] },
          { icon: CheckCircle2, title: 'Результат', points: ['Доставлено', 'Оценка', 'Возврат / жалоба', 'Заказ завершён'] },
        ],
      },
      {
        label: 'Деньги и контроль',
        blocks: [
          { icon: CreditCard, title: 'Оплаты', points: ['Онлайн и карта', 'Наличные', 'Чаевые', 'Возврат'] },
          { icon: Wallet, title: 'Финансы', points: ['Выручка', 'Фудкост', 'Себестоимость блюд', 'Прибыль'] },
          { icon: BarChart3, title: 'Аналитика и KPI', points: ['Топ-блюда', 'Средний чек', 'KPI смены', 'Отчёты'] },
          { icon: Shield, title: 'Касса и интеграции', points: ['Сайт и агрегаторы', 'Касса / ОФД', 'SMS', 'Склад продуктов'] },
        ],
      },
    ],
  },
  {
    key: 'services',
    label: 'Услуги / сервис',
    icon: Wrench,
    groups: [
      {
        label: 'Заявка',
        blocks: [
          { icon: MessageSquare, title: 'Каналы заявок', points: ['Сайт и звонок', 'Мессенджеры', 'Реклама', 'Повторный клиент'] },
          { icon: Users, title: 'CRM', points: ['Автолид', 'Проверка клиента', 'История обращений', 'Источник заявки'] },
          { icon: CalendarCheck, title: 'Запись / бронь', points: ['Онлайн-календарь', 'Выбор мастера', 'Свободный слот', 'Напоминание'] },
          { icon: ListChecks, title: 'Статусы', points: ['Новая', 'Подтверждена', 'В работе', 'Выполнена'] },
        ],
      },
      {
        label: 'Исполнение',
        blocks: [
          { icon: ClipboardList, title: 'Наряд на работу', points: ['Задачи и этапы', 'Материалы', 'Чек-лист', 'Ответственный'] },
          { icon: HardHat, title: 'Мастер / бригада', points: ['График', 'Приложение', 'Статус', 'Фото работ'] },
          { icon: Wrench, title: 'Выполнение', points: ['Этапы работ', 'Контроль качества', 'Учёт времени', 'Доп. работы'] },
          { icon: ClipboardCheck, title: 'Приёмка / сдача', points: ['Фото результата', 'Подпись клиента', 'Гарантия', 'Акт'] },
        ],
      },
      {
        label: 'Деньги и контроль',
        blocks: [
          { icon: CreditCard, title: 'Оплаты', points: ['Карта и наличные', 'Рассрочка', 'Предоплата', 'Чек'] },
          { icon: Wallet, title: 'Финансы', points: ['Выручка', 'Зарплата мастеров', 'Расходники', 'Прибыль'] },
          { icon: BarChart3, title: 'Аналитика и KPI', points: ['Заявки и конверсия', 'KPI мастеров', 'Отзывы', 'Отчёты'] },
          { icon: Repeat, title: 'Лояльность и защита', points: ['Напоминания', 'Повторный визит', 'SMS', 'Права доступа'] },
        ],
      },
    ],
  },
  {
    key: 'hotel',
    label: 'Гостиничный бизнес',
    icon: Hotel,
    groups: [
      {
        label: 'Бронирование и заезд',
        blocks: [
          { icon: Globe, title: 'Каналы броней', points: ['Сайт и телефон', 'Booking, Ostrovok', 'Мессенджеры', 'Постоянные гости'] },
          { icon: Users, title: 'CRM и бронь', points: ['Создание брони', 'Профиль гостя', 'История визитов', 'Предоплата'] },
          { icon: BedDouble, title: 'Тарифы и номера', points: ['Типы номеров', 'Доступность', 'Динамические тарифы', 'Доп. услуги'] },
          { icon: KeyRound, title: 'Заезд / выезд', points: ['Онлайн-регистрация', 'Выдача ключа', 'Депозит', 'Ранний / поздний выезд'] },
        ],
      },
      {
        label: 'Проживание и сервис',
        blocks: [
          { icon: Hotel, title: 'Управление номерами', points: ['Шахматка загрузки', 'Статусы номеров', 'Переселение', 'Продление'] },
          { icon: SprayCan, title: 'Хозслужба / уборка', points: ['График уборки', 'Статус номера', 'Чек-лист', 'Мини-бар'] },
          { icon: ConciergeBell, title: 'Услуги гостя', points: ['Room service', 'Спа и ресторан', 'Трансфер', 'Заявки и жалобы'] },
          { icon: Wrench, title: 'Обслуживание', points: ['Заявки на ремонт', 'Инвентарь', 'Ответственный', 'Контроль сроков'] },
        ],
      },
      {
        label: 'Деньги и контроль',
        blocks: [
          { icon: CreditCard, title: 'Оплаты и счёт гостя', points: ['Карта и наличные', 'Онлайн-оплата', 'Единый счёт', 'Возвраты'] },
          { icon: Wallet, title: 'Финансы', points: ['Выручка по номерам', 'ADR и RevPAR', 'Расходы', 'Прибыль'] },
          { icon: BarChart3, title: 'Аналитика и KPI', points: ['Загрузка номеров', 'Источники броней', 'KPI персонала', 'Отчёты'] },
          { icon: Shield, title: 'Интеграции и защита', points: ['Booking / Ostrovok', 'Онлайн-касса', 'Замки и Wi-Fi', 'Права доступа'] },
        ],
      },
    ],
  },
  {
    key: 'realty',
    label: 'Недвижимость',
    icon: Building2,
    groups: [
      {
        label: 'Заявка и подбор',
        blocks: [
          { icon: Globe, title: 'Каналы заявок', points: ['Сайт и звонок', 'Авито, Циан', 'Реклама', 'Рекомендации'] },
          { icon: Users, title: 'CRM: лид', points: ['Автосоздание лида', 'Квалификация', 'Источник заявки', 'История контактов'] },
          { icon: Building2, title: 'База объектов', points: ['Каталог объектов', 'Фото и планировки', 'Цена и статус', 'Собственник'] },
          { icon: MapPin, title: 'Подбор и показ', points: ['Подбор под запрос', 'Запись на показ', 'Маршрут показов', 'Обратная связь'] },
        ],
      },
      {
        label: 'Сделка и документы',
        blocks: [
          { icon: ListChecks, title: 'Воронка сделки', points: ['Этапы сделки', 'Бронь объекта', 'Согласование цены', 'Вероятность'] },
          { icon: FileText, title: 'Документы и договор', points: ['Договор и допсоглашения', 'Проверка юрчистоты', 'Электронная подпись', 'Шаблоны'] },
          { icon: Landmark, title: 'Ипотека / рассрочка', points: ['Заявки в банки', 'Одобрение', 'Первый взнос', 'График платежей'] },
          { icon: KeyRound, title: 'Сделка и передача', points: ['Регистрация', 'Акт приёма-передачи', 'Выдача ключей', 'Заселение'] },
        ],
      },
      {
        label: 'Деньги и контроль',
        blocks: [
          { icon: CreditCard, title: 'Оплаты и взаиморасчёты', points: ['Оплата и комиссия', 'Безнал и эскроу', 'Возвраты', 'График поступлений'] },
          { icon: Wallet, title: 'Финансы', points: ['Выручка и комиссии', 'Расходы на рекламу', 'Прибыль по сделкам', 'Дебиторка'] },
          { icon: BarChart3, title: 'Аналитика и KPI', points: ['Воронка и конверсия', 'KPI риелторов', 'Источники заявок', 'Отчёты'] },
          { icon: Shield, title: 'Интеграции и защита', points: ['Авито / Циан', 'Банки и Росреестр', 'SMS', 'Права доступа'] },
        ],
      },
    ],
  },
]

/* Стрелка между блоками внутри ряда: вниз на мобильном, вправо на десктопе. */
function StepArrow() {
  return (
    <div
      className="flex shrink-0 items-center justify-center self-center py-1 lg:py-0"
      aria-hidden="true"
    >
      {/* Соединительная линия (десктоп) */}
      <span className="hidden h-px w-3 bg-gradient-to-r from-transparent to-white/30 lg:block" />
      {/* Узел-стрелка */}
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/[0.12] text-white shadow-[0_0_16px_-2px_rgba(255,255,255,0.45)] backdrop-blur-sm">
        <ChevronDown size={16} strokeWidth={2.75} className="lg:hidden" />
        <ChevronRight size={16} strokeWidth={2.75} className="hidden lg:block" />
      </span>
      <span className="hidden h-px w-3 bg-gradient-to-l from-transparent to-white/30 lg:block" />
    </div>
  )
}

export default function BusinessFlows() {
  const [active, setActive] = useState(0)
  const flow = FLOWS[active]
  // Сквозная нумерация блоков 01…12 по всей схеме
  let counter = 0

  return (
    <section
      id="kak-rabotaet"
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12 md:py-32 lg:px-16"
    >
      {/* Яркое звёздное небо с падающими звёздами */}
      <Starfield bright shootingStars className="pointer-events-none absolute inset-0" />
      {/* Мягкое свечение + края в чёрный для бесшовного стыка */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Заголовок */}
        <Reveal>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/40">
            Как это работает
          </p>
          <h2 className="max-w-3xl text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            От разрозненных сервисов — к единому потоку
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            Малый и средний бизнес живёт в десятке несвязанных инструментов: заявки в мессенджерах,
            склад в Excel, финансы в тетради. Habibi собирает весь процесс в одну систему — под любой
            бизнес.
          </p>
        </Reveal>

        {/* ── ЧАСТЬ A: как сейчас (хаос) — подсвечено красным как реальная проблема ── */}
        <Reveal delay={0.05}>
          <div className="relative mt-14 overflow-hidden rounded-3xl border border-red-500/30 bg-red-950/[0.12] p-6 shadow-[0_0_50px_-10px_rgba(239,68,68,0.35)] backdrop-blur-md sm:p-8">
            {/* Красное свечение — визуальный сигнал проблемы */}
            <div className="pointer-events-none absolute -left-12 -top-12 h-52 w-52 rounded-full bg-red-500/25 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-10 -right-8 h-44 w-44 rounded-full bg-rose-500/15 blur-[80px]" />

            <div className="relative mb-5 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-400/40 bg-red-500/15 text-red-300">
                <Unlink size={17} strokeWidth={2} />
              </span>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-white">Знакомая картина?</h3>
                  <span className="rounded-full border border-red-400/40 bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-300">
                    Проблема
                  </span>
                </div>
                <p className="text-sm text-white/65">
                  Каждый сервис сам по себе — данные переносятся руками, часть заявок теряется.
                </p>
              </div>
            </div>

            <div className="relative flex flex-wrap items-center gap-2.5">
              {CHAOS.map((c) => (
                <span
                  key={c.label}
                  style={{ transform: `rotate(${c.rot}deg)` }}
                  className="inline-flex items-center gap-2 rounded-full border border-dashed border-red-400/35 bg-red-500/[0.07] px-3.5 py-2 text-sm text-red-50/85"
                >
                  <c.icon size={15} strokeWidth={1.75} className="text-red-300/80" />
                  {c.label}
                </span>
              ))}
            </div>

            {/* Цена хаоса — потери прибыли и показателей */}
            <div className="relative mt-6 border-t border-red-400/20 pt-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-red-200">
                <TrendingDown size={16} strokeWidth={2} className="shrink-0" />
                Цена хаоса — прибыль и показатели утекают
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-red-400/20 bg-red-500/[0.06] p-3.5"
                  >
                    <div className="text-xl font-bold text-red-300 sm:text-2xl">{s.value}</div>
                    <div className="mt-1 text-xs leading-relaxed text-white/55">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-white/30">
                *усреднённые оценки потерь для малого и среднего бизнеса
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Переход ── */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center text-center">
            <p className="text-base text-white/70 md:text-lg">
              С <span className="font-medium text-white">Habibi</span> всё это —{' '}
              <span className="text-white">один связанный поток</span>
            </p>
            <ArrowDown size={22} strokeWidth={2} className="mt-3 animate-bounce text-white/30" />
          </div>
        </Reveal>

        {/* ── ЧАСТЬ B: вкладки + детальная схема (стиль Doctor Ali) ── */}
        <Reveal delay={0.15}>
          {/* Вкладки-переключатель направлений */}
          <div role="tablist" aria-label="Направления бизнеса" className="mt-8 flex flex-wrap gap-2.5">
            {FLOWS.map((f, i) => {
              const isActive = i === active
              return (
                <button
                  key={f.key}
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
                  <f.icon size={16} strokeWidth={2} />
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Схема выбранного направления (ремаунт по key → повторный fadeSlideUp) */}
          <div
            key={active}
            role="tabpanel"
            className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-md [animation:fadeSlideUp_0.4s_ease_both] sm:p-7"
          >
            {flow.groups.map((group, gi) => (
              <div key={group.label}>
                {/* Стрелка между группами-рядами */}
                {gi > 0 && (
                  <div className="flex flex-col items-center py-2" aria-hidden="true">
                    <span className="h-4 w-px bg-white/25" />
                    <span className="my-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/[0.12] text-white shadow-[0_0_20px_-2px_rgba(255,255,255,0.5)] backdrop-blur-sm">
                      <ChevronDown size={20} strokeWidth={2.75} />
                    </span>
                    <span className="h-4 w-px bg-white/25" />
                  </div>
                )}

                {/* Заголовок ряда-этапа */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    {group.label}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
                </div>

                {/* Ряд блоков */}
                <div className="flex flex-col gap-2.5 lg:flex-row lg:items-stretch">
                  {group.blocks.map((b, bi) => {
                    counter += 1
                    const nn = String(counter).padStart(2, '0')
                    return (
                      <Fragment key={b.title}>
                        <div className="group flex flex-1 flex-col rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_10px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:from-white/[0.14] hover:shadow-[0_0_26px_-6px_rgba(255,255,255,0.28)]">
                          <div className="mb-2.5 flex items-start gap-2">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/25 bg-white/[0.16] text-xs font-bold text-white shadow-[0_0_12px_-4px_rgba(255,255,255,0.5)]">
                              {nn}
                            </span>
                            <b.icon
                              size={16}
                              strokeWidth={1.9}
                              className="mt-1.5 shrink-0 text-white/90"
                            />
                            <h4 className="mt-1 text-sm font-semibold leading-tight text-white">
                              {b.title}
                            </h4>
                          </div>
                          <ul className="space-y-1">
                            {b.points.map((p) => (
                              <li
                                key={p}
                                className="flex gap-1.5 text-xs leading-relaxed text-white/55"
                              >
                                <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-white/40" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {bi < group.blocks.length - 1 && <StepArrow />}
                      </Fragment>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Легенда — единый сквозной поток */}
            <p className="mx-auto mt-6 max-w-3xl rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.08] px-5 py-3.5 text-center text-sm font-medium leading-relaxed text-white sm:text-base">
              ⚡ Все 12 блоков связаны в один сквозной процесс — данные передаются между этапами
              автоматически, <span className="text-emerald-300">без ручного переноса и потерь</span>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
