import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface HlsVideoProps {
  /** URL HLS-потока (.m3u8). */
  src: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Фоновое видео из HLS-потока (например, Mux). В Safari .m3u8 играет нативно,
 * в остальных браузерах подключается через hls.js. Всегда без звука, зациклено.
 */
export default function HlsVideo({ src, className, style }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // React не всегда применяет атрибут muted как свойство — ставим явно,
    // иначе браузер считает видео со звуком и блокирует автозапуск.
    video.muted = true
    video.defaultMuted = true

    const play = () => {
      // Автовоспроизведение без звука разрешено браузерами.
      video.play().catch(() => {})
    }

    // Подстраховка: если браузер заблокировал автозапуск (строгая политика),
    // запускаем фон при первом же взаимодействии пользователя.
    const kickOnInteraction = () => {
      if (video.paused) play()
    }
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const
    events.forEach((e) => window.addEventListener(e, kickOnInteraction, { passive: true }))
    const cleanupInteraction = () =>
      events.forEach((e) => window.removeEventListener(e, kickOnInteraction))

    // Нативная поддержка HLS (Safari, iOS).
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', play)
      return () => {
        video.removeEventListener('loadedmetadata', play)
        cleanupInteraction()
      }
    }

    // Остальные браузеры — через hls.js.
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, play)
      return () => {
        hls.destroy()
        cleanupInteraction()
      }
    }

    return cleanupInteraction
  }, [src])

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      autoPlay
      muted
      loop
      playsInline
    />
  )
}
