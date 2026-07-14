import { createAuthClient } from 'better-auth/client'

// Vanilla (framework-agnostic) client — NOT better-auth/react, which pulls in a
// second copy of React under Vite and triggers "Invalid hook call".
export const authClient = createAuthClient({ baseURL: window.location.origin })

export type SessionData = Awaited<ReturnType<typeof authClient.getSession>>['data']
