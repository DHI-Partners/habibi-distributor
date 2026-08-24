import { useEffect, useState } from 'react'

/**
 * Пересчёт цен тарифов в валюты стран, откуда чаще всего приходят клиенты.
 * Базовая валюта прайса — евро; остальные считаются по курсу и округляются
 * до «человеческих» чисел. Курс тянется из открытого API раз в сутки,
 * при недоступности сети берутся запасные значения.
 */

export type CurrencyCode = 'EUR' | 'RUB' | 'KZT' | 'KGS' | 'TRY'

export interface Currency {
  code: CurrencyCode
  symbol: string
  label: string
  /** Символ идёт перед числом (€29) или после (2 800 ₽). */
  symbolBefore: boolean
}

export const CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', label: 'Евро', symbolBefore: true },
  { code: 'RUB', symbol: '₽', label: 'Рубли', symbolBefore: false },
  { code: 'KZT', symbol: '₸', label: 'Тенге', symbolBefore: false },
  { code: 'KGS', symbol: 'сом', label: 'Сом', symbolBefore: false },
  { code: 'TRY', symbol: '₺', label: 'Лира', symbolBefore: false },
]

/** Запасные курсы к евро на 24.08.2026 — используются, если API недоступен. */
const FALLBACK_RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  RUB: 96.75,
  KZT: 536,
  KGS: 102.7,
  TRY: 56.2,
}

const API_URL = 'https://open.er-api.com/v6/latest/EUR'
const CACHE_KEY = 'habibi-rates-v1'
const CACHE_TTL = 24 * 60 * 60 * 1000

interface RatesState {
  rates: Record<CurrencyCode, number>
  /** Дата курса в формате дд.мм.гггг — показываем рядом с ценой. */
  updatedAt: string | null
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function readCache(): RatesState | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { rates, ts } = JSON.parse(raw)
    if (!rates || Date.now() - ts > CACHE_TTL) return null
    return { rates, updatedAt: formatDate(ts) }
  } catch {
    return null
  }
}

export function useRates(): RatesState {
  const [state, setState] = useState<RatesState>(
    () => readCache() ?? { rates: FALLBACK_RATES, updatedAt: null },
  )

  useEffect(() => {
    if (readCache()) return
    let cancelled = false
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || data?.result !== 'success' || !data.rates) return
        const rates = { ...FALLBACK_RATES }
        for (const c of CURRENCIES) {
          const v = Number(data.rates[c.code])
          if (Number.isFinite(v) && v > 0) rates[c.code] = v
        }
        const ts = Date.now()
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, ts }))
        } catch {
          /* приватный режим — просто не кэшируем */
        }
        setState({ rates, updatedAt: formatDate(ts) })
      })
      .catch(() => {
        /* оставляем запасные курсы */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

/** Округление до «красивого» числа: чем крупнее сумма, тем крупнее шаг. */
function roundNice(value: number) {
  if (value < 100) return Math.round(value)
  if (value < 1000) return Math.round(value / 10) * 10
  if (value < 10000) return Math.round(value / 50) * 50
  if (value < 100000) return Math.round(value / 100) * 100
  return Math.round(value / 500) * 500
}

/** Разряды разделяем узким неразрывным пробелом: 144 200. */
function groupDigits(value: number) {
  return value.toLocaleString('ru-RU').replace(/ /g, ' ')
}

/** Число без символа валюты — символ рисуется отдельно, крупным макетом. */
export function convertAmount(
  amountEur: number,
  code: CurrencyCode,
  rates: Record<CurrencyCode, number>,
) {
  if (code === 'EUR') return groupDigits(Math.round(amountEur))
  return groupDigits(roundNice(amountEur * (rates[code] ?? FALLBACK_RATES[code])))
}

/** Готовая строка с символом — для бейджа экономии и подписей. */
export function formatMoney(
  amountEur: number,
  currency: Currency,
  rates: Record<CurrencyCode, number>,
) {
  const num = convertAmount(amountEur, currency.code, rates)
  return currency.symbolBefore ? `${currency.symbol}${num}` : `${num} ${currency.symbol}`
}
