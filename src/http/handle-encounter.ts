'use server'

import { clientEnv } from '@/env'
import { cookies } from 'next/headers'

export async function handleEncounter(encounterData: FormData) {
  const request = await fetch(
    `${clientEnv.NEXT_PUBLIC_BACKEND_URL}/encounter`,
    {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      headers: { Cookie: cookies().toString() },
      body: encounterData,
    }
  )

  if (!request.ok) {
    const errorMessage = await request.text()
    console.error('Erro no backend:', errorMessage)
    throw new Error('Invalid encounter.')
  }
}
