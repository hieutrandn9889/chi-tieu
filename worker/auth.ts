import { betterAuth } from 'better-auth'
import { D1Dialect } from 'kysely-d1'
import type { Env } from './types'

// Built per request: on Workers, `env` (D1 binding, secret) is only available
// inside the fetch handler — never construct this at module top level.
export function createAuth(env: Env) {
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: { dialect: new D1Dialect({ database: env.DB }), type: 'sqlite' },
    emailAndPassword: { enabled: true, autoSignIn: true, minPasswordLength: 8 },
    // Include the current origin (production via BETTER_AUTH_URL, or localhost in
    // dev) explicitly — some Better Auth versions do NOT auto-trust baseURL.
    trustedOrigins: [env.BETTER_AUTH_URL, 'http://localhost:5173', 'http://localhost:8787'],
  })
}
