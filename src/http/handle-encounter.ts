'use server'

import { clientEnv } from '@/env'
import { cookies } from 'next/headers'

export async function handleEncounter(encounterData: FormData) {
  try {
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

    if (request.status !== 200) {
      throw new Error('Invalid encounter.')
    }
  } catch (e) {
    console.log(e)
    throw new Error()
  }
}
