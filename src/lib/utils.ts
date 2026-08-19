import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Плавно скроллит к секции по её id (для кнопок-действий). */
export function scrollToId(id: string) {
  if (typeof document !== 'undefined') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}
