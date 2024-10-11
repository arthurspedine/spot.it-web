'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { login } from '../../auth'
import { toast } from 'sonner'
import { handleLogin } from './handle-login'

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
})

type LoginSchema = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()

  const { register, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  async function handleUserLogin(data: LoginSchema) {
    try {
      await handleLogin(data)
      router.replace('/dashboard')
    } catch {
      toast.error('Verifique suas credenciais.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleUserLogin)}
      className='flex flex-col gap-3 w-4/5'
    >
      <div className='space-y-1'>
        <Label htmlFor='user' className='font-bold text-sm'>
          Username ou Email
        </Label>
        <Input
          id='user'
          type='text'
          placeholder='exemplo@exemplo.com'
          {...register('identifier')}
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='password' className='font-bold text-sm'>
          Senha
        </Label>
        <Input
          id='password'
          type='password'
          placeholder='********'
          {...register('password')}
        />
      </div>

      <Button size={'sm'} type='submit' className='bg-red-700 hover:bg-red-800'>
        Entrar
      </Button>
    </form>
  )
}
