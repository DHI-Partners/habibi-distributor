import { useEffect, useRef, useState } from 'react'

/**
 * Наблюдает за элементом и возвращает true, когда он впервые попадает в область
 * видимости. Используется для reveal-по-скроллу (класс `.reveal` + `.is-visible`).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Если IntersectionObserver недоступен — показываем сразу.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(entry.target)
        }
      })
    }, options)

    observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ref, inView }
}
