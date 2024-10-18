import { z } from 'zod'

export type jwtToken = {
  id: string
  email: string
  name: string
  username: string
  iat: number
}

export const loginSchema = z.object({
  identifier: z
    .union([z.string(), z.string()])
    .refine(val => val.includes('@') || /^[a-zA-Z0-9_]+$/.test(val), {
      message: 'É necessário fornecer um email ou um username válido.',
    }),
  password: z.string(),
})

export type WallyRole = {
  id: string
  role: string
  scoreMultiplier: number
}

export type LoginDataInput = z.infer<typeof loginSchema>
