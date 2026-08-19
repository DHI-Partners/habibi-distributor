import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ContactProvider } from './components/ContactProvider'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import BusinessFlows from './components/BusinessFlows'
import Modules from './components/Modules'
import Quiz from './components/Quiz'
import Pricing from './components/Pricing'
import IndustrySelector from './components/IndustrySelector'
import Faq from './components/Faq'
import Closing from './components/Closing'
import Footer from './components/Footer'
import MessengerWidget from './components/MessengerWidget'
import ModulePage from './components/modules/ModulePage'

function LandingPage() {
  useEffect(() => {
    document.title = 'Habibi — цифровая экосистема для вашего бизнеса'
  }, [])

  return (
    <ContactProvider>
      <div className="min-h-screen w-full bg-black font-geist text-white">
        <Hero />
        <IndustrySelector />
        <Benefits />
        <BusinessFlows />
        <Modules />
        <Quiz />
        <Pricing />
        <Faq />
        <Closing />
        <Footer />
        <MessengerWidget />
      </div>
    </ContactProvider>
  )
}

/**
 * Deep-link scrolling: когда страницу открывают сразу с якорем (например, ссылка
 * «/#tarify»), контент SPA монтируется уже после собственного перехода браузера —
 * поэтому повторяем попытку, пока цель не появится, и выравниваемся ещё раз, когда
 * поздние картинки сдвинут вёрстку.
 */
function HashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    if (!id) return
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    let cancelled = false
    let tries = 0
    const scroll = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    const jump = () => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        scroll()
        window.setTimeout(() => {
          if (!cancelled) scroll()
        }, 500)
      } else if (tries++ < 40) {
        window.setTimeout(jump, 100)
      }
    }

    const t = window.setTimeout(jump, 80)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <HashScroll />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/moduli/:slug" element={<ModulePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
