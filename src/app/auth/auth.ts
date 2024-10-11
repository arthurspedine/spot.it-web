import {
  type LoginDataInput,
  loginSchema as loginDataSchema,
  type jwtToken,
} from '@/types'
import { api } from '@/lib/axios'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const key = new TextEncoder().encode(process.env.JWT_SECRET)

export async function decrypt(input: string): Promise<jwtToken> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })

  return payload as jwtToken
}

export async function login(formData: LoginDataInput) {
  const loginDataParse = loginDataSchema.safeParse(formData)

  const loginData = loginDataParse.success
    ? {
        identifier: loginDataParse.data.identifier,
        password: loginDataParse.data.password,
      }
    : {}

  const authResponse = await api.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,
    loginData
  )

  const { accessToken } = await authResponse.data
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  cookies().set('access_token', accessToken, {
    expires,
    httpOnly: true,
  })
}

export async function logout() {
  cookies().set('access_token', '', { expires: new Date(0) })
}

export async function getSession() {
  const session = cookies().get('access_token')?.value
  if (!session) return null
  return await decrypt(session)
}
