import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

/** Контент страницы модуля (/moduli/:slug). Наполнение — из продающих презентаций. */
export interface ModulePageData {
  slug: string
  icon: LucideIcon
  title: string
  lead: string
  /** Пилюли под заголовком героя. */
  pills: string[]
  /** «Знакомая картина?» — боли бизнеса. */
  pains: { icon: string; title: string; text: string }[]
  /** «Цена хаоса» — цифры потерь + пример расчёта. */
  chaos: {
    lead: string
    stats: { value: string; text: string }[]
    /** Пример расчёта: до/акцент/после — акцент подсвечивается зелёным. */
    example: { before: string; accent: string; after: string }
  }
  /** «Что это» — обзор модуля. */
  about: { lead: string; cards: { title: string; text: string }[] }
  /** Возможности — 3–4 блока. */
  capabilities: {
    title: string
    lead: string
    /** Цепочка этапов (пилюли со стрелками), опционально. */
    flow?: string[]
    cards: { title: string; text: string }[]
    /** Итоговая строка-вывод, опционально. */
    note?: string
  }[]
  /** Скриншот интерфейса из public/ (RU-страницы). */
  screenshot?: { src: string; title: string }
  /** Живое HTML-превью интерфейса (EN/AR-страницы) + заголовок секции. */
  Preview?: ComponentType
  previewTitle?: string
  /** Таблица «Было → Стало». */
  solve: { was: string; now: string }[]
  /** «Как заработать больше». */
  money: { title: string; text: string }[]
  /** «Скоро: ИИ-агенты». */
  ai: { title: string; lead: string; flow: string[]; cards: { title: string; text: string }[] }
  /** «Сильнее вместе» — связки с другими модулями. */
  together: { title: string; text: string }[]
  /** «Кому подходит». */
  industries: { list: string[]; note: string }
  /** В каком тарифе доступен модуль. */
  tariff: { headline: string; baseIncludes: boolean }
  /** Финальный призыв. */
  cta: { title: string; text: string }
}
