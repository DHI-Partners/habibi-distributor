import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import ContactModal from './ContactModal'

interface ContactCtx {
  /** Открыть форму заявки. Можно передать название тарифа для шапки формы. */
  open: (tierName?: string) => void
}

const Ctx = createContext<ContactCtx>({ open: () => {} })

export function useContact() {
  return useContext(Ctx)
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback((tierName?: string) => {
    setTier(tierName ?? null)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <ContactModal open={isOpen} tierName={tier} onClose={close} />
    </Ctx.Provider>
  )
}
