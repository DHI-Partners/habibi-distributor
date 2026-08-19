import HlsVideo from './HlsVideo'
import { PricingGlass, type TierType } from './ui/pricing-glass'
import { useContact } from './ContactProvider'

const VIDEO_URL =
  'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

const TIERS: TierType[] = [
  {
    name: 'Habibi',
    priceMonthly: '29',
    priceSemiAnnual: '25',
    priceAnnual: '19',
    description: 'Стартовый тариф для небольших команд.',
    features: [
      'CRM и продажи',
      'Проекты и задачи',
      'Сайт и заявки',
      'Финансы',
      'До 10 пользователей',
      'До 2 интеграций',
      '100 МБ дискового пространства',
      'База знаний',
    ],
  },
  {
    name: 'Habibi Pro',
    priceMonthly: '69',
    priceSemiAnnual: '59',
    priceAnnual: '49',
    description: 'Для команд, которым нужны интеграции.',
    isPopular: true,
    features: [
      'Все 10 модулей системы',
      'ИИ-агенты',
      'До 50 пользователей',
      'До 5 интеграций',
      '500 МБ дискового пространства',
      'Базовая техподдержка',
    ],
    excludedFeatures: ['Настройка кастомных решений'],
  },
  {
    name: 'Habibi Premium',
    priceMonthly: '269',
    priceSemiAnnual: '239',
    priceAnnual: '189',
    description: 'Для компаний с интеграциями и сопровождением.',
    features: [
      'Всё из тарифа «Habibi Pro»',
      '2 часа на настройку кастомных решений',
      'До 100 пользователей',
      '1 ГБ дискового пространства',
      'Персональное сопровождение',
      'Приоритетная поддержка',
      'Расширенная аналитика',
      'Гибкие права доступа',
    ],
  },
  {
    name: 'Habibi Exclusive',
    priceMonthly: '',
    priceSemiAnnual: '',
    priceAnnual: '',
    priceLabel: 'После аудита',
    isExclusive: true,
    noTrial: true,
    description: 'Индивидуальное решение. Стоимость рассчитывается после аудита вашего бизнеса.',
    ctaLabel: 'Оставить заявку',
    features: [
      'Всё из тарифа «Habibi Premium»',
      'Аудит и оптимизация бизнес-процессов',
      'Индивидуальная настройка под ваш бизнес',
      'Внедрение кастомного блока (CRM, Производство…) — разовая оплата от 650 €',
      'Кастомные модули и интеграции',
      'Выделенный менеджер',
      'Внедрение и обучение команды',
      'SLA и поддержка 24/7',
    ],
  },
]

export default function Pricing() {
  const { open } = useContact()

  return (
    <section
      id="tarify"
      className="relative overflow-hidden bg-black px-6 py-24 md:px-12 md:py-32 lg:px-16"
    >
      {/* Фоновое видео (HLS) */}
      <HlsVideo src={VIDEO_URL} className="absolute inset-0 h-full w-full object-cover" />

      {/* Затемнение; края уходят в чёрный для бесшовного стыка */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-black" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <PricingGlass
          title="Выберите подходящий тариф"
          description="Выберите подходящий план и растите вместе с Habibi. При годовой оплате — выгоднее."
          tiers={TIERS}
          ctaLabel="Начать"
          currency="€"
          trialBadge="14 дней бесплатно — демо-доступ ко всем функциям"
          trialNote="Первые 14 дней бесплатно, без карты"
          onGetStarted={(tier) => open(tier.name)}
        />
      </div>
    </section>
  )
}
