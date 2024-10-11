'use server'
import type { LoginDataInput } from '@/types'
import { login } from '../../auth'

export async function handleLogin(data: LoginDataInput) {
  try {
    await login(data)
  } catch {
    throw new Error('Verifique suas credênciais.')
  }
}
