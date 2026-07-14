import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { authClient, type SessionData } from '@/lib/auth-client'

interface AuthContextValue {
  session: SessionData
  isPending: boolean
  refresh: () => Promise<void>
}

const Ctx = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData>(null)
  const [isPending, setIsPending] = useState(true)

  const refresh = useCallback(async () => {
    const { data } = await authClient.getSession()
    setSession(data ?? null)
  }, [])

  useEffect(() => {
    let on = true
    authClient
      .getSession()
      .then(({ data }) => {
        if (on) setSession(data ?? null)
      })
      .finally(() => {
        if (on) setIsPending(false)
      })
    return () => {
      on = false
    }
  }, [])

  return <Ctx.Provider value={{ session, isPending, refresh }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth must be used within AuthProvider')
  return c
}
