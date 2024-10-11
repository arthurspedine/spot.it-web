import z from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().url(),
})

const envVars = {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
}

export const clientEnv = envSchema.parse(envVars)
